import { Utils } from '../../../utils/Utils';

class Cols {

  constructor(table, { data = [], len = 10, width }) {
    this.table = table;
    this._ = [];
    this.minWidth = 5;
    this.width = Utils.minIf(width, this.minWidth);
    this.len = len;
    this.cacheTotalWidth = null;
    this.setData(data);
  }

  get(ci) {
    return this._[ci];
  }

  getOrNew(ci) {
    this._[ci] = this._[ci] || {};
    return this._[ci];
  }

  getWidth(i) {
    const { table } = this;
    const { scale } = table;
    const col = this._[i];
    if (col && col.width) {
      return scale.digitModeTo(col.width);
    }
    return scale.digitModeTo(this.width);
  }

  setWidth(i, width) {
    const col = this.getOrNew(i);
    const { table } = this;
    const { scale } = table;
    col.width = scale.digitModeBack(Utils.minIf(width, this.minWidth));
    this.cacheTotalWidth = null;
  }

  eachWidth(ci, ei, cb, sx = 0) {
    let x = sx;
    for (let i = ci; i <= ei; i += 1) {
      const colWidth = this.getWidth(i);
      cb(i, colWidth, x);
      x += colWidth;
    }
  }

  sectionSumWidth(sci, eci) {
    return Utils.rangeSum(sci, eci + 1, i => this.getWidth(i));
  }

  rectRangeSumWidth(rectRange) {
    return this.sectionSumWidth(rectRange.sci, rectRange.eci);
  }

  totalWidth() {
    if (Utils.isNumber(this.cacheTotalWidth)) {
      this.cacheTotalWidth = Utils.rangeSum(0, this.len, i => this.getWidth(i));
    }
    return this.cacheTotalWidth;
  }

  getData() {
    return this._;
  }

  setData(data) {
    this._ = data;
  }
}

export { Cols };
