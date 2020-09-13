/* global document */
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';
import { EventBind } from '../../../../utils/EventBind';
import {
  Constant,
  cssPrefix,
} from '../../../../const/Constant';
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
    this.targetOffset = { top: 0, left: 0, width: 0, height: 0 };
    this.selectLocal = SELECT_LOCAL.BR;
    this.selectRange = null;
    this.selectBoundOut = false;
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
    this.ltElem.child(this.ltCorner);
    this.lElem.child(this.lCorner);
    this.tElem.child(this.tCorner);
    this.brElem.child(this.brCorner);
    this.blt.child(this.ltElem);
    this.bl.child(this.lElem);
    this.bt.child(this.tElem);
    this.bbr.child(this.brElem);
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

  bind() {
    const { table } = this;
    const {
      mousePointer, focus,
    } = table;
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
      this.selectCornerHandle();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
      this.selectCornerHandle();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
      this.selectCornerHandle();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
      this.selectCornerHandle();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
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
      this.selectOffsetHandle();
      this.selectBorderHandle();
      this.selectCornerHandle();
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
      EventBind.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.moveSelectRange(x, y);
        this.selectOffsetHandle();
        this.selectBorderHandle();
        this.selectCornerHandle();
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
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
      this.selectCornerHandle();
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

  selectOffsetHandle() {
    const { selectRange } = this;
    if (selectRange) {
      this.setDisplay(selectRange);
      this.setSizer(selectRange);
      this.setLocal(selectRange);
    }
  }

  selectBorderHandle() {
    const { selectRange } = this;
    if (selectRange) {
      this.hideBorder();
      this.showBorder(selectRange);
    }
  }

  selectCornerHandle() {
    const {
      selectBoundOut,
    } = this;
    if (selectBoundOut) {
      return;
    }
    const {
      selectLocal, selectRange,
    } = this;
    const overGo = this.getOverGo(selectRange);
    this.ltCorner.hide();
    this.tCorner.hide();
    this.lCorner.hide();
    this.brCorner.hide();
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
        break;
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.T:
        this.ltCorner.hide();
        this.tCorner.show();
        this.brCorner.hide();
        this.lCorner.hide();
        break;
      case RANGE_OVER_GO.ALL:
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.BRT:
      case RANGE_OVER_GO.BR:
        this.ltCorner.hide();
        this.tCorner.hide();
        this.brCorner.show();
        this.lCorner.hide();
        break;
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.L:
        this.ltCorner.hide();
        this.tCorner.hide();
        this.brCorner.hide();
        this.lCorner.show();
        break;
    }
  }

}

export {
  XSelectItem, SELECT_LOCAL,
};
