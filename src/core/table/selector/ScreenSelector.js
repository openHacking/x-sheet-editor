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

  getDownXYSelectorAttr(x, y) {
    const { screen } = this;
    const { table } = screen;
    const { merges, cols, rows } = table;
    const { ri, ci } = table.getRiCiByXy(x, y);
    // console.log('ri, ci >>>', ri, ci);
    if (ri === -1) {
      // 选中一整列
      const width = cols.getWidth(ci);
      const height = table.getContentHeight();
      const left = table.getColLeft(ci);
      const top = table.getIndexHeight();
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(0, ci, 0, ci);
      rect.width = width;
      rect.height = height;
      return {
        left,
        top,
        rect,
      };
    }
    if (ci === -1) {
      // 选中一整行
      const width = table.getContentWidth();
      const height = rows.getHeight(ri);
      const left = table.getIndexWidth();
      const top = table.getRowTop(ri);
      // console.log('width, height, left, top >>>', width, height, left, top);
      const rect = new RectRange(ri, 0, ri, 0, width, height);
      rect.width = width;
      rect.height = height;
      return {
        left,
        top,
        rect,
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
    return {
      left, top, rect,
    };
  }

  getMoveXySelectorAttr(selectorAttr, x, y) {
    // console.log('x, y >>>', x, y);
    const { screen } = this;
    const { table } = screen;
    const { merges, cols, rows } = table;
    const { rect: selectRect } = selectorAttr;
    const { ri, ci } = table.getRiCiByXy(x, y);
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
    return {
      top, left, rect,
    };
  }
}

export { ScreenSelector };
