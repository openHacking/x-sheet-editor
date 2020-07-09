import { Utils } from '../../../utils/Utils';
import { RectRange } from './RectRange';

class Merge {

  constructor(table, { merges = [] }) {
    this.table = table;
    this._ = [];
    this._ = merges.map(merge => RectRange.valueOf(merge)).concat(this._);
  }

  getFirstIncludes(ri, ci) {
    const { table } = this;
    const { cells } = table;
    const cell = cells.getCell(ri, ci);
    if (Utils.isUnDef(cell)) {
      return null;
    }
    const { merge } = cell;
    if (merge === -1) {
      return null;
    }
    return this._[merge];
  }

  add(rectRange) {
    const { table } = this;
    const { cells } = table;
    const len = this._.length;
    rectRange.each((ri, ci) => {
      const cell = cells.getCellOrNew(ri, ci);
      if (cell.merge !== -1) {
        this.delete(cell.merge);
      }
      cell.merge = len;
    });
    this._.push(rectRange);
    return len;
  }

  delete(mergeIdx) {
    const { table } = this;
    const { cells } = table;
    const rectRange = this._[mergeIdx];
    if (rectRange) {
      rectRange.each((ri, ci) => {
        const cell = cells.getCell(ri, ci);
        if (cell) {
          cell.merge = -1;
        }
      });
      this._.splice(mergeIdx, 1);
      this.sync(mergeIdx);
    }
    return rectRange;
  }

  sync(scan = 0) {
    const { table } = this;
    const { cells } = table;
    for (let i = scan; i < this._.length; i += 1) {
      const rectRange = this._[i];
      if (rectRange) {
        rectRange.each((ri, ci) => {
          const cell = cells.getCell(ri, ci);
          if (cell) {
            cell.merge = i;
          }
        });
      }
    }
  }

  union(cellRange) {
    let cr = cellRange;
    const filter = [];
    for (let i = 0; i < this._.length; i += 1) {
      const item = this._[i];
      if (filter.find(e => e === item)) {
        continue;
      }
      if (item.intersects(cr)) {
        filter.push(item);
        cr = item.union(cr);
        i = -1;
      }
    }
    return cr;
  }

  getData() {
    return this._;
  }

  setData(data) {
    this._ = data;
  }

}

export {
  Merge,
};
