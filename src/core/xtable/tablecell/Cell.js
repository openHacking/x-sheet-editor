import { SheetUtils } from '../../../utils/SheetUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../tableicon/XIcon';
import XTableFormat from '../XTableTextFormat';
import { RichFonts } from './RichFonts';
import { Formula } from '../../../formula/Formula';
import { DateUtils } from '../../../utils/DateUtils';

/**
 * 单元格
 */
class Cell {

  /**
   * Cell
   * @param background
   * @param format
   * @param text
   * @param richText
   * @param ruler
   * @param custom
   * @param icons
   * @param borderAttr
   * @param fontAttr
   * @param formula
   * @param contentWidth
   * @param contentHeight
   * @param contentType
   */
  constructor({
    ruler = SheetUtils.Undef,
    format = 'default',
    icons = [],
    fontAttr = {},
    custom = {},
    borderAttr = {},
    formula = {},
    richText = {},
    background = SheetUtils.Undef,
    text = SheetUtils.EMPTY,
    contentWidth = 0,
    contentHeight = 0,
    contentType = Cell.TYPE.STRING,
  } = {}) {
    // 背景颜色
    this.background = background;
    // 单元格图标
    this.icons = XIcon.newInstances(icons);
    // 自定义属性
    this.custom = custom;
    // 字体测量尺子
    this.ruler = ruler;
    // 格式化类型
    this.format = format;
    // 单元格公式
    this.formula = new Formula(formula);
    // 文本内容
    this.text = text;
    // 富文本内容
    this.richText = new RichFonts(richText);
    // 格式化后的内容
    this.formatText = SheetUtils.EMPTY;
    // 内容的高度
    this.contentHeight = contentHeight;
    // 内容的宽度
    this.contentWidth = contentWidth;
    // 字体属性
    this.fontAttr = new CellFont(fontAttr);
    // 边框属性
    this.borderAttr = new CellBorder(borderAttr);
    // 内容类型
    this.setContentType(contentType);
  }

  /**
   * 设置单元格小图标
   * @param icons
   */
  setIcons(icons) {
    this.icons = icons;
    return this;
  }

  /**
   * 设置内容文本
   * @param text
   */
  setText(text) {
    this.formatText = null;
    this.text = text;
    this.formula.setExpr(null);
    this.richText.setRich([]);
    this.setContentWidth(0);
    return this;
  }

  /**
   * 设置富文本
   */
  setRichText(rich) {
    this.formatText = null;
    this.text = null;
    this.formula.setExpr(null);
    this.richText.setRich(rich);
    this.setContentWidth(0);
    return this;
  }

  /**
   * 设置公式
   */
  setExpr(expr) {
    this.formatText = null;
    this.text = null;
    this.formula.setExpr(expr);
    this.richText.setRich([]);
    this.setContentWidth(0);
    return this;
  }

  /**
   * 获取公式
   */
  getExpr() {
    return this.formula.getExpr();
  }

  /**
   * 设置格式化类型
   * @param format
   */
  setFormat(format = 'default') {
    this.format = format;
    this.formatText = null;
    this.setContentWidth(0);
    return this;
  }

  /**
   * 保存测量尺子
   * @param ruler
   */
  setRuler(ruler) {
    this.ruler = ruler;
    return this;
  }

  /**
   * 设置内容类型
   * @param type
   */
  setContentType(type = Cell.TYPE.STRING) {
    const { text } = this;
    switch (type) {
      case Cell.TYPE.STRING: {
        this.contentType = Cell.TYPE.STRING;
        break;
      }
      case Cell.TYPE.NUMBER: {
        this.contentType = type;
        if (SheetUtils.isNumber(text)) {
          this.contentType = Cell.TYPE.NUMBER;
          this.text = SheetUtils.parseFloat(text);
        } else {
          this.contentType = Cell.TYPE.STRING;
          this.text = `${text}`;
        }
        break;
      }
      case Cell.TYPE.DATE_TIME: {
        const parse = DateUtils.parse(text);
        if (SheetUtils.isDate(parse)) {
          this.contentType = Cell.TYPE.DATE_TIME;
          this.text = SheetUtils.parseFloat(text);
        } else {
          this.contentType = Cell.TYPE.STRING;
          this.text = `${text}`;
        }
        break;
      }
      case Cell.TYPE.RICH_TEXT: {
        this.contentType = Cell.TYPE.RICH_TEXT;
        break;
      }
    }
    return this;
  }

  /**
   * 单元格是否为空
   * @returns {boolean}
   */
  isEmpty() {
    return SheetUtils.isBlank(this.getComputeText());
  }

  /**
   * 公式是否存在
   */
  hasFormula() {
    return this.formula.hasExpr();
  }

  /**
   * 获取格式后的文本
   * @returns {string|*}
   */
  getFormatText() {
    let { text, formula, format } = this;
    let { formatText } = this;
    let { contentType } = this;
    // 优先获取公式值
    if (formula.hasExpr()) {
      let value = formula.getValue();
      if (value) {
        if (SheetUtils.isBlank(formatText)) {
          formatText = XTableFormat(format, value);
        }
      }
      this.formatText = formatText;
      return formatText;
    }
    // 格式化文本
    switch (contentType) {
      case Cell.TYPE.STRING:
      case Cell.TYPE.NUMBER:
      case Cell.TYPE.DATE_TIME: {
        if (format) {
          if (SheetUtils.isBlank(formatText)) {
            this.formatText = XTableFormat(format, text);
            return this.formatText;
          }
        }
        return formatText;
      }
    }
    // 默认返回
    return SheetUtils.EMPTY;
  }

  /**
   * 获取计算后的文本
   * @returns {string|*}
   */
  getComputeText() {
    let { text, formula } = this;
    let { richText } = this;
    let { contentType } = this;
    // 优先获取公式值
    if (formula.hasExpr()) {
      return formula.getValue();
    }
    // 读取不同类型
    switch (contentType) {
      case Cell.TYPE.STRING:
      case Cell.TYPE.NUMBER:
      case Cell.TYPE.DATE_TIME: {
        return text;
      }
      case Cell.TYPE.RICH_TEXT: {
        return richText;
      }
    }
    // 默认返回
    return SheetUtils.EMPTY;
  }

  /**
   * 字体属性
   * @param attr
   */
  setFontAttr(attr) {
    this.fontAttr = attr;
    return this;
  }

  /**
   * 设置边框类型
   * @param attr
   */
  setBorderAttr(attr) {
    this.borderAttr = attr;
    return this;
  }

  /**
   * 复制单元格
   * @returns {Cell}
   */
  clone() {
    const { background, text, format, custom } = this;
    const { icons, contentType, formula } = this;
    const { richText, fontAttr, borderAttr } = this;
    return new Cell({
      background,
      text,
      custom,
      contentType,
      format,
      fontAttr,
      borderAttr,
      icons,
      formula,
      richText,
    });
  }

  /**
   * toJSON
   */
  toJSON() {
    const { background, text, format, custom } = this;
    const { icons, contentType, formula } = this;
    const { richText, fontAttr, borderAttr } = this;
    return {
      custom,
      expr: formula.getExpr(),
      rich: richText.getRich(),
      contentType,
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
    return this.getFormatText();
  }

  /**
   * 内容宽度
   * @param width
   */
  setContentWidth(width) {
    this.contentWidth = width;
    return this;
  }

  /**
   * 内容宽度
   * @param height
   */
  setContentHeight(height) {
    this.contentHeight = height;
    return this;
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
  // 富文本
  RICH_TEXT: 2,
  // 日期
  DATE_TIME: 3,
};

export {
  Cell,
};
