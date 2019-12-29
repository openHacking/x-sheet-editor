import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { SelectorElement } from './SelectorElement';
import { Constant } from '../utils/Constant';

let zIndex = 1;

class Br extends SelectorElement {
  setAreaOffset(selectorAttr) {
    const { table } = this;
    const {
      fixed, rows, cols, settings, content,
    } = table;
    const { scroll } = content;
    const { width, height } = selectorAttr;
    const { index } = settings;
    const fixedWidth = cols.sectionSumWidth(0, fixed.fxLeft);
    const fixedHeight = rows.sectionSumHeight(0, fixed.fxTop);

    let {
      left, top,
    } = selectorAttr;

    left -= index.width;
    left -= fixedWidth;

    top -= index.height;
    top -= fixedHeight;

    top -= scroll.y;
    left -= scroll.x;

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
    const { table } = this;
    const {
      fixed, cols, settings, content,
    } = table;
    const { scroll } = content;
    const { width, height } = selectorAttr;
    const { index } = settings;
    const fixedWidth = cols.sectionSumWidth(0, fixed.fxLeft);

    let {
      left, top,
    } = selectorAttr;

    left -= index.width;
    left -= fixedWidth;
    left -= scroll.x;

    top -= index.height;

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
    const { table } = this;
    const {
      fixed, rows, settings, content,
    } = table;
    const { scroll } = content;
    const { width, height } = selectorAttr;
    const { index } = settings;
    const fixedHeight = rows.sectionSumHeight(0, fixed.fxTop);

    let {
      left, top,
    } = selectorAttr;

    left -= index.width;

    top -= index.height;
    top -= fixedHeight;

    top -= scroll.y;
    left -= scroll.x;

    this.areaEl.offset({
      width: width - 4,
      height: height - 4,
      left,
      top,
    }).show();
  }
}

