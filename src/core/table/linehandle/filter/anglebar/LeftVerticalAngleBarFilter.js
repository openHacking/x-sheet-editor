import { LineFilter } from '../LineFilter';
import { BaseFont } from '../../../../../canvas/font/BaseFont';

class LeftVerticalAngleBarFilter extends LineFilter {

  constructor({
    cells, cols, merges,
  }) {
    super((ci, ri) => {
      const last = cells.getCell(ri, ci - 1);
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
      if (last) {
        const { fontAttr } = last;
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
  LeftVerticalAngleBarFilter,
};
