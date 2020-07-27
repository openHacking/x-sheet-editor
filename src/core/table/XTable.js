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
import { Scale, ScaleAdapter } from './tablebase/Scale';
import { MousePointer } from './MousePointer';
import { Keyboard } from './Keyboard';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { Screen } from './screen/Screen';
import { Edit } from './Edit';
import { Focus } from './Focus';
import { SCREEN_SELECT_EVENT, ScreenSelector } from './screenwiget/selector/ScreenSelector';
import { ScreenAutoFill } from './screenwiget/autofill/ScreenAutoFill';
import { ScreenCopyStyle } from './screenwiget/copystyle/ScreenCopyStyle';

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

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const { xLeft } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
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
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

}

class XTableLeft extends Dimensions {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { cols } = table;
    const { fixed } = table;
    const width = cols.sectionSumWidth(0, fixed.fxLeft);
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
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
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
        height: 30,
        width: 40,
        gridColor: '#c4c4c4',
        size: 10,
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
        len: 36,
        width: 128,
      },
      data: [],
      merge: {},
    }, settings);
    // 视口区域大小
    this.visualHeightCache = null;
    this.visualWidthCache = null;
    // 表格数据配置
    this.scale = new Scale();
    this.index = new Code({
      scaleAdapter: new ScaleAdapter({
        goto: v => this.scale.goto(v),
      }),
      ...this.settings.index,
    });
    this.rows = new Rows({
      scaleAdapter: new ScaleAdapter({
        goto: v => this.scale.goto(v),
      }),
      ...this.settings.rows,
    });
    this.cols = new Cols({
      scaleAdapter: new ScaleAdapter({
        goto: v => this.scale.goto(v),
      }),
      ...this.settings.cols,
    });
    // 冻结视图坐标
    this.fixed = new Fixed(this.settings.fixed);
    // 滚动视图的坐标
    this.scroll = new Scroll({
      fixed: this.fixed,
    });
    // 表格滚动视图
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
    // 表格界面
    this.xTableImage = new XTableImage({
      xTableScrollView: this.xTableScrollView,
      settings: this.settings,
      scroll: this.scroll,
      fixed: this.fixed,
    });
    // table区域
    this.xTableFrozenContent = new XTableFrozenContent(this);
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    // table组件
    this.focus = new Focus(this);
    this.mousePointer = new MousePointer(this);
    this.keyboard = new Keyboard(this);
    this.screen = new Screen(this);
    this.xReSizer = new XReSizer(this);
    this.yReSizer = new YReSizer(this);
    this.xHeightLight = new XHeightLight(this);
    this.yHeightLight = new YHeightLight(this);
    this.edit = new Edit(this);
  }

  /**
   * 读取快照数据
   * @returns {TableDataSnapshot}
   */
  getTableDataSnapshot() {
    const { xTableImage } = this;
    const { tableDataSnapshot } = xTableImage;
    return tableDataSnapshot;
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
   * 获取内容区域宽度
   */
  getContentWidth() {
    const { xContent } = this;
    return xContent.getWidth();
  }

  /**
   * 获取内容区域高度
   */
  getContentHeight() {
    const { xContent } = this;
    return xContent.getHeight();
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
   * 索引栏高度
   * @returns {*}
   */
  getIndexHeight() {
    const { index } = this;
    return index.getHeight();
  }

  /**
   * 固定区域宽度
   */
  getFixedWidth() {
    const { xLeft } = this;
    return xLeft.getWidth();
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
   * 重置变量区
   */
  reset() {
    const { xTableAreaView } = this;
    const { xTableFrozenContent } = this;
    const { xLeftIndex } = this;
    const { xTopIndex } = this;
    const { xLeft } = this;
    const { xTop } = this;
    const { xContent } = this;
    xTableAreaView.reset();
    xTableFrozenContent.reset();
    xLeftIndex.reset();
    xTopIndex.reset();
    xLeft.reset();
    xTop.reset();
    xContent.reset();
  }

  /**
   * onAttach
   */
  onAttach() {
    const { xTableImage } = this;
    this.attach(xTableImage);
    this.bind();
    // 表格组件
    const tableDataSnapshot = this.getTableDataSnapshot();
    this.screenSelector = new ScreenSelector(this.screen);
    this.screenAutoFill = new ScreenAutoFill(this.screen, {
      onBeforeAutoFill: () => {
        tableDataSnapshot.begin();
      },
      onAfterAutoFill: () => {
        tableDataSnapshot.end();
      },
    });
    this.copyStyle = new ScreenCopyStyle(this.screen, {});
    this.screen.addWidget(this.screenSelector);
    this.screen.addWidget(this.screenAutoFill);
    this.screen.addWidget(this.copyStyle);
    this.screenSelector.on(SCREEN_SELECT_EVENT.SELECT_CHANGE, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
    });
    this.screenSelector.on(SCREEN_SELECT_EVENT.DOWN_SELECT, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN);
    });
    this.attach(this.screen);
    this.attach(this.xReSizer);
    this.attach(this.yReSizer);
    this.attach(this.xHeightLight);
    this.attach(this.yHeightLight);
    this.attach(this.edit);
  }

  /**
   * 事件绑定
   */
  bind() {
    const { mousePointer } = this;
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.resize();
    });
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.resize();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.scrolling();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      const { x, y } = this.computeEventXy(e);
      const { ri, ci } = this.getRiCiByXy(x, y);
      if (ri === -1) {
        const { type, key } = Constant.MOUSE_POINTER_TYPE.SELECT_ONE_COLUMN;
        mousePointer.set(type, key);
        return;
      }
      if (ci === -1) {
        const { type, key } = Constant.MOUSE_POINTER_TYPE.SELECT_ONE_ROW;
        mousePointer.set(type, key);
        return;
      }
      const { type, key } = Constant.MOUSE_POINTER_TYPE.SELECT_CELL;
      mousePointer.set(type, key);
    });
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

  /**
   * 重置界面大小
   */
  resize() {
    const {
      xTableImage,
    } = this;
    this.visualHeightCache = null;
    this.visualWidthCache = null;
    this.reset();
    xTableImage.resize();
  }

  /**
   * 渲染滚动界面
   */
  scrolling() {
    const { xTableImage } = this;
    // this.reset();
    xTableImage.scrolling();
  }

  /**
   * 渲染静态界面
   */
  render() {
    const { xTableImage } = this;
    xTableImage.render();
  }

  /**
   * 设置缩放比
   */
  setScale(val) {
    const { xTableImage, scale } = this;
    this.reset();
    scale.setValue(val);
    xTableImage.setScale(val);
  }

}

export { XTable };
