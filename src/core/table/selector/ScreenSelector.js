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
    this.autoFillAttr = null;
    this.bind();
  }

  setLTOffset(selectorAttr, intersectsArea) {
    const { screen } = this;
    const { table } = screen;
    const { frozenLeftTop, cols, rows } = table;
    const viewRange = frozenLeftTop.getViewRange();
    const { rect, edgeType } = selectorAttr;
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
    this.lt.cornerEl.cssRemoveKeys('left');
    this.lt.cornerEl.cssRemoveKeys('top');
    this.lt.cornerEl.cssRemoveKeys('right');
    this.lt.cornerEl.cssRemoveKeys('bottom');
    if (Utils.arrayEqual(intersectsArea, ['lt'])) {
      this.lt.cornerEl.show();
      this.lt.cornerEl.css('right', '0px');
      this.lt.cornerEl.css('bottom', '0px');
    } else {
      this.lt.cornerEl.hide();
    }
    if (edgeType === 'top') {
      this.lt.cornerEl.show();
      this.lt.cornerEl.css('top', '0px');
      this.lt.cornerEl.css('right', '0px');
    }
    if (edgeType === 'left') {
      this.lt.cornerEl.show();
      this.lt.cornerEl.css('left', '0px');
      this.lt.cornerEl.css('bottom', '0px');
    }
    this.lt.offset({
      width,
      height,
      left,
      top,
    }).show();
  }

  setTOffset(selectorAttr, intersectsArea) {
    const { screen } = this;
    const { table } = screen;
    const { fixedTop, cols, rows } = table;
    const viewRange = fixedTop.getViewRange();
    const { rect, edgeType } = selectorAttr;
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
    this.t.cornerEl.cssRemoveKeys('left');
    this.t.cornerEl.cssRemoveKeys('top');
    this.t.cornerEl.cssRemoveKeys('right');
    this.t.cornerEl.cssRemoveKeys('bottom');
    if (Utils.arrayEqual(intersectsArea, ['t']) || Utils.arrayEqual(intersectsArea, ['lt', 't'])) {
      this.t.cornerEl.show();
      this.t.cornerEl.css('right', '0px');
      this.t.cornerEl.css('bottom', '0px');
    } else {
      this.t.cornerEl.hide();
    }
    if (edgeType === 'top') {
      this.t.cornerEl.show();
      this.t.cornerEl.css('top', '0px');
      this.t.cornerEl.css('right', '0px');
    }
    this.t.offset({
      width,
      height,
      left,
      top,
    }).show();
  }

  setLOffset(selectorAttr, intersectsArea) {
    const { screen } = this;
    const { table } = screen;
    const { fixedLeft, cols, rows } = table;
    const viewRange = fixedLeft.getViewRange();
    const { rect, edgeType } = selectorAttr;
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
    this.l.cornerEl.cssRemoveKeys('left');
    this.l.cornerEl.cssRemoveKeys('top');
    this.l.cornerEl.cssRemoveKeys('right');
    this.l.cornerEl.cssRemoveKeys('bottom');
    if (Utils.arrayEqual(intersectsArea, ['l']) || Utils.arrayEqual(intersectsArea, ['lt', 'l'])) {
      this.l.cornerEl.show();
      this.l.cornerEl.css('right', '0px');
      this.l.cornerEl.css('bottom', '0px');
    } else {
      this.l.cornerEl.hide();
    }
    if (edgeType === 'left') {
      this.l.cornerEl.show();
      this.l.cornerEl.css('left', '0px');
      this.l.cornerEl.css('bottom', '0px');
    }
    this.l.offset({
      width,
      height,
      left,
      top,
    }).show();
  }

  setBROffset(selectorAttr, intersectsArea) {
    const { screen } = this;
    const { table } = screen;
    const {
      content, cols, rows,
    } = table;
    const viewRange = content.getViewRange();
    const { rect, edge, edgeType } = selectorAttr;
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
    this.br.cornerEl.cssRemoveKeys('left');
    this.br.cornerEl.cssRemoveKeys('top');
    this.br.cornerEl.cssRemoveKeys('right');
    this.br.cornerEl.cssRemoveKeys('bottom');
    if (Utils.arrayEqual(intersectsArea, ['br']) || Utils.arrayEqual(intersectsArea, ['br', 't']) || Utils.arrayEqual(intersectsArea, ['br', 'l']) || Utils.arrayEqual(intersectsArea, ['br', 'lt', 't', 'l'])) {
      this.br.cornerEl.show();
      this.br.cornerEl.css('right', '0px');
      this.br.cornerEl.css('bottom', '0px');
    } else {
      this.br.cornerEl.hide();
    }
    if (edge) {
      if (Utils.arrayEqual(intersectsArea, ['br'])) {
        if (edgeType === 'top') {
          this.br.cornerEl.show();
          this.br.cornerEl.css('top', '0px');
          this.br.cornerEl.css('right', '0px');
        }
        if (edgeType === 'left') {
          this.br.cornerEl.show();
          this.br.cornerEl.css('left', '0px');
          this.br.cornerEl.css('bottom', '0px');
        }
      } else {
        this.br.cornerEl.hide();
      }
    }
    this.br.offset({
      width,
      height,
      left,
      top,
    }).show();
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
    this.setLTOffset(selectorAttr, intersectsArea);
    this.setTOffset(selectorAttr, intersectsArea);
    this.setLOffset(selectorAttr, intersectsArea);
    this.setBROffset(selectorAttr, intersectsArea);
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
      if (downSelectAttr.edge) {
        mousePointType.on(['table-ci', 'table-ri', 'table-cell']);
      } else {
        mousePointType.on(['table-cell']);
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
        this.updateSelectorAttr();
        this.setOffset(this.selectorAttr);
      }
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.EVENT_TYPE.CHANGE_WIDTH, (e) => {
      if (this.selectorAttr) {
        this.updateSelectorAttr();
        this.setOffset(this.selectorAttr);
      }
      e.stopPropagation();
    });
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
    // console.log('x, y >>>', x, y);
    const { screen } = this;
    const { table } = screen;
    const { merges, rows, cols } = table;
    const { ri, ci } = table.getRiCiByXy(x, y);
    // console.log('ri, ci >>>', ri, ci);

    if (ri === -1 && ci === -1) {
      const rect = new RectRange(0, 0, rows.len, cols.len);
      return {
        rect, edge: true, edgeType: 'left-top',
      };
    }
    if (ri === -1) {
      const rect = new RectRange(0, ci, rows.len, ci);
      return {
        rect, edge: true, edgeType: 'top',
      };
    }
    if (ci === -1) {
      const rect = new RectRange(ri, 0, ri, cols.len);
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
    // console.log('x, y >>>', x, y);
    const { screen } = this;
    const { table } = screen;
    const { merges } = table;
    const { rect: selectRect, edge } = selectorAttr;
    const { ri, ci } = table.getRiCiByXy(x, y);

    if (edge && ri === -1 && ci === -1) {
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(0, 0, 0, 0);
      return {
        rect, edge: true, edgeType: 'left-top',
      };
    }
    if (edge && ri === -1) {
      let rect = new RectRange(0, ci, 0, ci);
      rect = selectRect.union(rect);
      return {
        rect, edge: true, edgeType: 'top',
      };
    }
    if (edge && ci === -1) {
      let rect = new RectRange(ri, 0, ri, 0);
      rect = selectRect.union(rect);
      return {
        rect, edge: true, edgeType: 'left',
      };
    }

    if (ri === -1 && ci === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(viewRange.sri, viewRange.sci, 0, 0);
      rect = selectRect.union(rect);
      rect = merges.union(rect);
      return { rect };
    }
    if (ri === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(viewRange.sri, ci, viewRange.sri, ci);
      rect = selectRect.union(rect);
      rect = merges.union(rect);
      return { rect };
    }
    if (ci === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(ri, viewRange.sci, ri, viewRange.sci);
      rect = selectRect.union(rect);
      rect = merges.union(rect);
      return { rect };
    }

    let rect = selectRect.union(new RectRange(ri, ci, ri, ci));
    rect = merges.union(rect);
    // console.log('selectRect>>>', selectRect);
    // console.log('rect>>>', rect);
    return { rect };
  }

  updateSelectorAttr() {
    const { screen } = this;
    const { table } = screen;
    const { rows, cols } = table;
    const { rect } = this.selectorAttr;
    if (this.selectorAttr.edge) {
      switch (this.selectorAttr.edgeType) {
        case 'left':
          this.selectorAttr.left = table.getIndexWidth();
          this.selectorAttr.top = table.getRowTop(rect.sri);
          rect.w = table.getContentWidth() + table.getFixedWidth();
          rect.h = rows.sectionSumHeight(rect.sri, rect.eri);
          break;
        case 'top':
          this.selectorAttr.left = table.getColLeft(rect.sci);
          this.selectorAttr.top = table.getIndexHeight();
          rect.w = cols.sectionSumWidth(rect.sci, rect.eci);
          rect.h = table.getContentHeight() + table.getFixedHeight();
          break;
        case 'left-top':
          this.selectorAttr.left = table.getIndexWidth();
          this.selectorAttr.top = table.getIndexHeight();
          rect.w = table.getContentWidth() + table.getFixedWidth();
          rect.h = table.getContentHeight() + table.getFixedHeight();
          break;
        default: break;
      }
    } else {
      this.selectorAttr.left = table.getColLeft(rect.sci);
      this.selectorAttr.top = table.getRowTop(rect.sri);
      rect.w = cols.sectionSumWidth(rect.sci, rect.eci);
      rect.h = rows.sectionSumHeight(rect.sri, rect.eri);
    }
  }
}

export { ScreenSelector };
