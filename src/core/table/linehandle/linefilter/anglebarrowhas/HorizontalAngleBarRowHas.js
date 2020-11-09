import { LineFilter } from '../LineFilter';

class HorizontalAngleBarRowHas extends LineFilter {

  constructor({
    cells, cols, merges, rows,
  }) {
    super(ri => (rows.getOrNew(ri).hasAngleCell()
      ? LineFilter.RETURN_TYPE.HANDLE
      : LineFilter.RETURN_TYPE.NEXT_ROW));
    this.rows = rows;
    this.cells = cells;
    this.cols = cols;
    this.merges = merges;
  }

}

export {
  HorizontalAngleBarRowHas,
};
