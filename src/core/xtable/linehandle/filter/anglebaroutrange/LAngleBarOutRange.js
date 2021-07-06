import { LineIteratorFilter } from '../../LineIteratorFilter';

class LAngleBarOutRange {

  constructor(table) {
    this.table = table;
  }

  run({
    row, col, x,
  }) {
    const { table } = this;
    if (!table.isAngleBarCell(row, col)) {
      return LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    const { cells } = table;
    const cell = cells.getCell(row, col);
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    if (angle < 0) {
      return LineIteratorFilter.RETURN_TYPE.JUMP;
    }
    const size = table.getCellContentBoundOutWidth(row, col);
    if (size === 0 || size > x) {
      return LineIteratorFilter.RETURN_TYPE.EXEC;
    }
    return LineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  LAngleBarOutRange,
};
