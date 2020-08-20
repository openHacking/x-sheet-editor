import { XScreenItem } from '../../xscreen/XScreenItem';
import { EventBind } from '../../../../utils/EventBind';
import { Constant } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';

const SELECT_LOCAL = {
  LT: Symbol(''),
  L: Symbol(''),
  T: Symbol(''),
};

class XSelectItem extends XScreenItem {

  constructor(table) {
    super();
    this.selectRange = null;
    this.selectLocal = null;
    this.table = table;
    this.bind();
  }

  bind() {
    const { table } = this;
    const { mousePointer, focus } = table;
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCALE_CHANGE, () => {});
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {});
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      if (e1.button !== 0) return;
      const { activate } = focus;
      const { el } = activate;
      if (el !== table) return;
      const { x, y } = table.computeEventXy(e1);
      const selectRange = this.downSelectRange(x, y);
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.CHANGE_HEIGHT, () => {});
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.CHANGE_WIDTH, () => {});
  }

  downSelectRange(x, y) {
    const { screen } = this;
    const { table } = screen;
    const { rows, cols } = table;
    const merges = table.getTableMerges();
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1 && ci === -1) {
      this.selectRange = new RectRange(0, 0, rows.len - 1, cols.len - 1);
      this.selectLocal = SELECT_LOCAL.LT;
      return;
    }
    if (ri === -1) {
      this.selectRange = new RectRange(0, ci, rows.len - 1, ci);
      this.selectLocal = SELECT_LOCAL.T;
      return;
    }
    if (ci === -1) {
      this.selectRange = new RectRange(ri, 0, ri, cols.len - 1);
      this.selectLocal = SELECT_LOCAL.L;
      return;
    }
    this.selectRange = merges.getFirstIncludes(ri, ci)
      || new RectRange(ri, ci, ri, ci);
    this.selectLocal = null;
  }

  moveSelectRange(x, y) {
    const { screen } = this;
    const { table } = screen;
    const {
      rows, cols,
    } = table;
    const merges = table.getTableMerges();
    const { selectRange, selectLocal } = this;
    const viewRange = this.getViewRange();
    let { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1) {
      ri = viewRange.sri;
    }
    if (ci === -1) {
      ci = viewRange.sci;
    }
    if (selectLocal === SELECT_LOCAL.LT) {
      const rect = selectRange.union(new RectRange(0, 0, rows.len - 1, cols.len - 1));
      this.selectRange = selectRange.union(rect);
      this.selectLocal = SELECT_LOCAL.LT;
      return;
    }
    if (selectLocal === SELECT_LOCAL.L) {
      const rect = selectRange.union(new RectRange(ri, 0, ri, 0));
      this.selectRange = selectRange.union(rect);
      this.selectLocal = SELECT_LOCAL.L;
      return;
    }
    if (selectLocal === SELECT_LOCAL.T) {
      const rect = selectRange.union(new RectRange(0, ci, 0, ci));
      this.selectRange = selectRange.union(rect);
      this.selectLocal = SELECT_LOCAL.T;
      return;
    }
    const rect = selectRange.union(new RectRange(ri, ci, ri, ci));
    this.selectRange = merges.union(rect);
    this.selectLocal = null;
  }

}

export {
  XSelectItem, SELECT_LOCAL,
};
