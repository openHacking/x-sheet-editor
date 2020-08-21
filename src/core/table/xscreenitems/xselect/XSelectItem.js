/* global document */
import { XScreenItem } from '../../xscreen/XScreenItem';
import { EventBind } from '../../../../utils/EventBind';
import { Constant } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { Utils } from '../../../../utils/Utils';

const SELECT_LOCAL = {
  LT: Symbol('LT'),
  L: Symbol('L'),
  T: Symbol('T'),
  BR: Symbol('BR'),
};

class XSelectItem extends XScreenItem {

  constructor(table) {
    super({ table });
    this.selectRange = null;
    this.selectLocal = null;
    this.selectOffset = { top: 0, left: 0, width: 0, height: 0 };
    this.bind();
  }

  bind() {
    const { table } = this;
    const { mousePointer, focus } = table;
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCALE_CHANGE, () => {
      this.computerSelectOffset();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.computerSelectOffset();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      if (e1.button !== 0) return;
      const { activate } = focus;
      const { el } = activate;
      if (el !== table) return;
      const { x, y } = table.computeEventXy(e1);
      this.downSelectRange(x, y);
      this.computerSelectOffset();
      const { selectLocal } = this;
      let key = Constant.MOUSE_POINTER_TYPE.SELECT_CELL;
      switch (selectLocal) {
        case SELECT_LOCAL.L: {
          key = Constant.MOUSE_POINTER_TYPE.SELECT_ONE_ROW;
          break;
        }
        case SELECT_LOCAL.T: {
          key = Constant.MOUSE_POINTER_TYPE.SELECT_ONE_COLUMN;
          break;
        }
      }
      mousePointer.on(key);
      table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN);
      table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      EventBind.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.moveSelectRange(x, y);
        this.computerSelectOffset();
        table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      }, () => {
        mousePointer.off(key);
      });
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.computerSelectOffset();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.computerSelectOffset();
    });
  }

  computerSelectOffset() {
    const { selectRange } = this;
    if (Utils.isUnDef(selectRange)) {
      return;
    }
    const { table } = this;
    const { cols, rows } = table;
    const scrollView = table.getScrollView();
    const targetRange = scrollView.coincide(selectRange);
    if (targetRange.equals(RectRange.EMPTY)) {
      this.hide();
    } else {
      this.show();
      targetRange.w = cols.rectRangeSumWidth(targetRange);
      targetRange.h = rows.rectRangeSumHeight(targetRange);
      this.selectOffset.top = cols.sectionSumWidth(scrollView.sci, targetRange.eci - 1);
      this.selectOffset.left = rows.sectionSumHeight(scrollView.sri, targetRange.eri - 1);
      this.selectOffset.width = targetRange.w;
      this.selectOffset.height = targetRange.h;
      this.setTop(this.selectOffset.top);
      this.setLeft(this.selectOffset.left);
      this.setWidth(this.selectOffset.width);
      this.setHeight(this.selectOffset.height);
    }
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
    this.selectLocal = SELECT_LOCAL.BR;
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
    this.selectLocal = SELECT_LOCAL.BR;
  }

}

export {
  XSelectItem,
  SELECT_LOCAL,
};
