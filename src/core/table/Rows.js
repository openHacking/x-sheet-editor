import { Utils } from '../../utils/Utils';

class Rows {

  constructor(table, { data = [], len = 10, height }) {
    this.table = table;
    this._ = [];
    this.minHeight = 5;
    this.height = Utils.minIf(height, this.minHeight);
    this.len = len;
    this.cacheTotalHeight = null;
    this.setData(data);
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
    this.cacheTotalHeight = null;
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

  rectRangeSumHeight(rectRange) {
    return this.sectionSumHeight(rectRange.sri, rectRange.eri);
  }

  totalHeight() {
    if (Utils.isNumber(this.cacheTotalHeight)) {
      return this.cacheTotalHeight;
    }
    this.cacheTotalHeight = Utils.rangeSum(0, this.len, i => this.getHeight(i));
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
