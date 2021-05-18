import { PlainUtils } from '../../../utils/PlainUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../xicon/XIcon';
import XTableFormat from '../XTableFormat';

/**
 * Cell
 * @author jerry
 */
class Cell {

  /**
   * Cell
   * @param text
   * @param background
   * @param format
   * @param fontAttr
   * @param ruler
   * @param icons
   * @param borderAttr
   * @param contentWidth
   * @param leftSdistWidth
   * @param rightSdistWidth
   * @param contentType
   */
  constructor({
    text = PlainUtils.EMPTY,
    background = PlainUtils.Nul,
    format = 'default',
    ruler = null,
    fontAttr = {},
    borderAttr = {},
    icons = [],
    contentWidth = 0,
    leftSdistWidth = 0,
    rightSdistWidth = 0,
    contentType = Cell.CONTENT_TYPE.STRING,
  }) {
    this.ruler = ruler;
    this.text = text;
    this.background = background;
    this.format = format;
    this.icons = XIcon.newInstances(icons);
    this.borderAttr = new CellBorder(borderAttr);
    this.fontAttr = new CellFont(fontAttr);
    this.contentWidth = contentWidth;
    this.leftSdistWidth = leftSdistWidth;
    this.rightSdistWidth = rightSdistWidth;
    this.contentType = contentType;
    this.setContentType(contentType);
    this.setFormat(format);
  }

  convert(text) {
    if (PlainUtils.isBlank(text)) {
      this.contentType = Cell.CONTENT_TYPE.STRING;
      this.format = 'default';
      this.text = PlainUtils.EMPTY;
    } else {
      const { contentType } = this;
      switch (contentType) {
        case Cell.CONTENT_TYPE.NUMBER: {
          this.text = PlainUtils.parseFloat(text);
          break;
        }
        case Cell.CONTENT_TYPE.STRING: {
          this.text = text.toString();
          break;
        }
      }
    }
  }

  isEmpty() {
    return PlainUtils.isBlank(this.text);
  }

  getFormatText() {
    const { format, text, contentType } = this;
    switch (contentType) {
      case Cell.CONTENT_TYPE.STRING: {
        if (PlainUtils.isBlank(text)) {
          return PlainUtils.EMPTY;
        }
        return XTableFormat(format, text);
      }
      case Cell.CONTENT_TYPE.NUMBER: {
        if (PlainUtils.isBlank(text)) {
          return PlainUtils.EMPTY;
        }
        const number = XTableFormat(format, text);
        return number.toString();
      }
      case Cell.CONTENT_TYPE.RICH_TEXT: {
        return PlainUtils.EMPTY;
      }
    }
    return PlainUtils.EMPTY;
  }

  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
  }

  setLeftSdistWidth(leftSdistWidth) {
    this.leftSdistWidth = leftSdistWidth;
  }

  setRightSdistWidth(rightSdistWidth) {
    this.rightSdistWidth = rightSdistWidth;
  }

  setIcons(icons) {
    this.icons = icons;
  }

  setFontAttr(fontAttr) {
    this.fontAttr = fontAttr;
  }

  setContentType(type) {
    this.contentType = type;
    this.convert(this.text);
  }

  setText(text) {
    this.convert(text);
    this.setContentWidth(0);
    this.setLeftSdistWidth(0);
    this.setRightSdistWidth(0);
  }

  setRuler(ruler) {
    this.ruler = ruler;
  }

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
        this.setContentType(Cell.CONTENT_TYPE.NUMBER);
        break;
    }
  }

  setBorderAttr(borderAttr) {
    this.borderAttr = borderAttr;
  }

  clone() {
    const {
      background, format, text, fontAttr,
      borderAttr, contentWidth, icons,
      contentType,
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
    });
  }

  toString() {
    const { contentType } = this;
    switch (contentType) {
      case Cell.CONTENT_TYPE.NUMBER:
      case Cell.CONTENT_TYPE.STRING: {
        return this.text;
      }
      case Cell.CONTENT_TYPE.RICH_TEXT: {
        return PlainUtils.EMPTY;
      }
    }
    return PlainUtils.EMPTY;
  }

  toJSON() {
    const {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    } = this;
    return {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    };
  }

}

Cell.CONTENT_TYPE = {
  NUMBER: 0,
  STRING: 1,
  RICH_TEXT: 2,
};

export {
  Cell,
};
