import { Utils } from '../../utils/Utils';

class Rows {
  constructor({ len, height }) {
    this._ = [];
    this.height = height;
    this.len = len;
  }

  get(ri) {
    return this._[ri];
  }

  getOrNew(ri) {
    this._[ri] = this._[ri] || {};
    return this._[ri];
  }

  getHeight(ri) {
    const row = this.get(ri);
    if (row && row.height) {
      return row.height;
    }
    return this.height;
  }

  setHeight(ri, height) {
    const row = this.get(ri);
    row.height = height;
    this.computeTop(ri, this.len);
  }

  eachHeight(ri, ei, cb) {
    let y = 0;
    for (let i = ri; i <= ei; i += 1) {
      const rowHeight = this.getHeight(i);
      cb(i, rowHeight, y);
      y += rowHeight;
    }
  }

  sectionSumHeight(sri, eri) {
    return Utils.rangeSum(sri, eri + 1, i => this.getHeight(i));
  }

  totalHeight() {
    return Utils.rangeSum(0, this.len, i => this.getHeight(i));
  }

  getTop(ri) {
    const row = this.getOrNew(ri);
    if (!row.top) {
      this.computeTop(0, ri);
    }
    return row.top;
  }

  computeTop(sri, eri) {
    let top = 0;
    if (sri > 0) {
      top += this.getTop(sri - 1);
      top += this.getHeight(sri - 1);
    }
    for (let i = sri; i <= eri; i += 1) {
      const row = this.getOrNew(i);
      row.top = top;
      top += this.getHeight(i);
    }
  }
}

export { Rows };