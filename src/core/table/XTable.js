import { Utils } from '../../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Merges } from './Merges';
import { Scroll, SCROLL_TYPE } from './Scroll';
import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../constant/Constant';
import { Draw, npx } from '../../canvas/Draw';
import { Line, LINE_TYPE } from '../../canvas/Line';
import { Grid } from '../../canvas/Grid';
import { LineHandle } from './gridborder/LineHandle';
import { BorderLineHandle } from './gridborder/BorderLineHandle';
import { GridLineHandle } from './gridborder/GridLineHandle';
import { Fixed } from './Fixed';
import { Crop } from '../../canvas/Crop';
import { Rect } from '../../canvas/Rect';
import { ALIGN, Font, TEXT_WRAP } from '../../canvas/Font';
import Format from './Format';
import { Box } from '../../canvas/Box';
import { RectRange } from './RectRange';
import { EventBind } from '../../utils/EventBind';
import { CellsHelper } from './CellsHelper';
import { Cells } from './cells/Cells';
import { TableDataSnapshot } from './datasnapshot/TableDataSnapshot';
import { Screen } from './screen/Screen';
import { ScreenSelector } from './screenwiget/selector/ScreenSelector';

const RENDER_MODE = {
  SCROLL: Symbol('scroll'),
  RENDER: Symbol('render'),
};

const VIEW_MODE = {
  CHANGE: Symbol('change'),
  OUT: Symbol('out'),
  STATIC: Symbol('static'),
};

// ================== 表格滚动视图 ==================

class XTableScrollView {

  constructor(table) {
    this.table = table;
    // 上一次滚动的视图
    this.lastScrollView = null;
    // 滚动视图和内容视图
    this.scrollEnterView = null;
    this.scrollView = null;
    // 滚动进入的视图和离开的视图
    this.enterView = null;
    this.leaveView = null;
  }

  reset() {
    this.lastScrollView = this.scrollView;
    this.scrollEnterView = null;
    this.scrollView = null;
    this.enterView = null;
    this.leaveView = null;
  }

  getLastScrollView() {
    if (Utils.isNotUnDef(this.lastScrollView)) {
      return this.lastScrollView.clone();
    }
    return null;
  }

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const {
      rows, cols, scroll, xContent,
    } = table;
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
    const scrollView = new RectRange(ri, ci, eri, eci, width, height);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

