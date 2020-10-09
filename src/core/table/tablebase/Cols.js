import { PlainUtils } from '../../../utils/PlainUtils';
import { ScaleAdapter } from './Scale';
import { RectRange } from './RectRange';
import { ColsIterator } from '../iterator/ColsIterator';

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
    this.min = 5;
    this.width = PlainUtils.minIf(width, this.min);
  }

  rectRangeSumWidth(rectRange) {
    if (!rectRange.equals(RectRange.EMPTY)) {
      return this.sectionSumWidth(rectRange.sci, rectRange.eci);
    }
    return 0;
  }

  sectionSumWidth(sci, eci) {
    let total = 0;
    if (sci > eci) {
      return total;
    }
    ColsIterator.getInstance()
      .setBegin(sci)
      .setEnd(eci)
      .setLoop((i) => {
        total += this.getWidth(i);
      })
      .execute();
    return total;
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
    ColsIterator.getInstance()
      .setBegin(ci)
      .setEnd(ei)
      .setLoop((i) => {
        const colWidth = this.getWidth(i);
        cb(i, colWidth, x);
        x += colWidth;
      })
      .execute();
  }

  setWidth(i, width) {
    const col = this.getOrNew(i);
    const { scaleAdapter } = this;
    col.width = scaleAdapter.back(PlainUtils.minIf(width, this.min));
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }
}

export { Cols };
