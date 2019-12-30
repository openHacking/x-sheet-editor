import { cssPrefix } from '../../config';
import { Plugin } from '../table/Plugin';
import { SelectorElement } from './SelectorElement';
import { TABLE_EVENT } from '../table/EventManage';

class L extends SelectorElement {
  setAreaOffset(selectorAttr) {
    const { selector } = this;
    const { table } = selector;
    const { settings } = table;
    const { width, height } = selectorAttr;
    const { index } = settings;

    let { left, top } = selectorAttr;

    left -= index.width;
    top -= index.height;

    this.areaEl.offset({
      width: width - 4,
      height: height - 4,
      left,
      top,
    }).show();
  }
}

class T extends SelectorElement {
  setAreaOffset(selectorAttr) {
    const { selector } = this;
    const { table } = selector;
    const { width, height } = selectorAttr;
    const scroll = table.getScroll();
    const indexWidth = table.getIndexWidth();
    const indexHeight = table.getIndexHeight();
    const fixedWidth = table.getFixedWidth();

    let { left, top } = selectorAttr;

    left -= indexWidth;
    left -= fixedWidth;
    left -= scroll.x;

    top -= indexHeight;

    this.areaEl.offset({
      width: width - 4,
      height: height - 4,
      left,
      top,
    }).show();
  }
}

class TL extends SelectorElement {
  setAreaOffset(selectorAttr) {
    const { selector } = this;
    const { table } = selector;
    const { width, height } = selectorAttr;
    const scroll = table.getScroll();
    const indexWidth = table.getIndexWidth();
    const indexHeight = table.getIndexHeight();
    const fixedHeight = table.getFixedHeight();

    let { left, top } = selectorAttr;

    left -= indexWidth;

    top -= indexHeight;
    top -= fixedHeight;
    top -= scroll.y;

    this.areaEl.offset({
      width: width - 4,
      height: height - 4,
      left,
      top,
    }).show();
  }
}

class Br extends SelectorElement {
  setAreaOffset(selectorAttr) {
    const { selector } = this;
    const { table } = selector;
    const { width, height } = selectorAttr;
    const scroll = table.getScroll();
    const indexWidth = table.getIndexWidth();
    const indexHeight = table.getIndexHeight();
    const fixedHeight = table.getFixedHeight();
    const fixedWidth = table.getFixedWidth();

    let {
      left, top,
    } = selectorAttr;

    left -= indexWidth;
    left -= fixedWidth;
    left -= scroll.x;

    top -= indexHeight;
    top -= fixedHeight;
    top -= scroll.y;

    this.areaEl.offset({
      width: width - 4,
      height: height - 4,
      left,
      top,
    }).show();
  }
}

class Selector extends Plugin {
  constructor() {
    super(`${cssPrefix}-selector`);
    this.l = new L(this);
    this.t = new T(this);
    this.tl = new TL(this);
    this.br = new Br(this);
    this.br.show();
    this.children(this.l, this.t, this.tl, this.br).show();
    this.selectorAttr = null;
  }

  init() {
    this.divideLayer();
  }

  ready(table) {
    this.table = table;
    table.eventMange.addEvent(TABLE_EVENT.MOUSE_DOWN, (e) => {
      const { x, y } = e;
      this.selectorAttr = this.eventSelectorAttr(x, y);
      this.l.setAreaOffset(this.selectorAttr);
      this.t.setAreaOffset(this.selectorAttr);
      this.tl.setAreaOffset(this.selectorAttr);
      this.br.setAreaOffset(this.selectorAttr);
    });
    table.eventMange.addEvent(TABLE_EVENT.MOUSE_UP, () => {});
    table.eventMange.addEvent(TABLE_EVENT.MOUSE_MOVE, () => {});
    table.eventMange.addEvent(TABLE_EVENT.SCROLL_X, () => {
      this.updateSelectorAttr();
    });
    table.eventMange.addEvent(TABLE_EVENT.SCROLL_Y, () => {
      this.updateSelectorAttr();
    });
  }

  eventSelectorAttr(x, y) {
    const { table } = this;
    const {
      merges, cols, rows,
    } = table;
    let { ri, ci } = table.getRiCiByXy(x, y);
    // console.log('ri ci >>>', ri, ci);
    let [top, left, width, height] = [
      table.getRowTop(ri),
      table.getColLeft(ci),
      cols.getWidth(ci),
      rows.getHeight(ri),
    ];
    const rectRange = merges.getFirstIncludes(ri, ci);
    if (rectRange) {
      [ri, ci, top, left, width, height] = [
        rectRange.sri,
        rectRange.sci,
        table.getRowTop(ri),
        table.getColLeft(ci),
        cols.sectionSumWidth(rectRange.sci, rectRange.eci),
        rows.sectionSumHeight(rectRange.sri, rectRange.eri),
      ];
    }
    return {
      ri, ci, left, top, width, height,
    };
  }

  updateSelectorAttr() {}

  divideLayer() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const fixedWidth = table.getFixedWidth();
    const fixedHeight = table.getFixedHeight();
    const brLeft = index.width + fixedWidth;
    const brTop = index.height + fixedHeight;
    this.br.offset({ left: brLeft, top: brTop });
    if (brLeft > 0 || brTop > 0) {
      this.l.offset({
        left: index.width, top: index.height, width: fixedWidth, height: fixedHeight,
      }).show();
      this.t.offset({ left: brLeft, top: index.height, height: fixedHeight }).show();
      this.tl.offset({ left: index.width, top: brTop, width: fixedWidth }).show();
    } else {
      this.tl.hide();
      this.t.hide();
      this.l.hide();
      this.br.setOffset({ left: 0, top: 0 });
    }
  }
}

export { Selector };
