import { Utils } from '../../utils/Utils';
import { Rows } from './base/Rows';
import { Cols } from './base/Cols';
import {
  Scroll, SCROLL_TYPE,
} from './base/Scroll';
import { Widget } from '../../lib/Widget';
import {
  Constant, cssPrefix,
} from '../../constant/Constant';
import { Draw, npx } from '../../canvas/Draw';
import { Line, LINE_TYPE } from '../../canvas/Line';
import { Grid } from '../../canvas/Grid';
import { LineHandle } from './gridborder/LineHandle';
import { BorderLineHandle } from './gridborder/BorderLineHandle';
import { GridLineHandle } from './gridborder/GridLineHandle';
import { Fixed } from './base/Fixed';
import { Crop } from '../../canvas/Crop';
import { Rect } from '../../canvas/Rect';
import {
  ALIGN, TEXT_WRAP,
} from '../../canvas/Font';
import Format from './Format';
import { Box } from '../../canvas/Box';
import { RectRange } from './base/RectRange';
import { EventBind } from '../../utils/EventBind';
import { CellsHelper } from './cells/CellsHelper';
import { Cells } from './cells/Cells';
import { TableDataSnapshot } from './datasnapshot/TableDataSnapshot';
import { Screen } from './screen/Screen';
import {
  SCREEN_SELECT_EVENT, ScreenSelector,
} from './screenwiget/selector/ScreenSelector';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { Edit } from './Edit';
import { ScreenAutoFill } from './screenwiget/autofill/ScreenAutoFill';
import { ScreenCopyStyle } from './screenwiget/copystyle/ScreenCopyStyle';
import { MousePointer } from './MousePointer';
import { Keyboard } from './Keyboard';
import { Focus } from './Focus';
import { Merge } from './base/Merge';
import { Scale } from './base/Scale';
import { FixedIndex } from './base/FixedIndex';
import { FontFactory } from './base/FontFactory';

const RENDER_MODE = {
  SCROLL: Symbol('scroll'),
  RENDER: Symbol('render'),
};

