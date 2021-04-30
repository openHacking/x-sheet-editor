/* global Blob */
import ExcelJS from 'exceljs/dist/exceljs';
import { XDraw } from '../canvas/XDraw';
import Download from '../libs/donwload/Download';
import { BaseFont } from '../canvas/font/BaseFont';
import { ColorPicker } from '../component/colorpicker/ColorPicker';
import { PlainUtils } from '../utils/PlainUtils';
import { Cell } from '../core/table/tablecell/Cell';
import { LINE_TYPE } from '../canvas/Line';

class XlsxExport {

  static next(i, step = 1) {
    return i + step;
  }

  static last(i, step = 1) {
    return i - step;
  }

  static export(work) {
    const { sheetView } = work.body;
    const { sheetList } = sheetView;
    // 创建工作薄
    const workbook = new ExcelJS.Workbook();
    workbook.lastModifiedBy = work.options.lastModifiedBy;
    workbook.creator = work.options.creator;
    workbook.created = work.options.created;
    workbook.modified = work.options.modified;
    // 添加工作表
    sheetList.forEach((sheet) => {
      const { tab, table } = sheet;
      const { settings, rows, cols } = table;
      const { xIteratorBuilder } = table;
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const { xMergesItems } = merges;
      // 创建工作表
      const worksheet = workbook.addWorksheet(tab.name);
      // 默认宽高
      worksheet.defaultRowHeight = rows.getDefaultHeight();
      worksheet.defaultColWidth = cols.getDefaultWidth();
      // 是否显示网格
      worksheet.views = [{ showGridLines: settings.table.showGrid }];
      // 处理列宽
      const sheetColumns = [];
      cols.eachWidth(0, this.last(cols.len), (idx, width) => {
        sheetColumns.push({ width: this.convertWidth(width) });
      });
      worksheet.columns = sheetColumns;
      // 处理数据
      xIteratorBuilder.getRowIterator()
        .foldOnOff(false)
        .setBegin(0)
        .setEnd(this.last(rows.len))
        .setLoop((row) => {
          const workRow = worksheet.getRow(this.next(row));
          workRow.height = this.convertHeight(rows.getHeight(row));
          xIteratorBuilder.getColIterator()
            .setBegin(0)
            .setEnd(this.last(cols.len))
            .setLoop((col) => {
              const cell = cells.getCell(row, col);
              if (cell) {
                const { fontAttr, borderAttr, contentType, background } = cell;
                const workCell = workRow.getCell(this.next(col));
                // 单元格文本
                switch (contentType) {
                  case Cell.CONTENT_TYPE.NUMBER:
                    workCell.value = PlainUtils.parseFloat(cell.text);
                    break;
                  case Cell.CONTENT_TYPE.STRING:
                    workCell.value = cell.text;
                    break;
                }
                // 字体样式
                workCell.font = {
                  name: fontAttr.name,
                  size: this.convertFontSize(fontAttr.size),
                  color: {
                    argb: ColorPicker.parseRgbToHex(fontAttr.color),
                  },
                  bold: fontAttr.bold,
                  italic: fontAttr.italic,
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
                // 单元格边框
                workCell.border = {
                  top: {}, left: {}, right: {}, bottom: {},
                };
                if (borderAttr.top.display) {
                  const { widthType, type, color } = borderAttr.top;
                  workCell.border.top.style = this.convertBorderType(widthType, type);
                  workCell.border.top.color = {
                    argb: ColorPicker.parseRgbToHex(color),
                  };
                }
                if (borderAttr.left.display) {
                  const { widthType, type, color } = borderAttr.left;
                  workCell.border.left.style = this.convertBorderType(widthType, type);
                  workCell.border.left.color = {
                    argb: ColorPicker.parseRgbToHex(color),
                  };
                }
                if (borderAttr.right.display) {
                  const { widthType, type, color } = borderAttr.right;
                  workCell.border.right.style = this.convertBorderType(widthType, type);
                  workCell.border.right.color = {
                    argb: ColorPicker.parseRgbToHex(color),
                  };
                }
                if (borderAttr.bottom.display) {
                  const { widthType, type, color } = borderAttr.bottom;
                  workCell.border.bottom.style = this.convertBorderType(widthType, type);
                  workCell.border.bottom.color = {
                    argb: ColorPicker.parseRgbToHex(color),
                  };
                }
                // 单元格背景
                if (background) {
                  workCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: ColorPicker.parseRgbToHex(background) },
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
              this.next(sri.no),
              this.next(sci.no),
              this.next(eri.no),
              this.next(eci.no),
            );
          }
        });
    });
    // 导出XLSX
    workbook.xlsx
      .writeBuffer().then((data) => {
        Download(new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }), `${work.options.name}.xlsx`);
      });
  }

  static convertWidth(value) {
    // 8.11 / 64.8
    return value * 0.1251543209876543;
  }

  static convertHeight(value) {
    // 13.2 / 20
    return value * 0.6599999999999999;
  }

  static convertFontSize(value) {
    // 16 / 24
    return value * 0.6666666666666666;
  }

  static convertBorderType(value, type) {
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
      case LINE_TYPE.DOTTED_LINE: {
        return 'dotted';
      }
      case LINE_TYPE.DOUBLE_LINE:
        return 'double';
      case LINE_TYPE.POINT_LINE:
        return 'dashDot';
    }
    return 'thick';
  }

}

export {
  XlsxExport,
};
