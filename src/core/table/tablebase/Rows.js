import { Utils } from '../../../utils/Utils';
import { ScaleAdapter } from './Scale';
import { RectRange } from './RectRange';

class Rows {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    len = 10,
    data = [],
    height,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.len = len;
    this.data = data;
    this.min = 5;
    this.height = Utils.minIf(height, this.min);
  }

  getOrNew(ri) {
    this.data[ri] = this.data[ri] || {};
    return this.data[ri];
  }

  getHeight(ri) {
    const { scaleAdapter } = this;
    const row = this.get(ri);
    if (row && row.height) {
      return scaleAdapter.goto(row.height);
    }
    return scaleAdapter.goto(this.height);
  }

  get(ri) {
    return this.data[ri];
  }

  eachHeight(ri, ei, cb, sy = 0) {
    let y = sy;
    for (let i = ri; i <= ei; i += 1) {
      const rowHeight = this.getHeight(i);
      cb(i, rowHeight, y);
      y += rowHeight;
    }
  }

  setHeight(ri, height) {
    const row = this.getOrNew(ri);
    const { scaleAdapter } = this;
    row.height = scaleAdapter.back(Utils.minIf(height, this.min));
  }

  rectRangeSumHeight(rectRange) {
    if (!rectRange.equals(RectRange.EMPTY)) {
      return this.sectionSumHeight(rectRange.sri, rectRange.eri);
    }
    return 0;
  }

  sectionSumHeight(sri, eri) {
    return Utils.rangeSum(sri, eri + 1, i => this.getHeight(i));
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }
}

export { Rows };