const VIEW_MODE = {
  CHANGE_ADD: Symbol('change_add'),
  CHANGE_NOT: Symbol('change_not'),
  STATIC: Symbol('static'),
  BOUND_OUT: Symbol('bound_out'),
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

  record() {
    this.lastScrollView = this.scrollView;
  }

  reset() {
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

}

// ================= 表格绘制抽象类 =================

class XTableUI {

  /**
   * XTableUI
   * @param table
   */
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
    this.borderView = null;

    this.borderX = null;
    this.borderY = null;

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
    this.borderView = null;

    this.borderX = null;
    this.borderY = null;

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
    if (this.getViewMode() === VIEW_MODE.BOUND_OUT) {
      this.drawX = x;
      return x;
    }
    if (this.getViewMode() === VIEW_MODE.CHANGE_NOT) {
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
    if (this.getViewMode() === VIEW_MODE.BOUND_OUT) {
      this.drawY = y;
      return y;
    }
    if (this.getViewMode() === VIEW_MODE.CHANGE_NOT) {
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
    if (this.getViewMode() === VIEW_MODE.BOUND_OUT) {
      this.borderX = x;
      return x;
    }
    if (this.getViewMode() === VIEW_MODE.CHANGE_NOT) {
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
    if (this.getViewMode() === VIEW_MODE.BOUND_OUT) {
      this.borderY = y;
      return y;
    }
    if (this.getViewMode() === VIEW_MODE.CHANGE_NOT) {
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
   * 边框&网格绘制区域
   * @returns {RectRange}
   */
  getLineView() {
    if (Utils.isNotUnDef(this.borderView)) {
      return this.borderView.clone();
    }
    const { table } = this;
    const { cols, rows } = table;
    const renderMode = table.getRenderMode();
    const viewMode = this.getViewMode();
    const scrollView = this.getScrollView();
    if (viewMode === VIEW_MODE.CHANGE_ADD && renderMode === RENDER_MODE.SCROLL) {
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
    }
    this.borderView = scrollView;
    return scrollView.clone();
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
    if (viewMode === VIEW_MODE.CHANGE_ADD && renderMode === RENDER_MODE.SCROLL) {
      const {
        draw, canvas,
      } = table;
      const { el } = canvas;
      const mapWidth = this.getMapWidth();
      const mapHeight = this.getMapHeight();
      const ox = this.getMapOriginX();
      const oy = this.getMapOriginY();
      const tx = this.getMapTargetX();
      const ty = this.getMapTargetY();
      draw.drawImage(el, ox, oy, mapWidth, mapHeight, tx, ty, mapWidth, mapHeight);
    }
  }

  /**
   * 清空重新绘制区域
   */
  drawClear() {
    const { table } = this;
    const {
      scroll, draw, settings,
    } = table;
    const viewMode = this.getViewMode();
    const renderMode = table.getRenderMode();
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    draw.attr({
      fillStyle: settings.table.background,
    });
    if (renderMode === RENDER_MODE.SCROLL) {
      switch (viewMode) {
        case VIEW_MODE.CHANGE_NOT:
        case VIEW_MODE.STATIC:
        case VIEW_MODE.BOUND_OUT: {
          const height = this.getHeight();
          const width = this.getWidth();
          draw.fillRect(dx, dy, width, height);
          break;
        }
        case VIEW_MODE.CHANGE_ADD: {
          switch (scroll.type) {
            case SCROLL_TYPE.V_BOTTOM: {
              const fullScrollView = this.getFullScrollView();
              const scrollView = this.getScrollView();
              const height = table.visualHeight() - (fullScrollView.h - scrollView.h);
              const width = this.getWidth();
              draw.fillRect(dx, dy, width, height);
              break;
            }
            case SCROLL_TYPE.V_TOP: {
              const scrollView = this.getScrollView();
              const height = scrollView.h;
              const width = this.getWidth();
              draw.fillRect(dx, dy, width, height);
              break;
            }
            case SCROLL_TYPE.H_LEFT: {
              const scrollView = this.getScrollView();
              const height = this.getHeight();
              const width = scrollView.w;
              draw.fillRect(dx, dy, width, height);
              break;
            }
            case SCROLL_TYPE.H_RIGHT: {
              const fullScrollView = this.getFullScrollView();
              const scrollView = this.getScrollView();
              const height = this.getHeight();
              const width = table.visualWidth() - (fullScrollView.w - scrollView.w);
              draw.fillRect(dx, dy, width, height);
              break;
            }
          }
          break;
        }
      }
    } else {
      const height = this.getHeight();
      const width = this.getWidth();
      draw.fillRect(dx, dy, width, height);
    }
  }

}

class XTableIndexUI extends XTableUI {

  /**
   * 绘制文字
   */
  drawFont() {
    throw new TypeError('drawFont child impl');
  }

  /**
   * 绘制背景颜色
   */
  drawColor() {
    throw new TypeError('drawColor child impl');
  }

  /**
   * 绘制网格
   */
  drawGrid() {
    throw new TypeError('drawGrid child impl');
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
    this.drawMap();
    this.drawClear();
    this.drawColor();
    this.drawGrid();
    this.drawFont();
  }

}

class XTableTopIndexUI extends XTableIndexUI {

  /**
   *  绘制文字
   */
  drawFont() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const scrollView = this.getScrollView();
    const height = this.getHeight();
    const { table } = this;
    const {
      draw, cols, index,
    } = table;
    const { sci, eci } = scrollView;
    draw.offset(dx, dy);
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${npx(index.getSize())}px Arial`,
      fillStyle: index.getColor(),
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.fillText(Utils.stringAt(i), x + (cw / 2), height / 2);
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制网格
   */
  drawGrid() {
    const borderView = this.getLineView();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const {
      draw, topIdxGridHandle, indexGrid,
    } = table;
    draw.offset(borderX, borderY);
    const hLine = topIdxGridHandle.hLine(borderView);
    const vLine = topIdxGridHandle.vLine(borderView);
    hLine.forEach((item) => {
      indexGrid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      indexGrid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制背景
   */
  drawColor() {
    const { table } = this;
    const {
      draw, index,
    } = table;
    const scrollView = this.getScrollView();
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const height = this.getHeight();
    const width = scrollView.w;
    draw.offset(dx, dy);
    draw.attr({
      fillStyle: index.getBackground(),
    });
    draw.fillRect(0, 0, width, height);
    draw.offset(0, 0);
  }

}

class XTableLeftIndexUI extends XTableIndexUI {

  /**
   *  绘制文字
   */
  drawFont() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const scrollView = this.getScrollView();
    const width = this.getWidth();
    const { table } = this;
    const {
      draw, rows, index,
    } = table;
    const { sri, eri } = scrollView;
    draw.offset(dx, dy);
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${npx(index.getSize())}px Arial`,
      fillStyle: index.getColor(),
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.fillText(i + 1, width / 2, y + (ch / 2));
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制网格
   */
  drawGrid() {
    const borderView = this.getLineView();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const {
      draw, leftIdxGridHandle, indexGrid,
    } = table;
    draw.offset(borderX, borderY);
    const hLine = leftIdxGridHandle.hLine(borderView);
    const vLine = leftIdxGridHandle.vLine(borderView);
    hLine.forEach((item) => {
      indexGrid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      indexGrid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制背景
   */
  drawColor() {
    const dx = this.getDrawX();
    const dy = this.getDrawY();
    const scrollView = this.getScrollView();
    const height = scrollView.h;
    const width = this.getWidth();
    const { table } = this;
    const {
      draw, index,
    } = table;
    draw.offset(dx, dy);
    draw.attr({
      fillStyle: index.getBackground(),
    });
    draw.fillRect(0, 0, width, height);
    draw.offset(0, 0);
  }

}

class XTableContentUI extends XTableUI {

  /**
   * XTableContentUI
   * @param table
   */
  constructor(table) {
    super(table);
    this.contentView = null;
  }

  /**
   * 重置变量区
   */
  reset() {
    super.reset();
    this.contentView = null;
  }

  /**
   * 绘制越界文本
   */
  drawBoundOutFont() {
    const scrollView = this.getScrollView();
    const { table } = this;
    const {
      draw, cols, cellsHelper, cells, fontFactory,
    } = table;
    // 左边区域
    const lView = scrollView.clone();
    lView.sci = 0;
    lView.eci = scrollView.sci - 1;
    if (lView.eci > -1) {
      const lx = this.getDrawX() - cols.getWidth(lView.eci);
      const ly = this.getDrawY();
      let max;
      let curr;
      draw.offset(lx, ly);
      cellsHelper.getCellSkipMergeCellByViewRange({
        rectRange: lView,
        reverseCols: true,
        callback: (row, col, cell, rect, overflow) => {
          if (row !== curr) {
            max = 0;
            curr = row;
          }
          max += rect.width;
          const { text, fontAttr } = cell;
          const { align, textWrap } = fontAttr;
          if (Utils.isBlank(text)
            || align === ALIGN.right
            || textWrap !== TEXT_WRAP.OVER_FLOW) {
            return;
          }
          const size = cells.getCellBoundOutSize(row, col);
          if (size === 0 || size > max) {
            const {
              format, text, fontAttr,
            } = cell;
            const { align } = fontAttr;
            const builder = fontFactory.getBuilder();
            builder.setText(Format(format, text));
            builder.setAttr(fontAttr);
            builder.setRect(rect);
            builder.setOverFlow(overflow);
            const font = builder.build();
            font.setOverflowCrop(align === ALIGN.center);
            cell.setContentWidth(font.draw());
          }
        },
      });
      draw.offset(0, 0);
    }
    // 右边区域
    const rView = scrollView.clone();
    rView.sci = scrollView.eci + 1;
    rView.eci = cols.len - 1;
    if (rView.sci < cols.len) {
      const rx = this.getDrawX() + scrollView.w;
      const ry = this.getDrawY();
      let max;
      let curr;
      draw.offset(rx, ry);
      cellsHelper.getCellSkipMergeCellByViewRange({
        rectRange: rView,
        callback: (row, col, cell, rect, overflow) => {
          if (row !== curr) {
            max = 0;
            curr = row;
          }
          max += rect.width;
          const { text, fontAttr } = cell;
          const { align, textWrap } = fontAttr;
          if (Utils.isBlank(text)
            || align === ALIGN.left
            || textWrap !== TEXT_WRAP.OVER_FLOW) {
            return;
          }
          const size = cells.getCellBoundOutSize(row, col);
          if (size === 0 || size > max) {
            const {
              format, text, fontAttr,
            } = cell;
            const { align } = fontAttr;
            const builder = fontFactory.getBuilder();
            builder.setText(Format(format, text));
            builder.setAttr(fontAttr);
            builder.setRect(rect);
            builder.setOverFlow(overflow);
            const font = builder.build();
            font.setOverflowCrop(align === ALIGN.center);
            cell.setContentWidth(font.draw());
          }
        },
      });
      draw.offset(0, 0);
    }
  }

  /**
   * 绘制单元格文本
   */
  drawFont() {
    const scrollView = this.getScrollView();
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const { table } = this;
    const {
      draw, cellsHelper, fontFactory,
    } = table;
    draw.offset(drawX, drawY);
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: scrollView,
      callback: (row, col, cell, rect, overflow) => {
        const {
          format, text, fontAttr,
        } = cell;
        const { align } = fontAttr;
        const builder = fontFactory.getBuilder();
        builder.setText(Format(format, text));
        builder.setAttr(fontAttr);
        builder.setRect(rect);
        builder.setOverFlow(overflow);
        const font = builder.build();
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
        const builder = fontFactory.getBuilder();
        builder.setText(Format(format, text));
        builder.setAttr(fontAttr);
        builder.setRect(rect);
        const font = builder.build();
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
      },
    });
    draw.offset(0, 0);
  }

  /**
   * 绘制网格
   */
  drawGrid() {
    const borderView = this.getLineView();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const {
      draw, lineHandle, gridHandle, grid,
    } = table;
    draw.offset(borderX, borderY);
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
  }

  /**
   * 绘制边框
   */
  drawBorder() {
    const borderView = this.getLineView();
    const borderX = this.getLineX();
    const borderY = this.getLineY();
    const { table } = this;
    const {
      draw, lineHandle, borderHandle, line,
    } = table;
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
  }

  /**
   * 绘制背景颜色
   */
  drawColor() {
    const scrollView = this.getScrollView();
    const { table } = this;
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const {
      draw, cellsHelper,
    } = table;
    draw.offset(drawX, drawY);
    cellsHelper.getMergeCellByViewRange({
      rectRange: scrollView,
      callback: (rect, cell) => {
        const { background } = cell;
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(background);
      },
    });
    cellsHelper.getCellByViewRange({
      rectRange: scrollView,
      callback: (i, c, cell, rect) => {
        const { background } = cell;
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(background);
      },
    });
    draw.offset(0, 0);
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
    this.drawMap();
    this.drawClear();
    // 裁剪边界
    const scrollView = this.getScrollView();
    const x = this.getDrawX();
    const y = this.getDrawY();
    const width = scrollView.w;
    const height = scrollView.h;
    const { draw } = table;
    const crop = new Crop({
      rect: new Rect({ x, y, width, height }),
      draw,
    });
    crop.open();
    // 绘制内容
    this.drawColor();
    this.drawFont();
    this.drawBoundOutFont();
    if (this.table.settings.table.showGrid) {
      this.drawGrid();
    }
    this.drawBorder();
    crop.close();
  }

}

// ================ 表格动态内容绘制 ================

class XTableLeftIndex extends XTableLeftIndexUI {

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
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { xTableScrollView } = table;
    const { index } = table;
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
    view.w = index.getWidth();
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableScrollView } = table;
    const scrollView = xTableScrollView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = index.getWidth();
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

class XTableTopIndex extends XTableTopIndexUI {

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
    if (Utils.isNotUnDef(this.scrollVIew)) {
      return this.scrollVIew.clone();
    }
    const { table } = this;
    const { index } = table;
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
    view.h = index.getHeight();
    this.scrollVIew = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableScrollView } = table;
    const scrollView = xTableScrollView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = index.getHeight();
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

class XTableLeft extends XTableContentUI {

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

class XTableContent extends XTableContentUI {

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

class XTableTop extends XTableContentUI {

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

class XTableFrozenLeftIndex extends XTableLeftIndexUI {

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
    const { index } = table;
    const y = index.getHeight();
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

class XTableFrozenTopIndex extends XTableTopIndexUI {

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
    const { index } = table;
    const x = index.getWidth();
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

class XTableFrozenContent extends XTableContentUI {

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
    const { draw } = table;
    const { indexGrid } = table;
    const { index } = table;
    const indexHeight = index.getHeight();
    const indexWidth = index.getWidth();
    draw.save();
    draw.offset(dx, dy);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, index.getWidth(), indexHeight);
    draw.offset(0, 0);
    // 绘制边框
    indexGrid.horizontalLine(0, indexHeight, indexWidth, indexHeight);
    indexGrid.verticalLine(indexWidth, dy, indexWidth, indexHeight);
    draw.restore();
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

  /**
   * XTable
   * @param settings
   */
  constructor(settings) {
    super(`${cssPrefix}-table`);
    // 表格设置
    this.settings = Utils.mergeDeep({
      index: {
        height: 33,
        width: 50,
      },
      table: {
        showGrid: true,
        background: '#ffffff',
        borderColor: '#e5e5e5',
        gridColor: '#e8e8e8',
      },
      data: [],
      rows: {
        len: 1000,
        height: 33,
      },
      cols: {
        len: 26,
        width: 137,
      },
      merge: [],
      fixed: {
        fxTop: -1,
        fxLeft: -1,
      },
    }, settings);
    this.width = null;
    this.height = null;
    // 表格数据配置
    this.scale = new Scale(this);
    this.merges = new Merge(this, this.settings.merge);
    this.rows = new Rows(this, this.settings.rows);
    this.cols = new Cols(this, this.settings.cols);
    this.fixed = new Fixed(this, this.settings.fixed);
    this.index = new FixedIndex(this, this.settings.index);
    this.cells = new Cells(this, {
      rows: this.rows,
      cols: this.cols,
      data: this.settings.data,
    });
    this.scroll = new Scroll(this);
    // 表格视图计算
    this.xTableScrollView = new XTableScrollView(this);
    // 渲染模式 & 视图模式
    this.renderMode = RENDER_MODE.RENDER;
    this.viewMode = null;
    // canvas 画布
    this.canvas = new Widget(`${cssPrefix}-table-canvas`, 'canvas');
    this.canvas.attr({
      'moz-opaque': '',
    });
    // 绘制资源
    this.draw = new Draw(this.canvas.el);
    this.indexGrid = new Grid(this.draw, {
      color: this.index.getGridColor(),
    });
    this.grid = new Grid(this.draw, {
      color: this.settings.table.gridColor,
    });
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
          return this.lineHandle.vLineLeftBoundOut(ci, ri);
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
          return this.lineHandle.vLineRightBoundOut(ci, ri);
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
    this.fontFactory = new FontFactory(this);
    // 线段处理
    this.topIdxGridHandle = new GridLineHandle(this, {
      getHeight: () => this.index.getHeight(),
      checked: false,
    });
    this.leftIdxGridHandle = new GridLineHandle(this, {
      getWidth: () => this.index.getWidth(),
      checked: false,
    });
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
    // 单元格辅助类
    this.cellsHelper = new CellsHelper({
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
    });
    // 同步合并单元格
    this.merges.sync();
  }

  /**
   * 重置变量区
   */
  reset() {
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
    const { xTableScrollView } = this;
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.reset();
      this.render();
      xTableScrollView.record();
      this.reset();
    });
  }

  /**
   * 可视区域高度
   * @return {*}
   */
  visualHeight() {
    if (Utils.isNotUnDef(this.height)) {
      return this.height;
    }
    const height = this.box().height;
    this.height = height;
    return height;
  }

  /**
   * 可视区域宽度
   * @return {*}
   */
  visualWidth() {
    if (Utils.isNotUnDef(this.width)) {
      return this.width;
    }
    const width = this.box().width;
    this.width = width;
    return width;
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
    const {
      draw, xTableScrollView,
    } = this;
    this.width = null;
    this.height = null;
    xTableScrollView.lastScrollView = null;
    const [width, height] = [this.visualWidth(), this.visualHeight()];
    draw.resize(width, height);
    this.reset();
    this.render();
  }

  /**
   * 渲染界面
   */
  render() {
    const { fixed } = this;
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
   * 渲染模式
   */
  getRenderMode() {
    const { renderMode } = this;
    return renderMode;
  }
}

// ====================== 快捷键 =====================

class KeyBoardTab {

  constructor(table) {
    const { keyboard, cols, rows, edit, merges, screenSelector } = table;
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

// ====================== Table =====================

class Table extends XTable {

  constructor(settings) {
    super(settings);
    // 焦点元素管理
    this.focus = new Focus(this);
    // 数据快照
    this.tableDataSnapshot = new TableDataSnapshot(this);
    // 鼠标指针
    this.mousePointer = new MousePointer(this);
    // 键盘快捷键
    this.keyboard = new Keyboard(this);
    // table基础组件
    this.screen = new Screen(this);
    this.xReSizer = new XReSizer(this);
    this.yReSizer = new YReSizer(this);
    this.xHeightLight = new XHeightLight(this);
    this.yHeightLight = new YHeightLight(this);
    this.edit = new Edit(this);
  }

  onAttach() {
    this.bind();
    // 初始化表格基础小部件
    this.screenSelector = new ScreenSelector(this.screen);
    this.screenAutoFill = new ScreenAutoFill(this.screen, {
      onBeforeAutoFill: () => {
        this.tableDataSnapshot.begin();
      },
      onAfterAutoFill: () => {
        this.tableDataSnapshot.end();
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
    // 添加表格中的组件
    this.attach(this.canvas);
    this.attach(this.screen);
    this.attach(this.xReSizer);
    this.attach(this.yReSizer);
    this.attach(this.xHeightLight);
    this.attach(this.yHeightLight);
    this.attach(this.edit);
    // 注册快捷键
    this.keyBoardTab = new KeyBoardTab(this);
  }

  bind() {
    super.bind();
    const { mousePointer } = this;
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.reset();
      this.render();
    });
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.reset();
      this.render();
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

  getFixedWidth() {
    const { xLeft } = this;
    return xLeft.getWidth();
  }

  getFixedHeight() {
    const { xTop } = this;
    return xTop.getHeight();
  }

  getIndexWidth() {
    const { index } = this;
    return index.getWidth();
  }

  getIndexHeight() {
    const { index } = this;
    return index.getHeight();
  }

  getScrollView() {
    const { xTableScrollView } = this;
    return xTableScrollView.getScrollView();
  }

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
      // console.log('ci >>', ci);
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
      // console.log('ri >>', ri);
    }

    return {
      ri, ci,
    };
  }

  setScale(value) {
    this.scale.setValue(value);
    this.screen.setDivideLayer();
    this.xHeightLight.setSize();
    this.yHeightLight.setSize();
    this.resize();
    this.trigger(Constant.TABLE_EVENT_TYPE.SCALE_CHANGE);
  }
}

export {
  Table as XTable,
  RENDER_MODE,
  VIEW_MODE,
};
