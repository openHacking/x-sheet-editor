/* global document */

import { Selector } from './Selector';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
import { ScreenWidget } from '../screen/ScreenWidget';
import { RectRange } from '../RectRange';
import { Utils } from '../../../utils/Utils';
import { Rect } from '../../../canvas/Rect';

class ScreenSelector extends ScreenWidget {
  constructor(screen, options = {}) {
    super(screen);
    this.options = options;
    this.selectorAttr = null;
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
    const { mousePointType, keyboardManage, cols, rows, edit, merges } = table;
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e1) => {
      if (e1.button !== 0) return;
      const { x, y } = table.computeEventXy(e1);
      const downSelectAttr = this.getDownXYSelectorAttr(x, y);
      // console.log('downSelectAttr >>>', downSelectAttr);
      this.selectorAttr = downSelectAttr;
      this.setOffset(downSelectAttr);
      this.onDownSelectStack.forEach(cb => cb());
      this.onChangeStack.forEach(cb => cb());
      this.onSelectChangeStack.forEach(cb => cb());
      const { edgeType } = downSelectAttr;
      switch (edgeType) {
        case 'left-top':
          mousePointType.on(['table-cell']);
          break;
        case 'left':
          mousePointType.on(['table-ri']);
          break;
        case 'top':
          mousePointType.on(['table-ci']);
          break;
        default:
          mousePointType.on(['table-cell']);
          break;
      }
      EventBind.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        const moveSelectorAttr = this.getMoveXySelectorAttr(downSelectAttr, x, y);
        this.selectorAttr = moveSelectorAttr;
        this.setOffset(moveSelectorAttr);
        this.onChangeStack.forEach(cb => cb());
        this.onSelectChangeStack.forEach(cb => cb());
        e2.stopPropagation();
        e2.preventDefault();
      }, () => {
        mousePointType.off();
        this.onSelectChangeOver.forEach(cb => cb());
      });
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, (e) => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
        this.onChangeStack.forEach(cb => cb());
      }
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, (e) => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
        this.onChangeStack.forEach(cb => cb());
      }
      e.stopPropagation();
    });
    keyboardManage.register({
      el: table,
      code: 9,
      callback: () => {
        edit.hideEdit();
        let { rect } = this.selectorAttr;
        const { len: cLen } = cols;
        const { len: rLen } = rows;
        let { sri } = rect;
        let { sci } = rect;
        if (sri === rLen - 1 && sci === cLen - 1) {
          return;
        }
        if (sci === cLen - 1) {
          sri += 1;
          sci = 0;
        } else {
          sci += 1;
        }
        rect.sri = sri;
        rect.sci = sci;
        rect.eri = sri;
        rect.eci = sci;
        const mergesRect = merges.getFirstIncludes(sri, sci);
        if (mergesRect) {
          rect = mergesRect;
          this.selectorAttr.rect = rect;
        }
        this.setOffset(this.selectorAttr);
        this.onChangeStack.forEach(cb => cb());
        this.onSelectChangeStack.forEach(cb => cb());
        edit.showEdit();
      },
    });
  }

  setLTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      frozenLeftTop, cols, rows, grid,
    } = table;
    const viewRange = frozenLeftTop.getViewRange();
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
    size.expandSize(grid.lineWidth());
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
      fixedTop, cols, rows, grid,
    } = table;
    const viewRange = fixedTop.getViewRange();
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
    size.expandSize(grid.lineWidth());
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
      fixedLeft, cols, rows, grid,
    } = table;
    const viewRange = fixedLeft.getViewRange();
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
    size.expandSize(grid.lineWidth());
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
      cols, rows, grid,
    } = table;
    const viewRange = table.getViewRange();
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
    size.expandSize(grid.lineWidth());
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
    const { frozenLeftTop } = table;
    const viewRange = frozenLeftTop.getViewRange();
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
      const ltT = Utils.arrayIncludeArray(intersectsArea, ['lt', 't']);
      const ltL = Utils.arrayIncludeArray(intersectsArea, ['lt', 'l']);
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
      const lt = Utils.arrayIncludeArray(intersectsArea, ['lt']);
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
    const { fixedTop } = table;
    const viewRange = fixedTop.getViewRange();
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
      const tBr = Utils.arrayIncludeArray(intersectsArea, ['t', 'br']);
      const ltTBrL = Utils.arrayIncludeArray(intersectsArea, ['lt', 't', 'l', 'br']);
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
      const t = Utils.arrayIncludeArray(intersectsArea, ['t']);
      const ltT = Utils.arrayIncludeArray(intersectsArea, ['lt', 't']);
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
    const { fixedLeft } = table;
    const viewRange = fixedLeft.getViewRange();
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
      const lBr = Utils.arrayIncludeArray(intersectsArea, ['l', 'br']);
      const ltTBrL = Utils.arrayIncludeArray(intersectsArea, ['lt', 't', 'l', 'br']);
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
      const l = Utils.arrayIncludeArray(intersectsArea, ['l']);
      const ltL = Utils.arrayIncludeArray(intersectsArea, ['lt', 'l']);
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
    const viewRange = table.getViewRange();
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
      const br = Utils.arrayIncludeArray(intersectsArea, ['br']);
      const ltTLBr = Utils.arrayIncludeArray(intersectsArea, ['lt', 't', 'l', 'br']);
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
      const br = Utils.arrayIncludeArray(intersectsArea, ['br']);
      const tBr = Utils.arrayIncludeArray(intersectsArea, ['t', 'br']);
      const lBr = Utils.arrayIncludeArray(intersectsArea, ['l', 'br']);
      const ltTLBr = Utils.arrayIncludeArray(intersectsArea, ['lt', 't', 'l', 'br']);
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

  getIntersectsArea(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { fixed, cols, rows } = table;
    const { rect } = selectorAttr;
    const area = [];

    const tlRange = new RectRange(0, 0, fixed.fxTop, fixed.fxLeft);
    const tRange = new RectRange(0, fixed.fxLeft + 1, fixed.fxTop, cols.len);
    const lRange = new RectRange(fixed.fxTop + 1, 0, rows.len, fixed.fxLeft);
    const brRange = new RectRange(fixed.fxTop + 1, fixed.fxLeft + 1, rows.len, cols.len);

    if (rect.intersects(tlRange)) area.push('lt');
    if (rect.intersects(tRange)) area.push('t');
    if (rect.intersects(lRange)) area.push('l');
    if (rect.intersects(brRange)) area.push('br');

    return area;
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
    const viewRange = table.getViewRange();
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

  // ===========downSelectCb=============

  addDownSelectCb(cb) {
    this.onDownSelectStack.push(cb);
  }

  removeDownSelectCb(cb) {
    for (let i = 0; i < this.onChangeStack.length; i += 1) {
      const item = this.onDownSelectStack[i];
      if (item === cb) {
        this.onDownSelectStack.splice(i, 1);
        return;
      }
    }
  }

  // ===========changeCb=============

  addChangeCb(cb) {
    this.onChangeStack.push(cb);
  }

  removeChangeCb(cb) {
    for (let i = 0; i < this.onChangeStack.length; i += 1) {
      const item = this.onChangeStack[i];
      if (item === cb) {
        this.onChangeStack.splice(i, 1);
        return;
      }
    }
  }

  // ===========selectChangeCb=============

  addSelectChangeCb(cb) {
    this.onSelectChangeStack.push(cb);
  }

  removeSelectChangeCb(cb) {
    for (let i = 0; i < this.onSelectChangeStack.length; i += 1) {
      const item = this.onSelectChangeStack[i];
      if (item === cb) {
        this.onSelectChangeStack.splice(i, 1);
        return;
      }
    }
  }

  // ===========selectChangeOverCb=============

  addSelectChangeOverCb(cb) {
    this.onSelectChangeOver.push(cb);
  }

  removeSelectChangeOverCb(cb) {
    for (let i = 0; i < this.onSelectChangeOver.length; i += 1) {
      const item = this.onSelectChangeOver[i];
      if (item === cb) {
        this.onSelectChangeOver.splice(i, 1);
        return;
      }
    }
  }
}

export { ScreenSelector };
