/* global FileReader */
import { Workbook } from 'exceljs';
import { ColorPicker } from '../../component/colorpicker/ColorPicker';
import { BaseFont } from '../../canvas/font/BaseFont';
import { XDraw } from '../../canvas/XDraw';
import { LINE_TYPE } from '../../canvas/Line';
import { Tab } from '../../core/work/Tab';
import { Sheet } from '../../core/work/Sheet';
import { PlainUtils } from '../../utils/PlainUtils';

/**
 * XLSX 文件导出
 */
class XlsxImport {

  /**
   * 行高转换
   * @param table
   * @param height
   */
  static rowHeight(table, height) {
    const { xTableStyle } = table;
    const { heightUnit } = xTableStyle;
    const pixelUnit = heightUnit.getPixel(height);
    const pixelRound = XDraw.round(pixelUnit);
    const srcHeight = XDraw.srcPx(pixelRound);
    return XDraw.round(srcHeight);
  }

  /**
   * 边框类型转换
   * @param style
   */
  static borderType(style) {
    switch (style) {
      case 'thin':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.low,
          type: LINE_TYPE.SOLID_LINE,
        };
      case 'medium':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.medium,
          type: LINE_TYPE.SOLID_LINE,
        };
      case 'thick':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.high,
          type: LINE_TYPE.SOLID_LINE,
        };
      case 'dashDot':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.low,
          type: LINE_TYPE.POINT_LINE,
        };
      case 'dotted':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.low,
          type: LINE_TYPE.DOTTED_LINE,
        };
      case 'double':
        return {
          widthType: XDraw.LINE_WIDTH_TYPE.low,
          type: LINE_TYPE.DOUBLE_LINE,
        };
    }
    return 'thick';
  }

  /**
   * 列宽转换
   * @param table
   * @param width
   */
  static colWidth(table, width) {
    const { xTableStyle } = table;
    const { wideUnit } = xTableStyle;
    const pixelUnit = wideUnit.getWidePixel(width);
    const pixelRound = XDraw.round(pixelUnit);
    const srcWidth = XDraw.cssPx(pixelRound);
    return XDraw.round(srcWidth);
  }

  /**
   * 字体大小转换
   * @param table
   * @param size
   */
  static fontsize(table, size) {
    const { xTableStyle } = table;
    const { heightUnit } = xTableStyle;
    const pixelUnit = heightUnit.getPixel(size);
    const pixelRound = XDraw.round(pixelUnit);
    const srcFontSize = XDraw.srcPx(pixelRound);
    return XDraw.round(srcFontSize);
  }

  /**
   * 文件转换ArrayBuffer
   * @param file
   * @returns {Promise<ArrayBuffer>}
   */
  static async fileToBuffer(file) {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });
    });
  }

  /**
   * 导入XLSX文件
   * @param work
   * @param file
   * @returns {Promise<void>}
   */
  static async importXlsx(work, file) {
    // 获取默认的table
    const defaultSheet = work.body.getActiveSheet();
    const defaultTable = defaultSheet.table;
    // 文件转换
    const buffer = await XlsxImport.fileToBuffer(file);
    // 读取xlsx文件
    const workbook = new Workbook();
    await workbook.xlsx.load(buffer);
    // work文件属性
    work.options.created = workbook.created;
    work.options.creator = workbook.creator;
    work.options.modified = workbook.modified;
    work.options.lastModifiedBy = workbook.lastModifiedBy;
    // 读取sheet表
    const xSheets = [];
    workbook.eachSheet((worksheet) => {
      const { name, model, views } = worksheet;
      const { rows, cols, merges } = model;
      const xCols = {
        data: [],
      };
      const xRows = {
        data: [],
      };
      const xData = [];
      const xMerge = {
        merges,
      };
      const xTable = {
        showGrid: views[0].showGridLines,
        background: '#ffffff',
      };
      // 读取列宽
      cols.forEach((col) => {
        const { min, max, width } = col;
        if (min === max) {
          xCols.data.push({
            width: this.colWidth(defaultTable, width),
          });
        } else {
          for (let i = min; i <= max; i++) {
            xCols.data.push({
              width: this.colWidth(defaultTable, width),
            });
          }
        }
      });
      // 读取行高
      rows.forEach((row) => {
        const { cells, height } = row;
        xRows.data.push({
          height: this.rowHeight(defaultTable, height),
        });
        // 读取数据
        const item = [];
        cells.forEach((cell) => {
          // 单元格基本属性
          const { value = PlainUtils.EMPTY, style = {} } = cell;
          const { border, fill, font, alignment } = style;
          // 创建新的XCell;
          const xCell = {
            background: null,
            text: value,
            fontAttr: {},
            borderAttr: {
              top: {},
              right: {},
              left: {},
              bottom: {},
            },
          };
          // 字体属性
          if (font) {
            xCell.fontAttr.name = font.name;
            xCell.fontAttr.bold = font.bold;
            xCell.fontAttr.size = this.fontsize(defaultTable, font.size);
            xCell.fontAttr.color = ColorPicker.parseHexToRgb(font.color.argb);
            xCell.fontAttr.italic = font.italic;
            xCell.fontAttr.textWrap = BaseFont.TEXT_WRAP.WORD_WRAP;
            xCell.fontAttr.direction = BaseFont.TEXT_DIRECTION.HORIZONTAL;
            xCell.fontAttr.underline = font.underline;
            xCell.fontAttr.strikethrough = font.strike;
          }
          // 背景颜色
          if (fill) {
            if (fill.fgColor) {
              xCell.background = ColorPicker.parseHexToRgb(fill.fgColor.argb);
            }
          }
          // 对齐方式
          if (alignment) {
            const { textRotation, wrapText } = alignment;
            const { vertical, horizontal } = alignment;
            xCell.fontAttr.align = horizontal;
            xCell.fontAttr.verticalAlign = vertical;
            // 垂直旋转
            if (textRotation === 'vertical') {
              xCell.fontAttr.direction = BaseFont.TEXT_DIRECTION.VERTICAL;
            } else if (textRotation) {
              xCell.fontAttr.direction = BaseFont.TEXT_DIRECTION.ANGLE;
              xCell.fontAttr.angle = alignment.textRotation;
            }
            // 自动换行
            if (wrapText) {
              xCell.fontAttr.textWrap = BaseFont.TEXT_WRAP.WORD_WRAP;
            } else {
              xCell.fontAttr.textWrap = BaseFont.TEXT_WRAP.OVER_FLOW;
            }
          }
          // 单元格边框
          if (border) {
            if (border.right) {
              const { widthType, type } = this.borderType(border.right.style);
              xCell.borderAttr.right.display = true;
              xCell.borderAttr.right.type = type;
              xCell.borderAttr.right.widthType = widthType;
              xCell.borderAttr.right.color = ColorPicker.parseHexToRgb(border.right.color.argb);
            }
            if (border.top) {
              const { widthType, type } = this.borderType(border.top.style);
              xCell.borderAttr.top.display = true;
              xCell.borderAttr.top.type = type;
              xCell.borderAttr.top.widthType = widthType;
              xCell.borderAttr.top.color = ColorPicker.parseHexToRgb(border.top.color.argb);
            }
            if (border.left) {
              const { widthType, type } = this.borderType(border.left.style);
              xCell.borderAttr.left.display = true;
              xCell.borderAttr.left.type = type;
              xCell.borderAttr.left.widthType = widthType;
              xCell.borderAttr.left.color = ColorPicker.parseHexToRgb(border.left.color.argb);
            }
            if (border.bottom) {
              const { widthType, type } = this.borderType(border.bottom.style);
              xCell.borderAttr.bottom.display = true;
              xCell.borderAttr.bottom.type = type;
              xCell.borderAttr.bottom.widthType = widthType;
              xCell.borderAttr.bottom.color = ColorPicker.parseHexToRgb(border.bottom.color.argb);
            }
          }
          // 追加单元格数据
          item.push(xCell);
        });
        // 添加新行
        xData.push(item);
      });
      // 添加sheet表
      xCols.len = xCols.data.length;
      xRows.len = xRows.data.length;
      xSheets.push({
        name,
        tableConfig: {
          table: xTable,
          cols: xCols,
          rows: xRows,
          data: xData,
          merge: xMerge,
        },
      });
    });
    // 绘制sheet表
    const { body } = work;
    xSheets.forEach((xSheet) => {
      const tab = new Tab(xSheet.name);
      const sheet = new Sheet(tab, xSheet);
      body.addTabSheet({
        tab, sheet,
      });
    });
  }

}

export {
  XlsxImport,
};
