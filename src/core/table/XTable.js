import { XTableImage } from './XTableImage';
import { Utils } from '../../utils/Utils';
import { Code } from './tablebase/Code';
import { Rows } from './tablebase/Rows';
import { Cols } from './tablebase/Cols';
import { Fixed } from './tablebase/Fixed';
import { Scroll, SCROLL_TYPE } from './tablebase/Scroll';
import { XTableAreaView, XTableScrollView } from './XTableScrollView';
import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { EventBind } from '../../utils/EventBind';

class Dimensions {

  constructor(table) {
    this.table = table;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
  }

  reset() {
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
  }

  getX() {
    throw new TypeError('child impl');
  }

  getY() {
    throw new TypeError('child impl');
  }

  getHeight() {
    throw new TypeError('child impl');
  }

  getWidth() {
    throw new TypeError('child impl');
  }

}

// ============================== 表格区域信息 ===============================

class XTableFrozenContent extends Dimensions {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const width = rows.sectionSumHeight(0, fixed.fxLeft);
    this.width = width;
    return width;
  }

  getHeight() {
    if (Utils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const height = rows.sectionSumHeight(0, fixed.fxTop);
    this.height = height;
    return height;
  }

  getX() {
    if (Utils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

}

class XTableTopIndex extends Dimensions {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (Utils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { index } = table;
    const height = index.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (Utils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const y = 0;
    this.y = y;
    return y;
  }

}

class XTableLeftIndex extends Dimensions {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const width = index.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (Utils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (Utils.isNumber(this.x)) {
      return this.x;
    }
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

}

class XTableTop extends Dimensions {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (Utils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const height = rows.sectionSumHeight(0, fixed.fxTop);
    this.height = height;
    return height;
  }

  getX() {
    if (Utils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

}

class XTableContent extends Dimensions {

  getX() {
    super.getX();
  }

  getY() {
    super.getY();
  }

  getHeight() {
    super.getHeight();
  }

  getWidth() {
    super.getWidth();
  }

}

class XTableLeft extends Dimensions {

  getX() {
    super.getX();
  }

  getY() {
    super.getY();
  }

  getHeight() {
    super.getHeight();
  }

  getWidth() {
    super.getWidth();
  }

}

// ================================= XTable ================================

/**
 * XTable
 */
class XTable extends Widget {

  /**
   * XTable
   * @param settings
   */
  constructor({
    settings,
  }) {
    super(`${cssPrefix}-table`);
    // 表格设置
    this.settings = Utils.mergeDeep({
      index: {
        height: 25,
        width: 40,
        gridColor: '#c4c4c4',
        size: 9,
        color: '#000000',
      },
      table: {
        showGrid: true,
        background: '#ffffff',
        borderColor: '#e5e5e5',
        gridColor: '#c5c5c5',
      },
      fixed: {
        fxTop: -1,
        fxLeft: -1,
      },
      rows: {
        len: 1000,
        height: 28,
      },
      cols: {
        len: 26,
        width: 110,
      },
    }, settings);
    // 表格数据配置
    this.index = new Code(this.settings.index);
    this.rows = new Rows(this.settings.rows);
    this.cols = new Cols(this.settings.cols);
    // 冻结视图坐标
    this.fixed = new Fixed(this.settings.fixed);
    // 滚动视图的坐标
    this.scroll = new Scroll({
      fixed: this.fixed,
    });
    // 表格滚动区域
    this.xTableScrollView = new XTableScrollView({
      scroll: this.scroll,
      rows: this.rows,
      cols: this.cols,
      getHeight: () => this.xContent.getHeight(),
      getWidth: () => this.xContent.getWidth(),
    });
    // 表格视图区域
    this.xTableAreaView = new XTableAreaView({
      xTableScrollView: this.xTableScrollView,
      rows: this.rows,
      cols: this.cols,
      scroll: this.scroll,
    });
    // table 区域
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    this.xTableFrozenContent = new XTableFrozenContent(this);
    // 表格界面
    this.xTableImage = new XTableImage({
      xTableScrollView: this.xTableScrollView,
      settings,
      scroll: this.scroll,
      fixed: this.fixed,
    });
    // 视口区域大小
    this.visualHeightCache = null;
    this.visualWidthCache = null;
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

  /**
   * onAttach
   */
  onAttach() {
    const { xTable } = this;
    this.attach(xTable);
  }

  /**
   * 重置变量区域
   */
  reset() {
    const { xTableAreaView } = this;
    xTableAreaView.reset();
  }

  /**
   * 事件绑定
   */
  bind() {
    const { xTableImage } = this;
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.reset();
      this.render();
    });
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.reset();
      this.render();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      xTableImage.scroll();
    });
  }

  /**
   * 可视区域高度
   * @return {*}
   */
  visualHeight() {
    if (Utils.isNumber(this.visualHeightCache)) {
      return this.visualHeightCache;
    }
    const height = this.box().height;
    this.visualHeightCache = height;
    return height;
  }

  /**
   * 可视区域宽度
   * @return {*}
   */
  visualWidth() {
    if (Utils.isNumber(this.visualWidthCache)) {
      return this.visualWidthCache;
    }
    const width = this.box().width;
    this.visualWidthCache = width;
    return width;
  }

  /**
   * 获取指定单元格下的行列
   * @param x
   * @param y
   * @returns {{ci: number, ri: number}}
   */
  getRiCiByXy(x, y) {
    const {
      fixed, rows, cols,
    } = this;
    const { index } = this;
    const fixedHeight = this.getFixedHeight();
    const fixedWidth = this.getFixedWidth();

    let [left, top] = [x, y];
    let [ci, ri] = [-1, -1];

    left -= index.getWidth();
    top -= index.getHeight();

    // left
    if (left <= fixedWidth && x > index.getWidth()) {
      let total = 0;
      for (let i = 0; i <= fixed.fxLeft; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total > left) break;
      }
    } else if (x > index.getWidth()) {
      let total = fixedWidth;
      const viewRange = this.getScrollView();
      for (let i = viewRange.sci; i <= viewRange.eci; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total > left) break;
      }
    }

    // top
    if (top < fixedHeight && y > index.getHeight()) {
      let total = 0;
      for (let i = 0; i <= fixed.fxTop; i += 1) {
        const height = rows.getHeight(i);
        total += height;
        ri = i;
        if (total > top) break;
      }
    } else if (y > index.getHeight()) {
      let total = fixedHeight;
      const viewRange = this.getScrollView();
      for (let i = viewRange.sri; i <= viewRange.eri; i += 1) {
        const height = rows.getHeight(i);
        total += height;
        ri = i;
        if (total > top) break;
      }
    }

    return {
      ri, ci,
    };
  }

  /**
   * 固定区域高度
   * @returns {*}
   */
  getFixedHeight() {
    const { xTop } = this;
    return xTop.getHeight();
  }

  /**
   * 固定区域宽度
   */
  getFixedWidth() {
    const { xLeft } = this;
    return xLeft.getWidth();
  }

  /**
   * 索引栏高度
   * @returns {*}
   */
  getIndexHeight() {
    const { index } = this;
    return index.getHeight();
  }

  /**
   * 索引栏宽度
   * @returns {*}
   */
  getIndexWidth() {
    const { index } = this;
    return index.getWidth();
  }

  /**
   * 获取滚动视图
   * @returns {RectRange}
   */
  getScrollView() {
    const { xTableAreaView } = this;
    return xTableAreaView.getScrollView();
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
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
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
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
    scroll.type = SCROLL_TYPE.UN;
  }

  /**
   * 获取向上滚动的距离
   * @returns {*}
   */
  getTop() {
    const { rows } = this;
    const view = this.getScrollView();
    return rows.sectionSumHeight(0, view.sri - 1);
  }

  /**
   * 获取向左滚动的距离
   * @returns {*}
   */
  getLeft() {
    const { cols } = this;
    const view = this.getScrollView();
    return cols.sectionSumWidth(0, view.sci - 1);
  }

}

export { XTable };
