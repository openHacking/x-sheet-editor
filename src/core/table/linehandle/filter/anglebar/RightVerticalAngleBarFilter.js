import { LineFilter } from '../LineFilter';
import { BaseFont } from '../../../../../canvas/font/BaseFont';

class RightVerticalAngleBarFilter extends LineFilter {

  constructor({
    cells, cols, merges,
  }) {
    super((ci, ri) => {
      const next = cells.getCell(ri, ci + 1);
      const cell = cells.getCell(ri, ci);
      if (cell) {
        const { fontAttr } = cell;
        const { direction } = fontAttr;
        if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
          const { angle } = fontAttr;
          if (angle !== 90 && angle !== -90) {
            return false;
          }
        }
      }
      if (next) {
        const { fontAttr } = next;
        const { direction } = fontAttr;
        if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
          const { angle } = fontAttr;
          if (angle !== 90 && angle !== -90) {
            return false;
          }
        }
      }
      return true;
    });
    this.cells = cells;
    this.cols = cols;
    this.merges = merges;
  }

}

export {
  RightVerticalAngleBarFilter,
};
