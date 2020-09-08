import { Utils } from '../../../utils/Utils';
import { ScaleAdapter } from './Scale';

class Cols {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    len = 10,
    data = [],
    width = 110,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.len = len;
    this.data = data;
    this.min = 10;
    this.width = Utils.minIf(width, this.min);
  }

  getOrNew(ci) {
    this.data[ci] = this.data[ci] || {};
    return this.data[ci];
  }

  getWidth(i) {
    const { scaleAdapter } = this;
    const col = this.data[i];
    if (col && col.width) {
      return scaleAdapter.goto(col.width);
    }
    return scaleAdapter.goto(this.width);
  }

  get(ci) {
    return this.data[ci];
  }

  eachWidth(ci, ei, cb, sx = 0) {
    let x = sx;
    for (let i = ci; i <= ei; i += 1) {
      const colWidth = this.getWidth(i);
      cb(i, colWidth, x);
      x += colWidth;
    }
  }

  setWidth(i, width) {
    const col = this.getOrNew(i);
    const { scaleAdapter } = this;
    col.width = scaleAdapter.back(Utils.minIf(width, this.min));
  }

  rectRangeSumWidth(rectRange) {
    return this.sectionSumWidth(rectRange.sci, rectRange.eci);
  }

  sectionSumWidth(sci, eci) {
    return Utils.rangeSum(sci, eci + 1, i => this.getWidth(i));
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }
}

export { Cols };
