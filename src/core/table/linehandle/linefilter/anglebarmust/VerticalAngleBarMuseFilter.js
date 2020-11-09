import { LineFilter } from '../LineFilter';

class VerticalAngleBarMuseFilter extends LineFilter {

  constructor({
    cells, cols, merges,
  }) {
    super((ci, ri) => {
      const cell = cells.getCell(ri, ci);
      if (cell) {
        return cell.isAngleBarCell()
          ? LineFilter.RETURN_TYPE.HANDLE
          : LineFilter.RETURN_TYPE.JUMP;
      }
      return LineFilter.RETURN_TYPE.JUMP;
    });
    this.cells = cells;
    this.cols = cols;
    this.merges = merges;
  }

}

export {
  VerticalAngleBarMuseFilter,
};