  getLeaveView() {
    if (Utils.isNotUnDef(this.leaveView)) {
      return this.leaveView.clone();
    }
    const { lastScrollView } = this;
    const { scrollView } = this;
    const { table } = this;
    const { cols, rows } = table;
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

  getEnterView() {
    if (Utils.isNotUnDef(this.enterView)) {
      return this.enterView.clone();
    }
    const { lastScrollView } = this;
    const { scrollView } = this;
    const { table } = this;
    const { cols, rows } = table;
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

  getScrollEnterVIew() {
    if (Utils.isNotUnDef(this.scrollEnterView)) {
      return this.scrollEnterView.clone();
    }
    const { table } = this;
    const { cols, rows, scroll } = table;
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
   * 视图类型
   * @param lastView
   * @param view
   * @return {symbol}
   */
  static viewMode(lastView, view) {
    if (Utils.isUnDef(lastView)) {
      return VIEW_MODE.STATIC;
    }
    if (view.equals(lastView)) {
      return VIEW_MODE.STATIC;
    }
    if (view.coincide(lastView).equals(RectRange.EMPTY)) {
      return VIEW_MODE.OUT;
    }
    return VIEW_MODE.CHANGE;
  }

}

// ================= 表格绘制抽象类 =================

class XTableDraw {

  constructor(table) {
    this.table = table;

    this.width = null;
    this.height = null;

    this.x = null;
    this.y = null;

    this.drawX = null;
    this.drawY = null;

    this.mapOriginX = null;
    this.mapOriginY = null;
    this.mapTargetX = null;
    this.mapTargetY = null;
    this.mapWidth = null;
    this.mapHeight = null;

    this.fullScrollView = null;
    this.scrollVIew = null;

    this.viewMode = null;
  }

  /**
   * 重置变量区
   */
  reset() {
    this.width = null;
    this.height = null;

    this.x = null;
    this.y = null;

    this.drawX = null;
    this.drawY = null;

    this.mapOriginX = null;
    this.mapOriginY = null;
    this.mapTargetX = null;
    this.mapTargetY = null;
    this.mapWidth = null;
    this.mapHeight = null;

    this.fullScrollView = null;
    this.scrollVIew = null;

    this.viewMode = null;
  }

  /**
   * 绘制区域宽度
   * @returns {number}
   */
  getWidth() {
    throw new TypeError('getWidth child impl');
  }

  /**
   * 绘制区域高度
   * @returns {number}
   */
  getHeight() {
    throw new TypeError('getHeight child impl');
  }

  /**
   * 绘制区域的X坐标
   * @returns {number}
   */
  getX() {
    throw new TypeError('getX child impl');
  }

  /**
   * 绘制区域Y坐标
   * @returns {number}
   */
  getY() {
    throw new TypeError('getY child impl');
  }

  /**
   * 绘制内容的X坐标
   */
  getDrawX() {
    if (Utils.isNumber(this.drawX)) {
      return this.drawX;
    }
    const { table } = this;
    const x = this.getX();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.drawX = x;
      return x;
    }
    if (this.getViewMode() === VIEW_MODE.OUT) {
      this.drawX = x;
      return x;
    }
    const { scroll } = table;
    const scrollView = this.getScrollView();
    const fullScrollView = this.getFullScrollView();
    let drawX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT: {
        drawX = fullScrollView.w - scrollView.w;
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        drawX = 0;
        break;
      }
    }
    drawX = x + drawX;
    this.drawX = drawX;
    return drawX;
  }

  /**
   * 绘制内容的Y坐标
   */
  getDrawY() {
    if (Utils.isNumber(this.drawY)) {
      return this.drawY;
    }
    const { table } = this;
    const y = this.getY();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.drawY = y;
      return y;
    }
    if (this.getViewMode() === VIEW_MODE.OUT) {
      this.drawY = y;
      return y;
    }
    const { scroll } = table;
    const scrollView = this.getScrollView();
    const fullScrollView = this.getFullScrollView();
    let drawY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        drawY = fullScrollView.h - scrollView.h;
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        drawY = 0;
        break;
      }
    }
    drawY = y + drawY;
    this.drawY = drawY;
    return drawY;
  }

  /**
   * 绘制贴图的原始X坐标
   */
  getMapOriginX() {
    if (Utils.isNumber(this.mapOriginX)) {
      return this.mapOriginX;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { scroll } = table;
    const x = this.getX();
    let mapOriginX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_LEFT: {
        mapOriginX = 0;
        break;
      }
      case SCROLL_TYPE.H_RIGHT: {
        const leaveView = xTableScrollView.getLeaveView();
        mapOriginX = leaveView.w;
        break;
      }
    }
    mapOriginX = x + mapOriginX;
    this.mapOriginX = mapOriginX;
    return mapOriginX;
  }

  /**
   * 绘制贴图的原始Y坐标
   */
  getMapOriginY() {
    if (Utils.isNumber(this.mapOriginY)) {
      return this.mapOriginY;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { scroll } = table;
    const y = this.getY();
    let mapOriginY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_TOP: {
        mapOriginY = 0;
        break;
      }
      case SCROLL_TYPE.V_BOTTOM: {
        const leaveView = xTableScrollView.getLeaveView();
        mapOriginY = leaveView.h;
        break;
      }
    }
    mapOriginY = y + mapOriginY;
    this.mapOriginY = mapOriginY;
    return mapOriginY;
  }

  /**
   * 绘制贴图的目标X坐标
   */
  getMapTargetX() {
    if (Utils.isNumber(this.mapTargetX)) {
      return this.mapTargetX;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { scroll } = table;
    const x = this.getX();
    let mapTargetX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_LEFT: {
        const enterView = xTableScrollView.getEnterView();
        mapTargetX = enterView.w;
        break;
      }
      case SCROLL_TYPE.H_RIGHT: {
        mapTargetX = 0;
        break;
      }
    }
    mapTargetX = x + mapTargetX;
    this.mapTargetX = mapTargetX;
    return mapTargetX;
  }

  /**
   * 绘制贴图的目标X坐标
   */
  getMapTargetY() {
    if (Utils.isNumber(this.mapTargetY)) {
      return this.mapTargetY;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { scroll } = table;
    const y = this.getY();
    let mapTargetY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_TOP: {
        const enterView = xTableScrollView.getEnterView();
        mapTargetY = enterView.h;
        break;
      }
      case SCROLL_TYPE.V_BOTTOM: {
        mapTargetY = 0;
        break;
      }
    }
    mapTargetY = y + mapTargetY;
    this.mapTargetY = mapTargetY;
    return mapTargetY;
  }

  /**
   * 绘制贴图的宽度
   * @returns {number}
   */
  getMapWidth() {
    if (Utils.isNumber(this.mapWidth)) {
      return this.mapWidth;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { scroll } = table;
    let mapWidth = this.getWidth();
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT: {
        const leaveView = xTableScrollView.getLeaveView();
        mapWidth -= leaveView.w;
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        const enterView = xTableScrollView.getEnterView();
        mapWidth -= enterView.w;
        break;
      }
    }
    this.mapWidth = mapWidth;
    return mapWidth;
  }

  /**
   * 绘制贴图的高度
   * @returns {number}
   */
  getMapHeight() {
    if (Utils.isNumber(this.mapHeight)) {
      return this.mapHeight;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { scroll } = table;
    let mapHeight = this.getHeight();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        const leaveView = xTableScrollView.getLeaveView();
        mapHeight -= leaveView.h;
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        const enterView = xTableScrollView.getEnterView();
        mapHeight -= enterView.h;
        break;
      }
    }
    this.mapHeight = mapHeight;
    return mapHeight;
  }

  /**
   * 滚动区域
   * 网格和背景颜色的绘制区域
   * @returns {RectRange}
   */
  getScrollView() {
    throw new TypeError('getScrollView child impl');
  }

  /**
   * 完整的滚动区域
   * @returns {RectRange}
   */
  getFullScrollView() {
    throw new TypeError('getFullScrollView child impl');
  }

  /**
   * 视图模式
   * @return {symbol}
   */
  getViewMode() {
    throw new TypeError('getViewMode child impl');
  }

  /**
   * 绘制贴图
   */
  drawMap() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    const viewMode = this.getViewMode();
    if (viewMode === VIEW_MODE.CHANGE && renderMode === RENDER_MODE.SCROLL) {
      const {
        draw, canvas, grid,
      } = table;
      const { el } = canvas;
      const mapWidth = this.getMapWidth();
      const mapHeight = this.getMapHeight();
      let ox = this.getMapOriginX();
      let oy = this.getMapOriginY();
      let tx = this.getMapTargetX();
      let ty = this.getMapTargetY();
      if (ox === 0) ox += grid.lineWidth();
      if (oy === 0) oy += grid.lineWidth();
      if (tx === 0) tx += grid.lineWidth();
      if (ty === 0) ty += grid.lineWidth();
      draw.drawImage(el, ox, oy, mapWidth, mapHeight, tx, ty, mapWidth, mapHeight);
    }
  }

  /**
   * 清空重新绘制区域
   */
  drawClear() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const { table } = this;
    const { draw, grid } = table;
    const { scroll } = table;
    const viewMode = this.getViewMode();
    switch (viewMode) {
      case VIEW_MODE.STATIC:
      case VIEW_MODE.OUT: {
        const height = this.getHeight() + grid.lineWidth();
        const width = this.getWidth() + grid.lineWidth();
        draw.fillRect(dx, dy, width, height);
        break;
      }
      case VIEW_MODE.CHANGE: {
        switch (scroll.type) {
          case SCROLL_TYPE.V_BOTTOM: {
            const fullScrollView = this.getFullScrollView();
            const scrollView = this.getScrollView();
            const height = table.box().height - (fullScrollView.h - scrollView.h);
            const width = this.getWidth() + grid.lineWidth();
            draw.fillRect(dx, dy, width, height);
            break;
          }
          case SCROLL_TYPE.V_TOP: {
            const scrollView = this.getScrollView();
            const height = scrollView.h;
            const width = this.getWidth() + grid.lineWidth();
            draw.fillRect(dx, dy, width, height);
            break;
          }
          case SCROLL_TYPE.H_LEFT: {
            const scrollView = this.getScrollView();
            const height = this.getHeight() + grid.lineWidth();
            const width = scrollView.w;
            draw.fillRect(dx, dy, width, height);
            break;
          }
          case SCROLL_TYPE.H_RIGHT: {
            const fullScrollView = this.getFullScrollView();
            const scrollView = this.getScrollView();
            const height = this.getHeight() + grid.lineWidth();
            const width = table.box().width - (fullScrollView.w - scrollView.w);
            draw.fillRect(dx, dy, width, height);
            break;
          }
        }
        break;
      }
    }
  }

  /**
   * 渲染界面
   */
  render() {
    const { table } = this;
    const { draw, grid } = table;
    const x = this.getX() + grid.lineWidth();
    const y = this.getY() + grid.lineWidth();
    const width = this.getWidth();
    const height = this.getHeight();
    const crop = new Crop({
      rect: new Rect({ x, y, width, height }),
      draw,
    });
    crop.open();
    this.drawMap();
    this.drawClear();
    crop.close();
  }

}

