import { Utils } from '../../utils/Utils';
import { SCROLL_TYPE } from './tablebase/Scroll';
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
    // 视图无变化
    if (Utils.isUnDef(lastView)) {
      return VIEW_MODE.CHANGE_NOT;
    }
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

/**
 * TableAreaView
 */
class XTableAreaView {

  /**
   * TableAreaView
   * @param xTableScrollView
   * @param rows
   * @param cols
   * @param scroll
   */
  constructor({
    xTableScrollView,
    rows,
    cols,
    scroll,
  }) {
    this.xTableScrollView = xTableScrollView;
    this.scroll = scroll;
    this.rows = rows;
    this.cols = cols;
    this.scrollView = null;
  }

  /**
   * 重置变量区
   */
  reset() {
    this.scrollView = null;
  }

  /**
   * 当前视图滚动区域
   * @returns {RectRange}
   */
  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { xTableScrollView } = this;
    const { cols, rows } = this;
    const scrollView = xTableScrollView.getScrollView();
    scrollView.w = cols.rectRangeSumWidth(scrollView);
    scrollView.h = rows.rectRangeSumHeight(scrollView);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

/**
 * XTableHistoryAreaView
 */
class XTableHistoryAreaView extends XTableAreaView {

  /**
   * XTableHistoryAreaView
   * @param xTableScrollView
   * @param rows
   * @param cols
   * @param scroll
   */
  constructor({
    xTableScrollView,
    rows,
    cols,
    scroll,
  }) {
    super({
      xTableScrollView,
      rows,
      cols,
      scroll,
    });
    this.lastScrollView = null;
    this.enterView = null;
    this.scrollEnterView = null;
    this.leaveView = null;
  }

  /**
   * 重置变量区
   */
  reset() {
    super.reset();
    this.scrollEnterView = null;
    this.enterView = null;
    this.leaveView = null;
  }

  /**
   * 获取上一次滚动的视图区域
   * @returns {null|RectRange}
   */
  getLastScrollView() {
    if (Utils.isNotUnDef(this.lastScrollView)) {
      return this.lastScrollView.clone();
    }
    return null;
  }

  /**
   * 获取滚动离开的视图区域
   * @returns {null|RectRange}
   */
  getLeaveView() {
    if (Utils.isNotUnDef(this.leaveView)) {
      return this.leaveView.clone();
    }
    const lastScrollView = this.getLastScrollView();
    const scrollView = this.getScrollView();
    const { cols, rows } = this;
    if (lastScrollView) {
      const [leaveView] = lastScrollView.coincideDifference(scrollView);
      if (leaveView) {
        leaveView.w = cols.rectRangeSumWidth(leaveView);
        leaveView.h = rows.rectRangeSumHeight(leaveView);
        this.leaveView = leaveView;
        return leaveView.clone();
      }
    }
    return null;
  }

  /**
   * 获取滚动进入的视图区域
   * @returns {null|RectRange}
   */
  getEnterView() {
    if (Utils.isNotUnDef(this.enterView)) {
      return this.enterView.clone();
    }
    const lastScrollView = this.getLastScrollView();
    const scrollView = this.getScrollView();
    const { cols, rows } = this;
    if (lastScrollView) {
      const [enterView] = scrollView.coincideDifference(lastScrollView);
      if (enterView) {
        enterView.w = cols.rectRangeSumWidth(enterView);
        enterView.h = rows.rectRangeSumHeight(enterView);
        this.enterView = enterView;
        return enterView.clone();
      }
    }
    return null;
  }

  /**
   * 获取滚动进入的视图区域
   * @returns {null|RectRange}
   */
  getScrollEnterView() {
    if (Utils.isNotUnDef(this.scrollEnterView)) {
      return this.scrollEnterView.clone();
    }
    const { cols, rows, scroll } = this;
    const enterView = this.getEnterView();
    if (enterView) {
      switch (scroll.type) {
        case SCROLL_TYPE.H_RIGHT: {
          enterView.sci -= 1;
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          enterView.sri -= 1;
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          enterView.eci += 1;
          break;
        }
        case SCROLL_TYPE.V_TOP: {
          enterView.eri += 1;
          break;
        }
      }
      enterView.w = cols.rectRangeSumWidth(enterView);
      enterView.h = rows.rectRangeSumHeight(enterView);
      this.scrollEnterView = enterView;
      return enterView.clone();
    }
    return null;
  }

  /**
   * 清空上一次视图记录
   */
  undo() {
    this.lastScrollView = null;
  }

  /**
   * 记录上一次视图
   */
  record() {
    this.lastScrollView = this.scrollView;
  }

}

export {
  XTableScrollView,
  VIEW_MODE,
  XTableAreaView,
  XTableHistoryAreaView,
};
