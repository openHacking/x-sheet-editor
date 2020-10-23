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
   * @param icons
   * @param borderAttr
   * @param contentWidth
   */
  constructor({
    text = PlainUtils.EMPTY,
    background = PlainUtils.Nul,
    format = 'default',
    borderAttr = {},
    icons = [],
    fontAttr = {},
    contentWidth = 0,
  }) {
    this.background = background;
    this.text = text;
    this.format = format;
    this.icons = XIcon.newInstances(icons);
    this.borderAttr = new CellBorder(borderAttr);
    this.fontAttr = new CellFont(fontAttr);
    this.contentWidth = contentWidth;
  }

  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
  }

  setFontAttr(fontAttr) {
    this.fontAttr = fontAttr;
  }

  setIcons(icons) {
    this.icons = icons;
  }

  setBorderAttr(borderAttr) {
    this.borderAttr = borderAttr;
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
