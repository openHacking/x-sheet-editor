import { Utils } from '../../utils/Utils';
import { Code } from './tablebase/Code';
import { Rows } from './tablebase/Rows';
import { Cols } from './tablebase/Cols';
import { Fixed } from './tablebase/Fixed';
import { Scroll, SCROLL_TYPE } from './tablebase/Scroll';
import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { EventBind } from '../../utils/EventBind';
import { Scale, ScaleAdapter } from './tablebase/Scale';
import { XTableMousePointer } from './XTableMousePointer';
import { XTableKeyboard } from './XTableKeyboard';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { Screen } from './screen/Screen';
import { XTableFocus } from './XTableFocus';
import { SCREEN_SELECT_EVENT, ScreenSelector } from './screenwiget/selector/ScreenSelector';
import { ScreenAutoFill } from './screenwiget/autofill/ScreenAutoFill';
import { ScreenCopyStyle } from './screenwiget/copystyle/ScreenCopyStyle';
import { XDraw } from '../../canvas/XDraw';
import { RectRange } from './tablebase/RectRange';
import { XTableScrollView } from './XTableScrollView';
import { XTableAreaView } from './XTableAreaView';
import { XTableEdit } from './XTableEdit';
import { XTableStyle } from './XTableStyle';
import { XScreen } from './xscreen/XScreen';
import { XSelectItem } from './xscreenitems/xselect/XSelectItem';

class Dimensions {

  constructor(table) {
    this.table = table;
    this.scrollView = null;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
  }

