import { BaseCellsHelper } from './BaseCellsHelper';

class OperateCellsHelper extends BaseCellsHelper {

  getCellOrNewCellByViewRange({
    rectRange,
    callback,
  }) {
    const { cells, merges } = this;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    const filter = [];
    for (let i = sri; i <= eri; i += 1) {
      for (let j = sci; j <= eci; j += 1) {
        const cell = cells.getMergeCellOrNewCell(i, j);
        if (filter.indexOf(cell) !== -1) {
          continue;
        }
        filter.push(cell);
        const merge = merges.getFirstIncludes(i, j);
        callback(i, j, cell, merge);
      }
    }
  }

}

export {
  OperateCellsHelper,
};
