import { PlainUtils } from '../../../utils/PlainUtils';
import { ScaleAdapter } from '../tablebase/Scale';
import { RectRange } from '../tablebase/RectRange';
import { Row } from './Row';
import { CacheHeight } from './CacheHeight';
import { XIteratorBuilder } from '../iterator/XIteratorBuilder';

class Rows {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    xIteratorBuilder = new XIteratorBuilder(),
    len = 10,
    data = [],
    height = 30,
  } = {}) {
    this.xIteratorBuilder = xIteratorBuilder;
    this.cacheHeight = new CacheHeight();
    this.scaleAdapter = scaleAdapter;
    this.min = 5;
    this.len = len;
    this.data = data;
    this.height = PlainUtils.minIf(height, this.min);
    if (this.data.length > this.len) {
      this.len = this.data.length;
    }
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
    if (sri > eri) {
      return total;
    }
    const val = this.cacheHeight.get(sri, eri);
    if (val) {
      return val;
    }
    const items = this.cacheHeight.getItems(sri);
    if (items) {
      if (items.min < eri) {
        this.xIteratorBuilder.getRowIterator()
          .setBegin(eri)
          .setEnd(sri)
          .setLoop((i) => {
            const val = items.get(i);
            if (val) {
              total += val;
              return false;
            }
            total += this.getHeight(i);
            return true;
          })
          .execute();
        this.cacheHeight.add(sri, eri, total);
        return total;
      }
    }
    this.xIteratorBuilder.getRowIterator()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        total += this.getHeight(i);
      })
      .execute();
    this.cacheHeight.add(sri, eri, total);
    return total;
  }

  rectRangeSumHeight(rectRange) {
    if (!rectRange.equals(RectRange.EMPTY)) {
      return this.sectionSumHeight(rectRange.sri, rectRange.eri);
    }
    return 0;
  }

  clearCache() {
    this.cacheHeight.clear();
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

  getData() {
    return {
      min: this.min,
      len: this.len,
      data: this.data,
      height: this.height,
    };
  }

  setHeight(ri, height) {
    const row = this.getOrNew(ri);
    const { scaleAdapter } = this;
    row.height = scaleAdapter.back(PlainUtils.minIf(height, this.min));
  }

  removeRow(ri) {
    this.data.splice(ri, 1);
  }

  insertRowAfter(ri) {
    const next = ri + 1;
    this.data[next] = {};
    if (this.data.length > this.len) {
      this.len = this.data.length;
    }
  }

  insertRowBefore(ri) {
    const last = ri - 1;
    this.data[last] = {};
    if (this.data.length > this.len) {
      this.len = this.data.length;
    }
  }

}

export { Rows };
