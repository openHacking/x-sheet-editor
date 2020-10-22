import { PlainUtils } from '../../../utils/PlainUtils';
import { CellFont } from './CellFont';
import { CellBorder } from './CellBorder';
import { CellIcon } from './CellIcon';
import { XDraw } from '../../../canvas/XDraw';

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
    this.icons = CellIcon.newInstances(icons);
    this.borderAttr = new CellBorder(borderAttr);
    this.fontAttr = new CellFont(fontAttr);
    this.contentWidth = contentWidth;
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

  cellIconsEvent({
    type, x, y, native,
  }) {
    const { icons } = this;
    CellIcon.cellIconsEvent({
      icons, type, x, y, native,
    });
  }

  clone() {
    const {
      background, format, text, fontAttr, borderAttr, contentWidth, icons,
    } = this;
    return new Cell({
      background, format, icons, text, fontAttr, borderAttr, contentWidth,
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

  toCssStyle() {
    const { background, fontAttr } = this;
    let css = `
      background:${background};
    `;
    css = css.replace(/\s/g, '');
    return fontAttr.toCssStyle() + css;
  }

}

export { Cell };
