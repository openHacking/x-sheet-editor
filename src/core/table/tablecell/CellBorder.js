import { Border } from './Border';

/**
 * CellBorder
 * @author jerry
 */
class CellBorder {

  /**
   * CellBorder
   * @param time
   * @param left
   * @param top
   * @param right
   * @param bottom
   */
  constructor({
    left = {},
    top = {},
    right = {},
    bottom = {},
  }) {
    this.left = new Border(left);
    this.top = new Border(top);
    this.right = new Border(right);
    this.bottom = new Border(bottom);
  }

  clone() {
    const {
      left,
      top,
      right,
      bottom,
    } = this;
    return new CellBorder({
      left,
      top,
      right,
      bottom,
    });
  }
}

export { CellBorder };
