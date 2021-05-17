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
 * XLSX 文件导入
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
   * 颜色转换
   * @param argb
   * @returns {string|*}
   */
  static argbToRgb(argb) {
    if (argb) {
      if (argb.startsWith('#')) {
        if (argb.length === 9) {
          return `#${argb.substring(3)}`;
        }
      } else if (argb.length === 8) {
        return argb.substring(2);
      }
    }
    return argb;
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
          const { value = '', address = '', style = {} } = cell;
          const { richText } = value;
          const { border, fill, font, alignment } = style;
          // 读取列编号
          const colNo = address.replace(number, '');
          const colIndex = PlainUtils.indexAt(colNo);
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
          // 富文本
          if (richText) {
            xCell.text = PlainUtils.EMPTY;
          }
          // 字体属性
          if (font) {
            const { name, bold, size, italic, underline, strike, color = {} } = font;
            const { theme, argb } = color;
            xCell.fontAttr.name = name;
            xCell.fontAttr.bold = bold;
            xCell.fontAttr.size = this.fontsize(defaultTable, size);
            xCell.fontAttr.italic = italic;
            xCell.fontAttr.underline = underline;
            xCell.fontAttr.strikethrough = strike;
            if (PlainUtils.isNotUnDef(argb)) {
              const rgb = this.argbToRgb(argb);
              xCell.fontAttr.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
            } else if (PlainUtils.isNotUnDef(theme)) {
              xCell.fontAttr.color = XlsxImport.THEME_COLOR[theme];
            }
          }
          // 背景颜色
          if (fill) {
            const { fgColor } = fill;
            if (fgColor) {
              const { theme, argb } = fgColor;
              if (PlainUtils.isNotUnDef(argb)) {
                const rgb = this.argbToRgb(argb);
                xCell.background = ColorPicker.parseHexToRgb(rgb);
              } else if (PlainUtils.isNotUnDef(theme)) {
                xCell.background = XlsxImport.THEME_COLOR[theme];
              }
            }
          }
          // 对齐方式
          if (alignment) {
            const { textRotation, wrapText } = alignment;
            const { vertical, horizontal } = alignment;
            xCell.fontAttr.align = horizontal;
            xCell.fontAttr.verticalAlign = vertical;
            xCell.fontAttr.direction = BaseFont.TEXT_DIRECTION.HORIZONTAL;
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
              const { theme, argb } = color;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.right.widthType = widthType;
              xCell.borderAttr.right.type = type;
              xCell.borderAttr.right.display = true;
              if (PlainUtils.isNotUnDef(argb)) {
                const rgb = this.argbToRgb(argb);
                xCell.borderAttr.right.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
              } else if (PlainUtils.isNotUnDef(theme)) {
                xCell.borderAttr.right.color = XlsxImport.THEME_COLOR[theme];
              }
            }
            if (border.top) {
              const { style, color = {} } = border.top;
              const { theme, argb } = color;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.top.display = true;
              xCell.borderAttr.top.type = type;
              xCell.borderAttr.top.widthType = widthType;
              if (PlainUtils.isNotUnDef(argb)) {
                const rgb = this.argbToRgb(argb);
                xCell.borderAttr.top.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
              } else if (PlainUtils.isNotUnDef(theme)) {
                xCell.borderAttr.top.color = XlsxImport.THEME_COLOR[theme];
              }
            }
            if (border.left) {
              const { style, color = {} } = border.left;
              const { theme, argb } = color;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.left.display = true;
              xCell.borderAttr.left.type = type;
              xCell.borderAttr.left.widthType = widthType;
              if (PlainUtils.isNotUnDef(argb)) {
                const rgb = this.argbToRgb(argb);
                xCell.borderAttr.left.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
              } else if (PlainUtils.isNotUnDef(theme)) {
                xCell.borderAttr.left.color = XlsxImport.THEME_COLOR[theme];
              }
            }
            if (border.bottom) {
              const { style, color = {} } = border.bottom;
              const { theme, argb } = color;
              const { widthType, type } = this.borderType(style);
              xCell.borderAttr.bottom.display = true;
              xCell.borderAttr.bottom.type = type;
              xCell.borderAttr.bottom.widthType = widthType;
              if (PlainUtils.isNotUnDef(argb)) {
                const rgb = this.argbToRgb(argb);
                xCell.borderAttr.bottom.color = ColorPicker.parseHexToRgb(rgb, ColorArray.BLACK);
              } else if (PlainUtils.isNotUnDef(theme)) {
                xCell.borderAttr.bottom.color = XlsxImport.THEME_COLOR[theme];
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
XlsxImport.THEME_COLOR = [
  'rgb(255,255,255)',
  'rgb(0,0,0)',
  'rgb(231,230,230)',
  'rgb(68,84,106)',
  'rgb(91,155,213)',
  'rgb(192, 80, 77)',
  'rgb(165,165,165)',
  'rgb(255,192,0)',
  'rgb(68,144,196)',
  'rgb(247,150,70)',

  'rgb(242,242,242)',
  'rgb(128,128,128)',
  'rgb(208,208,206)',
  'rgb(214,220,218)',
  'rgb(221,235,247)',
  'rgb(242,220,219)',
  'rgb(237,237,237)',
  'rgb(255,242,204)',
  'rgb(217,225,242)',
  'rgb(226,239,218)',

  'rgb(217,217,217)',
  'rgb(89,89,89)',
  'rgb(174,170,170)',
  'rgb(172,185,202)',
  'rgb(189,215,238)',
  'rgb(248,203,173)',
  'rgb(219,219,219)',
  'rgb(255,230,153)',
  'rgb(180,198,231)',
  'rgb(198,224,180)',

  'rgb(191,191,191)',
  'rgb(64,64,64)',
  'rgb(117,113,113)',
  'rgb(132,151,176)',
  'rgb(155,194,230)',
  'rgb(244,176,132)',
  'rgb(201,201,201)',
  'rgb(255, 217, 102)',
  'rgb(142,169,219)',
  'rgb(169,208,142)',

  'rgb(166,166,166)',
  'rgb(38,38,38)',
  'rgb(58,56,56)',
  'rgb(51,63,79)',
  'rgb(47,117,181)',
  'rgb(198, 89, 17)',
  'rgb(123,123,123)',
  'rgb(191, 143, 0)',
  'rgb(48, 84, 150)',
  'rgb(165,165,165)',

  'rgb(128,128,128)',
  'rgb(13,13,13)',
  'rgb(22,22,22)',
  'rgb(34, 43, 53)',
  'rgb(31, 78, 120)',
  'rgb(131, 60, 12)',
  'rgb(82,82,82)',
  'rgb(128, 96, 0)',
  'rgb(32, 55, 100)',
  'rgb(55, 86, 35)',
];

export {
  XlsxImport,
};
