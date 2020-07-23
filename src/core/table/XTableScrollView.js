import { Utils } from '../../utils/Utils';
import { SCROLL_TYPE } from './base/Scroll';
import { RectRange } from './base/RectRange';

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
   * @param rows
   * @param cols
   * @param scroll
   * @param xContent
   */
  constructor({
    rows,
    cols,
    scroll,
    xContent,
  }) {
    this.xContent = xContent;
    this.rows = rows;
    this.cols = cols;
    this.scroll = scroll;
    // 上一次滚动的视图
    this.lastScrollView = null;
    // 滚动视图和内容视图
    this.scrollEnterView = null;
    this.scrollView = null;
    // 滚动进入的视图和离开的视图
    this.enterView = null;
    this.leaveView = null;
  }

  /**
   * 记录上一次视图
   */
  record() {
    this.lastScrollView = this.scrollView;
  }

  /**
   * 清空上一次视图记录
   */
  undo() {
    this.lastScrollView = null;
  }

  /**
   * 重置变量区
   */
  reset() {
    this.scrollEnterView = null;
    this.scrollView = null;
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
   * 当前视图滚动区域
   * @returns {RectRange}
   */
  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const {
      rows, cols, scroll, xContent,
    } = this;
    let [width, height] = [0, 0];
    const { ri, ci } = scroll;
    let [eri, eci] = [rows.len, cols.len];
    for (let i = ri; i < rows.len; i += 1) {
      height += rows.getHeight(i);
      eri = i;
      if (height > xContent.getHeight()) break;
    }
    for (let j = ci; j < cols.len; j += 1) {
      width += cols.getWidth(j);
      eci = j;
      if (width > xContent.getWidth()) break;
    }
    const scrollView = new RectRange(ri, ci, eri, eci);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

  /**
   * 获取滚动离开的视图区域
   * @returns {null|RectRange}
   */
  getLeaveView() {
    if (Utils.isNotUnDef(this.leaveView)) {
      return this.leaveView.clone();
    }
    const { lastScrollView } = this;
    const { scrollView } = this;
    if (lastScrollView) {
      const [leaveView] = lastScrollView.coincideDifference(scrollView);
      if (leaveView) {
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
    const { lastScrollView } = this;
    const { scrollView } = this;
    if (lastScrollView) {
      const [enterView] = scrollView.coincideDifference(lastScrollView);
      if (enterView) {
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
    const { scroll } = this;
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
      this.scrollEnterView = enterView;
      return enterView.clone();
    }
    return null;
  }

}

export {
  XTableScrollView, VIEW_MODE,
};
