import { Utils } from '../../utils/Utils';
import { Rows } from './tablebase/Rows';
import { Cols } from './tablebase/Cols';
import { SCROLL_TYPE } from './tablebase/Scroll';
import { BorderLineHandle } from './gridborder/BorderLineHandle';
import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';
import { XDraw } from '../../canvas/XDraw';
import { Line, LINE_TYPE } from '../../canvas/Line';
import { Grid } from '../../canvas/Grid';
import { LineHandle } from './gridborder/LineHandle';
import { GridLineHandle } from './gridborder/GridLineHandle';
import { Crop } from '../../canvas/Crop';
import { Rect } from '../../canvas/Rect';
import { ALIGN, TEXT_WRAP } from '../../canvas/Font';
import Format from './Format';
import { Box } from '../../canvas/Box';
import { RectRange } from './tablebase/RectRange';
import { Cells } from './tablecell/Cells';
import { Scale, ScaleAdapter } from './tablebase/Scale';
import { Code } from './tablebase/Code';
import { Text } from './tablebase/Text';
import { StyleCellsHelper } from './helper/StyleCellsHelper';
import { TextCellsHelper } from './helper/TextCellsHelper';
import { Merges } from './tablebase/Merges';
import {
  XTableScrollView, VIEW_MODE, XTableHistoryAreaView,
} from './XTableScrollView';
import {
  TableDataSnapshot,
} from './datasnapshot/TableDataSnapshot';

