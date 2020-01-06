/* global document */

import { Selector } from './Selector';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
import { ScreenWidget } from '../screen/ScreenWidget';
import { RectRange } from '../RectRange';

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

  setLTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { frozenLeftTop, cols, rows } = table;
    const viewRange = frozenLeftTop.getViewRange();
    const { rect, edgeType } = selectorAttr;
    const empty = new RectRange(0, 0, 0, 0, 0, 0);
    const coincideRange = rect.coincide(viewRange);
    // console.log('coincideRange >>>', coincideRange);
    if (empty.equals(coincideRange)) {
      this.lt.hide();
      return;
    }
    let width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    let height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
    // console.log('rect >>>', rect);
    if (edgeType === 'left') {
      this.lt.cornerEl.cssRemoveKeys('right');
      this.lt.cornerEl.cssRemoveKeys('top');
      this.lt.cornerEl.css('left', '-3px');
      this.lt.cornerEl.css('bottom', '-3px');
    } else if (edgeType === 'top') {
      this.lt.cornerEl.cssRemoveKeys('left');
      this.lt.cornerEl.cssRemoveKeys('bottom');
      this.lt.cornerEl.css('right', '-3px');
      this.lt.cornerEl.css('top', '-3px');
    } else {
      this.lt.cornerEl.cssRemoveKeys('top');
      this.lt.cornerEl.cssRemoveKeys('left');
      this.lt.cornerEl.css('right', '-3px');
      this.lt.cornerEl.css('bottom', '-3px');
    }
    if (rect.eci > viewRange.eci) {
      this.lt.areaEl.css('border-right', 'none');
      width += 2;
    } else {
      this.lt.areaEl.cssRemoveKeys('border-right');
    }
    if (rect.eri > viewRange.eri) {
      height += 2;
      this.lt.areaEl.css('border-bottom', 'none');
    } else {
      this.lt.areaEl.cssRemoveKeys('border-bottom');
    }
    if (rect.eci <= viewRange.eci && rect.eri <= viewRange.eri) {
      this.lt.cornerEl.show();
    } else {
      this.lt.cornerEl.hide();
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
    const { rect, edgeType, edge } = selectorAttr;
    const empty = new RectRange(0, 0, 0, 0, 0, 0);
    const coincideRange = rect.coincide(viewRange);
    // console.log('coincideRange >>>', coincideRange);
    if (empty.equals(coincideRange)) {
      this.t.hide();
      return;
    }
    let width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    let height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
    if (edgeType === 'left') {
      this.t.cornerEl.cssRemoveKeys('right');
      this.t.cornerEl.cssRemoveKeys('top');
      this.t.cornerEl.css('left', '-3px');
      this.t.cornerEl.css('bottom', '-3px');
    } else if (edgeType === 'top') {
      this.t.cornerEl.cssRemoveKeys('left');
      this.t.cornerEl.cssRemoveKeys('bottom');
      this.t.cornerEl.css('right', '-3px');
      this.t.cornerEl.css('top', '-3px');
    } else {
      this.t.cornerEl.cssRemoveKeys('top');
      this.t.cornerEl.cssRemoveKeys('left');
      this.t.cornerEl.css('right', '-3px');
      this.t.cornerEl.css('bottom', '-3px');
    }
    if (rect.sci < viewRange.sci) {
      this.t.areaEl.css('border-left', 'none');
      width += 2;
    } else {
      this.t.areaEl.cssRemoveKeys('border-left');
    }
    if (rect.eri > viewRange.eri) {
      this.t.areaEl.css('border-bottom', 'none');
      height += 2;
    } else {
      this.t.areaEl.cssRemoveKeys('border-bottom');
    }
    if ((rect.eci <= viewRange.eci && rect.eri <= viewRange.eri) || edge) {
      this.t.cornerEl.show();
    } else {
      this.t.cornerEl.hide();
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
    const { rect, edgeType, edge } = selectorAttr;
    const empty = new RectRange(0, 0, 0, 0, 0, 0);
    const coincideRange = rect.coincide(viewRange);
    // console.log('coincideRange >>>', coincideRange);
    if (empty.equals(coincideRange)) {
      this.l.hide();
      return;
    }
    let width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    let height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
    if (edgeType === 'left') {
      this.l.cornerEl.cssRemoveKeys('right');
      this.l.cornerEl.cssRemoveKeys('top');
      this.l.cornerEl.css('left', '-3px');
      this.l.cornerEl.css('bottom', '-3px');
    } else if (edgeType === 'top') {
      this.l.cornerEl.cssRemoveKeys('left');
      this.l.cornerEl.cssRemoveKeys('bottom');
      this.l.cornerEl.css('right', '-3px');
      this.l.cornerEl.css('top', '-3px');
    } else {
      this.l.cornerEl.cssRemoveKeys('top');
      this.l.cornerEl.cssRemoveKeys('left');
      this.l.cornerEl.css('right', '-3px');
      this.l.cornerEl.css('bottom', '-3px');
    }
    if (rect.sri < viewRange.sri) {
      this.l.areaEl.css('border-top', 'none');
      height += 2;
    } else {
      this.l.areaEl.cssRemoveKeys('border-top');
    }
    if (rect.eci > viewRange.eci) {
      this.l.areaEl.css('border-right', 'none');
      width += 2;
    } else {
      this.l.areaEl.cssRemoveKeys('border-right');
    }
    if ((rect.eci <= viewRange.eci && rect.eri <= viewRange.eri) || edge) {
      this.l.cornerEl.show();
    } else {
      this.l.cornerEl.hide();
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
    const { content, cols, rows } = table;
    const viewRange = content.getViewRange();
    const { rect, edgeType, edge } = selectorAttr;
    const empty = new RectRange(0, 0, 0, 0, 0, 0);
    const coincideRange = rect.coincide(viewRange);
    // console.log('coincideRange >>>', coincideRange);
    if (empty.equals(coincideRange)) {
      this.br.hide();
      return;
    }
    let width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    let height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
    if (edgeType === 'left') {
      this.br.cornerEl.cssRemoveKeys('right');
      this.br.cornerEl.cssRemoveKeys('top');
      this.br.cornerEl.css('left', '-3px');
      this.br.cornerEl.css('bottom', '-3px');
    } else if (edgeType === 'top') {
      this.br.cornerEl.cssRemoveKeys('left');
      this.br.cornerEl.cssRemoveKeys('bottom');
      this.br.cornerEl.css('right', '-3px');
      this.br.cornerEl.css('top', '-3px');
    } else {
      this.br.cornerEl.cssRemoveKeys('top');
      this.br.cornerEl.cssRemoveKeys('left');
      this.br.cornerEl.css('right', '-3px');
      this.br.cornerEl.css('bottom', '-3px');
    }
    if (rect.sci < viewRange.sci) {
      this.br.areaEl.css('border-left', 'none');
      width += 2;
    } else {
      this.br.areaEl.cssRemoveKeys('border-left');
    }
    if (rect.sri < viewRange.sri) {
      this.br.areaEl.css('border-top', 'none');
      height += 2;
    } else {
      this.br.areaEl.cssRemoveKeys('border-top');
    }
    if (edge) {
      this.br.cornerEl.hide();
    } else {
      this.br.cornerEl.show();
    }
    this.br.offset({
      width,
      height,
      left,
      top,
    }).show();
  }

  setOffset(selectorAttr) {
    this.setLTOffset(selectorAttr);
    this.setTOffset(selectorAttr);
    this.setLOffset(selectorAttr);
    this.setBROffset(selectorAttr);
  }

  setLtAutoFillOffset(selectorAutoFillAttr) {
    const { rect, direction } = selectorAutoFillAttr;
    const { lt } = this;
    const { autofillEl } = lt;
    autofillEl.cssRemoveKeys('top');
    autofillEl.cssRemoveKeys('left');
    autofillEl.cssRemoveKeys('right');
    autofillEl.cssRemoveKeys('bottom');
    switch (direction) {
      case 'top':
        autofillEl.css('top', `-${rect.h}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'bottom':
        autofillEl.css('bottom', `-${rect.h}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'left':
        autofillEl.css('top', '0px');
        autofillEl.css('left', `-${rect.w}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'right':
        autofillEl.css('top', '0px');
        autofillEl.css('right', `-${rect.w}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      default: break;
    }
  }

  setTAutoFillOffset(selectorAutoFillAttr) {
    const { rect, direction } = selectorAutoFillAttr;
    const { t } = this;
    const { autofillEl } = t;
    autofillEl.cssRemoveKeys('top');
    autofillEl.cssRemoveKeys('left');
    autofillEl.cssRemoveKeys('right');
    autofillEl.cssRemoveKeys('bottom');
    switch (direction) {
      case 'top':
        autofillEl.css('top', `-${rect.h}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'bottom':
        autofillEl.css('bottom', `-${rect.h}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'left':
        autofillEl.css('top', '0px');
        autofillEl.css('left', `-${rect.w}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'right':
        autofillEl.css('top', '0px');
        autofillEl.css('right', `-${rect.w}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      default: break;
    }
  }

  setLAutoFillOffset(selectorAutoFillAttr) {
    const { rect, direction } = selectorAutoFillAttr;
    const { l } = this;
    const { autofillEl } = l;
    autofillEl.cssRemoveKeys('top');
    autofillEl.cssRemoveKeys('left');
    autofillEl.cssRemoveKeys('right');
    autofillEl.cssRemoveKeys('bottom');
    switch (direction) {
      case 'top':
        autofillEl.css('top', `-${rect.h}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'bottom':
        autofillEl.css('bottom', `-${rect.h}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'left':
        autofillEl.css('top', '0px');
        autofillEl.css('left', `-${rect.w}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'right':
        autofillEl.css('top', '0px');
        autofillEl.css('right', `-${rect.w}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      default: break;
    }
  }

  setBRAutoFillOffset(selectorAutoFillAttr) {
    const { rect, direction } = selectorAutoFillAttr;
    const { br } = this;
    const { autofillEl } = br;
    autofillEl.cssRemoveKeys('top');
    autofillEl.cssRemoveKeys('left');
    autofillEl.cssRemoveKeys('right');
    autofillEl.cssRemoveKeys('bottom');
    switch (direction) {
      case 'top':
        autofillEl.css('top', `-${rect.h}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'bottom':
        autofillEl.css('bottom', `-${rect.h}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'left':
        autofillEl.css('top', '0px');
        autofillEl.css('left', `-${rect.w}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      case 'right':
        autofillEl.css('top', '0px');
        autofillEl.css('right', `-${rect.w}px`);
        autofillEl.css('width', `${rect.w}px`);
        autofillEl.css('height', `${rect.h}px`);
        break;
      default: break;
    }
  }

  setAutoFillOffset(selectorAutoFillAttr) {
    this.setLtAutoFillOffset(selectorAutoFillAttr);
    this.setTAutoFillOffset(selectorAutoFillAttr);
    this.setLAutoFillOffset(selectorAutoFillAttr);
    this.setBRAutoFillOffset(selectorAutoFillAttr);
  }

  showAutoFill() {
    const { lt } = this;
    const { t } = this;
    const { l } = this;
    const { br } = this;
    lt.autofillEl.show();
    t.autofillEl.show();
    l.autofillEl.show();
    br.autofillEl.show();
  }

  hideAutoFill() {
    const { lt } = this;
    const { t } = this;
    const { l } = this;
    const { br } = this;
    lt.autofillEl.hide();
    t.autofillEl.hide();
    l.autofillEl.hide();
    br.autofillEl.hide();
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
        const { x, y } = table.computeEventXy(e2);
        const selectorAutoFillAttr = this.getMoveAutoFillXYSelectorAttr(x, y);
        // console.log(selectorAutoFillAttr);
        if (selectorAutoFillAttr) {
          this.showAutoFill();
          this.setAutoFillOffset(selectorAutoFillAttr);
        } else {
          this.hideAutoFill();
        }
        this.autoFillAttr = selectorAutoFillAttr;
        e2.stopPropagation();
        e2.preventDefault();
      }, () => {
        mousePointType.off();
        this.hideAutoFill();
        this.autoFill();
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

  getMoveAutoFillXYSelectorAttr(x, y) {
    // console.log('x, y >>>', x, y);
    const { screen } = this;
    const { table } = screen;
    const { cols, rows } = table;
    const { selectorAttr } = this;
    const { rect: selectorRect, edge, edgeType } = selectorAttr;
    let { ri, ci } = table.getRiCiByXy(x, y);
    // console.log('ri, ci >>>', ri, ci);
    // console.log('edge >>>', edge);
    if (ri < 0) ri = 0; else if (ri > rows.len) ri = rows.len - 1;
    if (ci < 0) ci = 0; else if (ci > cols.len) ci = cols.len - 1;

    const {
      sri: selectorSri, sci: selectorSci,
    } = selectorRect;
    let {
      eri: selectorEri, eci: selectorEci,
    } = selectorRect;
    if (edge && edgeType === 'left') {
      selectorEci = cols.len - 1;
    }
    if (edge && edgeType === 'top') {
      selectorEri = rows.len - 1;
    }
    // console.log('selectorSri selectorSci selectorEri selectorEci',
    //   selectorSri, selectorSci, selectorEri, selectorEci);

    let rect = null;
    let direction = 'un';
    if (ri < selectorSri || ri > selectorEri) {
      if (ri < selectorSri) {
        direction = 'top';
        rect = new RectRange(ri, selectorSci, selectorSri - 1, selectorEci);
      }
      if (ri > selectorEri) {
        direction = 'bottom';
        rect = new RectRange(selectorEri + 1, selectorSci, ri, selectorEci);
      }
    } else if (ci < selectorSci || ci > selectorEci) {
      if (ci < selectorSci) {
        direction = 'left';
        rect = new RectRange(selectorSri, ci, selectorEri, selectorSci - 1);
      }
      if (ci > selectorEci) {
        direction = 'right';
        rect = new RectRange(selectorSri, selectorEci + 1, selectorEri, ci);
      }
    }
    // console.log('rect >>>', rect);

    if (rect !== null) {
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      rect.w = width;
      rect.h = height;
      return {
        rect, direction,
      };
    }

    return null;
  }

  getDownXYSelectorAttr(x, y) {
    // console.log('x, y >>>', x, y);
    const { screen } = this;
    const { table } = screen;
    const { merges , rows, cols} = table;
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

  getAutoFillRange() {
    const { rect } = this.autoFillAttr;
    return rect;
  }

  getSelectorRange() {
    const { screen } = this;
    const { table } = screen;
    const { rows, cols } = table;
    const { selectorAttr } = this;
    const { edge, edgeType, rect } = selectorAttr;
    // console.log('rect>>>', rect);
    // console.log('selectorAttr>>>', selectorAttr);
    // console.log('edgeType>>>', edgeType);
    const result = rect.clone();
    if (edge) {
      switch (edgeType) {
        case 'left':
          result.eci = cols.len - 1;
          break;
        case 'top':
          result.eri = rows.len - 1;
          break;
        default:
          result.eci = cols.len - 1;
          result.eri = rows.len - 1;
          break;
      }
    }
    return result;
  }

  autoFill() {
    const selectorRange = this.getSelectorRange();
    const autoFillRange = this.getAutoFillRange();
    console.log('selectorRange>>>', selectorRange);
    console.log('autoFillRange>>>', autoFillRange);
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
