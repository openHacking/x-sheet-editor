import { LineFilter } from '../LineFilter';

class BottomHorizontalAngleBarIgnoreFilter extends LineFilter {

  constructor({
    cells, cols, merges,
  }) {
    super((ri, ci) => {
      const next = cells.getCell(ri + 1, ci);
      const cell = cells.getCell(ri, ci);
      if (cell) {
        return cell.isAngleBarCell()
          ? LineFilter.RETURN_TYPE.JUMP
          : LineFilter.RETURN_TYPE.HANDLE;
      }
      if (next) {
        return next.isAngleBarCell()
          ? LineFilter.RETURN_TYPE.JUMP
          : LineFilter.RETURN_TYPE.HANDLE;
      }
      return LineFilter.RETURN_TYPE.HANDLE;
    });
    this.cells = cells;
    this.cols = cols;
    this.merges = merges;
  }

}

export {
  BottomHorizontalAngleBarIgnoreFilter,
};
