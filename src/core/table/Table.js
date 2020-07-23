import { RENDER_MODE, XTable } from './XTable';
import { Utils } from '../../utils/Utils';
import { SCROLL_TYPE } from './base/Scroll';
import { Constant } from '../../const/Constant';

/**
 * Table
 */
class Table {

  /**
   * Table
   * @param settings
   */
  constructor(settings) {
    this.xTable = new XTable(settings);
  }

  /**
   * 获取头部高度
   */
  getTop() {
    const { rows } = this;
    const view = this.getScrollView();
    return rows.sectionSumHeight(0, view.sri - 1);
  }

  /**
   * 获取左边宽度
   */
  getLeft() {
    const { cols } = this;
    const view = this.getScrollView();
    return cols.sectionSumWidth(0, view.sci - 1);
  }

  /**
   * 水平滚动
   * @param x
   */
  scrollX(x) {
    const {
      cols, fixed, scroll,
    } = this;
    let { fxLeft } = fixed;
    fxLeft += 1;
    const [
      ci, left, width,
    ] = Utils.rangeReduceIf(fxLeft, cols.len, 0, 0, x, i => cols.getWidth(i));
    let x1 = left;
    if (x > 0) x1 += width;
    let type;
    if (scroll.x > x1) {
      type = SCROLL_TYPE.H_LEFT;
    } else if (scroll.x < x1) {
      type = SCROLL_TYPE.H_RIGHT;
    }
    scroll.type = type;
    scroll.ci = ci;
    scroll.x = x1;
    this.renderMode = RENDER_MODE.SCROLL;
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
    this.renderMode = RENDER_MODE.RENDER;
    scroll.type = SCROLL_TYPE.UN;
  }

  /**
   * 垂直滚动
   * @param y
   */
  scrollY(y) {
    const {
      rows, fixed, scroll,
    } = this;
    let { fxTop } = fixed;
    fxTop += 1;
    const [
      ri, top, height,
    ] = Utils.rangeReduceIf(fxTop, rows.len, 0, 0, y, i => rows.getHeight(i));
    let y1 = top;
    if (y > 0) y1 += height;
    let type;
    if (scroll.y > y1) {
      type = SCROLL_TYPE.V_TOP;
    } else if (scroll.y < y1) {
      type = SCROLL_TYPE.V_BOTTOM;
    }
    scroll.type = type;
    scroll.ri = ri;
    scroll.y = y1;
    this.renderMode = RENDER_MODE.SCROLL;
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
    this.renderMode = RENDER_MODE.RENDER;
    scroll.type = SCROLL_TYPE.UN;
  }

  /**
   * 滚动视图的高度
   * @returns {*}
   */
  getScrollTotalHeight() {
    const { fixed } = this;
    const { rows } = this;
    let height;
    if (fixed.fxTop > -1) {
      height = rows.sectionSumHeight(fixed.fxTop, rows.len - 1);
    } else {
      height = rows.sectionSumHeight(0, rows.len - 1);
    }
    return height;
  }

  /**
   * 滚动视图的宽度
   * @returns {*}
   */
  getScrollTotalWidth() {
    const { fixed } = this;
    const { cols } = this;
    let width;
    if (fixed.fxTop > -1) {
      width = cols.sectionSumWidth(fixed.fxLeft, cols.len - 1);
    } else {
      width = cols.sectionSumWidth(0, cols.len - 1);
    }
    return width;
  }

}

export { Table };
