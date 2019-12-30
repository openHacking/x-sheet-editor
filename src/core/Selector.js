import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { SelectorElement } from './SelectorElement';
import { Constant } from '../utils/Constant';

let zIndex = 1;

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

    let { left, top } = selectorAttr;

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

    let { left, top } = selectorAttr;

    left -= index.width;

    top -= index.height;
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
    left -= scroll.x;

    top -= index.height;
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

class Selector extends Widget {
  /**
   * Selector
   * @param table
   */
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

  /**
   * 获取发生鼠标事件的单元格信息
   * @param event
   * @returns {{top: *, left: *, ci: number, ri: number, width: *, height: *}}
   */
  getEventSelector(event) {
    const { table } = this;
    const {
      merges, cols, rows,
    } = table;
    const { x, y } = table.computeEventXy(event);
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

  /**
   * 划分显示的区域
   */
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

  /**
   * 绑定事件
   */
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