class XTableContentDraw extends XTableDraw {

  constructor(table) {
    super(table);

    this.borderX = null;
    this.borderY = null;

    this.borderView = null;
  }

  /**
   * 重置变量区
   */
  reset() {
    super.reset();
    this.borderX = null;
    this.borderY = null;
    this.scrollX = null;
    this.contentView = null;
    this.borderView = null;
  }

  /**
   * 边框&网格绘制区域
   * @returns {RectRange}
   */
  getLineView() {
    if (Utils.isNotUnDef(this.borderView)) {
      return this.borderView.clone();
    }
    const { table } = this;
    const { cols, rows } = table;
    const viewMode = this.getViewMode();
    const scrollView = this.getScrollView();
    let view;
    if (viewMode === VIEW_MODE.CHANGE) {
      const fullScrollView = this.getFullScrollView();
      const renderMode = table.getRenderMode();
      if (renderMode === RENDER_MODE.SCROLL && !scrollView.equals(fullScrollView)) {
        const { scroll } = table;
        switch (scroll.type) {
          case SCROLL_TYPE.V_TOP: {
            scrollView.eri += 1;
            scrollView.h = rows.rectRangeSumHeight(scrollView);
            break;
          }
          case SCROLL_TYPE.V_BOTTOM: {
            scrollView.sri -= 1;
            scrollView.h = rows.rectRangeSumHeight(scrollView);
            break;
          }
          case SCROLL_TYPE.H_RIGHT: {
            scrollView.sci -= 1;
            scrollView.w = cols.rectRangeSumWidth(scrollView);
            break;
          }
          case SCROLL_TYPE.H_LEFT: {
            scrollView.eci += 1;
            scrollView.w = cols.rectRangeSumWidth(scrollView);
            break;
          }
        }
        view = scrollView;
        this.borderView = view;
        return view.clone();
      }
    }
    view = scrollView;
    this.borderView = view;
    return view.clone();
  }

