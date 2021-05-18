import { PlainUtils } from '../../../utils/PlainUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../xicon/XIcon';

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
    this.background = background;
    this.format = format;
    this.icons = XIcon.newInstances(icons);
    this.borderAttr = new CellBorder(borderAttr);
    this.fontAttr = new CellFont(fontAttr);
    this.ruler = ruler;
    this.contentWidth = contentWidth;
    this.leftSdistWidth = leftSdistWidth;
    this.rightSdistWidth = rightSdistWidth;
    this.contentType = contentType;
    this.convert(text);
  }

  convert(text) {
    const { contentType } = this;
    switch (contentType) {
      case Cell.CONTENT_TYPE.NUMBER: {
        if (PlainUtils.isBlank(text)) {
          this.contentType = Cell.CONTENT_TYPE.STRING;
        } else {
          this.text = PlainUtils.parseFloat(text);
        }
        break;
      }
      case Cell.CONTENT_TYPE.STRING: {
        this.text = text.toString();
        break;
      }
    }
  }

  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
  }

  setFontAttr(fontAttr) {
    this.fontAttr = fontAttr;
  }

  setBorderAttr(borderAttr) {
    this.borderAttr = borderAttr;
  }

  setIcons(icons) {
    this.icons = icons;
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

  setContentType(type) {
    this.contentType = type;
    this.convert(this.text);
  }

  setLeftSdistWidth(leftSdistWidth) {
    this.leftSdistWidth = leftSdistWidth;
  }

  setRightSdistWidth(rightSdistWidth) {
    this.rightSdistWidth = rightSdistWidth;
  }

  clone() {
    const { background, format, text, fontAttr, borderAttr, contentWidth, icons } = this;
    return new Cell({
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    });
  }

  toJSON() {
    const { background, format, text, fontAttr, borderAttr, contentWidth, icons } = this;
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
