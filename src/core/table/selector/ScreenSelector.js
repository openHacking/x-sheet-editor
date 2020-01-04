/* global document */

import { Selector } from './Selector';
import { Constant } from '../../../utils/Constant';
import { ScreenWidget } from '../screen/ScreenWidget';
import { EventBind } from '../../../utils/EventBind';
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

  setLTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { rect, edgeType } = selectorAttr;
    const { w: width, h: height } = rect;
    const indexWidth = table.getIndexWidth();
    const indexHeight = table.getIndexHeight();
    let { left, top } = selectorAttr;
    left -= indexWidth;
    top -= indexHeight;
    this.lt.offset({
      width,
      height,
      left,
      top,
    }).show();
    switch (edgeType) {
      case 'top':
        this.lt.cornerEl.cssRemoveKeys('bottom');
        this.lt.cornerEl.cssRemoveKeys('left');
        this.lt.cornerEl.css('top', '-3px');
        this.lt.cornerEl.css('right', '-3px');
        break;
      case 'left':
        this.lt.cornerEl.cssRemoveKeys('top');
        this.lt.cornerEl.cssRemoveKeys('right');
        this.lt.cornerEl.css('bottom', '-3px');
        this.lt.cornerEl.css('left', '-3px');
        break;
      default:
        this.lt.cornerEl.cssRemoveKeys('top');
        this.lt.cornerEl.cssRemoveKeys('left');
        this.lt.cornerEl.css('bottom', '-3px');
        this.lt.cornerEl.css('right', '-3px');
    }
  }

  setTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { rect, edgeType } = selectorAttr;
    const { w: width, h: height } = rect;
    const scroll = table.getScroll();
    const indexWidth = table.getIndexWidth();
    const indexHeight = table.getIndexHeight();
    const fixedWidth = table.getFixedWidth();
    let { left, top } = selectorAttr;
    left -= indexWidth;
    left -= fixedWidth;
    left -= scroll.x;
    top -= indexHeight;
    this.t.offset({
      width,
      height,
      left,
      top,
    }).show();
    switch (edgeType) {
      case 'top':
        this.t.cornerEl.cssRemoveKeys('bottom');
        this.t.cornerEl.cssRemoveKeys('left');
        this.t.cornerEl.css('top', '-3px');
        this.t.cornerEl.css('right', '-3px');
        break;
      case 'left':
        this.t.cornerEl.cssRemoveKeys('top');
        this.t.cornerEl.cssRemoveKeys('right');
        this.t.cornerEl.css('bottom', '-3px');
        this.t.cornerEl.css('left', '-3px');
        break;
      default:
        this.t.cornerEl.cssRemoveKeys('top');
        this.t.cornerEl.cssRemoveKeys('left');
        this.t.cornerEl.css('bottom', '-3px');
        this.t.cornerEl.css('right', '-3px');
    }
  }

  setLOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { rect, edgeType } = selectorAttr;
    const { w: width, h: height } = rect;
    const scroll = table.getScroll();
    const indexWidth = table.getIndexWidth();
    const indexHeight = table.getIndexHeight();
    const fixedHeight = table.getFixedHeight();
    let { left, top } = selectorAttr;
    left -= indexWidth;
    top -= indexHeight;
    top -= fixedHeight;
    top -= scroll.y;
    this.l.offset({
      width,
      height,
      left,
      top,
    }).show();
    switch (edgeType) {
      case 'top':
        this.l.cornerEl.cssRemoveKeys('bottom');
        this.l.cornerEl.cssRemoveKeys('left');
        this.l.cornerEl.css('top', '-3px');
        this.l.cornerEl.css('right', '-3px');
        break;
      case 'left':
        this.l.cornerEl.cssRemoveKeys('top');
        this.l.cornerEl.cssRemoveKeys('right');
        this.l.cornerEl.css('bottom', '-3px');
        this.l.cornerEl.css('left', '-3px');
        break;
      default:
        this.l.cornerEl.cssRemoveKeys('top');
        this.l.cornerEl.cssRemoveKeys('left');
        this.l.cornerEl.css('bottom', '-3px');
        this.l.cornerEl.css('right', '-3px');
    }
  }

  setBROffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { rect, edgeType } = selectorAttr;
    const { w: width, h: height } = rect;
    const scroll = table.getScroll();
    const indexWidth = table.getIndexWidth();
    const indexHeight = table.getIndexHeight();
    const fixedHeight = table.getFixedHeight();
    const fixedWidth = table.getFixedWidth();
    let { left, top } = selectorAttr;
    left -= indexWidth;
    left -= fixedWidth;
    left -= scroll.x;
    top -= indexHeight;
    top -= fixedHeight;
    top -= scroll.y;
    this.br.offset({
      width,
      height,
      left,
      top,
    }).show();
    switch (edgeType) {
      case 'top':
        this.br.cornerEl.cssRemoveKeys('bottom');
        this.br.cornerEl.cssRemoveKeys('left');
        this.br.cornerEl.css('top', '-3px');
        this.br.cornerEl.css('right', '-3px');
        break;
      case 'left':
        this.br.cornerEl.cssRemoveKeys('top');
        this.br.cornerEl.cssRemoveKeys('right');
        this.br.cornerEl.css('bottom', '-3px');
        this.br.cornerEl.css('left', '-3px');
        break;
      default:
        this.br.cornerEl.cssRemoveKeys('top');
        this.br.cornerEl.cssRemoveKeys('left');
        this.br.cornerEl.css('bottom', '-3px');
        this.br.cornerEl.css('right', '-3px');
    }
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
      EventBind.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        const moveSelectorAttr = this.getMoveXySelectorAttr(downSelectAttr, x, y);
        this.selectorAttr = moveSelectorAttr;
        this.setOffset(moveSelectorAttr);
      });
    });
    EventBind.bind([
      this.lt.cornerEl,
      this.t.cornerEl,
      this.l.cornerEl,
      this.br.cornerEl,
    ], Constant.EVENT_TYPE.MOUSE_DOWN, (e1) => {
      // console.log('auto fill');
      Utils.serMousePointCrossHair();
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
      }, () => {
        this.hideAutoFill();
        Utils.setMousePoint();
      });
      e1.stopPropagation();
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
    const { merges, cols, rows } = table;
    const { ri, ci } = table.getRiCiByXy(x, y);
    // console.log('ri, ci >>>', ri, ci);

    if (ri === -1 && ci === -1) {
      const width = table.getContentWidth() + table.getFixedWidth();
      const height = table.getContentHeight() + table.getFixedHeight();
      const left = table.getIndexWidth();
      const top = table.getIndexHeight();
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(0, 0, 0, 0);
      rect.w = width;
      rect.h = height;
      return {
        left, top, rect, edge: true, edgeType: 'left-top',
      };
    }
    if (ri === -1) {
      const width = cols.getWidth(ci);
      const height = table.getContentHeight() + table.getFixedHeight();
      const left = table.getColLeft(ci);
      const top = table.getIndexHeight();
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(0, ci, 0, ci);
      rect.w = width;
      rect.h = height;
      return {
        left, top, rect, edge: true, edgeType: 'top',
      };
    }
    if (ci === -1) {
      const width = table.getContentWidth() + table.getFixedWidth();
      const height = rows.getHeight(ri);
      const left = table.getIndexWidth();
      const top = table.getRowTop(ri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(ri, 0, ri, 0);
      rect.w = width;
      rect.h = height;
      return {
        left, top, rect, edge: true, edgeType: 'left',
      };
    }

    const merge = merges.getFirstIncludes(ri, ci);
    let rect = new RectRange(ri, ci, ri, ci);
    if (merge) {
      rect = merge;
    }
    const top = table.getRowTop(rect.sri);
    const left = table.getColLeft(rect.sci);
    const width = cols.sectionSumWidth(rect.sci, rect.eci);
    const height = rows.sectionSumHeight(rect.sri, rect.eri);
    rect.w = width;
    rect.h = height;
    return { left, top, rect };
  }

  getMoveXySelectorAttr(selectorAttr, x, y) {
    // console.log('x, y >>>', x, y);
    const { screen } = this;
    const { table } = screen;
    const { merges, cols, rows } = table;
    const { rect: selectRect, edge } = selectorAttr;
    const { ri, ci } = table.getRiCiByXy(x, y);

    if (edge && ri === -1 && ci === -1) {
      const width = table.getContentWidth() + table.getFixedWidth();
      const height = table.getContentHeight() + table.getFixedHeight();
      const left = table.getIndexWidth();
      const top = table.getIndexHeight();
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(0, 0, 0, 0);
      rect.w = width;
      rect.h = height;
      return {
        left, top, rect, edge: true, edgeType: 'left-top',
      };
    }
    if (edge && ri === -1) {
      let rect = new RectRange(0, ci, 0, ci);
      rect = selectRect.union(rect);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = table.getContentHeight() + table.getFixedHeight();
      const left = table.getColLeft(rect.sci);
      const top = table.getIndexHeight();
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.w = width;
      rect.h = height;
      return {
        left, top, rect, edge: true, edgeType: 'top',
      };
    }
    if (edge && ci === -1) {
      let rect = new RectRange(ri, 0, ri, 0);
      rect = selectRect.union(rect);
      const width = table.getContentWidth() + table.getFixedWidth();
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      const left = table.getIndexWidth();
      const top = table.getRowTop(rect.sri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.w = width;
      rect.h = height;
      return {
        left, top, rect, edge: true, edgeType: 'left',
      };
    }

    if (ri === -1 && ci === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(viewRange.sri, viewRange.sci, 0, 0);
      rect = selectRect.union(rect);
      rect = merges.union(rect);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      const left = table.getColLeft(rect.sci);
      const top = table.getRowTop(rect.sri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.w = width;
      rect.h = height;
      return { left, top, rect };
    }
    if (ri === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(viewRange.sri, ci, viewRange.sri, ci);
      rect = selectRect.union(rect);
      rect = merges.union(rect);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      const left = table.getColLeft(rect.sci);
      const top = table.getRowTop(rect.sri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.w = width;
      rect.h = height;
      return { left, top, rect };
    }
    if (ci === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(ri, viewRange.sci, ri, viewRange.sci);
      rect = selectRect.union(rect);
      rect = merges.union(rect);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      const left = table.getColLeft(rect.sci);
      const top = table.getRowTop(rect.sri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.w = width;
      rect.h = height;
      return { left, top, rect };
    }

    let rect = selectRect.union(new RectRange(ri, ci, ri, ci));
    rect = merges.union(rect);
    const top = table.getRowTop(rect.sri);
    const left = table.getColLeft(rect.sci);
    const width = cols.sectionSumWidth(rect.sci, rect.eci);
    const height = rows.sectionSumHeight(rect.sri, rect.eri);
    rect.w = width;
    rect.h = height;
    // console.log('selectRect>>>', selectRect);
    // console.log('rect>>>', rect);
    return { left, top, rect };
  }

  getAutoFillRange() {
    // TODO ...
    //
  }

  getSelectorRange() {
    // TODO ...
    //
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
