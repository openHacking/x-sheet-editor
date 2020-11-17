import { RectRange } from './RectRange';
import { PlainUtils } from '../../../utils/PlainUtils';

/**
 * Merges Class
 */
class Merges {

  /**
   * Merges
   * @param merges
   * @param cols
   * @param rows
   */
  constructor({
    merges = [],
    cols,
    rows,
  }) {
    this.rows = rows;
    this.cols = cols;
    this.data = merges.map(merge => RectRange.valueOf(merge));
    this.index = new Array(rows.len * cols.len);
  }

  getIncludes(rectRange, cb) {
    const { index, data } = this;
    rectRange.each((ri, ci) => {
      const offset = this.getOffsetIndex(ri, ci);
      const no = index[offset];
      if (PlainUtils.isNotUnDef(no)) {
        cb(data[no], no);
      }
    });
  }

  getFirstIncludes(ri, ci) {
    const { index, data } = this;
    const offset = this.getOffsetIndex(ri, ci);
    const no = index[offset];
    if (PlainUtils.isUnDef(no)) {
      return null;
    }
    const item = data[no];
    if (PlainUtils.isUnDef(item)) {
      return null;
    }
    return item;
  }

  getOffsetIndex(ri, ci) {
    const { cols } = this;
    const { len } = cols;
    return (ri * len) + ci;
  }

  deleteIntersects(rectRange) {
    this.getIncludes(rectRange, old => this.delete(old));
  }

  delete(rectRange) {
    const { sri, sci } = rectRange;
    const { index, data } = this;
    const offset = this.getOffsetIndex(sri, sci);
    const no = index[offset];
    if (PlainUtils.isUnDef(no)) {
      return;
    }
    data.splice(no, 1);
    rectRange.each((ri, ci) => {
      const offset = this.getOffsetIndex(ri, ci);
      index[offset] = undefined;
    });
    this.sync(no);
  }

  add(rectRange, checked = true) {
    const { index, data } = this;
    if (checked) {
      this.deleteIntersects(rectRange);
    }
    const len = data.length;
    data.push(rectRange);
    rectRange.each((ri, ci) => {
      const offset = this.getOffsetIndex(ri, ci);
      index[offset] = len;
    });
  }

  sync(offset = 0) {
    const { index, data } = this;
    for (let i = offset; i < data.length; i += 1) {
      const rectRange = data[i];
      rectRange.each((ri, ci) => {
        const offset = this.getOffsetIndex(ri, ci);
        index[offset] = i;
      });
    }
  }

  union(cellRange = RectRange.EMPTY) {
    let cr = cellRange;
    const filter = [];
    for (let i = 0; i < this.data.length; i += 1) {
      const item = this.data[i];
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
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

}

export {
  Merges,
};