const RENDER_MODE = {
  SCROLL: Symbol('scroll'),
  RENDER: Symbol('render'),
  SCALE: Symbol('scale'),
};

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
    if (Utils.isNumber(this.drawX)) {
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
    if (Utils.isNumber(this.drawY)) {
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
    if (Utils.isNumber(this.borderX)) {
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
    if (Utils.isNumber(this.borderY)) {
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
    if (Utils.isNumber(this.mapOriginX)) {
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
    if (Utils.isNumber(this.mapOriginY)) {
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
    if (Utils.isNumber(this.mapTargetX)) {
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
    if (Utils.isNumber(this.mapTargetY)) {
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
    if (Utils.isNumber(this.mapWidth)) {
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
    if (Utils.isNumber(this.mapHeight)) {
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
      draw, cols, textCellsHelper, cells, textFont, scale,
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
      textCellsHelper.getCellSkipMergeCellByViewRange({
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
            scale.useFloat();
            const { align } = fontAttr;
            const builder = textFont.getBuilder();
            builder.setDraw(draw);
            builder.setText(Format(format, text));
            builder.setAttr(fontAttr);
            builder.setRect(rect);
            builder.setOverFlow(overflow);
            const font = builder.build();
            font.setOverflowCrop(align === ALIGN.center);
            cell.setContentWidth(font.draw());
            scale.notFloat();
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
      textCellsHelper.getCellSkipMergeCellByViewRange({
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
            scale.useFloat();
            const { align } = fontAttr;
            const builder = textFont.getBuilder();
            builder.setDraw(draw);
            builder.setText(Format(format, text));
            builder.setAttr(fontAttr);
            builder.setRect(rect);
            builder.setOverFlow(overflow);
            const font = builder.build();
            font.setOverflowCrop(align === ALIGN.center);
            cell.setContentWidth(font.draw());
            scale.notFloat();
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
      draw, textCellsHelper, textFont, scale,
    } = table;
    draw.offset(drawX, drawY);
    textCellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: scrollView,
      callback: (row, col, cell, rect, overflow) => {
        const {
          format, text, fontAttr,
        } = cell;
        scale.useFloat();
        const { align } = fontAttr;
        const builder = textFont.getBuilder();
        builder.setDraw(draw);
        builder.setText(Format(format, text));
        builder.setAttr(fontAttr);
        builder.setRect(rect);
        builder.setOverFlow(overflow);
        const font = builder.build();
        font.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
        scale.notFloat();
      },
    });
    textCellsHelper.getMergeCellByViewRange({
      rectRange: scrollView,
      callback: (rect, cell) => {
        const {
          format, text, fontAttr,
        } = cell;
        scale.useFloat();
        const builder = textFont.getBuilder();
        builder.setDraw(draw);
        builder.setText(Format(format, text));
        builder.setAttr(fontAttr);
        builder.setRect(rect);
        const font = builder.build();
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
        scale.notFloat();
      },
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
     * 绘制背景颜色
     */
  drawColor() {
    const scrollView = this.getScrollView();
    const { table } = this;
    const drawX = this.getDrawX();
    const drawY = this.getDrawY();
    const {
      draw, styleCellsHelper,
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

// ============================ 表格冻结区域内容绘制 =============================

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
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { rows, cols } = table;
    const { fixed } = table;
    const view = new RectRange(0, 0, fixed.fxTop, 0);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
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
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
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
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
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
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { rows, cols } = table;
    const { fixed } = table;
    const view = new RectRange(0, 0, 0, fixed.fxLeft);
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
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
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
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
    if (renderMode === RENDER_MODE.RENDER || renderMode === RENDER_MODE.SCALE) {
      this.draw();
    }
  }

}

// ============================ 表格动态区域内容绘制 =============================

class XTableLeftIndex extends XTableLeftIndexUI {

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
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    view.sci = 0;
    view.eci = 0;
    view.w = index.getWidth();
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
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
    if (Utils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { cols } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
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
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    view.sci = 0;
    view.eci = fixed.fxLeft;
    view.w = cols.sectionSumWidth(view.sci, view.eci);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
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
    const { xTableAreaView } = table;
    const { cols } = table;
    const { fixed } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
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
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    this.fullScrollView = scrollView;
    return scrollView.clone();
  }

  getViewMode() {
    if (Utils.isNotUnDef(this.viewMode)) {
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
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    view.sri = 0;
    view.eri = fixed.fxTop;
    view.h = rows.sectionSumHeight(view.sci, view.eci);
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
      return this.fullScrollView.clone();
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

  getViewMode() {
    if (Utils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { rows } = table;
    const { fixed } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
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
    if (Utils.isNotUnDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const renderMode = table.getRenderMode();
    const scrollView = xTableAreaView.getScrollView();
    const enterView = xTableAreaView.getScrollEnterView();
    let view;
    if (Utils.isNotUnDef(enterView) && renderMode === RENDER_MODE.SCROLL) {
      view = enterView;
    } else {
      view = scrollView;
    }
    view.sri = 0;
    view.eri = 0;
    view.h = index.getHeight();
    this.scrollView = view;
    return view.clone();
  }

  getFullScrollView() {
    if (Utils.isNotUnDef(this.fullScrollView)) {
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
    if (Utils.isNotUnDef(this.viewMode)) {
      return this.viewMode;
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { rows } = table;
    const lastScrollView = xTableAreaView.getLastScrollView();
    const scrollView = xTableAreaView.getScrollView();
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

// =============================== XTableImage ==============================

class XTableImage extends Widget {

  /**
   * xTableScrollView
   * @param xTableScrollView
   * @param settings
   * @param fixed
   * @param scroll
   */
  constructor({
    xTableScrollView,
    settings,
    fixed,
    scroll,
  }) {
    super(`${cssPrefix}-table-canvas`, 'canvas');
    // 表格设置
    this.settings = settings;
    // 冻结的视图 & 滚动的坐标
    this.fixed = fixed;
    this.scroll = scroll;
    // 渲染模式
    this.renderMode = RENDER_MODE.RENDER;
    // 表格数据配置
    this.scale = new Scale();
    this.index = new Code({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.rounding(XDraw.rpx(this.scale.goto(v))),
      }),
      ...this.settings.index,
    });
    this.rows = new Rows({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.rounding(XDraw.rpx(this.scale.goto(v))),
      }),
      ...this.settings.rows,
    });
    this.cols = new Cols({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.rounding(XDraw.rpx(this.scale.goto(v))),
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
    // 表格视图区域
    this.xTableAreaView = new XTableHistoryAreaView({
      xTableScrollView,
      scroll: this.scroll,
      rows: this.rows,
      cols: this.cols,
    });
    // 单元格辅助类
    this.styleCellsHelper = new StyleCellsHelper({
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      scale: this.scale,
    });
    this.textCellsHelper = new TextCellsHelper({
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      scale: this.scale,
    });
    // 数据快照
    this.tableDataSnapshot = new TableDataSnapshot(this);
    // 绘制资源
    this.draw = new XDraw(this.el);
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
    this.textFont = new Text({
      scaleAdapter: new ScaleAdapter({
        goto: v => this.scale.goto(v),
      }),
    });
    // 线段处理
    this.lineHandle = new LineHandle({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
    });
    this.leftIdxGridHandle = new GridLineHandle({
      checked: false,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      lineHandle: this.lineHandle,
      getWidth: () => this.index.getWidth(),
    });
    this.topIdxGridHandle = new GridLineHandle({
      checked: false,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      lineHandle: this.lineHandle,
      getHeight: () => this.index.getHeight(),
    });
    this.borderHandle = new BorderLineHandle({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      lineHandle: this.lineHandle,
    });
    this.gridHandle = new GridLineHandle({
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
      cells: this.cells,
      lineHandle: this.lineHandle,
    });
    // 冻结内容
    this.xTableFrozenFullRect = new XTableFrozenFullRect(this);
    this.xLeftFrozenIndex = new XTableFrozenLeftIndex(this);
    this.xTopFrozenIndex = new XTableFrozenTopIndex(this);
    this.xTableFrozenContent = new XTableFrozenContent(this);
    // 动态内容
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    // 画布大小
    this.visualWidthCache = null;
    this.visualHeightCache = null;
    // 同步合并单元格
    this.merges.sync();
  }

  /**
   * 边框渲染优化
   */
  drawBorderOptimize() {
    const { styleCellsHelper } = this;
    const { xTableAreaView } = this;
    const { borderHandle } = this;
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
      borderHandle.openDrawOptimization();
    } else {
      borderHandle.closeDrawOptimization();
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
    if (Utils.isNumber(this.visualWidthCache)) {
      return this.visualWidthCache;
    }
    const width = XDraw.rounding(XDraw.rpx(this.box().width));
    this.visualWidthCache = width;
    return width;
  }

  /**
   * 画布高度
   * @returns {null|*}
   */
  visualHeight() {
    if (Utils.isNumber(this.visualHeightCache)) {
      return this.visualHeightCache;
    }
    const height = XDraw.rounding(XDraw.rpx(this.box().height));
    this.visualHeightCache = height;
    return height;
  }

  /**
   * 重置界面大小
   */
  resize() {
    const {
      draw, xTableAreaView,
    } = this;
    const box = this.parent().box();
    this.visualWidthCache = null;
    this.visualHeightCache = null;
    draw.resize(box.width, box.height);
    xTableAreaView.undo();
    this.reset();
    this.render();
  }

  /**
   * 渲染滚动界面
   */
  scrolling() {
    const { xTableAreaView } = this;
    this.renderMode = RENDER_MODE.SCROLL;
    this.reset();
    this.render();
    xTableAreaView.record();
    this.renderMode = RENDER_MODE.RENDER;
  }

  /**
     * 渲染静态界面
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
  setScale(val) {
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
}

export {
  RENDER_MODE,
  VIEW_MODE,
  XTableImage,
};
