import { Utils } from '../utils/Utils';

class Cols {
  constructor({ len, width }) {
    this._ = [];
    this.width = width;
    this.len = len;
  }

  get(ci) {
    return this._[ci];
  }

  getOrNew(ci) {
    this._[ci] = this._[ci] || {};
    return this._[ci];
  }

  getWidth(i) {
    const col = this._[i];
    if (col && col.width) {
      return col.width;
    }
    return this.width;
  }

  eachWidth(ci, ei, cb) {
    let x = 0;
    for (let i = ci; i <= ei; i += 1) {
      const colWidth = this.getWidth(i);
      cb(i, colWidth, x);
      x += colWidth;
    }
  }

  sumWidth(sci, eci) {
    return Utils.rangeSum(sci, eci + 1, i => this.getWidth(i));
  }

  totalWidth() {
    return this.sumWidth(0, this.len);
  }
}

export { Cols };
