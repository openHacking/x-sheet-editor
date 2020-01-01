/* global document */

import { Selector } from './Selector';
import { Constant } from '../../../utils/Constant';
import { ScreenWidget } from '../screen/ScreenWidget';
import { EventBind } from '../../../utils/EventBind';
import { RectRange } from '../RectRange';

class ScreenSelector extends ScreenWidget {
  constructor(screen, options = {}) {
    super(screen);
    this.lt = new Selector(options);
    this.t = new Selector(options);
    this.l = new Selector(options);
    this.br = new Selector(options);
    this.bind();
  }

  bind() {
    const { screen } = this;
    const { table } = screen;
    table.on(Constant.EVENT_TYPE.SCROLL, () => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
    });
    table.on(Constant.EVENT_TYPE.MOUSE_DOWN, (e1) => {
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
  }

  setLtOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { rect } = selectorAttr;
    const { width, height } = rect;
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
  }

  setTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { rect } = selectorAttr;
    const { width, height } = rect;
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
  }

  setLOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { rect } = selectorAttr;
    const { width, height } = rect;
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
  }

  setBROffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { rect } = selectorAttr;
    const { width, height } = rect;
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
  }

  setOffset(selectorAttr) {
    this.setLtOffset(selectorAttr);
    this.setTOffset(selectorAttr);
    this.setLOffset(selectorAttr);
    this.setBROffset(selectorAttr);
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
    const { merges, cols, rows } = table;
    const { ri, ci } = table.getRiCiByXy(x, y);
    // console.log('ri, ci >>>', ri, ci);

    if (ri === -1 && ci === -1) {
      const width = table.getContentWidth() + table.getFixedWidth();
      const height = table.getContentHeight() + table.getFixedHeight();
      const left = table.getIndexWidth();
      const top = table.getIndexHeight();
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(0, ci, 0, ci);
      rect.width = width;
      rect.height = height;
      return {
        left, top, rect, edge: true,
      };
    }
    if (ri === -1) {
      const width = cols.getWidth(ci);
      const height = table.getContentHeight() + table.getFixedHeight();
      const left = table.getColLeft(ci);
      const top = table.getIndexHeight();
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(0, ci, 0, ci);
      rect.width = width;
      rect.height = height;
      return {
        left, top, rect, edge: true,
      };
    }
    if (ci === -1) {
      const width = table.getContentWidth() + table.getFixedWidth();
      const height = rows.getHeight(ri);
      const left = table.getIndexWidth();
      const top = table.getRowTop(ri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(ri, 0, ri, 0, width, height);
      rect.width = width;
      rect.height = height;
      return {
        left, top, rect, edge: true,
      };
    }

    const merge = merges.getFirstIncludes(ri, ci);
    let rect;
    if (merge) {
      rect = merge;
    } else {
      rect = new RectRange(ri, ci, ri, ci);
    }
    const top = table.getRowTop(rect.sri);
    const left = table.getColLeft(rect.sci);
    const width = cols.sectionSumWidth(rect.sci, rect.eci);
    const height = rows.sectionSumHeight(rect.sri, rect.eri);
    rect.width = width;
    rect.height = height;
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
      const rect = new RectRange(0, ci, 0, ci);
      rect.width = width;
      rect.height = height;
      return {
        left, top, rect, edge: true,
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
      rect.width = width;
      rect.height = height;
      return { left, top, rect };
    }
    if (edge && ci === -1) {
      let rect = new RectRange(ri, 0, ri, 0);
      rect = selectRect.union(rect);
      const width = table.getContentWidth() + table.getFixedWidth();
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      const left = table.getIndexWidth();
      const top = table.getRowTop(rect.sri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.width = width;
      rect.height = height;
      return { left, top, rect };
    }

    if (ri === -1 && ci === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(viewRange.sri, viewRange.sci, 0, 0);
      rect = selectRect.union(rect);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      const left = table.getColLeft(rect.sci);
      const top = table.getRowTop(rect.sri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.width = width;
      rect.height = height;
      return { left, top, rect };
    }
    if (ri === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(viewRange.sri, ci, 0, ci);
      rect = selectRect.union(rect);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      const left = table.getColLeft(rect.sci);
      const top = table.getRowTop(rect.sri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.width = width;
      rect.height = height;
      return { left, top, rect };
    }
    if (ci === -1) {
      const viewRange = this.getViewRange();
      // console.log('viewRange >>>', viewRange);
      let rect = new RectRange(ri, viewRange.sci, ri, 0);
      rect = selectRect.union(rect);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      const left = table.getColLeft(rect.sci);
      const top = table.getRowTop(rect.sri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      rect.width = width;
      rect.height = height;
      return { left, top, rect };
    }

    const merge = merges.getFirstIncludes(ri, ci);
    let rect;
    if (merge) {
      rect = selectRect.union(merge);
    } else {
      rect = selectRect.union(new RectRange(ri, ci, ri, ci));
    }
    const top = table.getRowTop(rect.sri);
    const left = table.getColLeft(rect.sci);
    const width = cols.sectionSumWidth(rect.sci, rect.eci);
    const height = rows.sectionSumHeight(rect.sri, rect.eri);
    rect.width = width;
    rect.height = height;
    // console.log('selectRect>>>', selectRect);
    // console.log('rect>>>', rect);
    return { left, top, rect };
  }
}

export { ScreenSelector };
