import { XMergesIndex } from './XMergesIndex';
import { XMergesNoRow } from './XMergesNoRow';
import { XMergesItems } from './XMergesItems';
import { XMergesNoCol } from './XMergesNoCol';
import { XMergesRange } from './XMergesRange';
import { PlainUtils } from '../../../utils/PlainUtils';
import { RectRange } from '../tablebase/RectRange';
import { XMergesPool } from './XMergesPool';

class XMerges {

  constructor({
    merges = [], xTableData, xIteratorBuilder,
  }) {
    this.xMergesNoRow = new XMergesNoRow();
    this.xMergesNoCol = new XMergesNoCol();
    this.xMergesPool = new XMergesPool();
    this.xMergesIndex = new XMergesIndex(xTableData);
    this.xMergesItems = new XMergesItems();
    this.xIteratorBuilder = xIteratorBuilder;
    merges.map(merge => RectRange.valueOf(merge)).forEach(view => this.add(view));
  }

  getIncludes(view, cb) {
    view.each(this.xIteratorBuilder, (ri, ci) => {
      const view = this.getFirstIncludes(ri, ci);
      if (view) {
        cb(view);
      }
    });
  }

  getFirstIncludes(ri, ci) {
    const point = this.xMergesIndex.get(ri, ci);
    if (PlainUtils.isNotUnDef(point)) {
      const view = this.xMergesItems.get(point);
      if (PlainUtils.isNotUnDef(view)) {
        return view.getView();
      }
    }
    const src = new RectRange(ri, ci, ri, ci);
    const view = this.xMergesPool.get(src);
    if (PlainUtils.isNotUnDef(view)) {
      return view.getView();
    }
    return PlainUtils.Undef;
  }

  getAll() {
    const data = [];
    this.xMergesItems.getItems().forEach((item) => {
      if (item) {
        data.push(item.getView());
      }
    });
    this.xMergesPool.getPool().forEach((view) => {
      data.push(view.getView());
    });
    return data;
  }

  union(view) {
    const { top, right, left, bottom } = view.brink();
    let find = null;
    // 上边扫描
    top.each(this.xIteratorBuilder, (ri, ci) => {
      const item = this.getFirstIncludes(ri, ci);
      if (PlainUtils.isUnDef(item)) {
        return true;
      }
      if (view.contains(item)) {
        return true;
      }
      find = item;
      return false;
    });
    if (find) {
      return this.union(find.union(view));
    }
    // 右边扫描
    right.each(this.xIteratorBuilder, (ri, ci) => {
      const item = this.getFirstIncludes(ri, ci);
      if (PlainUtils.isUnDef(item)) {
        return true;
      }
      if (view.contains(item)) {
        return true;
      }
      find = item;
      return false;
    });
    if (find) {
      return this.union(find.union(view));
    }
    // 左边扫描
    left.each(this.xIteratorBuilder, (ri, ci) => {
      const item = this.getFirstIncludes(ri, ci);
      if (PlainUtils.isUnDef(item)) {
        return true;
      }
      if (view.contains(item)) {
        return true;
      }
      find = item;
      return false;
    });
    if (find) {
      return this.union(find.union(view));
    }
    // 底边扫描
    bottom.each(this.xIteratorBuilder, (ri, ci) => {
      const item = this.getFirstIncludes(ri, ci);
      if (PlainUtils.isUnDef(item)) {
        return true;
      }
      if (view.contains(item)) {
        return true;
      }
      find = item;
      return false;
    });
    if (find) {
      return this.union(find.union(view));
    }
    return view;
  }

  add(view) {
    const span = view.eri - view.sri;
    const sri = this.xMergesNoRow.getNo(view.sri);
    const sci = this.xMergesNoCol.getNo(view.sci);
    const eri = this.xMergesNoRow.getNo(view.eri);
    const eci = this.xMergesNoCol.getNo(view.eci);
    const range = new XMergesRange(sri, sci, eri, eci, view);
    if (span <= 50000) {
      const point = this.xMergesItems.add(range);
      view.each(this.xIteratorBuilder, (ri, ci) => {
        this.xMergesIndex.set(ri, ci, point);
      });
    } else {
      this.xMergesPool.add(range);
    }
  }

  delete(view) {
    const point = this.xMergesIndex.get(view.sri, view.sci);
    if (PlainUtils.isNotUnDef(point)) {
      const full = this.xMergesItems.get(point);
      if (PlainUtils.isNotUnDef(view)) {
        const fullView = full.getView();
        fullView.each(this.xIteratorBuilder, (ri, ci) => { this.xMergesIndex.clear(ri, ci); });
        this.xMergesItems.clear(point);
      }
    } else {
      this.xMergesPool.delete(view);
    }
  }

  getData() {
    const data = [];
    this.getAll().forEach((item) => {
      data.push(item.toString());
    });
    return data;
  }

}

export {
  XMerges,
};