  /**
   * 绘制边框&网格的X坐标
   */
  getLineX() {
    if (Utils.isNumber(this.borderX)) {
      return this.borderX;
    }
    const { table } = this;
    const x = this.getX();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.borderX = x;
      return x;
    }
    if (this.getViewMode() === VIEW_MODE.OUT) {
      this.borderX = x;
      return x;
    }
    const { scroll } = table;
    let borderX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT: {
        const borderView = this.getLineView();
        const fullScrollView = this.getFullScrollView();
        borderX = fullScrollView.w - borderView.w;
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        borderX = 0;
        break;
      }
    }
    borderX = x + borderX;
    this.borderX = borderX;
    return borderX;
  }

  /**
   * 绘制边框&网格的Y坐标
   */
  getLineY() {
    if (Utils.isNumber(this.borderY)) {
      return this.borderY;
    }
    const { table } = this;
    const y = this.getY();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.borderY = y;
      return y;
    }
    if (this.getViewMode() === VIEW_MODE.OUT) {
      this.borderY = y;
      return y;
    }
    const { scroll } = table;
    let borderY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        const borderView = this.getLineView();
        const fullScrollView = this.getFullScrollView();
        borderY = fullScrollView.h - borderView.h;
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        borderY = 0;
        break;
      }
    }
    borderY = y + borderY;
    this.borderY = borderY;
    return borderY;
  }

  /**
   * 绘制边框
   */
  drawBorder() {
    const scrollView = this.getScrollView();
    const borderView = this.getLineView();
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const width = scrollView.w;
    const height = scrollView.h;
    const {
      draw, lineHandle, borderHandle, line,
    } = table;
    const crop = new Crop({
      rect: new Rect({ x: drawX, y: drawY, width, height }),
      draw,
    });
    crop.open();
    draw.offset(borderX, borderY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({
      viewRange: borderView,
    });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderHandle.htLine(borderView);
    const hbLine = borderHandle.hbLine(borderView);
    const vlLine = borderHandle.vlLine(borderView);
    const vrLine = borderHandle.vrLine(borderView);
    htLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    const htMergeLine = borderHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderHandle.vrMergeLine(coincideViewBrink);
    htMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    draw.offset(0, 0);
    crop.close();
  }

  /**
   * 绘制网格
   */
  drawGrid() {
    const scrollView = this.getScrollView();
    const borderView = this.getLineView();
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const width = scrollView.w;
    const height = scrollView.h;
    const {
      draw, lineHandle, gridHandle, grid,
    } = table;
    const crop = new Crop({
      rect: new Rect({ x: drawX, y: drawY, width, height }),
      draw,
    });
    crop.open();
    draw.offset(borderX, borderY);
    draw.attr({
      globalAlpha: 0.3,
    });
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({
      viewRange: borderView,
    });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridHandle.hLine(borderView);
    const vLine = gridHandle.vLine(borderView);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    crop.close();
  }

  /**
   * 绘制背景颜色
   */
  drawColor() {
    const scrollView = this.getScrollView();
    const x = this.getDrawX();
    const y = this.getDrawY();
    const { table } = this;
    const width = scrollView.w;
    const height = scrollView.h;
    const {
      draw, cellsHelper, grid,
    } = table;
    const crop = new Crop({
      rect: new Rect({ x, y, width, height }),
      draw,
    });
    crop.open();
    draw.offset(x, y);
    cellsHelper.getMergeCellByViewRange({
      rectRange: scrollView,
      callback: (rect, cell) => {
        const { background } = cell;
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(background);
      },
    });
    cellsHelper.getCellByViewRange({
      rectRange: scrollView,
      callback: (i, c, cell, rect) => {
        const { background } = cell;
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(background);
      },
    });
    draw.offset(0, 0);
    crop.close();
  }

  /**
   * 绘制单元格文字
   */
  drawFont() {
    const scrollView = this.getScrollView();
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const x = this.getX();
    const { table } = this;
    const width = scrollView.w;
    const height = scrollView.h;
    const {
      draw, cellsHelper, grid,
    } = table;
    const crop = new Crop({
      rect: new Rect({ x: drawX, y: drawY, width, height }),
      draw,
    });
    crop.open();
    draw.offset(x, drawY);
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: scrollView,
      callback: (row, col, cell, rect, overflow) => {
        const {
          format, text, fontAttr,
        } = cell;
        const {
          align,
        } = fontAttr;
        const font = new Font({
          text: Format(format, text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        font.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
      },
    });
    cellsHelper.getMergeCellByViewRange({
      rectRange: scrollView,
      callback: (rect, cell) => {
        const {
          format, text, fontAttr,
        } = cell;
        const font = new Font({
          text: Format(format, text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow: null,
          attr: fontAttr,
        });
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
      },
    });
    draw.offset(0, 0);
    crop.close();
  }

  /**
   * 渲染界面
   */
  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    const viewMode = this.getViewMode();
    if (viewMode === VIEW_MODE.STATIC && renderMode === RENDER_MODE.SCROLL) {
      return;
    }
    super.render();
    this.drawColor();
    this.drawFont();
    if (this.table.settings.table.showGrid) {
      this.drawGrid();
    }
    this.drawBorder();
  }

}

class XTableIndexDraw extends XTableDraw {

  /**
   * 渲染界面
   */
  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    const viewMode = this.getViewMode();
    if (viewMode === VIEW_MODE.STATIC && renderMode === RENDER_MODE.SCROLL) {
      return;
    }
    super.render();
    this.draw();
  }

}

