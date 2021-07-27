import { SheetUtils } from '../../../utils/SheetUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../xicon/XIcon';
import XTableFormat from '../XTableFormat';
import { RichFonts } from './RichFonts';

/**
 * Cell
 * @author jerry
 */
class Cell {

  /**
   * Cell
   * @param text
   * @param readOnly
   * @param background
   * @param format
   * @param ruler
   * @param fontAttr
   * @param borderAttr
   * @param icons
   * @param custom
   * @param contentWidth
   * @param contentHeight
   * @param contentType
   */
  constructor({
    text = SheetUtils.EMPTY,
    ruler = null,
    readOnly = false,
    format = 'default',
    custom = {},
    background = SheetUtils.Nul,
    icons = [],
    borderAttr = {},
    fontAttr = {},
    contentWidth = 0,
    contentHeight = 0,
    contentType = Cell.TYPE.STRING,
  } = {}) {
    this.fontAttr = new CellFont(fontAttr);
    this.icons = XIcon.newInstances(icons);
    this.borderAttr = new CellBorder(borderAttr);
    this.background = background;
    this.contentType = contentType;
    this.ruler = ruler;
    this.readOnly = readOnly;
    this.text = text;
    this.format = format;
    this.custom = custom;
    this.contentWidth = contentWidth;
    this.contentHeight = contentHeight;
    this.setContentType(contentType);
    this.setFormat(format);
  }

  /**
   * 设置单元格小图标
   * @param icons
   */
  setIcons(icons) {
    this.icons = icons;
  }

  /**
   * 字体属性
   * @param fontAttr
   */
  setFontAttr(fontAttr) {
    this.fontAttr = fontAttr;
  }

  /**
   * 获取格式化文本
   * @returns {string|*}
   */
  getFormatText() {
    let { format, text, contentType } = this;
    switch (contentType) {
      case Cell.TYPE.RICH_TEXT: {
        return text;
      }
      case Cell.TYPE.DATE: {
        if (format === 'default') {
          format = 'date1';
        }
        return XTableFormat(format, text);
      }
      case Cell.TYPE.STRING: {
        return XTableFormat(format, text);
      }
      case Cell.TYPE.NUMBER: {
        const number = XTableFormat(format, text);
        return number.toString();
      }
    }
    return SheetUtils.EMPTY;
  }

  /**
   * 设置内容类型
   * @param type
   */
  setContentType(type) {
    this.contentType = type;
    this.convert(this.text);
  }

  /**
   * 设置内容文本
   * @param text
   */
  setText(text) {
    this.convert(text);
    this.setContentWidth(0);
  }

  /**
   * 保存测量尺子
   * @param ruler
   */
  setRuler(ruler) {
    this.ruler = ruler;
  }

  /**
   * 设置格式化类型
   * @param format
   */
  setFormat(format) {
    this.format = format;
    switch (format) {
      case 'decimal':
      case 'eNotation':
      case 'percentage':
      case 'rmb':
      case 'hk':
      case 'dollar':
      case 'number':
        this.setContentType(Cell.TYPE.NUMBER);
        break;
    }
  }

  /**
   * 内容宽度
   * @param contentWidth
   */
  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
  }

  /**
   * 内容宽度
   * @param contentHeight
   */
  setContentHeight(contentHeight) {
    this.contentHeight = contentHeight;
  }

  /**
   * 是否只读
   * @returns {boolean}
   */
  isReadOnly() {
    return this.readOnly;
  }

  /**
   * 单元格是否为空
   * @returns {boolean}
   */
  isEmpty() {
    return SheetUtils.isBlank(this.text);
  }

  /**
   * 内容类型转换
   * @param text
   */
  convert(text) {
    if (SheetUtils.isBlank(text)) {
      this.contentType = Cell.TYPE.STRING;
      this.format = 'default';
      this.text = SheetUtils.EMPTY;
    } else {
      const { contentType } = this;
      switch (contentType) {
        case Cell.TYPE.NUMBER: {
          this.text = SheetUtils.parseFloat(text);
          break;
        }
        case Cell.TYPE.STRING: {
          this.text = text.toString();
          break;
        }
        case Cell.TYPE.RICH_TEXT: {
          this.text = new RichFonts(text);
          break;
        }
      }
    }
  }

  /**
   * 设置边框类型
   * @param borderAttr
   */
  setBorderAttr(borderAttr) {
    this.borderAttr = borderAttr;
  }

  /**
   * 复制单元格
   * @returns {Cell}
   */
  clone() {
    const {
      background, format, text, fontAttr,
      borderAttr, contentWidth, icons,
      contentType, custom,
    } = this;
    return new Cell({
      background,
      format,
      text,
      fontAttr,
      borderAttr,
      contentWidth,
      icons,
      contentType,
      custom,
    });
  }

  /**
   * toJSON
   */
  toJSON() {
    const {
      text,
      icons,
      background,
      format,
      fontAttr,
      borderAttr,
    } = this;
    return {
      text,
      icons,
      background,
      format,
      fontAttr,
      borderAttr,
    };
  }

  /**
   * toString
   * @returns {string|*}
   */
  toString() {
    let { format, text, contentType } = this;
    switch (contentType) {
      case Cell.TYPE.NUMBER:
      case Cell.TYPE.STRING: {
        return text;
      }
      case Cell.TYPE.DATE: {
        if (format === 'default') {
          format = 'date1';
        }
        return XTableFormat(format, text);
      }
      case Cell.TYPE.RICH_TEXT: {
        return SheetUtils.EMPTY;
      }
    }
    return SheetUtils.EMPTY;
  }

}

/**
 * 单元格类型
 */
Cell.TYPE = {
  // 数字
  NUMBER: 0,
  // 字符
  STRING: 1,
  // 日期
  DATE: 3,
  // 富文本
  RICH_TEXT: 2,
  // 表达式
  EXPRESSION: 4,
};

export {
  Cell,
};
