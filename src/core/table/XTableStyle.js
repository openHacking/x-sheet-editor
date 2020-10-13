import { PlainUtils } from '../../utils/PlainUtils';
import { Rows } from './tablebase/Rows';
import { Cols } from './tablebase/Cols';
import { SCROLL_TYPE } from './tablebase/Scroll';
import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { XDraw } from '../../canvas/XDraw';
import { Line, LINE_TYPE } from '../../canvas/Line';
import { Grid } from '../../canvas/Grid';
import { Crop } from '../../canvas/Crop';
import { Rect } from '../../canvas/Rect';
import XTableFormat from './XTableFormat';
import { Box } from '../../canvas/Box';
import { RectRange } from './tablebase/RectRange';
import { Cells } from './tablecell/Cells';
import { Scale, ScaleAdapter } from './tablebase/Scale';
import { Code } from './tablebase/Code';
import { Text } from './tablebase/Text';
import { StyleCellsHelper } from './helper/StyleCellsHelper';
import { BREAK_LOOP, TextCellsHelper } from './helper/TextCellsHelper';
import { Merges } from './tablebase/Merges';
import { TableHorizontalGrid } from './linehandle/grid/TableHorizontalGrid';
import { TableVerticalGrid } from './linehandle/grid/TableVerticalGrid';
import { TableHorizontalBorder } from './linehandle/border/TableHorizontalBorder';
import { TableVerticalBorder } from './linehandle/border/TableVerticalBorder';
import { ChainLogic, FilterChain } from './linehandle/filter/FilterChain';
import { XTableHistoryAreaView } from './XTableHistoryAreaView';
import { LineFilter } from './linehandle/filter/LineFilter';
import { LeftOutRangeFilter } from './linehandle/filter/outrange/LeftOutRangeFilter';
import { RightOutRangeFilter } from './linehandle/filter/outrange/RightOutRangeFilter';
import { OperateCellsHelper } from './helper/OperateCellsHelper';
import { BaseFont } from '../../canvas/font/BaseFont';
import { VIEW_MODE, XTableScrollView } from './XTableScrollView';
import { XFixedMeasure } from './tablebase/XFixedMeasure';
import { CellMergeCopyHelper } from './helper/CellMergeCopyHelper';

const RENDER_MODE = {
  SCROLL: Symbol('scroll'),
  RENDER: Symbol('render'),
  SCALE: Symbol('scale'),
};

//  ============================== 表格细节元素绘制 =============================

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
    indexGrid.horizonLine(0, indexHeight, indexWidth, indexHeight);
    indexGrid.verticalLine(indexWidth, dy, indexWidth, indexHeight);
    draw.restore();
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      this.draw();
    }
  }

}

class XTableFixedBar {

  constructor(table, {
    width, height, background, buttonColor,
  }) {
    this.table = table;
    this.height = height;
    this.width = width;
    this.background = background;
    this.buttonColor = buttonColor;
  }

  drawBar() {
    const {
      table, height, width, background,
    } = this;
    const {
      xFixedView, draw, index, xFixedMeasure,
    } = table;
    if (xFixedView.hasFixedTop()) {
      const rpxHeight = XDraw.transformStylePx(height);
      const width = table.visualWidth();
      const x = index.getWidth();
      const y = xFixedMeasure.getHeight() + index.getHeight() - rpxHeight / 2;
      draw.attr({ fillStyle: background });
      draw.fillRect(x, y, width, rpxHeight);
    }
    if (xFixedView.hasFixedLeft()) {
      const height = table.visualHeight();
      const rpxWidth = XDraw.transformStylePx(width);
      const x = xFixedMeasure.getWidth() + index.getWidth() - rpxWidth / 2;
      const y = index.getHeight();
      draw.attr({ fillStyle: background });
      draw.fillRect(x, y, rpxWidth, height);
    }
  }

