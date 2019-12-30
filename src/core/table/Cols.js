import { Utils } from '../../utils/Utils';

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

  setWidth(i, width) {
    const col = this.get(i);
    col.width = width;
    this.computeLeft(i, this.len);
  }

  eachWidth(ci, ei, cb) {
    let x = 0;
    for (let i = ci; i <= ei; i += 1) {
      const colWidth = this.getWidth(i);
      cb(i, colWidth, x);
      x += colWidth;
    }
  }

  sectionSumWidth(sci, eci) {
    return Utils.rangeSum(sci, eci + 1, i => this.getWidth(i));
  }

  totalWidth() {
    return Utils.rangeSum(0, this.len, i => this.getWidth(i));
  }

  getLeft(i) {
    const col = this.getOrNew(i);
    if (!col.left) {
      this.computeLeft(0, i);
    }
    return col.left;
  }

  computeLeft(sci, eci) {
    let left = 0;
    if (sci > 0) {
      left += this.getLeft(sci - 1);
      left += this.getWidth(sci - 1);
    }
    for (let i = sci; i <= eci; i += 1) {
      const col = this.getOrNew(i);
      col.left = left;
      left += this.getWidth(i);
    }
  }
}

export { Cols };
