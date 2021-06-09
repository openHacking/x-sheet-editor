import { PlainUtils } from '../../../utils/PlainUtils';
import { ScaleAdapter } from '../tablebase/Scale';
import { RectRange } from '../tablebase/RectRange';
import { Row } from './Row';
import { CacheHeightItems } from './CacheHeightItems';

class Rows {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    len = 10,
    height = 30,
    xIteratorBuilder,
    data = [],
  }) {
    this.xIteratorBuilder = xIteratorBuilder;
    this.cacheItems = new CacheHeightItems();
    this.scaleAdapter = scaleAdapter;
    this.len = len;
    this.data = data;
    this.min = 5;
    this.height = PlainUtils.minIf(height, this.min);
  }

  eachHeight(ri, ei, cb, sy = 0) {
    let y = sy;
    this.xIteratorBuilder.getRowIterator()
      .setBegin(ri)
      .setEnd(ei)
      .setLoop((i) => {
        const rowHeight = this.getHeight(i);
        cb(i, rowHeight, y);
        y += rowHeight;
      })
      .execute();
  }

  sectionSumHeight(sri, eri) {
    let total = 0;
    if (sri > eri) { return total; }
    const cache = this.cacheItems.get(sri, eri);
    if (cache) { return cache; }
    this.xIteratorBuilder.getRowIterator()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        total += this.getHeight(i);
      })
      .execute();
    this.cacheItems.add(sri, eri, total);
    return total;
  }

  rectRangeSumHeight(rectRange) {
    if (!rectRange.equals(RectRange.EMPTY)) {
      return this.sectionSumHeight(rectRange.sri, rectRange.eri);
    }
    return 0;
  }

  get(ri) {
    let row = this.data[ri];
    if (row) {
      if (row instanceof Row) {
        return row;
      }
      row = new Row(ri, row);
      this.data[ri] = row;
    }
    return row;
  }

  getOrNew(ri) {
    const row = this.get(ri);
    if (row) {
      return row;
    }
    this.data[ri] = new Row(ri, {
      height: this.height,
    });
    return this.data[ri];
  }

  getMinHeight() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.min);
  }

  getHeight(ri) {
    const { scaleAdapter } = this;
    const row = this.get(ri);
    if (row && row.height) {
      return scaleAdapter.goto(row.height);
    }
    return scaleAdapter.goto(this.height);
  }

  getDefaultHeight() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.height);
  }

  getOriginHeight(ri) {
    const row = this.get(ri);
    if (row && row.height) {
      return row.height;
    }
    return this.height;
  }

  getOriginDefaultHeight() {
    return this.height;
  }

  setHeight(ri, height) {
    const row = this.getOrNew(ri);
    const { scaleAdapter } = this;
    row.height = scaleAdapter.back(PlainUtils.minIf(height, this.min));
    this.cacheItems.clear();
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

}

export { Rows };
