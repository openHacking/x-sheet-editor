import { XMergesIndex } from './XMergesIndex';
import { XMergesNoRow } from './XMergesNoRow';
import { XMergesItems } from './XMergesItems';
import { XMergesNoCol } from './XMergesNoCol';
import { XMergesRange } from './XMergesRange';
import { PlainUtils } from '../../../utils/PlainUtils';
import { RectRange } from '../tablebase/RectRange';
import { XTableDataItems } from '../XTableDataItems';
import { XIteratorBuilder } from '../iterator/XIteratorBuilder';

class XMerges {

  constructor({
    merges = [],
    xTableData = new XTableDataItems([]),
    xIteratorBuilder = new XIteratorBuilder(),
  } = {}) {
    this.xMergesNoRow = new XMergesNoRow();
    this.xMergesNoCol = new XMergesNoCol();
    this.xMergesItems = new XMergesItems();
    this.xMergesIndex = new XMergesIndex(xTableData);
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
    return PlainUtils.Undef;
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
    }
  }

  getAll() {
    const data = [];
    this.xMergesItems.getItems().forEach((item) => {
      if (item) {
        data.push(item.getView());
      }
    });
    return data;
  }

  add(view) {
    const sri = this.xMergesNoRow.getNo(view.sri);
    const sci = this.xMergesNoCol.getNo(view.sci);
    const eri = this.xMergesNoRow.getNo(view.eri);
    const eci = this.xMergesNoCol.getNo(view.eci);
    const range = new XMergesRange(sri, sci, eri, eci, view);
    const point = this.xMergesItems.add(range);
    view.each(this.xIteratorBuilder, (ri, ci) => {
      this.xMergesIndex.set(ri, ci, point);
    });
  }

  union(view) {
    let { xMergesItems } = this;
    let sizer = xMergesItems.getSizeOf();
    let span = view.eri - view.sri;
    let find;
    if (span > 50000 && sizer < 1000) {
      let items = this.getAll();
      for (let i = 0, len = items.length; i <= len; i++) {
        const item = items[i];
        if (item) {
          if (item.intersects(view)) {
            if (!view.contains(item)) {
              find = item;
              break;
            }
          }
        }
      }
      if (find) {
        return this.union(find.union(view));
      }
    } else {
      const { top, right, left, bottom } = view.brink();
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
    }
    return view;
  }

  getData() {
    const data = [];
    this.getAll().forEach((item) => {
      data.push(item.toString());
    });
    return {
      merges: data,
    };
  }

}

export {
  XMerges,
};
