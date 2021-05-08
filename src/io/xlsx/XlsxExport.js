/* global Blob */
import ExcelJS from 'exceljs/dist/exceljs';
import { XDraw } from '../../canvas/XDraw';
import { ColorPicker } from '../../component/colorpicker/ColorPicker';
import { BaseFont } from '../../canvas/font/BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';
import { Cell } from '../../core/table/tablecell/Cell';
import { LINE_TYPE } from '../../canvas/Line';
import Download from '../../libs/donwload/Download';

function next(i, step = 1) {
  return i + step;
}

function last(i, step = 1) {
  return i - step;
}

/**
 * XLSX 文件导出
 */
class XlsxExport {

  /**
   * 像素行高转换
   * @param table
   * @param value
   * @returns {number}
   */
  static rowHeight(table, value) {
    const { xTableStyle } = table;
    const { heightUnit } = xTableStyle;
    return heightUnit.getPoint(XDraw.srcTransformStylePx(value));
  }

  /**
   * 字体大小转换
   * @param table
   * @param value
   * @returns {number}
   */
  static fontsize(table, value) {
    const { xTableStyle } = table;
    const { heightUnit } = xTableStyle;
    return heightUnit.getPoint(XDraw.srcTransformStylePx(value));
  }

  /**
   * 像素列宽转换
   * @param table
   * @param value
   * @returns {number}
   */
  static colWidth(table, value) {
    const { xTableStyle } = table;
    const { widthUnit } = xTableStyle;
    return widthUnit.getNumber(XDraw.srcTransformStylePx(value));
  }

  /**
   * 边框类型转换
   * @param value
   * @param type
   * @returns {string}
   */
  static borderType(value, type) {
    switch (type) {
      case LINE_TYPE.SOLID_LINE: {
        switch (value) {
          case XDraw.LINE_WIDTH_TYPE.low:
            return 'thin';
          case XDraw.LINE_WIDTH_TYPE.medium:
            return 'medium';
          case XDraw.LINE_WIDTH_TYPE.high:
            return 'thick';
        }
        break;
      }
      case LINE_TYPE.POINT_LINE:
        return 'dashDot';
      case LINE_TYPE.DOTTED_LINE: {
        return 'dotted';
      }
      case LINE_TYPE.DOUBLE_LINE:
        return 'double';
    }
    return 'thick';
  }

  /**
   * 导出xlsx文件
   * @param work
   */
  static exportXlsx(work) {
    const { sheetView } = work.body;
    const { sheetList } = sheetView;
    // 创建工作薄
    const workbook = new ExcelJS.Workbook();
    workbook.created = work.options.created;
    workbook.creator = work.options.creator;
    workbook.modified = work.options.modified;
    workbook.lastModifiedBy = work.options.lastModifiedBy;
    // 添加工作表
    sheetList.forEach((sheet) => {
      const { tab, table } = sheet;
      const { settings, xIteratorBuilder, rows, cols } = table;
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const { xMergesItems } = merges;
      // 创建工作表
      const worksheet = workbook.addWorksheet(tab.name);
      // 默认宽高
      worksheet.defaultRowHeight = this.rowHeight(table, rows.getOriginDefaultHeight());
      worksheet.defaultColWidth = this.colWidth(table, cols.getOriginDefaultWidth());
      // 是否显示网格
      worksheet.views = [{ showGridLines: settings.table.showGrid }];
      // 处理列宽
      const sheetColumns = [];
      cols.eachWidth(0, last(cols.len), (col) => {
        const width = cols.getOriginWidth(col);
        sheetColumns.push({
          width: this.colWidth(table, width) + 0.78
        });
      });
      worksheet.columns = sheetColumns;
      // 处理数据
      xIteratorBuilder.getRowIterator()
        .foldOnOff(false)
        .setBegin(0)
        .setEnd(last(rows.len))
        .setLoop((row) => {
          const workRow = worksheet.getRow(next(row));
          workRow.height = this.rowHeight(table, rows.getOriginHeight(row));
          xIteratorBuilder.getColIterator()
            .setBegin(0)
            .setEnd(last(cols.len))
            .setLoop((col) => {
              const cell = cells.getCell(row, col);
              if (cell) {
                const { contentType, background } = cell;
                const { text, fontAttr, borderAttr } = cell;
                const { top, right, left, bottom } = borderAttr;
                const workCell = workRow.getCell(next(col));
                // 单元格文本
                if (text) {
                  switch (contentType) {
                    case Cell.CONTENT_TYPE.NUMBER:
                      workCell.value = PlainUtils.parseFloat(text);
                      break;
                    case Cell.CONTENT_TYPE.STRING:
                      workCell.value = text;
                      break;
                  }
                }
                // 字体样式
                workCell.font = {
                  name: fontAttr.name,
                  color: {
                    argb: ColorPicker.parseRgbToHex(fontAttr.color),
                  },
                  size: this.fontsize(table, fontAttr.size),
                  italic: fontAttr.italic,
                  bold: fontAttr.bold,
                  underline: fontAttr.underline,
                  strike: fontAttr.strikethrough,
                };
                // 对齐方式
                workCell.alignment = {
                  vertical: fontAttr.verticalAlign,
                  horizontal: fontAttr.align,
                  wrapText: fontAttr.textWrap === BaseFont.TEXT_WRAP.WORD_WRAP,
                };
                switch (fontAttr.direction) {
                  case BaseFont.TEXT_DIRECTION.VERTICAL:
                    workCell.alignment.textRotation = 'vertical';
                    break;
                  case BaseFont.TEXT_DIRECTION.ANGLE:
                  case BaseFont.TEXT_DIRECTION.ANGLE_BAR:
                    workCell.alignment.textRotation = fontAttr.angle;
                    break;
                }
                // 单元格背景
                if (background) {
                  workCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: ColorPicker.parseRgbToHex(background) },
                  };
                }
                // 单元格边框
                workCell.border = {
                  top: {}, left: {}, right: {}, bottom: {},
                };
                if (top.display) {
                  const { widthType, type, color } = borderAttr.top;
                  workCell.border.top.style = this.borderType(widthType, type);
                  workCell.border.top.color = {
                    argb: ColorPicker.parseRgbToHex(color),
                  };
                }
                if (right.display) {
                  const { widthType, type, color } = borderAttr.right;
                  workCell.border.right.style = this.borderType(widthType, type);
                  workCell.border.right.color = {
                    argb: ColorPicker.parseRgbToHex(color),
                  };
                }
                if (left.display) {
                  const { widthType, type, color } = borderAttr.left;
                  workCell.border.left.style = this.borderType(widthType, type);
                  workCell.border.left.color = {
                    argb: ColorPicker.parseRgbToHex(color),
                  };
                }
                if (bottom.display) {
                  const { widthType, type, color } = borderAttr.bottom;
                  workCell.border.bottom.style = this.borderType(widthType, type);
                  workCell.border.bottom.color = {
                    argb: ColorPicker.parseRgbToHex(color),
                  };
                }
              }
            })
            .execute();
        })
        .execute();
      // 处理合并
      xMergesItems.getItems()
        .forEach((xMergeRange) => {
          if (xMergeRange) {
            const { sri, sci, eri, eci } = xMergeRange;
            worksheet.mergeCells(
              next(sri.no),
              next(sci.no),
              next(eri.no),
              next(eci.no),
            );
          }
        });
    });
    // 导出XLSX
    workbook.xlsx
      .writeBuffer()
      .then((data) => {
        Download(new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }), `${work.options.name}.xlsx`);
      });
  }

}

export {
  XlsxExport,
};
