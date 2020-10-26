/* global document */
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';
import { XEvent } from '../../../../lib/XEvent';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { Widget } from '../../../../lib/Widget';
import { XTableMousePointer } from '../../XTableMousePointer';
import { RANGE_OVER_GO } from '../../xscreen/item/viewborder/XScreenStyleBorderItem';

const SELECT_LOCAL = {
  LT: Symbol('LT'),
  L: Symbol('L'),
  T: Symbol('T'),
  BR: Symbol('BR'),
};

class XSelectItem extends XScreenCssBorderItem {

  constructor(table) {
    super({ table });
    this.selectLocal = SELECT_LOCAL.BR;
    this.display = false;
    this.border = {};
    this.activeCorner = null;
    this.selectRange = null;
    this.downRange = null;
    this.moveRange = null;
    this.ltElem = new Widget(`${cssPrefix}-x-select-area`);
    this.brElem = new Widget(`${cssPrefix}-x-select-area`);
    this.lElem = new Widget(`${cssPrefix}-x-select-area`);
    this.tElem = new Widget(`${cssPrefix}-x-select-area`);
    this.ltCorner = new Widget(`${cssPrefix}-x-select-corner`);
    this.lCorner = new Widget(`${cssPrefix}-x-select-corner`);
    this.tCorner = new Widget(`${cssPrefix}-x-select-corner`);
    this.brCorner = new Widget(`${cssPrefix}-x-select-corner`);
    this.ltElem.children(this.ltCorner);
    this.lElem.children(this.lCorner);
    this.tElem.children(this.tCorner);
    this.brElem.children(this.brCorner);
    this.blt.children(this.ltElem);
    this.bl.children(this.lElem);
    this.bt.children(this.tElem);
    this.bbr.children(this.brElem);
    this.setBorderType('solid');
  }

  onAdd() {
    const { table } = this;
    this.bind();
    this.hide();
    table.focus.register({ target: this.ltCorner });
    table.focus.register({ target: this.lCorner });
    table.focus.register({ target: this.tCorner });
    table.focus.register({ target: this.brCorner });
  }

  unbind() {
    const { table } = this;
    XEvent.unbind(table);
  }