  drawButton() {
    const {
      table, height, width, buttonColor,
    } = this;
    const {
      xFixedView, draw, index, xFixedMeasure,
    } = table;
    if (xFixedView.hasFixedTop()) {
      const rpxHeight = XDraw.transformStylePx(height);
      const width = index.getWidth();
      const x = 0;
      const y = xFixedMeasure.getHeight() + index.getHeight() - rpxHeight / 2;
      draw.attr({ fillStyle: buttonColor });
      draw.fillRect(x, y, width, rpxHeight);
    }
    if (xFixedView.hasFixedLeft()) {
      const height = index.getHeight();
      const rpxWidth = XDraw.transformStylePx(width);
      const x = xFixedMeasure.getWidth() + index.getWidth() - rpxWidth / 2;
      const y = 0;
      draw.attr({ fillStyle: buttonColor });
      draw.fillRect(x, y, rpxWidth, height);
    }
  }

  render() {
    const { table } = this;
    const renderMode = table.getRenderMode();
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      this.drawBar();
      this.drawButton();
    }
  }

}

// =============================== 表格绘制抽象类 ==============================

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
    this.scrollView = null;
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
    this.scrollView = null;
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
    if (PlainUtils.isNumber(this.drawX)) {
      return this.drawX;
    }
    const { table } = this;
    const x = this.getX();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.drawX = x;
      return x;
    }
    if (table.getRenderMode() === RENDER_MODE.SCALE) {
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
    if (PlainUtils.isNumber(this.drawY)) {
      return this.drawY;
    }
    const { table } = this;
    const y = this.getY();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.drawY = y;
      return y;
    }
    if (table.getRenderMode() === RENDER_MODE.SCALE) {
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
    if (PlainUtils.isNumber(this.borderX)) {
      return this.borderX;
    }
    const { table } = this;
    const x = this.getX();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.borderX = x;
      return x;
    }
    if (table.getRenderMode() === RENDER_MODE.SCALE) {
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
   * 绘制边框 & 网格的Y坐标
   */
  getLineY() {
    if (PlainUtils.isNumber(this.borderY)) {
      return this.borderY;
    }
    const { table } = this;
    const y = this.getY();
    if (table.getRenderMode() === RENDER_MODE.RENDER) {
      this.borderY = y;
      return y;
    }
    if (table.getRenderMode() === RENDER_MODE.SCALE) {
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
    if (PlainUtils.isNumber(this.mapOriginX)) {
      return this.mapOriginX;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    const x = this.getX();
    let mapOriginX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_LEFT: {
        mapOriginX = 0;
        break;
      }
      case SCROLL_TYPE.H_RIGHT: {
        const leaveView = xTableAreaView.getLeaveView();
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
    if (PlainUtils.isNumber(this.mapOriginY)) {
      return this.mapOriginY;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    const y = this.getY();
    let mapOriginY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_TOP: {
        mapOriginY = 0;
        break;
      }
      case SCROLL_TYPE.V_BOTTOM: {
        const leaveView = xTableAreaView.getLeaveView();
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
    if (PlainUtils.isNumber(this.mapTargetX)) {
      return this.mapTargetX;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    const x = this.getX();
    let mapTargetX = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.H_LEFT: {
        const enterView = xTableAreaView.getEnterView();
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
    if (PlainUtils.isNumber(this.mapTargetY)) {
      return this.mapTargetY;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    const y = this.getY();
    let mapTargetY = 0;
    switch (scroll.type) {
      case SCROLL_TYPE.V_TOP: {
        const enterView = xTableAreaView.getEnterView();
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
    if (PlainUtils.isNumber(this.mapWidth)) {
      return this.mapWidth;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    let mapWidth = this.getWidth();
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT: {
        const leaveView = xTableAreaView.getLeaveView();
        mapWidth -= leaveView.w;
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        const enterView = xTableAreaView.getEnterView();
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
    if (PlainUtils.isNumber(this.mapHeight)) {
      return this.mapHeight;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { scroll } = table;
    let mapHeight = this.getHeight();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        const leaveView = xTableAreaView.getLeaveView();
        mapHeight -= leaveView.h;
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        const enterView = xTableAreaView.getEnterView();
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
    if (PlainUtils.isNotUnDef(this.borderView)) {
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
        draw, el,
      } = table;
      const mapWidth = this.getMapWidth();
      const mapHeight = this.getMapHeight();
      const ox = this.getMapOriginX();
      const oy = this.getMapOriginY();
      const tx = this.getMapTargetX();
      const ty = this.getMapTargetY();
      draw.drawImage(el, ox, oy, mapWidth, mapHeight,
        tx, ty, mapWidth, mapHeight);
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
    } else if (RENDER_MODE.RENDER) {
      const height = this.getHeight();
      const width = this.getWidth();
      draw.fillRect(dx, dy, width, height);
    }
  }

}

class XTableContentUI extends XTableUI {

  /**
   * 绘制越界文本
   */
  drawBoundOutFont() {
    const scrollView = this.getScrollView();
    const { table } = this;
    const {
      draw, cols, textCellsHelper, cells, textFont, merges,
    } = table;
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    draw.offset(drawX, drawY);
    // 左边区域
    const lView = scrollView.clone();
    lView.sci = 0;
    lView.eci = scrollView.sci - 1;
    if (lView.eci > -1) {
      let max;
      textCellsHelper.getCellByViewRange({
        reverseCols: true,
        rectRange: lView,
        newCol: (col) => {
          max += cols.getWidth(col);
        },
        newRow: () => {
          max = 0;
        },
        callback: (row, col, cell, rect, overflow) => {
          if (merges.getFirstIncludes(row, col)) {
            return BREAK_LOOP.ROW;
          }
          const { text } = cell;
          if (PlainUtils.isBlank(text)) {
            return BREAK_LOOP.CONTINUE;
          }
          const { fontAttr } = cell;
          const { align, textWrap } = fontAttr;
          const allowAlign = align === BaseFont.ALIGN.left
            || align === BaseFont.ALIGN.center;
          if (allowAlign && textWrap === BaseFont.TEXT_WRAP.OVER_FLOW) {
            const size = cells.getCellBoundOutSize(row, col);
            if (size === 0 || size > max) {
              const {
                format, text, fontAttr,
              } = cell;
              const builder = textFont.getBuilder();
              builder.setDraw(draw);
              builder.setText(XTableFormat(format, text));
              builder.setAttr(fontAttr);
              builder.setRect(rect);
              builder.setOverFlow(overflow);
              const font = builder.build();
              cell.setContentWidth(font.draw());
            }
          }
          return BREAK_LOOP.ROW;
        },
      });
    }
    // 右边区域
    const rView = scrollView.clone();
    rView.sci = scrollView.eci + 1;
    rView.eci = cols.len - 1;
    if (rView.sci < cols.len) {
      let max;
      textCellsHelper.getCellSkipMergeCellByViewRange({
        rectRange: rView,
        startX: scrollView.w,
        newCol: (col) => {
          max += cols.getWidth(col);
        },
        newRow: () => {
          max = 0;
        },
        callback: (row, col, cell, rect, overflow) => {
          if (merges.getFirstIncludes(row, col)) {
            return BREAK_LOOP.ROW;
          }
          const { text } = cell;
          if (PlainUtils.isBlank(text)) {
            return BREAK_LOOP.CONTINUE;
          }
          const { fontAttr } = cell;
          const { align, textWrap } = fontAttr;
          const allowAlign = align === BaseFont.ALIGN.right
            || align === BaseFont.ALIGN.center;
          if (allowAlign && textWrap === BaseFont.TEXT_WRAP.OVER_FLOW) {
            const size = cells.getCellBoundOutSize(row, col);
            if (size === 0 || size > max) {
              const {
                format, text, fontAttr,
              } = cell;
              const builder = textFont.getBuilder();
              builder.setDraw(draw);
              builder.setText(XTableFormat(format, text));
              builder.setAttr(fontAttr);
              builder.setRect(rect);
              builder.setOverFlow(overflow);
              const font = builder.build();
              cell.setContentWidth(font.draw());
            }
          }
          return BREAK_LOOP.ROW;
        },
      });
    }
    draw.offset(0, 0);
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
      draw, textCellsHelper, textFont,
    } = table;
    draw.offset(drawX, drawY);
    textCellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: scrollView,
      callback: (row, col, cell, rect, overflow) => {
        const {
          format, text, fontAttr,
        } = cell;
        const builder = textFont.getBuilder();
        builder.setDraw(draw);
        builder.setText(XTableFormat(format, text));
        builder.setAttr(fontAttr);
        builder.setRect(rect);
        builder.setOverFlow(overflow);
        const font = builder.build();
        cell.setContentWidth(font.draw());
      },
    });
    textCellsHelper.getMergeCellByViewRange({
      rectRange: scrollView,
      callback: (rect, cell) => {
        const {
          format, text, fontAttr,
        } = cell;
        const builder = textFont.getBuilder();
        builder.setDraw(draw);
        builder.setText(XTableFormat(format, text));
        builder.setAttr(fontAttr);
        builder.setRect(rect);
        const font = builder.build();
        cell.setContentWidth(font.draw());
      },
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
      draw, styleCellsHelper, merges,
    } = table;
    draw.offset(drawX, drawY);
    styleCellsHelper.getMergeCellByViewRange({
      rectRange: scrollView,
      callback: (rect, cell) => {
        const { background } = cell;
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(background);
      },
    });
    styleCellsHelper.getCellByViewRange({
      rectRange: scrollView,
      callback: (row, col, cell, rect) => {
        const merge = merges.getFirstIncludes(row, col);
        if (merge && (merge.sri !== row || merge.sci !== row)) {
          return;
        }
        const { background } = cell;
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(background);
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
      draw, grid, cellHorizontalGrid, cellVerticalGrid,
    } = table;
    draw.offset(borderX, borderY);
    const coincide = cellHorizontalGrid.getMergeCoincideRange({
      viewRange: borderView,
    });
    const brink = cellHorizontalGrid.getCoincideRangeBrink({
      coincide,
    });
    // 绘制单元格水平线段
    // 和垂直线段
    const horizontalLine = cellHorizontalGrid.getHorizontalLine({
      viewRange: borderView,
    });
    const verticalLine = cellVerticalGrid.getVerticalLine({
      viewRange: borderView,
    });
    horizontalLine.forEach((item) => {
      grid.horizonLine(item.sx, item.sy, item.ex, item.ey);
    });
    verticalLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    // 绘制合并单元格水平线段
    // 和垂直线段
    const mergeHorizontalLine = cellHorizontalGrid.getMergeHorizontalLine({
      brink,
    });
    const mergeVerticalLine = cellVerticalGrid.getMergeVerticalLine({
      brink,
    });
    mergeHorizontalLine.forEach((item) => {
      grid.horizonLine(item.sx, item.sy, item.ex, item.ey);
    });
    mergeVerticalLine.forEach((item) => {
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
      draw, line, cellHorizontalBorder, cellVerticalBorder,
    } = table;
    draw.offset(borderX, borderY);
    const coincide = cellHorizontalBorder.getMergeCoincideRange({
      viewRange: borderView,
    });
    const brink = cellHorizontalBorder.getCoincideRangeBrink({
      coincide,
    });
    // 绘制单元格水平线段
    // 和垂直线段
    const bottomHorizontalLine = cellHorizontalBorder.getBottomHorizontalLine({
      viewRange: borderView,
    });
    const topHorizontalLine = cellHorizontalBorder.getTopHorizontalLine({
      viewRange: borderView,
    });
    const leftVerticalLine = cellVerticalBorder.getLeftVerticalLine({
      viewRange: borderView,
    });
    const rightVerticalLine = cellVerticalBorder.getRightVerticalLine({
      viewRange: borderView,
    });
    topHorizontalLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, widthType, type } = top;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.horizonLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    bottomHorizontalLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, widthType, type } = bottom;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.horizonLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    leftVerticalLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, widthType, type } = left;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.verticalLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    rightVerticalLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, widthType, type } = right;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.verticalLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    // 绘制合并单元格水平线段
    // 和垂直线段
    const topMergeHorizontalLine = cellHorizontalBorder.getTopMergeHorizontalLine({
      brink,
    });
    const bottomMergeHorizontalLine = cellHorizontalBorder.getBottomMergeHorizontalLine({
      brink,
    });
    const leftMergeVerticalLine = cellVerticalBorder.getLeftMergeVerticalLine({
      brink,
    });
    const rightMergeVerticalLine = cellVerticalBorder.getRightMergeVerticalLine({
      brink,
    });
    topMergeHorizontalLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, widthType, type } = top;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.horizonLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    bottomMergeHorizontalLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, widthType, type } = bottom;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.horizonLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    leftMergeVerticalLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, widthType, type } = left;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.verticalLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    rightMergeVerticalLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, widthType, type } = right;
      line.setType(type);
      line.setWidthType(widthType);
      line.setColor(color);
      line.verticalLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
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
    // 渲染贴图
    this.drawMap();
    // 清空画布
    this.drawClear();
    // 裁剪界面
    const scrollView = this.getScrollView();
    const x = this.getDrawX();
    const y = this.getDrawY();
    const width = scrollView.w;
    const height = scrollView.h;
    const {
      draw,
    } = table;
    const crop = new Crop({
      rect: new Rect({ x, y, width, height }),
      draw,
    });
    crop.open();
    // 绘制背景
    this.drawColor();
    // 绘制文字
    this.drawFont();
    this.drawBoundOutFont();
    // 绘制网格
    if (this.table.settings.table.showGrid) {
      this.drawGrid();
    }
    // 绘制边框
    this.drawBorder();
    crop.close();
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
      font: `${index.getSize()}px Arial`,
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
      draw, indexGrid, leftIndexHorizontalGrid, leftIndexVerticalGrid,
    } = table;
    draw.offset(borderX, borderY);
    const horizontalLine = leftIndexHorizontalGrid.getHorizontalLine({
      viewRange: borderView,
    });
    const verticalLine = leftIndexVerticalGrid.getVerticalLine({
      viewRange: borderView,
    });
    horizontalLine.forEach((item) => {
      indexGrid.horizonLine(item.sx, item.sy, item.ex, item.ey);
    });
    verticalLine.forEach((item) => {
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
      font: `${index.getSize()}px Arial`,
      fillStyle: index.getColor(),
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.fillText(PlainUtils.stringAt(i), x + (cw / 2), height / 2);
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
      draw, indexGrid, topIndexVerticalGrid, topIndexHorizontalGrid,
    } = table;
    draw.offset(borderX, borderY);
    const horizontalLine = topIndexHorizontalGrid.getHorizontalLine({
      viewRange: borderView,
    });
    const verticalLine = topIndexVerticalGrid.getVerticalLine({
      viewRange: borderView,
    });
    horizontalLine.forEach((item) => {
      indexGrid.horizonLine(item.sx, item.sy, item.ex, item.ey);
    });
    verticalLine.forEach((item) => {
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

// ============================ 表格冻结区域内容绘制 =============================

class XTableFrozenTopIndex extends XTableTopIndexUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { index } = table;
    const height = index.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const y = 0;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const {
      rows, cols, xFixedView,
    } = table;
    const fixedView = xFixedView.getFixedView();
    const view = new RectRange(0, fixedView.sci, 0, fixedView.eci);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
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
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      super.render();
    }
  }

}

class XTableFrozenLeftIndex extends XTableLeftIndexUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const width = index.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const {
      rows, cols, xFixedView,
    } = table;
    const fixedView = xFixedView.getFixedView();
    const view = new RectRange(fixedView.sri, 0, fixedView.eri, 0);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
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
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      super.render();
    }
  }

}

class XTableFrozenContent extends XTableContentUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const {
      rows, cols, xFixedView,
    } = table;
    const view = xFixedView.getFixedView();
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
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
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      super.render();
    }
  }

}

