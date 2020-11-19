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
    this.index = [];
    this.sync();
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

  getOffsetIndex(ri, ci) {
    const { cols } = this;
    const { len } = cols;
    return (ri * len) + ci;
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

  union(rectRange) {
    const { top, left, right, bottom } = rectRange.brink();
    let find = null;
    // 左边扫描
    left.each((ri, ci) => {
      find = this.getFirstIncludes(ri, ci);
      if (find) {
        return rectRange.contains(find);
      }
      return true;
    });
    if (find) {
      return this.union(rectRange.union(find));
    }
    // 下边扫描
    bottom.each((ri, ci) => {
      find = this.getFirstIncludes(ri, ci);
      if (find) {
        return rectRange.contains(find);
      }
      return true;
    });
    if (find) {
      return this.union(rectRange.union(find));
    }
    // 上边扫描
    top.each((ri, ci) => {
      find = this.getFirstIncludes(ri, ci);
      if (find) {
        return rectRange.contains(find);
      }
      return true;
    });
    if (find) {
      return this.union(rectRange.union(find));
    }
    // 右边扫描
    right.each((ri, ci) => {
      find = this.getFirstIncludes(ri, ci);
      if (find) {
        return rectRange.contains(find);
      }
      return true;
    });
    if (find) {
      return this.union(rectRange.union(find));
    }
    return rectRange;
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

  deleteIntersects(rectRange) {
    this.getIncludes(rectRange, old => this.delete(old));
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