  reset() {
    this.scrollView = null;
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

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { rows, cols } = table;
    const { fixed } = table;
    const view = new RectRange(0, 0, fixed.fxTop, fixed.fxLeft);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
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

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = index.getHeight();
    this.scrollView = scrollView;
    return scrollView.clone();
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

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { index } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = index.getWidth();
    this.scrollView = scrollView;
    return scrollView.clone();
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

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = fixed.fxTop;
    scrollView.h = rows.sectionSumHeight(scrollView.sci, scrollView.eci);
    this.scrollView = scrollView;
    return scrollView.clone();
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

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    this.scrollView = scrollView;
    return scrollView.clone();
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

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = fixed.fxLeft;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

// ================================= 快捷键 =================================

class KeyBoardTab {

  constructor(table) {
    const { keyboard, cols, rows, edit, screenSelector } = table;
    const merges = table.getTableMerges();
    let tabId = 0;
    let tabNext = null;
    keyboard.register({
      el: table,
      focus: true,
      stop: false,
      attr: {
        code: 9,
        callback: () => {
          edit.hideEdit();
          const { selectorAttr } = screenSelector;
          if (!selectorAttr) {
            return;
          }
          const id = selectorAttr;
          const rect = selectorAttr.rect.clone();
          if (tabId !== id) {
            const { sri, sci } = rect;
            tabId = id;
            tabNext = { sri, sci };
          }
          const cLen = cols.len - 1;
          const rLen = rows.len - 1;
          let { sri, sci } = tabNext;
          const srcMerges = merges.getFirstIncludes(sri, sci);
          if (srcMerges) {
            sci = srcMerges.eci;
          }
          if (sci >= cLen && sri >= rLen) {
            return;
          }
          if (sci >= cLen) {
            sri += 1;
            sci = 0;
          } else {
            sci += 1;
          }
          tabNext.sri = sri;
          tabNext.sci = sci;
          let eri = sri;
          let eci = sci;
          const targetMerges = merges.getFirstIncludes(sri, sci);
          if (targetMerges) {
            sri = targetMerges.sri;
            sci = targetMerges.sci;
            eri = targetMerges.eri;
            eci = targetMerges.eci;
          }
          rect.sri = sri;
          rect.sci = sci;
          rect.eri = eri;
          rect.eci = eci;
          screenSelector.selectorAttr.rect = rect;
          screenSelector.setOffset(screenSelector.selectorAttr);
          screenSelector.onChangeStack.forEach(cb => cb());
          screenSelector.onSelectChangeStack.forEach(cb => cb());
          edit.showEdit();
        },
      },
    });
  }

}

// ================================= XTable ================================

/**
 * XTable
 */
class XTableDimensions extends Widget {

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
        width: 50,
        gridColor: '#e8e8e8',
        size: 10,
        color: '#000000',
      },
      table: {
        showGrid: true,
        background: '#ffffff',
        borderColor: '#e5e5e5',
        gridColor: '#e8e8e8',
      },
      fixed: {
        fxTop: -1,
        fxLeft: -1,
      },
      rows: {
        len: 1000,
        height: 30,
        data: [],
      },
      cols: {
        len: 36,
        width: 90,
        data: [],
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
        goto: v => XDraw.cvCssPx(this.scale.goto(v)),
      }),
      ...this.settings.index,
    });
    this.rows = new Rows({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.cvCssPx(this.scale.goto(v)),
      }),
      ...this.settings.rows,
    });
    this.cols = new Cols({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.cvCssPx(this.scale.goto(v)),
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
    this.xTableStyle = new XTableStyle({
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
    this.focus = new XTableFocus(this);
    this.mousePointer = new XTableMousePointer(this);
    this.keyboard = new XTableKeyboard(this);
    this.screen = new Screen(this);
    this.xScreen = new XScreen(this);
    this.xReSizer = new XReSizer(this);
    this.yReSizer = new YReSizer(this);
    this.xHeightLight = new XHeightLight(this);
    this.yHeightLight = new YHeightLight(this);
    this.edit = new XTableEdit(this);
  }

  /**
   * 读取快照数据
   * @returns {TableDataSnapshot}
   */
  getTableDataSnapshot() {
    const { xTableStyle } = this;
    const { tableDataSnapshot } = xTableStyle;
    return tableDataSnapshot;
  }

  /**
   * 读取合并单元格
   */
  getTableMerges() {
    const { xTableStyle } = this;
    const { merges } = xTableStyle;
    return merges;
  }

  /**
   * 单元辅助实例
   * @returns {StyleCellsHelper}
   */
  getStyleCellsHelper() {
    const { xTableStyle } = this;
    const { styleCellsHelper } = xTableStyle;
    return styleCellsHelper;
  }

  /**
   * 单元辅助实例
   * @returns {OperateCellsHelper}
   */
  getOperateCellsHelper() {
    const { xTableStyle } = this;
    const { operateCellsHelper } = xTableStyle;
    return operateCellsHelper;
  }

  /**
   * 获取表格单元格
   * @returns {Cells}
   */
  getTableCells() {
    const { xTableStyle } = this;
    const { cells } = xTableStyle;
    return cells;
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
        if (total >= left) break;
      }
    } else if (x > index.getWidth()) {
      let total = fixedWidth;
      const viewRange = this.getScrollView();
      for (let i = viewRange.sci; i <= viewRange.eci; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total >= left) break;
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
   * onAttach
   */
  onAttach() {
    const { xTableStyle } = this;
    this.attach(xTableStyle);
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
    // this.attach(this.screen);
    this.attach(this.xScreen);
    this.attach(this.xReSizer);
    this.attach(this.yReSizer);
    this.attach(this.xHeightLight);
    this.attach(this.yHeightLight);
    this.attach(this.edit);
    //
    this.xScreen.addItem(new XSelectItem(this));
    // 注册快捷键
    this.keyBoardTab = new KeyBoardTab(this);
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
    this.scrolling();
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
    this.scrolling();
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
      xTableStyle,
    } = this;
    this.visualHeightCache = null;
    this.visualWidthCache = null;
    this.reset();
    xTableStyle.resize();
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
   * 设置缩放比
   */
  setScale(val) {
    const { xTableStyle } = this;
    this.reset();
    this.scale.setValue(val);
    this.screen.setDivideLayer();
    this.xHeightLight.setSize();
    this.yHeightLight.setSize();
    xTableStyle.setScale(val);
    this.trigger(Constant.TABLE_EVENT_TYPE.SCALE_CHANGE);
  }

  /**
   * 渲染静态界面
   */
  render() {
    const { xTableStyle } = this;
    xTableStyle.render();
  }

  /**
   * 渲染滚动界面
   */
  scrolling() {
    const { xTableStyle } = this;
    this.reset();
    xTableStyle.scrolling();
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
  }

}

export {
  XTableDimensions,
};
