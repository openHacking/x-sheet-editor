/* global document */
import { Selector } from './Selector';
import { EventBind } from '../../../../utils/EventBind';
import { Constant } from '../../../../const/Constant';
import { ScreenWidget } from '../../screen/ScreenWidget';
import { RectRange } from '../../base/RectRange';
import { Rect } from '../../../../canvas/Rect';

const SCREEN_SELECT_EVENT = {
  DOWN_SELECT: Symbol('选择单元格时触发'),
  CHANGE: Symbol('选择区域大小发生变化时触发'),
  SELECT_CHANGE: Symbol('选择区域发生变化时触发'),
  SELECT_CHANGE_OVER: Symbol('选择区域结束时触发'),
};

class ScreenSelector extends ScreenWidget {

  constructor(screen, options = {}) {
    super(screen);
    this.options = options;
    this.selectorAttr = null;
    this.downSelectorAttr = null;
    this.onChangeStack = [];
    this.onSelectChangeStack = [];
    this.onSelectChangeOver = [];
    this.onDownSelectStack = [];
    this.lt = new Selector();
    this.t = new Selector();
    this.l = new Selector();
    this.br = new Selector();
    this.bind();
  }

  bind() {
    const { screen } = this;
    const { table } = screen;
    const { mousePointer, focus } = table;
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      if (e1.button !== 0) return;
      const { activate } = focus;
      const { el } = activate;
      if (el !== table) return;
      const { x, y } = table.computeEventXy(e1);
      const downSelectAttr = this.getDownXYSelectorAttr(x, y);
      this.setSelectAttr(downSelectAttr);
      this.setDownSelectAttr(downSelectAttr);
      this.setOffset(downSelectAttr);
      this.onDownSelectStack.forEach(cb => cb());
      this.onChangeStack.forEach(cb => cb());
      this.onSelectChangeStack.forEach(cb => cb());
      const { edgeType } = downSelectAttr;
      let key;
      switch (edgeType) {
        case 'left': {
          key = Constant.MOUSE_POINTER_TYPE.SELECT_ONE_ROW;
          break;
        }
        case 'top': {
          key = Constant.MOUSE_POINTER_TYPE.SELECT_ONE_COLUMN;
          break;
        }
        default: {
          key = Constant.MOUSE_POINTER_TYPE.SELECT_CELL;
          break;
        }
      }
      mousePointer.on(key);
      EventBind.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        const moveSelectorAttr = this.getMoveXySelectorAttr(downSelectAttr, x, y);
        this.setSelectAttr(moveSelectorAttr);
        this.setOffset(moveSelectorAttr);
        this.onChangeStack.forEach(cb => cb());
        this.onSelectChangeStack.forEach(cb => cb());
      }, () => {
        mousePointer.off(key);
        this.onSelectChangeOver.forEach(cb => cb());
      });
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
        this.onChangeStack.forEach(cb => cb());
      }
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
        this.onChangeStack.forEach(cb => cb());
      }
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, () => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
        this.onChangeStack.forEach(cb => cb());
      }
    });
  }

  setLTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      xTableFrozenContent, cols, rows,
    } = table;
    const viewRange = xTableFrozenContent.getScrollView();
    const { rect } = selectorAttr;

    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      this.lt.hide();
      return;
    }

    const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);

    if (rect.eci > viewRange.eci) {
      this.lt.areaEl.css('border-right', 'none');
    } else {
      this.lt.areaEl.cssRemoveKeys('border-right');
    }
    if (rect.eri > viewRange.eri) {
      this.lt.areaEl.css('border-bottom', 'none');
    } else {
      this.lt.areaEl.cssRemoveKeys('border-bottom');
    }

    const size = new Rect({
      x: left, y: top, width, height,
    });
    this.lt.offset({
      width: size.width,
      height: size.height,
      left: size.x,
      top: size.y,
    }).show();
  }

  setTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      xTop, cols, rows,
    } = table;
    const viewRange = xTop.getScrollView();
    const { rect } = selectorAttr;

    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      this.t.hide();
      return;
    }

    const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);

    if (rect.sci < viewRange.sci) {
      this.t.areaEl.css('border-left', 'none');
    } else {
      this.t.areaEl.cssRemoveKeys('border-left');
    }
    if (rect.eri > viewRange.eri) {
      this.t.areaEl.css('border-bottom', 'none');
    } else {
      this.t.areaEl.cssRemoveKeys('border-bottom');
    }
    if (rect.eci > viewRange.eci) {
      this.t.areaEl.css('border-right', 'none');
    } else {
      this.t.areaEl.cssRemoveKeys('border-right');
    }

    const size = new Rect({
      x: left, y: top, width, height,
    });
    this.t.offset({
      width: size.width,
      height: size.height,
      left: size.x,
      top: size.y,
    }).show();
  }

  setLOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      xLeft, cols, rows,
    } = table;
    const viewRange = xLeft.getScrollView();
    const { rect } = selectorAttr;

    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      this.l.hide();
      return;
    }

    const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);

    if (rect.sri < viewRange.sri) {
      this.l.areaEl.css('border-top', 'none');
    } else {
      this.l.areaEl.cssRemoveKeys('border-top');
    }
    if (rect.eci > viewRange.eci) {
      this.l.areaEl.css('border-right', 'none');
    } else {
      this.l.areaEl.cssRemoveKeys('border-right');
    }
    if (rect.eri > viewRange.eri) {
      this.l.areaEl.css('border-bottom', 'none');
    } else {
      this.l.areaEl.cssRemoveKeys('border-bottom');
    }

    const size = new Rect({
      x: left, y: top, width, height,
    });
    this.l.offset({
      width: size.width,
      height: size.height,
      left: size.x,
      top: size.y,
    }).show();
  }

  setBROffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      cols, rows,
    } = table;
    const viewRange = table.getScrollView();
    const { rect } = selectorAttr;

    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      this.br.hide();
      return;
    }

    const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);

    if (rect.sci < viewRange.sci) {
      this.br.areaEl.css('border-left', 'none');
    } else {
      this.br.areaEl.cssRemoveKeys('border-left');
    }
    if (rect.sri < viewRange.sri) {
      this.br.areaEl.css('border-top', 'none');
    } else {
      this.br.areaEl.cssRemoveKeys('border-top');
    }
    if (rect.eri > viewRange.eri) {
      this.br.areaEl.css('border-bottom', 'none');
    } else {
      this.br.areaEl.cssRemoveKeys('border-bottom');
    }
    if (rect.eci > viewRange.eci) {
      this.br.areaEl.css('border-right', 'none');
    } else {
      this.br.areaEl.cssRemoveKeys('border-right');
    }

    const size = new Rect({
      x: left, y: top, width, height,
    });
    this.br.offset({
      width: size.width,
      height: size.height,
      left: size.x,
      top: size.y,
    }).show();
  }

  setLTCorner(selectorAttr, intersectsArea) {
    const { screen } = this;
    const { table } = screen;
    const { xTableFrozenContent } = table;
    const viewRange = xTableFrozenContent.getScrollView();
    const { rect, edge, edgeType } = selectorAttr;

    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      return;
    }

    this.lt.cornerEl.cssRemoveKeys('left');
    this.lt.cornerEl.cssRemoveKeys('top');
    this.lt.cornerEl.cssRemoveKeys('right');
    this.lt.cornerEl.cssRemoveKeys('bottom');
    this.lt.cornerEl.hide();

    if (edge) {
      const ltT = intersectsArea === 'ltt';
      const ltL = intersectsArea === 'ltl';
      if (edgeType === 'left' && ltT) {
        this.lt.cornerEl.show();
        this.lt.cornerEl.css('left', '0px');
        this.lt.cornerEl.css('bottom', '0px');
      }
      if (edgeType === 'top' && ltL) {
        this.lt.cornerEl.show();
        this.lt.cornerEl.css('right', '0px');
        this.lt.cornerEl.css('top', '0px');
      }
    } else {
      const lt = intersectsArea === 'lt';
      if (lt) {
        this.lt.cornerEl.show();
        this.lt.cornerEl.css('right', '0px');
        this.lt.cornerEl.css('bottom', '0px');
      }
      if (rect.eci > viewRange.eci) {
        this.lt.cornerEl.hide();
      }
      if (rect.eri > viewRange.eri) {
        this.lt.cornerEl.hide();
      }
    }
  }

  setTCorner(selectorAttr, intersectsArea) {
    const { screen } = this;
    const { table } = screen;
    const { xTop } = table;
    const viewRange = xTop.getScrollView();
    const { rect, edge, edgeType } = selectorAttr;

    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      return;
    }

    this.t.cornerEl.cssRemoveKeys('left');
    this.t.cornerEl.cssRemoveKeys('top');
    this.t.cornerEl.cssRemoveKeys('right');
    this.t.cornerEl.cssRemoveKeys('bottom');
    this.t.cornerEl.hide();

    if (edge) {
      const tBr = intersectsArea === 'tbr';
      const ltTBrL = intersectsArea === 'lttlbr';
      if (edgeType === 'top' && tBr) {
        this.t.cornerEl.show();
        this.t.cornerEl.css('right', '0px');
        this.t.cornerEl.css('top', '0px');
      }
      if (edgeType === 'top' && ltTBrL) {
        this.t.cornerEl.show();
        this.t.cornerEl.css('right', '0px');
        this.t.cornerEl.css('top', '0px');
      }
      if (edgeType === 'top' && rect.eci > viewRange.eci) {
        this.t.cornerEl.hide();
      }
    } else {
      const t = intersectsArea === 't';
      const ltT = intersectsArea === 'ltt';
      if (t || ltT) {
        this.t.cornerEl.show();
        this.t.cornerEl.css('right', '0px');
        this.t.cornerEl.css('bottom', '0px');
      }
      if (rect.eci > viewRange.eci) {
        this.t.cornerEl.hide();
      }
      if (rect.eri > viewRange.eri) {
        this.t.cornerEl.hide();
      }
    }
  }

  setLCorner(selectorAttr, intersectsArea) {
    const { screen } = this;
    const { table } = screen;
    const { xLeft } = table;
    const viewRange = xLeft.getScrollView();
    const { rect, edge, edgeType } = selectorAttr;

    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      return;
    }

    this.l.cornerEl.cssRemoveKeys('left');
    this.l.cornerEl.cssRemoveKeys('top');
    this.l.cornerEl.cssRemoveKeys('right');
    this.l.cornerEl.cssRemoveKeys('bottom');
    this.l.cornerEl.hide();

    if (edge) {
      const lBr = intersectsArea === 'lbr';
      const ltTBrL = intersectsArea === 'lttlbr';
      if (edgeType === 'left' && lBr) {
        this.l.cornerEl.show();
        this.l.cornerEl.css('left', '0');
        this.l.cornerEl.css('bottom', '0');
      }
      if (edgeType === 'left' && ltTBrL) {
        this.l.cornerEl.show();
        this.l.cornerEl.css('left', '0');
        this.l.cornerEl.css('bottom', '0');
      }
      if (edgeType === 'left' && rect.eri > viewRange.eri) {
        this.l.cornerEl.hide();
      }
    } else {
      const l = intersectsArea === 'l';
      const ltL = intersectsArea === 'ltl';
      if (l || ltL) {
        this.l.cornerEl.show();
        this.l.cornerEl.css('right', '0px');
        this.l.cornerEl.css('bottom', '0px');
      }
      if (rect.eci > viewRange.eci) {
        this.l.cornerEl.hide();
      }
      if (rect.eri > viewRange.eri) {
        this.l.cornerEl.hide();
      }
    }
  }

  setBrCorner(selectorAttr, intersectsArea) {
    const { screen } = this;
    const { table } = screen;
    const viewRange = table.getScrollView();
    const { rect, edge, edgeType } = selectorAttr;

    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      return;
    }

    this.br.cornerEl.cssRemoveKeys('left');
    this.br.cornerEl.cssRemoveKeys('top');
    this.br.cornerEl.cssRemoveKeys('right');
    this.br.cornerEl.cssRemoveKeys('bottom');
    this.br.cornerEl.hide();

    if (edge) {
      const br = intersectsArea === 'br';
      const ltTLBr = intersectsArea === 'lttlbr';
      if (edgeType === 'left' && br) {
        this.br.cornerEl.show();
        this.br.cornerEl.css('left', '0');
        this.br.cornerEl.css('bottom', '0');
      }
      if (edgeType === 'top' && br) {
        this.br.cornerEl.show();
        this.br.cornerEl.css('right', '0');
        this.br.cornerEl.css('top', '0');
      }
      if (edgeType === 'left-top' && ltTLBr) {
        this.br.cornerEl.show();
        this.br.cornerEl.css('right', '0');
        this.br.cornerEl.css('bottom', '0');
      }
      if (edgeType === 'left-top' && br) {
        this.br.cornerEl.show();
        this.br.cornerEl.css('right', '0');
        this.br.cornerEl.css('bottom', '0');
      }
      if (edgeType === 'left' && rect.eri > viewRange.eri) {
        this.br.cornerEl.hide();
      }
      if (edgeType === 'top' && rect.eci > viewRange.eci) {
        this.br.cornerEl.hide();
      }
    } else {
      const br = intersectsArea === 'br';
      const tBr = intersectsArea === 'tbr';
      const lBr = intersectsArea === 'lbr';
      const ltTLBr = intersectsArea === 'lttlbr';
      if (br || tBr || lBr || lBr || ltTLBr) {
        this.br.cornerEl.show();
        this.br.cornerEl.css('right', '0px');
        this.br.cornerEl.css('bottom', '0px');
      }
      if (rect.eri > viewRange.eri) {
        this.br.cornerEl.hide();
      }
      if (rect.eci > viewRange.eci) {
        this.br.cornerEl.hide();
      }
    }
  }

  setSelectAttr(selectorAttr) {
    this.selectorAttr = selectorAttr;
    this.selectorAttr.id = Date.now();
  }

  setDownSelectAttr(downSelectorAttr) {
    this.downSelectorAttr = downSelectorAttr;
  }

  getIntersectsArea(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { fixed, cols, rows } = table;
    const { rect } = selectorAttr;
    let type = '';
    const tlRange = new RectRange(0, 0, fixed.fxTop, fixed.fxLeft);
    const tRange = new RectRange(0, fixed.fxLeft + 1, fixed.fxTop, cols.len);
    const lRange = new RectRange(fixed.fxTop + 1, 0, rows.len, fixed.fxLeft);
    const brRange = new RectRange(fixed.fxTop + 1, fixed.fxLeft + 1, rows.len, cols.len);
    if (rect.intersects(tlRange)) type += 'lt';
    if (rect.intersects(tRange)) type += 't';
    if (rect.intersects(lRange)) type += 'l';
    if (rect.intersects(brRange)) type += 'br';
    return type;
  }

  setOffset(selectorAttr) {
    const intersectsArea = this.getIntersectsArea(selectorAttr);
    // console.log('intersectsArea', intersectsArea)

    this.setLTOffset(selectorAttr);
    this.setTOffset(selectorAttr);
    this.setLOffset(selectorAttr);
    this.setBROffset(selectorAttr);

    this.setLTCorner(selectorAttr, intersectsArea);
    this.setTCorner(selectorAttr, intersectsArea);
    this.setLCorner(selectorAttr, intersectsArea);
    this.setBrCorner(selectorAttr, intersectsArea);
  }

  getViewRange() {
    const { screen } = this;
    const { table } = screen;
    const { cols, rows } = table;
    const viewRange = table.getScrollView();
    let { sri, sci } = viewRange;
    const { eri, eci } = viewRange;

    if (table.getFixedWidth() > 0) {
      sri = 0;
    }
    if (table.getFixedHeight() > 0) {
      sci = 0;
    }

    const width = cols.sectionSumWidth(sci, eci);
    const height = rows.sectionSumHeight(sri, eri);

    return new RectRange(sri, sci, eri, eci, width, height);
  }

  getDownXYSelectorAttr(x, y) {
    const { screen } = this;
    const { table } = screen;
    const { merges, rows, cols } = table;
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1 && ci === -1) {
      const rect = new RectRange(0, 0, rows.len - 1, cols.len - 1);
      return {
        rect, edge: true, edgeType: 'left-top',
      };
    }
    if (ri === -1) {
      const rect = new RectRange(0, ci, rows.len - 1, ci);
      return {
        rect, edge: true, edgeType: 'top',
      };
    }
    if (ci === -1) {
      const rect = new RectRange(ri, 0, ri, cols.len - 1);
      return {
        rect, edge: true, edgeType: 'left',
      };
    }
    const merge = merges.getFirstIncludes(ri, ci);
    let rect = new RectRange(ri, ci, ri, ci);
    if (merge) {
      rect = merge;
    }
    return { rect };
  }

  getMoveXySelectorAttr(selectorAttr, x, y) {
    const { screen } = this;
    const { table } = screen;
    const {
      merges, rows, cols,
    } = table;
    const { rect: selectRect, edgeType } = selectorAttr;
    const viewRange = this.getViewRange();
    let { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1) ri = viewRange.sri;
    if (ci === -1) ci = viewRange.sci;
    switch (edgeType) {
      case 'left-top': {
        let rect = selectRect.union(new RectRange(0, 0, rows.len - 1, cols.len - 1));
        rect = selectRect.union(rect);
        return {
          rect, edge: true, edgeType: 'left-top',
        };
      }
      case 'top': {
        let rect = selectRect.union(new RectRange(0, ci, 0, ci));
        rect = selectRect.union(rect);
        return {
          rect, edge: true, edgeType: 'top',
        };
      }
      case 'left': {
        let rect = selectRect.union(new RectRange(ri, 0, ri, 0));
        rect = selectRect.union(rect);
        return {
          rect, edge: true, edgeType: 'left',
        };
      }
      default: break;
    }
    let rect = selectRect.union(new RectRange(ri, ci, ri, ci));
    rect = merges.union(rect);
    return { rect };
  }

  getSelectRange() {
    const { rect } = this.selectorAttr;
    return rect;
  }

  on(type, cb) {
    let array;
    switch (type) {
      case SCREEN_SELECT_EVENT.CHANGE:
        array = this.onChangeStack;
        break;
      case SCREEN_SELECT_EVENT.SELECT_CHANGE_OVER:
        array = this.onSelectChangeOver;
        break;
      case SCREEN_SELECT_EVENT.DOWN_SELECT:
        array = this.onDownSelectStack;
        break;
      case SCREEN_SELECT_EVENT.SELECT_CHANGE:
        array = this.onSelectChangeStack;
        break;
      default: break;
    }
    if (array) {
      array.push(cb);
    }
  }

  remove(type, cb) {
    let array;
    switch (type) {
      case SCREEN_SELECT_EVENT.CHANGE:
        array = this.onChangeStack;
        break;
      case SCREEN_SELECT_EVENT.SELECT_CHANGE_OVER:
        array = this.onSelectChangeOver;
        break;
      case SCREEN_SELECT_EVENT.DOWN_SELECT:
        array = this.onDownSelectStack;
        break;
      case SCREEN_SELECT_EVENT.SELECT_CHANGE:
        array = this.onSelectChangeStack;
        break;
      default: break;
    }
    if (array) {
      for (let i = 0; i < array.length; i += 1) {
        const item = array[i];
        if (item === cb) {
          array.splice(i, 1);
          return;
        }
      }
    }
  }
}

export {
  SCREEN_SELECT_EVENT,
  ScreenSelector,
};
