import { LineFilter } from '../LineFilter';

class VerticalAngleBarRowHas extends LineFilter {

  constructor({
    cells, cols, merges, rows,
  }) {
    super((ci, ri) => (rows.getOrNew(ri).hasAngleCell()
      ? LineFilter.RETURN_TYPE.HANDLE
      : LineFilter.RETURN_TYPE.JUMP));
    this.rows = rows;
    this.cells = cells;
    this.cols = cols;
    this.merges = merges;
  }

}

export {
  VerticalAngleBarRowHas,
};
