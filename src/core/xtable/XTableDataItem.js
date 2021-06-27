import { PlainUtils } from '../../utils/PlainUtils';
import { Cell } from './tablecell/Cell';

class XTableDataItem {

  constructor(options) {
    if (options) {
      const { cell, mergeId } = options;
      this.cell = cell || options;
      this.mergeId = mergeId || undefined;
    } else {
      this.cell = undefined;
      this.mergeId = undefined;
    }
  }

  setCell(cell) {
    this.cell = cell;
  }

  setMergeId(mergeId) {
    this.mergeId = mergeId;
  }

  getCell() {
    const { cell } = this;
    if (cell instanceof Cell) {
      return cell;
    }
    if (PlainUtils.isString(cell)) {
      this.cell = new Cell({
        text: cell,
      });
    } else {
      this.cell = new Cell(cell);
    }
    return this.cell;
  }

  getMergeId() {
    return this.mergeId;
  }

}

export {
  XTableDataItem,
};
