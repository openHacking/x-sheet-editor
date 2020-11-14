import { PlainUtils } from '../../../utils/PlainUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { XIcon } from '../xicon/XIcon';
import { BaseFont } from '../../../canvas/font/BaseFont';

const tableMerges = null;

/**
 * Cell
 * @author jerry
 */
class Cell {

  static setTableMerges(merges) {
    this.tableMerges = merges;
  }

  /**
   * Cell
   * @param text
   * @param background
   * @param format
   * @param fontAttr
   * @param icons
   * @param borderAttr
   * @param contentWidth
   * @param leftSdistWidth
   * @param rightSdistWidth
   */
  constructor({
    text = PlainUtils.EMPTY,
    background = PlainUtils.Nul,
    format = 'default',
    borderAttr = {},
    icons = [],
    fontAttr = {},
    contentWidth = 0,
    leftSdistWidth = 0,
    rightSdistWidth = 0,
  }) {
    this.background = background;
    this.text = text;
    this.format = format;
    this.icons = XIcon.newInstances(icons);
    this.borderAttr = new CellBorder(borderAttr);
    this.fontAttr = new CellFont(fontAttr);
    this.contentWidth = contentWidth;
    this.leftSdistWidth = leftSdistWidth;
    this.rightSdistWidth = rightSdistWidth;
  }

  isAngleBarCell() {
    const { fontAttr, borderAttr } = this;
    if (fontAttr.direction !== BaseFont.TEXT_DIRECTION.ANGLE) {
      return false;
    }
    const lessZero = fontAttr.angle < 0 && fontAttr.angle > -90;
    const moreZero = fontAttr.angle > 0 && fontAttr.angle < 90;
    return (lessZero || moreZero) && borderAttr.isDisplay();
  }

  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
  }

  setBorderAttr(borderAttr) {
    this.borderAttr = borderAttr;
  }

  setIcons(icons) {
    this.icons = icons;
  }

  setFontAttr(fontAttr) {
    this.fontAttr = fontAttr;
  }

  setLeftSdistWidth(leftSdistWidth) {
    this.leftSdistWidth = leftSdistWidth;
  }

  setRightSdistWidth(rightSdistWidth) {
    this.rightSdistWidth = rightSdistWidth;
  }

  toJSON() {
    const {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    } = this;
    return {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    };
  }

  toCssStyle() {
    const { background, fontAttr } = this;
    let css = `
      background:${background};
    `;
    css = css.replace(/\s/g, '');
    return fontAttr.toCssStyle() + css;
  }

  clone() {
    const {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    } = this;
    return new Cell({
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    });
  }

}

export { Cell };
