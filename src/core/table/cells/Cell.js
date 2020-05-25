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
   */
  constructor({
    text = Utils.EMPTY,
    background = Utils.Nul,
    format = 'default',
    fontAttr = {},
    borderAttr = {},
  }) {
    this.background = background;
    this.format = format;
    this.text = text;
    this.fontAttr = new CellFont(fontAttr);
    this.borderAttr = new CellBorder(borderAttr);
  }
}

export { Cell };