class L extends SelectorElement {
  setAreaOffset(selectorAttr) {
    const { table } = this;
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

class Selector extends Widget {
  constructor(table) {
    super(`${cssPrefix}-selector`);
    this.table = table;
    this.l = new L({ zIndex: zIndex += 1, table });
    this.t = new T({ zIndex: zIndex += 1, table });
    this.tl = new TL({ zIndex: zIndex += 1, table });
    this.br = new Br({ zIndex: zIndex += 1, table });
    this.br.show();
    this.children(this.l, this.t, this.tl, this.br).show();
    this.bind();
    this.setDivideLayer();
  }

  // ri top height
  getCellRowByY(eventY) {
    const { table } = this;
    const {
      fixed, rows, content,
    } = table;
    const fixedHeight = rows.sectionSumHeight(0, fixed.fxTop);

    if (eventY < fixedHeight) {
      // 鼠标在冻结区域
      let ri = 0;
      let top = 0;
      let height = 0;
      for (let i = 0; i <= fixed.fxTop; i += 1) {
        height = rows.getHeight(i);
        top += height;
        ri = i;
        if (top > eventY) break;
      }
      top -= height;
      return { ri, top, height };
    }

    // 鼠标在滚动区域
    const { scroll } = content;
    const viewRange = content.getViewRange();
    let ri = 0;
    let top = fixedHeight;
    let height = 0;

    for (let i = viewRange.sri; i <= viewRange.eri; i += 1) {
      height = rows.getHeight(i);
      top += height;
      ri = i;
      if (top > eventY) break;
    }
    top -= height;
    top += scroll.y;

    return { ri, top, height };
  }

  // ci left width
  getCellColByX(eventX) {
    const { table } = this;
    const {
      fixed, cols, content,
    } = table;
    const fixedWidth = cols.sectionSumWidth(0, fixed.fxLeft);

    if (eventX < fixedWidth) {
      // 鼠标在冻结区域
      let ci = 0;
      let left = 0;
      let width = 0;
      for (let i = 0; i <= fixed.fxLeft; i += 1) {
        width = cols.getWidth(i);
        left += width;
        ci = i;
        if (left > eventX) break;
      }
      left -= width;
      return { ci, left, width };
    }

    // 鼠标在滚动区域
    const { scroll } = content;
    const viewRange = content.getViewRange();
    let ci = 0;
    let left = fixedWidth;
    let width = 0;

    for (let i = viewRange.sci; i <= viewRange.eci; i += 1) {
      width = cols.getWidth(i);
      left += width;
      ci = i;
      if (left > eventX) break;
    }
    left -= width;
    left += scroll.x;

    return { ci, left, width };
  }

  // top height
  getMergeCellRowByY(rect) {
    const { table } = this;
    const {
      fixed, rows, content,
    } = table;
    const height = rows.sectionSumHeight(rect.sri, rect.eri);
    if (rect.sri <= fixed.fxTop) {
      // 合并单元格的起始坐标在固定区域中
      let top = rows.sectionSumHeight(0, rect.sri);
      top -= rows.getHeight(rect.sri);
      return { top, height };
    }
    // 合并单元格的起始坐标在滚动区域中
    const { scroll } = content;
    const viewRange = content.getViewRange();
    const fixedHeight = rows.sectionSumHeight(0, fixed.fxTop);
    let top = rows.sectionSumHeight(
      Math.min(rect.sri, viewRange.sri),
      Math.max(rect.sri, viewRange.sri),
    );
    top -= rows.getHeight(rect.sri);
    top = viewRange.sri > rect.sri ? top * -1 : top;
    top += scroll.y;
    top += fixedHeight;
    return { top, height };
  }

  // left width
  getMergeCellRowByX(rect) {
    const { table } = this;
    const {
      fixed, cols, content,
    } = table;
    const width = cols.sectionSumWidth(rect.sci, rect.eci);
    if (rect.sci <= fixed.fxLeft) {
      // 合并单元格的起始坐标在固定区域中
      let left = cols.sectionSumWidth(0, rect.sci);
      left -= cols.getWidth(rect.sci);
      return { left, width };
    }
    // 合并单元格的起始坐标在滚动区域中
    const { scroll } = content;
    const viewRange = content.getViewRange();
    const fixedWidth = cols.sectionSumWidth(0, fixed.fxLeft);
    let left = cols.sectionSumWidth(
      Math.min(rect.sci, viewRange.eci),
      Math.max(rect.sci, viewRange.eci),
    );
    left -= cols.getWidth(rect.sri);
    left = viewRange.sci > rect.sci ? left * -1 : left;
    left += scroll.x;
    left += fixedWidth;
    return { left, width };
  }

  // 获取发生鼠标事件的单元格信息
  getEventSelector(event) {
    const { table } = this;
    const { settings, merges } = table;
    const { index } = settings;
    let { x, y } = table.computerEventXy(event);
    y -= index.height;
    x -= index.width;
    let { ri, top, height } = this.getCellRowByY(y);
    let { ci, left, width } = this.getCellColByX(x);
    const rectRange = merges.getFirstIncludes(ri, ci);
    if (rectRange) {
      ({ sri: ri, sci: ci } = rectRange);
      ({ top, height } = this.getMergeCellRowByY(rectRange));
      ({ left, width } = this.getMergeCellRowByX(rectRange));
    }
    top += index.height;
    left += index.width;
    return {
      ri, ci, left, top, width, height,
    };
  }

  // 划分显示的区域
  setDivideLayer() {
    const { table } = this;
    const {
      fixed, rows, cols, settings,
    } = table;
    const { index } = settings;
    const fixedWidth = cols.sectionSumWidth(0, fixed.fxLeft);
    const fixedHeight = rows.sectionSumHeight(0, fixed.fxTop);
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

  scrollX() {

  }

  scrollY() {

  }

  bind() {
    const { table } = this;
    table.on(Constant.EVENT_TYPE.MOUSE_DOWN, (e) => {
      const selectorAttr = this.getEventSelector(e);
      // console.log('selectorAttr >>>', selectorAttr);
      this.br.setAreaOffset(selectorAttr);
      this.t.setAreaOffset(selectorAttr);
      this.l.setAreaOffset(selectorAttr);
      this.tl.setAreaOffset(selectorAttr);
    });
  }
}

export { Selector };
