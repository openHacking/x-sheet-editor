
class CellOutRange {

  constructor({
    cells, cols, rows, merges,
  }) {
    this.cells = cells;
    this.cols = cols;
    this.merges = merges;
    this.rows = rows;
  }

}

export {
  CellOutRange,
};
