import { Utils } from '../../utils/Utils';

class Rows {
  constructor({ len, height }) {
    this._ = [];
    this.minHeight = 20;
    this.height = Utils.minIf(height, this.minHeight);
    this.len = len;
    this.cacheTotalHeight = -1;
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
    const row = this.getOrNew(ri);
    row.height = Utils.minIf(height, this.minHeight);
    this.cacheTotalHeight = -1;
  }

  eachHeight(ri, ei, cb, sy = 0) {
    let y = sy;
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
    if (this.cacheTotalHeight === -1) {
      this.cacheTotalHeight = Utils.rangeSum(0, this.len, i => this.getHeight(i));
    }
    return this.cacheTotalHeight;
  }

  getData() {
    return this._;
  }

  setData(data) {
    this._ = data;
  }
}

export { Rows };