class XTableTopIndexDraw extends XTableIndexDraw {

  /**
   *  绘制边框文字背景
   */
  draw() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const scrollView = this.getScrollView();
    const height = this.getHeight();
    const width = scrollView.w;
    const { table } = this;
    const {
      draw, cols, settings,
    } = table;
    const grid = new Grid(draw, {
      color: settings.table.indexBorderColor,
    });
    const { sci, eci } = scrollView;
    draw.save();
    draw.offset(dx, dy);
    // 绘制背景
    draw.attr({
      fillStyle: '#f6f7fa',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${npx(11)}px Arial`,
      fillStyle: '#585757',
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.fillText(Utils.stringAt(i), x + (cw / 2), height / 2);
    });
    // 绘制边框
    let lineWidth = 0;
    cols.eachWidth(sci, eci, (i, cw, x) => {
      lineWidth += cw;
      grid.verticalLine(x, 0, x, height);
      if (i === eci) grid.verticalLine(x + cw, 0, x + cw, height);
    });
    grid.horizontalLine(0, height, lineWidth, height);
    draw.offset(0, 0);
    draw.restore();
  }

}

class XTableLeftIndexDraw extends XTableIndexDraw {

  /**
   *  绘制边框文字背景
   */
  draw() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const scrollView = this.getScrollView();
    const height = scrollView.h;
    const width = this.getWidth();
    const { table } = this;
    const {
      draw, rows, settings,
    } = table;
    const grid = new Grid(draw, {
      color: settings.table.indexBorderColor,
    });
    const { sri, eri } = scrollView;
    draw.save();
    draw.offset(dx, dy);
    // 绘制背景
    draw.attr({
      fillStyle: '#f6f7fa',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${npx(11)}px Arial`,
      fillStyle: '#585757',
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.fillText(i + 1, width / 2, y + (ch / 2));
    });
    // 绘制边框
    let lineHeight = 0;
    rows.eachHeight(sri, eri, (i, ch, y) => {
      lineHeight += ch;
      grid.horizontalLine(0, y, width, y);
      if (i === eri) grid.horizontalLine(0, y + ch, width, y + ch);
    });
    grid.verticalLine(width, 0, width, lineHeight);
    draw.offset(0, 0);
    draw.restore();
  }

}

// ================ 表格动态内容绘制 ================

class XTableLeftIndex extends XTableLeftIndexDraw {

