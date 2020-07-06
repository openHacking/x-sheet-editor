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
   * @param merge
   */
  constructor({
    text = Utils.EMPTY,
    background = Utils.Nul,
    format = 'default',
    fontAttr = {},
    borderAttr = {},
    contentWidth = 0,
    merge = -1,
  }) {
    this.background = background;
    this.format = format;
    this.text = text;
    this.fontAttr = new CellFont(fontAttr);
    this.borderAttr = new CellBorder(borderAttr);
    this.contentWidth = contentWidth;
    this.merge = merge;
  }

  setContentWidth(contentWidth) {
    this.contentWidth = contentWidth;
  }

  clone() {
    const {
      background,
      format,
      text,
      fontAttr,
      borderAttr,
    } = this;
    return new Cell({
      background,
      format,
      text,
      fontAttr: fontAttr.clone(),
      borderAttr: borderAttr.clone(),
    });
  }
}

export { Cell };
