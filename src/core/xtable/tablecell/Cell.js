import { SheetUtils } from '../../../utils/SheetUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../xicon/XIcon';
import XTableFormat from '../XTableTextFormat';
import { Compile, Instruct } from '../../../formula/Compiler';
import { RichFonts } from './RichFonts';

/**
 * 单元格
 */
class Cell {

  /**
   * Cell
   * @param background
   * @param readOnly
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
    background = SheetUtils.Nul,
    readOnly = false,
    formula = null,
    icons = [],
    format = 'default',
    text = SheetUtils.EMPTY,
    richText = SheetUtils.EMPTY,
    ruler = null,
    custom = {},
    borderAttr = {},
    fontAttr = {},
    contentWidth = 0,
    contentHeight = 0,
    contentType = Cell.TYPE.STRING,
  } = {}) {
    // 单元格图标
    this.icons = XIcon.newInstances(icons);
    // 背景颜色
    this.background = background;
    // 自定义属性
    this.custom = custom;
    // 字体测量尺子
    this.ruler = ruler;
    // 单元格是否只读
    this.readOnly = readOnly;
    // 格式化类型
    this.format = format;
    // 内容类型
    this.contentType = contentType;
    // 单元格公式
    this.formula = formula;
    // 公式指令
    this.formulaInstruct = null;
    // 文本内容
    this.text = text;
    // 富文本内容
    this.richText = new RichFonts(richText);
    // 格式化后的内容
    this.formatText = null;
    // 公式计算后的内容
    this.formulaText = null;
    // 内容的高度
    this.contentHeight = contentHeight;
    // 内容的宽度
    this.contentWidth = contentWidth;
    // 字体属性
    this.fontAttr = new CellFont(fontAttr);
    // 边框属性
    this.borderAttr = new CellBorder(borderAttr);
  }

  /**
   * 获取格式后的文本
   * @returns {string|*}
   */
  getFormatText() {
    let { contentType, formulaInstruct, format, formula } = this;
    let { text, formulaText, formatText } = this;
    // 优先获取公式值
    if (formula) {
      if (!formulaText) {
        if (formulaInstruct) {
          formulaText = Instruct(formulaInstruct);
          this.formulaText = formulaText;
        } else {
          formulaInstruct = Compile(formula);
          this.formulaInstruct = formulaInstruct;
          formulaText = Instruct(formulaInstruct);
        }
      }
      if (format) {
        // 有缓存直接读取缓存
        if (!formatText) {
          formatText = XTableFormat(format, formulaText);
          this.formatText = formatText;
        }
      }
      return formatText;
    }
    // 格式化文本
    switch (contentType) {
      case Cell.TYPE.STRING:
      case Cell.TYPE.NUMBER:
      case Cell.TYPE.DATE_TIME: {
        if (format) {
          if (!formatText) {
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
    let { formula, formulaInstruct, contentType } = this;
    let { richText, formulaText, text } = this;
    // 优先获取公式值
    if (formula) {
      if (!formulaText) {
        if (formulaInstruct) {
          formulaText = Instruct(formulaInstruct);
          this.formulaText = formulaText;
        } else {
          formulaInstruct = Compile(formula);
          this.formulaInstruct = formulaInstruct;
          formulaText = Instruct(formulaInstruct);
        }
      }
      return formulaText;
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
   * 设置单元格小图标
   * @param icons
   */
  setIcons(icons) {
    this.icons = icons;
  }

  /**
   * 设置格式化类型
   * @param format
   */
  setFormat(format) {
    this.format = format;
    this.formatText = null;
    this.setContentWidth(0);
  }

  /**
   * 设置内容文本
   * @param text
   */
  setText(text) {
    this.text = text;
    this.richText = new RichFonts();
    this.formatText = null;
    this.formulaText = null;
    this.formula = null;
    this.formulaInstruct = null;
    this.setContentWidth(0);
  }

  /**
   * 设置富文本
   */
  setRichText(text) {
    this.text = null;
    this.formatText = null;
    this.richText = text;
    this.formulaText = null;
    this.formula = null;
    this.formulaInstruct = null;
    this.setContentWidth(0);
  }

  /**
   * 设置公式
   */
  setFormula(formula) {
    this.text = null;
    this.richText = new RichFonts();
    this.formatText = null;
    this.formulaText = null;
    this.formula = formula;
    this.formulaInstruct = null;
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
   * 设置内容类型
   * @param type
   */
  setContentType(type) {
    this.contentType = type;
  }

  /**
   * 公式是否存在
   * @returns {*}
   */
  hasFormula() {
    return SheetUtils.isNotUnDef(this.formula);
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
    return SheetUtils.isBlank(this.getComputeText());
  }

  /**
   * 字体属性
   * @param attr
   */
  setFontAttr(attr) {
    this.fontAttr = attr;
  }

  /**
   * 设置边框类型
   * @param attr
   */
  setBorderAttr(attr) {
    this.borderAttr = attr;
  }

  /**
   * 复制单元格
   * @returns {Cell}
   */
  clone() {
    const { background, text, format, custom } = this;
    const { richText, fontAttr, borderAttr } = this;
    const { contentWidth, icons, contentType } = this;
    return new Cell({
      background,
      format,
      text,
      custom,
      richText,
      fontAttr,
      borderAttr,
      contentWidth,
      icons,
      contentType,
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
    return this.getFormatText();
  }

  /**
   * 内容宽度
   * @param width
   */
  setContentWidth(width) {
    this.contentWidth = width;
  }

  /**
   * 内容宽度
   * @param height
   */
  setContentHeight(height) {
    this.contentHeight = height;
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