  getHeight() {
    if (Utils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { settings } = table;
    const { index } = settings;
    const height = table.box().height - (index.height + xTop.getHeight());
    this.height = height;
    return height;
  }

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const width = index.width;
    this.width = width;
    return width;
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
    const { settings } = table;
    const { index } = settings;
    const y = index.height + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { cols } = table;
    const { xTableScrollView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableScrollView.getScrollView();
    const enterView = xTableScrollView.getScrollEnterVIew();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    view.sci = 0;
    view.eci = 0;
    view.w = cols.sectionSumWidth(view.sci, view.eci);
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { cols } = table;
    const { xTableScrollView } = table;
    const scrollView = xTableScrollView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (Utils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { cols } = table;
    const lastScrollView = xTableScrollView.getLastScrollView();
    const scrollView = xTableScrollView.getScrollView();
    if (Utils.isNotUnDef(lastScrollView)) {
      lastScrollView.sci = 0;
      lastScrollView.eci = 0;
      lastScrollView.w = cols.sectionSumWidth(lastScrollView.sci, lastScrollView.eci);
    }
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableTopIndex extends XTableTopIndexDraw {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { settings } = table;
    const { index } = settings;
    const width = table.box().width - (index.width + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (Utils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const height = index.height;
    this.height = height;
    return height;
  }

  getX() {
    if (Utils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { settings } = table;
    const { index } = settings;
    const x = index.width + xLeft.getWidth();
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
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { rows } = table;
    const { xTableScrollView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableScrollView.getScrollView();
    const enterView = xTableScrollView.getScrollEnterVIew();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    view.sri = 0;
    view.eri = 0;
    view.h = rows.sectionSumHeight(view.sri, view.eri);
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { rows } = table;
    const { xTableScrollView } = table;
    const scrollView = xTableScrollView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = rows.sectionSumHeight(scrollView.sri, scrollView.eri);
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (Utils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { rows } = table;
    const lastScrollView = xTableScrollView.getLastScrollView();
    const scrollView = xTableScrollView.getScrollView();
    if (Utils.isNotUnDef(lastScrollView)) {
      lastScrollView.sri = 0;
      lastScrollView.eri = 0;
      lastScrollView.h = rows.sectionSumHeight(lastScrollView.sri, lastScrollView.eri);
    }
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = rows.sectionSumHeight(scrollView.sri, scrollView.eri);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableLeft extends XTableContentDraw {

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
    const { settings } = table;
    const { index } = settings;
    const height = table.box().height - (index.height + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (Utils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const x = index.width;
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { settings } = table;
    const { index } = settings;
    const y = index.height + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { cols } = table;
    const { xTableScrollView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableScrollView.getScrollView();
    const enterView = xTableScrollView.getScrollEnterVIew();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    view.sci = 0;
    view.eci = fixed.fxLeft;
    view.w = cols.sectionSumWidth(view.sci, view.eci);
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { cols } = table;
    const { xTableScrollView } = table;
    const scrollView = xTableScrollView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = fixed.fxLeft;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (Utils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { cols } = table;
    const { fixed } = table;
    const lastScrollView = xTableScrollView.getLastScrollView();
    const scrollView = xTableScrollView.getScrollView();
    if (Utils.isNotUnDef(lastScrollView)) {
      lastScrollView.sci = 0;
      lastScrollView.eci = fixed.fxLeft;
      lastScrollView.w = cols.sectionSumWidth(lastScrollView.sci, lastScrollView.eci);
    }
    scrollView.sci = 0;
    scrollView.eci = fixed.fxLeft;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableContent extends XTableContentDraw {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const { xLeft } = table;
    const width = table.box().width - (index.width + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (Utils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { settings } = table;
    const { index } = settings;
    const height = table.box().height - (index.height + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (Utils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { settings } = table;
    const { index } = settings;
    const x = index.width + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { settings } = table;
    const { index } = settings;
    const y = index.height + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableScrollView.getScrollView();
    const enterView = xTableScrollView.getScrollEnterVIew();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const scrollView = xTableScrollView.getScrollView();
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (Utils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const lastScrollView = xTableScrollView.getLastScrollView();
    const scrollView = xTableScrollView.getScrollView();
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableTop extends XTableContentDraw {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { settings } = table;
    const { index } = settings;
    const width = table.box().width - (index.width + xLeft.getWidth());
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
    const { settings } = table;
    const { index } = settings;
    const x = index.width + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const y = index.height;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const { xTableScrollView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableScrollView.getScrollView();
    const enterView = xTableScrollView.getScrollEnterVIew();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    view.sri = 0;
    view.eri = fixed.fxTop;
    view.h = rows.sectionSumHeight(view.sci, view.eci);
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const { xTableScrollView } = table;
    const scrollView = xTableScrollView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = fixed.fxTop;
    scrollView.h = rows.sectionSumHeight(scrollView.sci, scrollView.eci);
    this.scrollVIew = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (Utils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { rows } = table;
    const { fixed } = table;
    const lastScrollView = xTableScrollView.getLastScrollView();
    const scrollView = xTableScrollView.getScrollView();
    if (Utils.isNotUnDef(lastScrollView)) {
      lastScrollView.sri = 0;
      lastScrollView.eri = fixed.fxTop;
      lastScrollView.h = rows.sectionSumHeight(lastScrollView.sci, lastScrollView.eci);
    }
    scrollView.sri = 0;
    scrollView.eri = fixed.fxTop;
    scrollView.h = rows.sectionSumHeight(scrollView.sci, scrollView.eci);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

// ================ 表格冻结内容绘制 ================

class XTableFrozenLeftIndex extends XTableLeftIndexDraw {

  getWidth() {
    if (Utils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const width = index.width;
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
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const y = index.height;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { rows, cols } = table;
    const { fixed } = table;
    const view = new RectRange(0, 0, fixed.fxTop, 0);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const fullScrollView = this.getScrollView();
    this.fullScrollView = fullScrollView;
    return fullScrollView.clone();
  }

  getViewMode() {
    this.viewMode = VIEW_MODE.STATIC;
    return VIEW_MODE.STATIC;
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER) {
      super.render();
    }
  }

}

class XTableFrozenTopIndex extends XTableTopIndexDraw {

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
    const { settings } = table;
    const { index } = settings;
    const height = index.height;
    this.height = height;
    return height;
  }

  getX() {
    if (Utils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const x = index.width;
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
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { rows, cols } = table;
    const { fixed } = table;
    const view = new RectRange(0, 0, 0, fixed.fxLeft);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const fullScrollView = this.getScrollView();
    this.fullScrollView = fullScrollView;
    return fullScrollView.clone();
  }

  getViewMode() {
    this.viewMode = VIEW_MODE.STATIC;
    return VIEW_MODE.STATIC;
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER) {
      super.render();
    }
  }

}

class XTableFrozenContent extends XTableContentDraw {

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
    const { settings } = table;
    const { index } = settings;
    const x = index.width;
    this.x = x;
    return x;
  }

  getY() {
    if (Utils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const y = index.height;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { rows, cols } = table;
    const { fixed } = table;
    const view = new RectRange(0, 0, fixed.fxTop, fixed.fxLeft);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const fullScrollView = this.getScrollView();
    this.fullScrollView = fullScrollView;
    return fullScrollView.clone();
  }

  getViewMode() {
    this.viewMode = VIEW_MODE.STATIC;
    return VIEW_MODE.STATIC;
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER) {
      super.render();
    }
  }

}

class XTableFrozenFullRect {

  constructor(table) {
    this.table = table;
  }

  draw() {
    const dx = 0;
    const dy = 0;
    const { table } = this;
    const { draw, settings } = table;
    const { index } = settings;
    const indexHeight = index.height;
    const indexWidth = index.width;
    const grid = new Grid(draw, {
      color: settings.table.indexBorderColor,
    });
    draw.save();
    draw.offset(dx, dy);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, index.width, indexHeight);
    draw.offset(0, 0);
    draw.restore();
    // 绘制边框
    grid.horizontalLine(0, indexHeight, indexWidth, indexHeight);
    grid.verticalLine(indexWidth, dy, indexWidth, indexHeight);
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER) {
      this.draw();
    }
  }

}

// ====================== X-Table ===================

class XTable extends Widget {

  constructor(settings) {
    super(`${cssPrefix}-table`);
    // 表格设置
    this.settings = Utils.mergeDeep({
      index: {
        height: 30,
        width: 50,
        bgColor: '#f4f5f8',
        color: '#000000',
      },
      table: {
        showGrid: true,
        background: '#ffffff',
        borderColor: '#e5e5e5',
        gridColor: '#b7b7b7',
        indexBorderColor: '#d8d8d8',
      },
      data: [],
      rows: {
        len: 10000,
        height: 30,
      },
      cols: {
        len: 26,
        width: 137,
      },
      merges: [],
      fixed: {
        fxTop: -1,
        fxLeft: -1,
      },
    }, settings);
    // 表格数据配置
    this.merges = new Merges(this.settings.merges);
    this.rows = new Rows(this.settings.rows);
    this.cols = new Cols(this.settings.cols);
    this.cells = new Cells({
      table: this,
      rows: this.rows,
      cols: this.cols,
      data: this.settings.data,
    });
    this.fixed = new Fixed(this.settings.fixed);
    this.scroll = new Scroll(this);
    // 表格视图计算
    this.xTableScrollView = new XTableScrollView(this);
    // 渲染模式 & 视图模式
    this.renderMode = RENDER_MODE.RENDER;
    this.viewMode = null;
    // canvas 画布
    this.canvas = new Widget(`${cssPrefix}-table-canvas`, 'canvas');
    // 绘制资源
    this.draw = new Draw(this.canvas.el);
    this.line = new Line(this.draw, {
      leftShow: (ri, ci) => {
        // 单元格是否存在
        const cell = this.cells.getCell(ri, ci);
        if (cell === null) {
          return false;
        }
        // 是否是合并单元格
        const merge = this.merges.getFirstIncludes(ri, ci);
        if (merge) {
          const mergeCell = this.cells.getCell(merge.sri, merge.sci);
          return mergeCell.borderAttr.left.display;
        }
        // 检查边框是否需要绘制
        if (cell.borderAttr.left.display) {
          return this.lineHandle.vLineLeftOverFlowChecked(ci, ri);
        }
        return false;
      },
      topShow: (ri, ci) => {
        const cell = this.cells.getMergeCellOrCell(ri, ci);
        return cell && cell.borderAttr.top.display;
      },
      rightShow: (ri, ci) => {
        // 单元格是否存在
        const cell = this.cells.getCell(ri, ci);
        if (cell === null) {
          return false;
        }
        // 是否是合并单元格
        const merge = this.merges.getFirstIncludes(ri, ci);
        if (merge) {
          const mergeCell = this.cells.getCell(merge.sri, merge.sci);
          return mergeCell.borderAttr.right.display;
        }
        // 检查边框是否需要绘制
        if (cell.borderAttr.right.display) {
          return this.lineHandle.vLineRightOverFlowChecked(ci, ri);
        }
        return false;
      },
      bottomShow: (ri, ci) => {
        const cell = this.cells.getMergeCellOrCell(ri, ci);
        return cell && cell.borderAttr.bottom.display;
      },
      iFMerge: (row, col) => this.merges.getFirstIncludes(row, col) !== null,
      iFMergeFirstRow: (row, col) => this.merges.getFirstIncludes(row, col).sri === row,
      iFMergeLastRow: (row, col) => this.merges.getFirstIncludes(row, col).eri === row,
      iFMergeFirstCol: (row, col) => this.merges.getFirstIncludes(row, col).sci === col,
      iFMergeLastCol: (row, col) => this.merges.getFirstIncludes(row, col).eci === col,
    });
    this.grid = new Grid(this.draw, {
      color: this.settings.table.gridColor,
    });
    // 线段处理
    this.lineHandle = new LineHandle(this);
    this.borderHandle = new BorderLineHandle(this);
    this.gridHandle = new GridLineHandle(this);
    // 冻结内容
    this.xLeftFrozenIndex = new XTableFrozenLeftIndex(this);
    this.xTopFrozenIndex = new XTableFrozenTopIndex(this);
    this.xTableFrozenContent = new XTableFrozenContent(this);
    this.xTableFrozenFullRect = new XTableFrozenFullRect(this);
    // 动态内容
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    //  单元格辅助类
    this.cellsHelper = new CellsHelper({
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
    });
    // 数据快照
    this.tableDataSnapshot = new TableDataSnapshot(this);
    // 表格屏幕管理
    this.screen = new Screen(this);
  }

  onAttach() {
    this.bind();
    this.screenSelector = new ScreenSelector(this.screen);
    this.screen.addWidget(this.screenSelector);
    this.attach(this.canvas);
    this.attach(this.screen);
  }

  /**
   * 重置变量区
   */
  reset() {
    this.viewMode = null;
    const { xTableScrollView } = this;
    const { xLeftFrozenIndex } = this;
    const { xTopFrozenIndex } = this;
    const { xTableFrozenContent } = this;
    const { xLeftIndex } = this;
    const { xTopIndex } = this;
    const { xLeft } = this;
    const { xTop } = this;
    const { xContent } = this;
    xTableScrollView.reset();
    xLeftFrozenIndex.reset();
    xTopFrozenIndex.reset();
    xTableFrozenContent.reset();
    xLeftIndex.reset();
    xTopIndex.reset();
    xLeft.reset();
    xTop.reset();
    xContent.reset();
  }

  /**
   * 边框渲染优化
   */
  drawBorderOptimize() {
    const { cellsHelper } = this;
    const { xTableScrollView } = this;
    const { borderHandle } = this;
    const scrollView = xTableScrollView.getScrollView();
    let enable = true;
    cellsHelper.getCellByViewRange({
      rectRange: scrollView,
      callback: (row, col, cell) => {
        const { borderAttr } = cell;
        const { top, left, right, bottom } = borderAttr;
        if (top.type === LINE_TYPE.DOUBLE_LINE) {
          enable = false;
          return enable;
        }
        if (left.type === LINE_TYPE.DOUBLE_LINE) {
          enable = false;
          return enable;
        }
        if (right.type === LINE_TYPE.DOUBLE_LINE) {
          enable = false;
          return enable;
        }
        if (bottom.type === LINE_TYPE.DOUBLE_LINE) {
          enable = false;
          return enable;
        }
        return true;
      },
    });
    if (enable) {
      borderHandle.openDrawOptimization();
    } else {
      borderHandle.closeDrawOptimization();
    }
  }

  /**
   * 绑定事件处理
   */
  bind() {
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.reset();
      this.render();
    });
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
   * 重置界面大小
   */
  resize() {
    const { draw } = this;
    const [width, height] = [this.box().width, this.box().height];
    draw.resize(width, height);
    this.reset();
    this.render();
  }

  /**
   * 渲染界面
   */
  render() {
    const { fixed, draw, settings } = this;
    const { xTableFrozenFullRect } = this;
    const { xLeftFrozenIndex } = this;
    const { xTopFrozenIndex } = this;
    const { xTableFrozenContent } = this;
    const { xLeftIndex } = this;
    const { xTopIndex } = this;
    const { xLeft } = this;
    const { xTop } = this;
    const { xContent } = this;
    this.drawBorderOptimize();
    xTableFrozenFullRect.render();
    draw.attr({
      fillStyle: settings.table.background,
    });
    if (fixed.fxLeft > -1 && fixed.fxTop > -1) {
      xTableFrozenContent.render();
    }
    if (fixed.fxTop > -1) {
      xLeftFrozenIndex.render();
      xTop.render();
    }
    if (fixed.fxLeft > -1) {
      xTopFrozenIndex.render();
      xLeft.render();
    }
    xContent.render();
    xLeftIndex.render();
    xTopIndex.render();
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
   * 固定区域宽度
   * @returns {number}
   */
  getFixedWidth() {
    const { xLeft } = this;
    return xLeft.getWidth();
  }

  /**
   * 固定区域高度
   * @returns {number}
   */
  getFixedHeight() {
    const { xTop } = this;
    return xTop.getHeight();
  }

  /**
   * 渲染模式
   */
  getRenderMode() {
    const { renderMode } = this;
    return renderMode;
  }

  /**
   * 返回指定坐标的单元格行列
   * @param x
   * @param y
   * @returns {{ci: number, ri: number}}
   */
  getRiCiByXy(x, y) {
    const {
      settings, fixed, rows, cols,
    } = this;
    const { index } = settings;
    const fixedHeight = this.getFixedHeight();
    const fixedWidth = this.getFixedWidth();

    let [left, top] = [x, y];
    let [ci, ri] = [-1, -1];

    left -= index.width;
    top -= index.height;

    // left
    if (left <= fixedWidth && x > index.width) {
      let total = 0;
      for (let i = 0; i <= fixed.fxLeft; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total > left) break;
      }
    } else if (x > index.width) {
      let total = fixedWidth;
      const viewRange = this.getScrollViewRange();
      for (let i = viewRange.sci; i <= viewRange.eci; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total > left) break;
      }
      // console.log('ci >>', ci);
    }

    // top
    if (top < fixedHeight && y > index.height) {
      let total = 0;
      for (let i = 0; i <= fixed.fxTop; i += 1) {
        const height = rows.getHeight(i);
        total += height;
        ri = i;
        if (total > top) break;
      }
    } else if (y > index.height) {
      let total = fixedHeight;
      const viewRange = this.getScrollViewRange();
      for (let i = viewRange.sri; i <= viewRange.eri; i += 1) {
        const height = rows.getHeight(i);
        total += height;
        ri = i;
        if (total > top) break;
      }
      // console.log('ri >>', ri);
    }

    return {
      ri, ci,
    };
  }
}

export {
  XTable,
  RENDER_MODE,
  VIEW_MODE,
};
