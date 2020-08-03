import { Utils } from '../../../utils/Utils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';

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
   * @param borderAttr
   * @param contentWidth
   */
  constructor({
    text = Utils.EMPTY,
    background = Utils.Nul,
    format = 'default',
    fontAttr = {},
    borderAttr = {},
    contentWidth = 0,
  }) {
    this.background = background;
    this.format = format;
    this.text = text;
    this.fontAttr = new CellFont(fontAttr);
    this.borderAttr = new CellBorder(borderAttr);
    this.contentWidth = contentWidth;
  }

  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
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
      background,
      format,
      text,
      fontAttr,
      borderAttr,
      contentWidth,
    } = this;
    return new Cell({
      background,
      format,
      text,
      fontAttr,
      borderAttr,
      contentWidth,
    });
  }

  toJSON() {
    const {
      background,
      format,
      text,
      fontAttr,
      borderAttr,
      contentWidth,
    } = this;
    return { background, format, text, fontAttr, borderAttr, contentWidth };
  }
}

export { Cell };
