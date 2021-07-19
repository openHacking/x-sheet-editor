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

  clearCache() {
    this.cacheHeight.clear();
  }

  setHeight(ri, height) {
    const row = this.getOrNew(ri);
    const { scaleAdapter } = this;
    row.height = scaleAdapter.back(PlainUtils.minIf(height, this.min));
  }

  removeRow(ri) {
    const { data } = this;
    if (PlainUtils.isNotUnDef(ri)) {
      if (data[ri]) {
        data.splice(ri, 1);
      }
    }
    this.len--;
  }

  insertRowAfter(ri) {
    const { data } = this;
    if (PlainUtils.isNotUnDef(ri)) {
      if (data[ri]) {
        data.splice(ri + 1, 0, {});
      }
    }
    this.len++;
  }

  insertRowBefore(ri) {
    const { data } = this;
    if (PlainUtils.isNotUnDef(ri)) {
      if (data[ri]) {
        data.splice(ri, 0, {});
      }
    }
    this.len++;
  }

  getOrNew(ri) {
    const row = this.get(ri);
    if (row) {
      return row;
    }
    if (ri < 0) {
      throw new TypeError(`错误的行号${ri}`);
    }
    this.data[ri] = new Row(ri, {
      height: this.height,
    });
    return this.data[ri];
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

  getData() {
    return {
      min: this.min,
      len: this.len,
      data: this.data,
      height: this.height,
    };
  }

  getMinHeight() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.min);
  }

  getHeight(ri) {
    if (ri < 0) {
      return 0;
    }
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
    if (ri < 0) {
      return 0;
    }
    const row = this.get(ri);
    if (row && row.height) {
      return row.height;
    }
    return this.height;
  }

  getOriginDefaultHeight() {
    return this.height;
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

}

export { Rows };
