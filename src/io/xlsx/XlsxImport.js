/* global FileReader */
import { Workbook } from 'exceljs';
import { ColorPicker } from '../../component/colorpicker/ColorPicker';
import { BaseFont } from '../../canvas/font/BaseFont';
import { XDraw } from '../../canvas/XDraw';
import { LINE_TYPE } from '../../canvas/Line';
import { Tab } from '../../core/work/Tab';
import { Sheet } from '../../core/work/Sheet';
import { PlainUtils } from '../../utils/PlainUtils';
import { ColorArray } from '../../component/colorpicker/colorarray/ColorArray';

/**
 * XLSX 文件导出
 */
class XlsxImport {

  /**
   * 行高转换
   * @param table
   * @param value
   */
  static rowHeight(table, value) {
    const { xTableStyle } = table;
    const { heightUnit } = xTableStyle;
    const pixel = heightUnit.getPixel(value);
    return XDraw.srcPx(pixel);
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
   * @param value
   */
  static colWidth(table, value) {
    const { xTableStyle } = table;
    const { wideUnit } = xTableStyle;
    return wideUnit.getWidePixel(value);
  }

  /**
   * 字体大小转换
   * @param table
   * @param value
   */
  static fontsize(table, value) {
    const { xTableStyle } = table;
    const { heightUnit } = xTableStyle;
    const pixel = heightUnit.getPixel(value);
    const fontsize = XDraw.srcPx(pixel);
    return XDraw.ceil(fontsize);
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
  static async import(work, file) {
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
    const { model } = workbook;
    const { worksheets } = model;
    worksheets.forEach((worksheet) => {
      const { name, cols = [], rows = [], merges = [], views = [] } = worksheet;
      const xCols = {
        data: [],
        len: 25,
      };
      const xRows = {
        data: [],
        len: 100,
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
      const lastIndex = cols.length - 1;
      cols.forEach((col, idx) => {
        const { min, max, width } = col;
        const colWidth = this.colWidth(defaultTable, width);
        if (min === max || lastIndex === idx) {
          xCols.data[min - 1] = {
            width: colWidth,
          };
        } else {
          for (let i = min; i <= max; i++) {
            xCols.data[i - 1] = {
              width: colWidth,
            };
          }
        }
      });
      // 读取行高
      rows.forEach((row) => {
        const { cells, height, number } = row;
        const rowIndex = number - 1;
        xRows.data[rowIndex] = {
          height: this.rowHeight(defaultTable, height),
        };
        // 读取数据
        const item = [];
        cells.forEach((cell) => {
          // 单元格基本属性
          const { value, address, style = {} } = cell;
          const { border, fill, font, alignment } = style;
          // 读取列编号
          const colAddress = address.replace(number, '');
          const colIndex = PlainUtils.indexAt(colAddress);
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
            const { name, bold, size, italic, underline, strike, color = {} } = font;
            const { argb } = color;
            xCell.fontAttr.name = name;
            xCell.fontAttr.bold = bold;
            xCell.fontAttr.size = this.fontsize(defaultTable, size);
            xCell.fontAttr.italic = italic;
            xCell.fontAttr.textWrap = BaseFont.TEXT_WRAP.WORD_WRAP;
            xCell.fontAttr.direction = BaseFont.TEXT_DIRECTION.HORIZONTAL;
            xCell.fontAttr.underline = underline;
            xCell.fontAttr.strikethrough = strike;
            if (argb) {
              xCell.fontAttr.color = ColorPicker.parseHexToRgb(argb, ColorArray.BLACK);
            }
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
              const { style, color = {} } = border.right;
              const { argb } = color;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.right.widthType = widthType;
              xCell.borderAttr.right.type = type;
              xCell.borderAttr.right.display = true;
              if (argb) {
                xCell.borderAttr.right.color = ColorPicker.parseHexToRgb(argb, ColorArray.BLACK);
              }
            }
            if (border.top) {
              const { style, color = {} } = border.top;
              const { argb } = color;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.top.display = true;
              xCell.borderAttr.top.type = type;
              xCell.borderAttr.top.widthType = widthType;
              if (argb) {
                xCell.borderAttr.top.color = ColorPicker.parseHexToRgb(argb, ColorArray.BLACK);
              }
            }
            if (border.left) {
              const { style, color = {} } = border.left;
              const { argb } = color;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.left.display = true;
              xCell.borderAttr.left.type = type;
              xCell.borderAttr.left.widthType = widthType;
              if (argb) {
                xCell.borderAttr.left.color = ColorPicker.parseHexToRgb(argb, ColorArray.BLACK);
              }
            }
            if (border.bottom) {
              const { style, color = {} } = border.bottom;
              const { argb } = color;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.bottom.display = true;
              xCell.borderAttr.bottom.type = type;
              xCell.borderAttr.bottom.widthType = widthType;
              if (argb) {
                xCell.borderAttr.bottom.color = ColorPicker.parseHexToRgb(argb, ColorArray.BLACK);
              }
            }
          }
          // 添加单元格
          item[colIndex] = xCell;
        });
        // 添加新行
        xData[rowIndex] = item;
      });
      // 添加sheet表
      if (xCols.data.length) {
        xCols.len = xCols.data.length;
      }
      if (xRows.data.length) {
        xRows.len = xRows.data.length;
      }
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

XlsxImport.INDEX_COLOR = [
  '000000',
  'FFFFFF',
  'FF0000',
  '00FF00',
  '0000FF',
  'FFFF00',
  'FF00FF',
  '00FFFF',
  '000000',
  'FFFFFF',
  'FF0000',
  '00FF00',
  '0000FF',
  'FFFF00',
  'FF00FF',
  '00FFFF',
  '800000',
  '008000',
  '000080',
  '808000',
  '800080',
  '008080',
  'C0C0C0',
  '808080',
  '9999FF',
  '993366',
  'FFFFCC',
  'CCFFFF',
  '660066',
  'FF8080',
  '0066CC',
  'CCCCFF',
  '000080',
  'FF00FF',
  'FFFF00',
  '00FFFF',
  '800080',
  '800000',
  '008080',
  '0000FF',
  '00CCFF',
  'CCFFFF',
  'CCFFCC',
  'FFFF99',
  '99CCFF',
  'FF99CC',
  'CC99FF',
  'FFCC99',
  '3366FF',
  '33CCCC',
  '99CC00',
  'FFCC00',
  'FF9900',
  'FF6600',
  '666699',
  '969696',
  '003366',
  '339966',
  '003300',
  '333300',
  '993300',
  '993366',
  '333399',
  '333333',
];

export {
  XlsxImport,
};