  bind() {
    const { table } = this;
    const {
      mousePointer, focus,
    } = table;
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      if (e1.button !== 0) {
        return;
      }
      const { activate } = focus;
      const { target } = activate;
      if (target !== table) {
        return;
      }
      const { x, y } = table.computeEventXy(e1);
      this.downSelectRange(x, y);
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
      const { selectLocal } = this;
      switch (selectLocal) {
        case SELECT_LOCAL.L:
          mousePointer.lock(XSelectItem);
          mousePointer.set(XTableMousePointer.KEYS.eResize, XSelectItem);
          break;
        case SELECT_LOCAL.T:
          mousePointer.lock(XSelectItem);
          mousePointer.set(XTableMousePointer.KEYS.sResize, XSelectItem);
          break;
      }
      table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN);
      table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      XEvent.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.moveSelectRange(x, y);
        this.offsetHandle();
        this.borderHandle();
        this.cornerHandle();
        table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      }, () => {
        switch (selectLocal) {
          case SELECT_LOCAL.L:
          case SELECT_LOCAL.T:
            mousePointer.free(XSelectItem);
            break;
        }
        table.trigger(Constant.TABLE_EVENT_TYPE.SELECT_OVER);
      });
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.offsetHandle();
      this.borderHandle();
      this.cornerHandle();
    });
  }

  moveSelectRange(x, y) {
    const { table } = this;
    const {
      rows, cols,
    } = table;
    const { downRange, selectLocal } = this;
    const merges = table.getTableMerges();
    const viewRange = table.getScrollView();
    let { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1) {
      ri = viewRange.sri;
    }
    if (ci === -1) {
      ci = viewRange.sci;
    }
    if (selectLocal === SELECT_LOCAL.LT) {
      const rect = downRange.union(new RectRange(0, 0, rows.len - 1, cols.len - 1));
      this.moveRange = downRange.union(rect);
      this.selectRange = this.moveRange;
      this.selectLocal = SELECT_LOCAL.LT;
      return;
    }
    if (selectLocal === SELECT_LOCAL.L) {
      const rect = downRange.union(new RectRange(ri, 0, ri, 0));
      this.moveRange = downRange.union(rect);
      this.selectRange = this.moveRange;
      this.selectLocal = SELECT_LOCAL.L;
      return;
    }
    if (selectLocal === SELECT_LOCAL.T) {
      const rect = downRange.union(new RectRange(0, ci, 0, ci));
      this.moveRange = downRange.union(rect);
      this.selectRange = this.moveRange;
      this.selectLocal = SELECT_LOCAL.T;
      return;
    }
    const rect = downRange.union(new RectRange(ri, ci, ri, ci));
    this.moveRange = merges.union(rect);
    this.selectRange = this.moveRange;
    this.selectLocal = SELECT_LOCAL.BR;
  }

  downSelectRange(x, y) {
    const { table } = this;
    const { rows, cols } = table;
    const merges = table.getTableMerges();
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1 && ci === -1) {
      this.downRange = new RectRange(0, 0, rows.len - 1, cols.len - 1);
      this.selectRange = this.downRange;
      this.selectLocal = SELECT_LOCAL.LT;
      return;
    }
    if (ri === -1) {
      this.downRange = new RectRange(0, ci, rows.len - 1, ci);
      this.selectRange = this.downRange;
      this.selectLocal = SELECT_LOCAL.T;
      return;
    }
    if (ci === -1) {
      this.downRange = new RectRange(ri, 0, ri, cols.len - 1);
      this.selectRange = this.downRange;
      this.selectLocal = SELECT_LOCAL.L;
      return;
    }
    this.downRange = merges.getFirstIncludes(ri, ci)
      || new RectRange(ri, ci, ri, ci);
    this.selectRange = this.downRange;
    this.selectLocal = SELECT_LOCAL.BR;
  }

  updateSelectRange(range) {
    this.selectRange = range;
    this.selectLocal = SELECT_LOCAL.BR;
    this.offsetHandle();
    this.borderHandle();
    this.cornerHandle();
  }

  borderHandle() {
    const { selectRange, display } = this;
    if (selectRange && display) {
      this.hideBorder();
      this.border = this.showBorder(selectRange);
    }
  }

  offsetHandle() {
    const { selectRange } = this;
    if (selectRange && this.setDisplay(selectRange)) {
      this.display = true;
      this.setSizer(selectRange);
      this.setLocal(selectRange);
    } else {
      this.display = false;
    }
  }

  cornerHandle() {
    const {
      selectRange, selectLocal, display, border,
    } = this;
    if (selectRange && display) {
      const overGo = this.getOverGo(selectRange);
      this.ltCorner.hide();
      this.tCorner.hide();
      this.lCorner.hide();
      this.brCorner.hide();
      switch (selectLocal) {
        case SELECT_LOCAL.LT:
        case SELECT_LOCAL.BR:
          if (border.bottom === false) {
            return;
          }
      }
      this.brCorner.removeClass('br-pos');
      this.lCorner.removeClass('br-pos');
      this.tCorner.removeClass('br-pos');
      this.ltCorner.removeClass('br-pos');
      this.brCorner.removeClass('tr-pos');
      this.lCorner.removeClass('tr-pos');
      this.tCorner.removeClass('tr-pos');
      this.ltCorner.removeClass('tr-pos');
      this.brCorner.removeClass('bl-pos');
      this.lCorner.removeClass('bl-pos');
      this.tCorner.removeClass('bl-pos');
      this.ltCorner.removeClass('bl-pos');
      switch (selectLocal) {
        case SELECT_LOCAL.L:
          this.brCorner.addClass('bl-pos');
          this.lCorner.addClass('bl-pos');
          this.tCorner.addClass('bl-pos');
          this.ltCorner.addClass('bl-pos');
          break;
        case SELECT_LOCAL.T:
          this.brCorner.addClass('tr-pos');
          this.lCorner.addClass('tr-pos');
          this.tCorner.addClass('tr-pos');
          this.ltCorner.addClass('tr-pos');
          break;
        case SELECT_LOCAL.LT:
        case SELECT_LOCAL.BR:
          this.brCorner.addClass('br-pos');
          this.lCorner.addClass('br-pos');
          this.tCorner.addClass('br-pos');
          this.ltCorner.addClass('br-pos');
          break;
      }
      switch (overGo) {
        case RANGE_OVER_GO.LT:
          this.ltCorner.show();
          this.tCorner.hide();
          this.brCorner.hide();
          this.lCorner.hide();
          this.activeCorner = this.ltCorner;
          break;
        case RANGE_OVER_GO.LTT:
        case RANGE_OVER_GO.T:
          this.ltCorner.hide();
          this.tCorner.show();
          this.brCorner.hide();
          this.lCorner.hide();
          this.activeCorner = this.tCorner;
          break;
        case RANGE_OVER_GO.ALL:
        case RANGE_OVER_GO.BRL:
        case RANGE_OVER_GO.BRT:
        case RANGE_OVER_GO.BR:
          this.ltCorner.hide();
          this.tCorner.hide();
          this.brCorner.show();
          this.lCorner.hide();
          this.activeCorner = this.brCorner;
          break;
        case RANGE_OVER_GO.LTL:
        case RANGE_OVER_GO.L:
          this.ltCorner.hide();
          this.tCorner.hide();
          this.brCorner.hide();
          this.lCorner.show();
          this.activeCorner = this.lCorner;
          break;
      }
    }
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  XSelectItem, SELECT_LOCAL,
};