// ============================ 表格动态区域内容绘制 =============================

class XTableTopIndex extends XTableTopIndexUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
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
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { index } = table;
    const height = index.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
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
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const y = 0;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    view.sri = 0;
    view.eri = 0;
    view.h = index.getHeight();
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = index.getHeight();
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { rows } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    if (PlainUtils.isNotUnDef(lastScrollView)) {
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

class XTableLeftIndex extends XTableLeftIndexUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const width = index.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
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
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
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
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { index } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    view.sci = 0;
    view.eci = 0;
    view.w = index.getWidth();
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = index.getWidth();
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { cols } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    if (PlainUtils.isNotUnDef(lastScrollView)) {
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

class XTableLeft extends XTableContentUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (PlainUtils.isNumber(this.height)) {
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
    if (PlainUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (PlainUtils.isNumber(this.y)) {
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
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const fixedView = xFixedView.getFixedView();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    view.sci = fixedView.sci;
    view.eci = fixedView.eci;
    view.w = cols.sectionSumWidth(view.sci, view.eci);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const fixedView = xFixedView.getFixedView();
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sci = fixedView.sci;
    scrollView.eci = fixedView.eci;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { cols } = table;
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    if (PlainUtils.isNotUnDef(lastScrollView)) {
      lastScrollView.sci = fixedView.sci;
      lastScrollView.eci = fixedView.eci;
      lastScrollView.w = cols.sectionSumWidth(lastScrollView.sci, lastScrollView.eci);
    }
    scrollView.sci = fixedView.sci;
    scrollView.eci = fixedView.eci;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableTop extends XTableContentUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
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
    if (PlainUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (PlainUtils.isNumber(this.x)) {
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
    if (PlainUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { rows } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const fixedView = xFixedView.getFixedView();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    view.sri = fixedView.sri;
    view.eri = fixedView.eri;
    view.h = rows.sectionSumHeight(view.sri, view.eri);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { rows } = table;
    const { xTableAreaView } = table;
    const fixedView = xFixedView.getFixedView();
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sri = fixedView.sri;
    scrollView.eri = fixedView.eri;
    scrollView.h = rows.sectionSumHeight(scrollView.sri, scrollView.eri);
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { rows } = table;
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    if (PlainUtils.isNotUnDef(lastScrollView)) {
      lastScrollView.sri = fixedView.sri;
      lastScrollView.eri = fixedView.eri;
      lastScrollView.h = rows.sectionSumHeight(lastScrollView.sci, lastScrollView.eci);
    }
    scrollView.sri = fixedView.sri;
    scrollView.eri = fixedView.eri;
    scrollView.h = rows.sectionSumHeight(scrollView.sci, scrollView.eci);
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

class XTableContent extends XTableContentUI {

  getWidth() {
    if (PlainUtils.isNumber(this.width)) {
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
    if (PlainUtils.isNumber(this.height)) {
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
    if (PlainUtils.isNumber(this.x)) {
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
    if (PlainUtils.isNumber(this.y)) {
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
    if (PlainUtils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    const view = PlainUtils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL
      ? enterView
      : scrollView;
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (PlainUtils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (PlainUtils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
    const viewMode = XTableScrollView.viewMode(lastScrollView, scrollView);
    this.viewMode = viewMode;
    return viewMode;
  }

}

// =============================== XTableStyle ==============================

class XTableStyle extends Widget {

  /**
   * xTableScrollView
   * @param xTableScrollView
   * @param settings
   * @param xFixedView
   * @param scroll
   */
  constructor({
    xTableScrollView,
    settings,
    xFixedView,
    scroll,
  }) {
    super(`${cssPrefix}-table-canvas`, 'canvas');
    // 表格设置
    this.settings = settings;
    // 冻结的视图 & 滚动的坐标
    this.scroll = scroll;
    this.xFixedView = xFixedView;
    // 渲染模式
    this.renderMode = RENDER_MODE.RENDER;
    // 表格数据配置
    this.scale = new Scale();
    this.index = new Code({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.transformStylePx(this.scale.goto(v)),
      }),
      ...this.settings.index,
    });
    this.rows = new Rows({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.transformStylePx(this.scale.goto(v)),
      }),
      ...this.settings.rows,
    });
    this.cols = new Cols({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.transformStylePx(this.scale.goto(v)),
        back: v => this.scale.back(v),
      }),
      ...this.settings.cols,
    });
    this.merges = new Merges({
      ...this.settings.merge,
      rows: this.rows,
      cols: this.cols,
    });
    this.cells = new Cells({
      rows: this.rows,
      cols: this.cols,
      data: this.settings.data,
      merges: this.merges,
    });
    this.xFixedMeasure = new XFixedMeasure({
      fixedView: this.xFixedView,
      cols: this.cols,
      rows: this.rows,
    });
    // 表格视图区域
    this.xTableAreaView = new XTableHistoryAreaView({
      xTableScrollView,
      scroll: this.scroll,
      rows: this.rows,
      cols: this.cols,
    });
    // 单元格辅助类
    this.operateCellsHelper = new OperateCellsHelper({
      xTableAreaView: this.xTableAreaView,
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
    });
    this.styleCellsHelper = new StyleCellsHelper({
      xTableAreaView: this.xTableAreaView,
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
    });
    this.textCellsHelper = new TextCellsHelper({
      xTableAreaView: this.xTableAreaView,
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
    });
    // 绘制资源
    const rightOutRangeFilter = new RightOutRangeFilter({
      merges: this.merges,
      cols: this.cols,
      cells: this.cells,
    });
    const leftOutRangeFilter = new LeftOutRangeFilter({
      merges: this.merges,
      cols: this.cols,
      cells: this.cells,
    });
    const rightShowFilter = new FilterChain(ChainLogic.AND, [
      new LineFilter((ri, ci) => {
        const cell = this.cells.getCell(ri, ci);
        if (PlainUtils.isUnDef(cell)) {
          return false;
        }
        return cell.borderAttr.right.display;
      }),
      new LineFilter((ri, ci) => rightOutRangeFilter.execute(ri, ci)),
    ]);
    const leftShowFilter = new FilterChain(ChainLogic.AND, [
      new LineFilter((ri, ci) => {
        const cell = this.cells.getCell(ri, ci);
        if (PlainUtils.isUnDef(cell)) {
          return false;
        }
        return cell.borderAttr.left.display;
      }),
      new LineFilter((ri, ci) => leftOutRangeFilter.execute(ri, ci)),
    ]);
    const topShowFilter = new LineFilter((ri, ci) => {
      const cell = this.cells.getCell(ri, ci);
      if (PlainUtils.isUnDef(cell)) {
        return false;
      }
      return cell.borderAttr.top.display;
    });
    const bottomShowFilter = new LineFilter((ri, ci) => {
      const cell = this.cells.getCell(ri, ci);
      if (PlainUtils.isUnDef(cell)) {
        return false;
      }
      return cell.borderAttr.bottom.display;
    });
    this.draw = new XDraw(this.el);
    this.line = new Line(this.draw, {
      leftShow: (ri, ci) => leftShowFilter.execute(ri, ci),
      topShow: (ri, ci) => topShowFilter.execute(ri, ci),
      rightShow: (ri, ci) => rightShowFilter.execute(ri, ci),
      bottomShow: (ri, ci) => bottomShowFilter.execute(ri, ci),
      iFMerge: (row, col) => this.merges.getFirstIncludes(row, col) !== null,
      iFMergeFirstRow: (row, col) => this.merges.getFirstIncludes(row, col).sri === row,
      iFMergeLastRow: (row, col) => this.merges.getFirstIncludes(row, col).eri === row,
      iFMergeFirstCol: (row, col) => this.merges.getFirstIncludes(row, col).sci === col,
      iFMergeLastCol: (row, col) => this.merges.getFirstIncludes(row, col).eci === col,
    });
    this.indexGrid = new Grid(this.draw, {
      color: this.index.getGridColor(),
    });
    this.grid = new Grid(this.draw, {
      color: this.settings.table.gridColor,
    });
    this.textFont = new Text({
      scaleAdapter: new ScaleAdapter({
        goto: v => this.scale.goto(v),
      }),
    });
    // 单元格网格处理
    this.cellHorizontalGrid = new TableHorizontalGrid({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      drawCheck: true,
    });
    this.cellVerticalGrid = new TableVerticalGrid({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      drawCheck: true,
    });
    // 索引网格处理
    this.topIndexHorizontalGrid = new TableHorizontalGrid({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      foldOnOff: false,
      getHeight: () => this.index.getHeight(),
    });
    this.topIndexVerticalGrid = new TableVerticalGrid({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      foldOnOff: false,
      getHeight: () => this.index.getHeight(),
    });
    this.leftIndexHorizontalGrid = new TableHorizontalGrid({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      foldOnOff: false,
      getWidth: () => this.index.getWidth(),
    });
    this.leftIndexVerticalGrid = new TableVerticalGrid({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      foldOnOff: false,
      getWidth: () => this.index.getWidth(),
    });
    // 单元格边框处理
    this.cellHorizontalBorder = new TableHorizontalBorder({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      drawOptimization: true,
    });
    this.cellVerticalBorder = new TableVerticalBorder({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      drawOptimization: true,
    });
    // 冻结内容
    this.xLeftFrozenIndex = new XTableFrozenLeftIndex(this);
    this.xTopFrozenIndex = new XTableFrozenTopIndex(this);
    this.xTableFrozenContent = new XTableFrozenContent(this);
    // 动态内容
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    // 细节内容
    this.xTableFrozenFullRect = new XTableFrozenFullRect(this);
    this.xTableFixedBar = new XTableFixedBar(this, settings.xFixedBar);
    // 同步合并单元格
    this.merges.sync();
  }

  /**
   * 边框渲染优化
   */
  drawBorderOptimize() {
    const { styleCellsHelper } = this;
    const { xTableAreaView } = this;
    const {
      cellHorizontalBorder,
      cellVerticalBorder,
    } = this;
    const scrollView = xTableAreaView.getScrollView();
    let enable = true;
    styleCellsHelper.getCellByViewRange({
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
      cellHorizontalBorder.enableOptimization();
      cellVerticalBorder.enableOptimization();
    } else {
      cellHorizontalBorder.disableOptimization();
      cellVerticalBorder.disableOptimization();
    }
  }

  /**
   * 渲染模式
   */
  getRenderMode() {
    const { renderMode } = this;
    return renderMode;
  }

  /**
   * 画布宽度
   * @returns {null|*}
   */
  visualWidth() {
    return this.el.width;
  }

  /**
   * 画布高度
   * @returns {null|*}
   */
  visualHeight() {
    return this.el.height;
  }

  /**
   * 重置变量区
   */
  reset() {
    const { xTableAreaView } = this;
    const { xLeftFrozenIndex } = this;
    const { xTopFrozenIndex } = this;
    const { xTableFrozenContent } = this;
    const { xLeftIndex } = this;
    const { xTopIndex } = this;
    const { xLeft } = this;
    const { xTop } = this;
    const { xContent } = this;
    xTableAreaView.reset();
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
   * 界面缩放
   * @param val
   */
  setScale(val = 1) {
    // 清空画布
    this.draw.attr({
      fillStyle: this.settings.table.background,
    });
    this.draw.fullRect();
    // 调整缩放级别
    this.scale.setValue(val);
    // 重新渲染界面
    this.renderMode = RENDER_MODE.SCALE;
    this.resize();
    this.renderMode = RENDER_MODE.RENDER;
  }

  /**
   * 重置界面大小
   */
  resize() {
    const {
      draw, xTableAreaView,
    } = this;
    const box = this.parent().box();
    draw.resize(box.width, box.height);
    xTableAreaView.undo();
    this.reset();
    this.render();
  }

  /**
   * 渲染静态界面
   */
  render() {
    const { xFixedView } = this;
    const { xTableFrozenFullRect } = this;
    const { xTableFixedBar } = this;
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
    if (xFixedView.hasFixedLeft() && xFixedView.hasFixedTop()) {
      xTableFrozenContent.render();
    }
    if (xFixedView.hasFixedTop()) {
      xLeftFrozenIndex.render();
      xTop.render();
    }
    if (xFixedView.hasFixedLeft()) {
      xTopFrozenIndex.render();
      xLeft.render();
    }
    xLeftIndex.render();
    xTopIndex.render();
    xContent.render();
    xTableFixedBar.render();
  }

  /**
   * 渲染滚动界面
   */
  scrolling() {
    const {
      xTableAreaView,
    } = this;
    this.reset();
    this.renderMode = RENDER_MODE.SCROLL;
    this.render();
    xTableAreaView.record();
    this.renderMode = RENDER_MODE.RENDER;
    this.reset();
  }

}

export {
  XTableStyle,
};
