import { PlainUtils } from '../../../utils/PlainUtils';
import { ScaleAdapter } from '../tablebase/Scale';
import { RectRange } from '../tablebase/RectRange';
import { Col } from './Col';
import { CacheWidth } from './CacheWidth';
import { XIteratorBuilder } from '../iterator/XIteratorBuilder';

class Cols {

  constructor({
    scaleAdapter = new ScaleAdapter(),
    xIteratorBuilder = new XIteratorBuilder(),
    len = 10,
    data = [],
    width = 110,
  } = {}) {
    this.xIteratorBuilder = xIteratorBuilder;
    this.scaleAdapter = scaleAdapter;
    this.cacheWidth = new CacheWidth();
    this.min = 5;
    this.len = len;
    this.data = data;
    this.width = PlainUtils.minIf(width, this.min);
    if (this.data.length > this.len) {
      this.len = this.data.length;
    }
  }

  eachWidth(ci, ei, cb, sx = 0) {
    let x = sx;
    this.xIteratorBuilder.getColIterator()
      .setBegin(ci)
      .setEnd(ei)
      .setLoop((i) => {
        const colWidth = this.getWidth(i);
        cb(i, colWidth, x);
        x += colWidth;
      })
      .execute();
  }

  sectionSumWidth(sci, eci) {
    let total = 0;
    if (sci > eci) {
      return total;
    }
    const val = this.cacheWidth.get(sci, eci);
    if (val) {
      return val;
    }
    const items = this.cacheWidth.getItems(sci);
    if (items) {
      if (items.min < eci) {
        this.xIteratorBuilder.getColIterator()
          .setBegin(eci)
          .setEnd(sci)
          .setLoop((i) => {
            const val = items.get(i);
            if (val) {
              total += val;
              return false;
            }
            total += this.getWidth(i);
            return true;
          })
          .execute();
        this.cacheWidth.add(sci, eci, total);
        return total;
      }
    }
    this.xIteratorBuilder.getColIterator()
      .setBegin(sci)
      .setEnd(eci)
      .setLoop((i) => {
        total += this.getWidth(i);
      })
      .execute();
    this.cacheWidth.add(sci, eci, total);
    return total;
  }

  clearCache() {
    this.cacheWidth.clear();
  }

  rectRangeSumWidth(rectRange) {
    if (!rectRange.equals(RectRange.EMPTY)) {
      return this.sectionSumWidth(rectRange.sci, rectRange.eci);
    }
    return 0;
  }

  get(ci) {
    let col = this.data[ci];
    if (col) {
      if (col instanceof Col) {
        return col;
      }
      col = new Col(ci, col);
      this.data[ci] = col;
    }
    return col;
  }

  getOrNew(ci) {
    const col = this.get(ci);
    if (col) {
      return col;
    }
    this.data[ci] = new Col(ci, {
      width: this.width,
    });
    return this.data[ci];
  }

  getMinWidth() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.min);
  }

  getWidth(ci) {
    const { scaleAdapter } = this;
    const col = this.data[ci];
    if (col && col.width) {
      return scaleAdapter.goto(col.width);
    }
    return scaleAdapter.goto(this.width);
  }

  getDefaultWidth() {
    const { scaleAdapter } = this;
    return scaleAdapter.goto(this.width);
  }

  getOriginWidth(ci) {
    const col = this.data[ci];
    if (col && col.width) {
      return col.width;
    }
    return this.width;
  }

  getOriginDefaultWidth() {
    return this.width;
  }

  getData() {
    return {
      min: this.min,
      len: this.len,
      data: this.data,
      width: this.width,
    };
  }

  setWidth(i, width) {
    const col = this.getOrNew(i);
    const { scaleAdapter } = this;
    col.width = scaleAdapter.back(PlainUtils.minIf(width, this.min));
  }

  removeCol(ci) {
    this.data.splice(ci, 1);
  }

  insertColAfter(ci) {
    const next = ci + 1;
    this.data[next] = {};
    if (this.data.length > this.len) {
      this.len = this.data.length;
    }
  }

  insertColBefore(ci) {
    const last = ci - 1;
    this.data[last] = {};
    if (this.data.length > this.len) {
      this.len = this.data.length;
    }
  }

}

export { Cols };
