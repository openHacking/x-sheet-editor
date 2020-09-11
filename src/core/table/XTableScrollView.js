import { Utils } from '../../utils/Utils';
import { RectRange } from './tablebase/RectRange';

const VIEW_MODE = {
  CHANGE_ADD: Symbol('change_add'),
  CHANGE_NOT: Symbol('change_not'),
  STATIC: Symbol('static'),
  BOUND_OUT: Symbol('bound_out'),
};

/**
 * XTableScrollView
 */
class XTableScrollView {

  /**
   * 视图类型
   * @param lastView
   * @param view
   * @return {symbol}
   */
  static viewMode(lastView, view) {
    if (Utils.isUnDef(lastView)) {
      return VIEW_MODE.CHANGE_NOT;
    }
    // 视图无变化
    if (view.equals(lastView)) {
      return VIEW_MODE.STATIC;
    }
    // 视图不相交
    if (view.coincide(lastView).equals(RectRange.EMPTY)) {
      return VIEW_MODE.BOUND_OUT;
    }
    // 无新增加的视图区域
    if (view.within(lastView)) {
      return VIEW_MODE.CHANGE_NOT;
    }
    // 有新增的视图区域
    return VIEW_MODE.CHANGE_ADD;
  }

  /**
   * XTableScrollView
   * @param scroll
   * @param rows
   * @param cols
   * @param getHeight
   * @param getWidth
   */
  constructor({
    scroll,
    rows,
    cols,
    getHeight = () => 0,
    getWidth = () => 0,
  }) {
    this.scroll = scroll;
    this.rows = rows;
    this.cols = cols;
    this.getHeight = getHeight;
    this.getWidth = getWidth;
  }

  /**
   * 当前视图滚动区域
   * @returns {RectRange}
   */
  getScrollView() {
    const {
      rows, cols, scroll, getHeight, getWidth,
    } = this;
    const { ri, ci } = scroll;
    let [width, height] = [0, 0];
    let [eri, eci] = [rows.len, cols.len];
    for (let i = ri; i < rows.len; i += 1) {
      height += rows.getHeight(i);
      eri = i;
      if (height >= getHeight()) break;
    }
    for (let j = ci; j < cols.len; j += 1) {
      width += cols.getWidth(j);
      eci = j;
      if (width >= getWidth()) break;
    }
    return new RectRange(ri, ci, eri, eci);
  }

}

export {
  XTableScrollView,
  VIEW_MODE,
};
