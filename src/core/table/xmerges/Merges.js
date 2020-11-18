import { JSObjectMap } from './JSObjectMap';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { MergesRange } from './MergesRange';
import { RectRange } from '../tablebase/RectRange';

class Merges {

  constructor({
    data = [],
  }) {
    this.map = new JSObjectMap();
    this.cols = new Cols();
    this.rows = new Rows();
    data.forEach(item => this.add(RectRange.valueOf(item)));
  }

  getIncludes(rectrange, callback) {
    rectrange.each((ri, ci) => {
      const key = this.getIndex(ri, ci);
      const item = this.map.get(key);
      if (item) {
        callback(item.getRectRange());
      }
    });
  }

  getIndex(ri, ci) {
    const rowIndex = this.rows.getIndex(ri);
    const colIndex = this.cols.getIndex(ci);
    return `R${rowIndex.id}C${colIndex.id}`;
  }

  getFirstIncludes(ri, ci) {
    const key = this.getIndex(ri, ci);
    const item = this.map.get(key);
    return item ? item.getRectRange() : null;
  }

  add(rectrange) {
    const sri = this.rows.getIndex(rectrange.sri);
    const sci = this.cols.getIndex(rectrange.sci);
    const eri = this.rows.getIndex(rectrange.eri);
    const eci = this.cols.getIndex(rectrange.eci);
    const mergesrange = new MergesRange(sri, sci, eri, eci);
    rectrange.each((ri, ci) => {
      this.map.put(this.getIndex(ri, ci), mergesrange);
    });
  }

  delete(rectrange) {
    rectrange.each((ri, ci) => {
      this.map.remove(this.getIndex(ri, ci));
    });
  }

  union(rectrange) {
    let brink = null;
    let find = null;
    brink = rectrange.brink();
    // 扫描左边
    brink.left.each((ri, ci) => {
      const key = this.getIndex(ri, ci);
      find = this.map.get(key);
      return !!find;
    });
    if (find) {
      return this.union(rectrange.union(find.getRectRange()));
    }
    // 扫描头部
    brink.top.each((ri, ci) => {
      const key = this.getIndex(ri, ci);
      find = this.map.get(key);
      return !!find;
    });
    if (find) {
      return this.union(rectrange.union(find.getRectRange()));
    }
    // 扫描右边
    brink.right.each((ri, ci) => {
      const key = this.getIndex(ri, ci);
      find = this.map.get(key);
      return !!find;
    });
    if (find) {
      return this.union(rectrange.union(find.getRectRange()));
    }
    // 扫描下边
    brink.bottom.each((ri, ci) => {
      const key = this.getIndex(ri, ci);
      find = this.map.get(key);
      return !!find;
    });
    if (find) {
      return this.union(rectrange.union(find.getRectRange()));
    }
    return rectrange;
  }

}

export {
  Merges,
};
