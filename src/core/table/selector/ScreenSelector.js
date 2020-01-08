/* global document */

import { Selector } from './Selector';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
import { ScreenWidget } from '../screen/ScreenWidget';
import { RectRange } from '../RectRange';
import { Utils } from '../../../utils/Utils';

class ScreenSelector extends ScreenWidget {
  constructor(screen, options = {}) {
    super(screen);
    this.lt = new Selector(options);
    this.t = new Selector(options);
    this.l = new Selector(options);
    this.br = new Selector(options);
    this.selectorAttr = null;
    this.bind();
  }

  bind() {
    const { screen } = this;
    const { table } = screen;
    const { mousePointType } = table;
    EventBind.bind([
      this.lt.cornerEl,
      this.t.cornerEl,
      this.l.cornerEl,
      this.br.cornerEl,
    ], Constant.EVENT_TYPE.MOUSE_DOWN, (e1) => {
      // console.log('auto fill');
      mousePointType.on(['selector']);
      mousePointType.set('crosshair', 'selector');
      EventBind.mouseMoveUp(document, (e2) => {
        e2.stopPropagation();
        e2.preventDefault();
      }, () => {
        mousePointType.off();
      });
      e1.stopPropagation();
      e1.preventDefault();
    });
    EventBind.bind([
      this.lt.cornerEl,
      this.t.cornerEl,
      this.l.cornerEl,
      this.br.cornerEl,
    ], Constant.EVENT_TYPE.MOUSE_MOVE, (e) => {
      mousePointType.set('crosshair', 'selector');
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(table, Constant.EVENT_TYPE.SCROLL, () => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
    });
    EventBind.bind(table, Constant.EVENT_TYPE.MOUSE_DOWN, (e1) => {
      const { x, y } = table.computeEventXy(e1);
      const downSelectAttr = this.getDownXYSelectorAttr(x, y);
      // console.log('downSelectAttr >>>', downSelectAttr);
      this.selectorAttr = downSelectAttr;
      this.setOffset(downSelectAttr);
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
        e2.stopPropagation();
        e2.preventDefault();
      }, () => {
        mousePointType.off();
      });
      e1.stopPropagation();
      e1.preventDefault();
    });
    EventBind.bind(table, Constant.EVENT_TYPE.CHANGE_HEIGHT, (e) => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.EVENT_TYPE.CHANGE_WIDTH, (e) => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
      e.stopPropagation();
    });
  }

  setLTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { frozenLeftTop, cols, rows } = table;
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
    this.lt.offset({
      width,
      height,
      left,
      top,
    }).show();
  }

  setTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { fixedTop, cols, rows } = table;
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
      this.t.cornerEl.hide();
      this.t.areaEl.css('border-right', 'none');
    } else {
      this.t.areaEl.cssRemoveKeys('border-right');
    }
    this.t.offset({
      width,
      height,
      left,
      top,
    }).show();
  }

  setLOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { fixedLeft, cols, rows } = table;
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
    this.l.offset({
      width,
      height,
      left,
      top,
    }).show();
  }

  setBROffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      content, cols, rows,
    } = table;
    const viewRange = content.getViewRange();
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
    this.br.offset({
      width,
      height,
      left,
      top,
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
      this.lt.hide();
      return;
    }
    this.lt.cornerEl.cssRemoveKeys('left');
    this.lt.cornerEl.cssRemoveKeys('top');
    this.lt.cornerEl.cssRemoveKeys('right');
    this.lt.cornerEl.cssRemoveKeys('bottom');
    this.lt.cornerEl.hide();
    if (edge) {
      const ltT = Utils.arrayEqual(intersectsArea, ['lt', 't']);
      const ltL = Utils.arrayEqual(intersectsArea, ['lt', 'l']);
      if (edgeType === 'left' && ltT) {
        this.lt.cornerEl.show();
        this.lt.cornerEl.css('left', '0');
        this.lt.cornerEl.css('bottom', '0');
      }
      if (edgeType === 'top' && ltL) {
        this.lt.cornerEl.show();
        this.lt.cornerEl.css('right', '0');
        this.lt.cornerEl.css('top', '0');
      }
    } else {
      const lt = Utils.arrayEqual(intersectsArea, ['lt']);
      if (lt) {
        this.lt.cornerEl.show();
        this.lt.cornerEl.css('right', '0');
        this.lt.cornerEl.css('bottom', '0');
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
      this.t.hide();
      return;
    }
    this.t.cornerEl.cssRemoveKeys('left');
    this.t.cornerEl.cssRemoveKeys('top');
    this.t.cornerEl.cssRemoveKeys('right');
    this.t.cornerEl.cssRemoveKeys('bottom');
    this.t.cornerEl.hide();
    if (edge) {
      const tBr = Utils.arrayEqual(intersectsArea, ['t', 'br']);
      const ltTBrL = Utils.arrayEqual(intersectsArea, ['lt', 't', 'l', 'br']);
      if (edgeType === 'top' && tBr) {
        this.t.cornerEl.show();
        this.t.cornerEl.css('right', '0');
        this.t.cornerEl.css('top', '0');
      }
      if (edgeType === 'top' && ltTBrL) {
        this.t.cornerEl.show();
        this.t.cornerEl.css('right', '0');
        this.t.cornerEl.css('top', '0');
      }
      if (edgeType === 'top' && rect.eci > viewRange.eci) {
        this.t.cornerEl.hide();
      }
    } else {
      const t = Utils.arrayEqual(intersectsArea, ['t']);
      const ltT = Utils.arrayEqual(intersectsArea, ['lt', 't']);
      if (t || ltT) {
        this.t.cornerEl.show();
        this.t.cornerEl.css('right', '0');
        this.t.cornerEl.css('bottom', '0');
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
      this.l.hide();
      return;
    }
    this.l.cornerEl.cssRemoveKeys('left');
    this.l.cornerEl.cssRemoveKeys('top');
    this.l.cornerEl.cssRemoveKeys('right');
    this.l.cornerEl.cssRemoveKeys('bottom');
    this.l.cornerEl.hide();
    if (edge) {
      const lBr = Utils.arrayEqual(intersectsArea, ['l', 'br']);
      const ltTBrL = Utils.arrayEqual(intersectsArea, ['lt', 't', 'l', 'br']);
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
      const l = Utils.arrayEqual(intersectsArea, ['l']);
      const ltL = Utils.arrayEqual(intersectsArea, ['lt', 'l']);
      if (l || ltL) {
        this.l.cornerEl.show();
        this.l.cornerEl.css('right', '0');
        this.l.cornerEl.css('bottom', '0');
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
    const { content } = table;
    const viewRange = content.getViewRange();
    const { rect, edge, edgeType } = selectorAttr;
    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    this.br.cornerEl.cssRemoveKeys('left');
    this.br.cornerEl.cssRemoveKeys('top');
    this.br.cornerEl.cssRemoveKeys('right');
    this.br.cornerEl.cssRemoveKeys('bottom');
    this.br.cornerEl.hide();
    if (empty.equals(coincideRange)) {
      this.br.hide();
      return;
    }
    if (edge) {
      const br = Utils.arrayEqual(intersectsArea, ['br']);
      const ltTLBr = Utils.arrayEqual(intersectsArea, ['lt', 't', 'l', 'br']);
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
      const br = Utils.arrayEqual(intersectsArea, ['br']);
      const tBr = Utils.arrayEqual(intersectsArea, ['t', 'br']);
      const lBr = Utils.arrayEqual(intersectsArea, ['l', 'br']);
      const ltTLBr = Utils.arrayEqual(intersectsArea, ['lt', 't', 'l', 'br']);
      if (br || tBr || lBr || lBr || ltTLBr) {
        this.br.cornerEl.show();
        this.br.cornerEl.css('right', '0');
        this.br.cornerEl.css('bottom', '0');
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
    const { content, cols, rows } = table;
    const viewRange = content.getViewRange();
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
}

export { ScreenSelector };
