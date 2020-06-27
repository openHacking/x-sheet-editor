import { cssPrefix, Constant } from '../../constant/Constant';
import Format from './Format';
import { Utils } from '../../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Scroll, SCROLL_TYPE } from './Scroll';
import { Fixed } from './Fixed';
import { Widget } from '../../lib/Widget';
import { RectRange } from './RectRange';
import { Merges } from './Merges';
import { EventBind } from '../../utils/EventBind';
import { Screen } from './screen/Screen';
import { ScreenCopyStyle } from './screenwiget/copystyle/ScreenCopyStyle';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { ScreenAutoFill } from './screenwiget/autofill/ScreenAutoFill';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { Edit } from './Edit';
import { Draw, npx } from '../../canvas/Draw';
import { ALIGN, Font, TEXT_WRAP } from '../../canvas/Font';
import { Rect } from '../../canvas/Rect';
import { Crop } from '../../canvas/Crop';
import { Grid } from '../../canvas/Grid';
import { Box } from '../../canvas/Box';
import { Line, LINE_TYPE } from '../../canvas/Line';
import { LineHandle } from './gridborder/LineHandle';
import { Cells } from './cells/Cells';
import { CellsHelper } from './CellsHelper';
import { GridLineHandle } from './gridborder/GridLineHandle';
import { BorderLineHandle } from './gridborder/BorderLineHandle';
import { TableDataSnapshot } from './datasnapshot/TableDataSnapshot';
import { MousePointer } from './MousePointer';
import { Keyboard } from './Keyboard';
import { Focus } from './Focus';
import {
  SCREEN_SELECT_EVENT,
  ScreenSelector,
} from './screenwiget/selector/ScreenSelector';

// ================================= 动态视图 =================================

class DynamicViewDifference {

  constructor(dynamicView) {
    this.dynamicView = dynamicView;
    // 滚动时的新区域
    this.subtractRange = null;
    this.addRange = null;
    // 渲染截图的坐标
    this.captureX = 0;
    this.captureY = 0;
    // 滚动区域渲染
    this.dwSubtractRange = null;
    this.dwAddRange = null;
    this.dwContentRange = null;
    // 渲染区域坐标
    this.dwXOffset = 0;
    this.dwYOffset = 0;
  }

  computerSubtractRange() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    const { lastScrollRange } = dynamicView;
    const { scrollRange } = dynamicView;
    const { cols, rows } = table;
    if (lastScrollRange) {
      const [subtractRange] = lastScrollRange.difference(scrollRange);
      if (subtractRange) {
        subtractRange.w = cols.rectRangeSumWidth(subtractRange);
        subtractRange.h = rows.rectRangeSumHeight(subtractRange);
        this.subtractRange = subtractRange;
      }
    }
  }

  computerAddRange() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    const { lastScrollRange } = dynamicView;
    const { scrollRange } = dynamicView;
    const { cols, rows } = table;
    if (lastScrollRange) {
      const [addRange] = scrollRange.difference(lastScrollRange);
      if (addRange) {
        addRange.w = cols.rectRangeSumWidth(addRange);
        addRange.h = rows.rectRangeSumHeight(addRange);
        this.addRange = addRange;
      }
    }
  }

  computerCaptureXY() {
    const { dynamicView } = this;
    const { addRange, subtractRange } = this;
    const { table } = dynamicView;
    const { scroll } = table;
    if (addRange && subtractRange) {
      const subtractWidth = subtractRange.w;
      const subtractHeight = subtractRange.h;
      const addedWidth = addRange.w;
      const addedHeight = addRange.h;
      let captureX = 0;
      let captureY = 0;
      switch (scroll.type) {
        case SCROLL_TYPE.V_TOP: {
          captureY = addedHeight;
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          captureY = -subtractHeight;
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          captureX = addedWidth;
          break;
        }
        case SCROLL_TYPE.H_RIGHT: {
          captureX = -subtractWidth;
          break;
        }
        default: break;
      }
      this.captureX = captureX;
      this.captureY = captureY;
    }
  }

  computerRange() {
    this.subtractRange = null;
    this.addRange = null;
    this.captureX = 0;
    this.captureY = 0;
    this.dwSubtractRange = null;
    this.dwAddRange = null;
    this.dwContentRange = null;
    this.dwXOffset = 0;
    this.dwYOffset = 0;
    this.computerSubtractRange();
    this.computerAddRange();
    this.computerDwSubtractRange();
    this.computerDwAddRange();
    this.computerDwContentRange();
    this.computerCaptureXY();
    this.computerDwOffsetXY();
  }

  computerDwSubtractRange() {
    const { subtractRange } = this;
    if (subtractRange) {
      this.dwSubtractRange = subtractRange.clone();
    }
  }

  computerDwAddRange() {
    const { dynamicView } = this;
    const { addRange } = this;
    const { table } = dynamicView;
    const { scroll } = table;
    if (addRange) {
      this.dwAddRange = addRange.clone();
      const { rows, cols } = table;
      switch (scroll.type) {
        case SCROLL_TYPE.H_RIGHT: {
          this.dwAddRange.sci -= 1;
          this.dwAddRange.w = cols.rectRangeSumWidth(this.dwAddRange);
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          this.dwAddRange.sri -= 1;
          this.dwAddRange.h = rows.rectRangeSumHeight(this.dwAddRange);
          break;
        }
        default: break;
      }
    }
  }

  computerDwContentRange() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    const { dwAddRange } = this;
    if (dwAddRange) {
      const { sri, eri } = dwAddRange;
      const { cols } = table;
      this.dwContentRange = dwAddRange.clone();
      this.dwContentRange.set(sri, 0, eri, cols.len);
      this.dwContentRange.w = cols.rectRangeSumWidth(this.dwContentRange);
    }
  }

  computerDwOffsetXY() {
    const { dynamicView } = this;
    const { dwAddRange } = this;
    const { table } = dynamicView;
    if (dwAddRange) {
      const width = dwAddRange.w;
      const height = dwAddRange.h;
      let dwXOffset = 0;
      let dwYOffset = 0;
      const { scroll } = table;
      switch (scroll.type) {
        case SCROLL_TYPE.V_TOP: {
          dwYOffset = 0;
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          const { rows } = table;
          const { scrollRange } = dynamicView;
          const h = rows.rectRangeSumHeight(scrollRange);
          dwYOffset = h - height;
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          dwXOffset = 0;
          break;
        }
        case SCROLL_TYPE.H_RIGHT: {
          const { cols } = table;
          const { scrollRange } = dynamicView;
          const w = cols.rectRangeSumWidth(scrollRange);
          dwXOffset = w - width;
          break;
        }
        default: break;
      }
      this.dwXOffset = dwXOffset;
      this.dwYOffset = dwYOffset;
    }
  }

  getCaptureX() {
    return this.captureX;
  }

  getCaptureY() {
    return this.captureY;
  }

  getDwXOffset() {
    return this.dwXOffset;
  }

  getDwYOffset() {
    return this.dwYOffset;
  }
}

class DynamicView {

  constructor(table) {
    this.difference = new DynamicViewDifference(this);
    this.table = table;
    this.lastScrollRange = null;
    this.scrollRange = null;
    this.contentRange = null;
    this.scrollXOffset = 0;
  }

  computerScrollRange() {
    const { table } = this;
    const {
      rows, cols, scroll, content,
    } = table;
    let [width, height] = [0, 0];
    const { ri, ci } = scroll;
    let [eri, eci] = [rows.len, cols.len];
    for (let i = ri; i < rows.len; i += 1) {
      height += rows.getHeight(i);
      eri = i;
      if (height > content.getHeight()) break;
    }
    for (let j = ci; j < cols.len; j += 1) {
      width += cols.getWidth(j);
      eci = j;
      if (width > content.getWidth()) break;
    }
    this.scrollRange = new RectRange(ri, ci, eri, eci, width, height);
  }

  computerContentRange() {
    const { table } = this;
    const { scrollRange } = this;
    const { sri, eri } = scrollRange;
    const { cols } = table;
    this.contentRange = scrollRange.clone();
    this.contentRange.set(sri, 0, eri, cols.len);
    this.contentRange.w = cols.rectRangeSumWidth(scrollRange);
  }

  computerScrollXOffset() {
    const { table } = this;
    const { scroll, cols } = table;
    const { ci } = scroll;
    this.scrollXOffset = -cols.sectionSumWidth(0, ci - 1);
  }

  computerRange() {
    this.lastScrollRange = this.scrollRange;
    this.scrollRange = null;
    this.contentRange = null;
    this.scrollXOffset = 0;
    this.computerScrollRange();
    this.computerContentRange();
    this.computerScrollXOffset();
    this.difference.computerRange();
  }

  getOriginScrollView() {
    const { scrollRange } = this;
    return scrollRange.clone();
  }

  getOriginContentView() {
    const { contentRange } = this;
    return contentRange.clone();
  }

  getScrollXOffset() {
    return this.scrollXOffset;
  }

  getScrollView() {
    const { scrollRange } = this;
    const { difference } = this;
    const { dwAddRange } = difference;
    if (dwAddRange) return dwAddRange.clone();
    return scrollRange.clone();
  }

  getContentView() {
    const { contentRange } = this;
    const { table } = this;
    const { scroll } = table;
    switch (scroll.type) {
      case SCROLL_TYPE.V_TOP:
      case SCROLL_TYPE.V_BOTTOM: {
        const { difference } = this;
        const { dwContentRange } = difference;
        if (dwContentRange) return dwContentRange.clone();
        break;
      }
      default: break;
    }
    return contentRange.clone();
  }
}

// ================================= 冻结内容 =================================

/**
 * 绘制图表左上固定的部分
 */
class FrozenLeftTop {
  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getYOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  getWidth() {
    const { table } = this;
    const { fixed, cols } = table;
    const { fxLeft } = fixed;
    return cols.sectionSumWidth(0, fxLeft);
  }

  getHeight() {
    const { table } = this;
    const { fixed, rows } = table;
    const { fxTop } = fixed;
    return rows.sectionSumHeight(0, fxTop);
  }

  getScrollViewRange() {
    const width = this.getWidth();
    const height = this.getHeight();
    const { table } = this;
    const { fixed } = table;
    const { fxTop, fxLeft } = fixed;
    return new RectRange(0, 0, fxTop, fxLeft, width, height);
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridLineHandle.hLine(viewRange);
    const vLine = gridLineHandle.vLine(viewRange);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridLineHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridLineHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBorder(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, line, lineHandle, borderLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderLineHandle.htLine(viewRange);
    const hbLine = borderLineHandle.hbLine(viewRange);
    const vlLine = borderLineHandle.vlLine(viewRange);
    const vrLine = borderLineHandle.vrLine(viewRange);
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
    const htMergeLine = borderLineHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderLineHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderLineHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderLineHandle.vrMergeLine(coincideViewBrink);
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
    draw.restore();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cellsHelper,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格背景
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    // 绘制合并单元格背景
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cellsHelper, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格文字
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect, overflow) => {
        // 绘制文字
        const { fontAttr } = cell;
        const { align } = fontAttr;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        cell.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
      },
    });
    // 绘制合并单元格文字
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制文字
        const { fontAttr } = cell;
        const font = new Font({
          text: Format(cell.format, cell.text),
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
    draw.restore();
  }

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const viewRange = this.getScrollViewRange();
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: viewRange.w,
      height: viewRange.h,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
    this.drawBackGround(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    if (settings.table.showGrid) {
      this.drawGrid(viewRange, offsetX, offsetY);
    }
    this.drawBorder(viewRange, offsetX, offsetY);
    crop.close();
  }
}

/**
 * 绘制图表左边固定的索引栏
 */
class FrozenLeftIndex {
  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    return 0;
  }

  getYOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  getWidth() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getHeight() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    return table.rows.sectionSumHeight(0, fxTop);
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const {
      draw, grid, rows, settings,
    } = table;
    const { sri, eri } = viewRange;
    draw.save();
    draw.offset(offsetX, offsetY);
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
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      grid.horizontalLine(0, y, width, y);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    const viewRange = new RectRange(0, 0, fxTop, 0, width, height);
    this.draw(viewRange, offsetX, offsetY, width, height);
  }
}

/**
 * 绘制图表顶部的索引栏
 */
class FrozenTopIndex {
  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getYOffset() {
    return 0;
  }

  getWidth() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    return table.cols.sectionSumWidth(0, fxLeft);
  }

  getHeight() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const {
      draw, grid, cols, settings,
    } = table;
    const { sci, eci } = viewRange;
    draw.save();
    draw.offset(offsetX, offsetY);
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
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      grid.verticalLine(x, 0, x, height);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    const viewRange = new RectRange(0, 0, 0, fxLeft, width, height);
    this.draw(viewRange, offsetX, offsetY, width, height);
  }
}

/**
 * 绘制图片固定区域
 */
class FrozenRect {
  constructor(table) {
    this.table = table;
  }

  draw(offsetX, offsetY, width, height) {
    const { table } = this;
    const { draw } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    this.draw(0, 0, index.width, index.height);
  }
}

// ================================= 内容坐标 =================================

class FixedTopOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedTopWidth = table.cols.sectionSumWidth(0, fxLeft);
    return index.width + fixedTopWidth;
  }

  getFixedYOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedTopWidth = table.cols.sectionSumWidth(0, fxLeft);
    return table.visualWidth() - (index.width + fixedTopWidth);
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    return table.rows.sectionSumHeight(0, fxTop);
  }
}

class FixedLeftOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    return table.cols.sectionSumWidth(0, fxLeft);
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return table.visualHeight() - (index.height + fixedTopHeight);
  }

  getFixedXOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getFixedYOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return index.height + fixedTopHeight;
  }

  getCaptureX() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureX = difference.getCaptureX();
    const xOffset = this.getFixedXOffset();
    return xOffset + captureX;
  }

  getCaptureY() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureY = difference.getCaptureX();
    const yOffset = this.getFixedYOffset();
    return yOffset + captureY;
  }

  getDwXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwXOffset = difference.getDwXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + dwXOffset;
  }

  getDwYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwYOffset = difference.getDwYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + dwYOffset;
  }
}

class ContentOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return fixedLeftWidth + index.width;
  }

  getFixedYOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return index.height + fixedTopHeight;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return table.visualWidth() - (fixedLeftWidth + index.width);
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return table.visualHeight() - (index.height + fixedTopHeight);
  }

  getCaptureX() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureX = difference.getCaptureX();
    const xOffset = this.getFixedXOffset();
    return xOffset + captureX;
  }

  getCaptureY() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureY = difference.getCaptureY();
    const yOffset = this.getFixedYOffset();
    return yOffset + captureY;
  }

  getDwXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwXOffset = difference.getDwXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + dwXOffset;
  }

  getDwYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwYOffset = difference.getDwYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + dwYOffset;
  }
}

class FixedTopIndexOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedTopWidth = table.cols.sectionSumWidth(0, fxLeft);
    return index.width + fixedTopWidth;
  }

  getFixedYOffset() {
    return 0;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedTopWidth = table.cols.sectionSumWidth(0, fxLeft);
    return table.visualWidth() - (index.width + fixedTopWidth);
  }

  getFixedHeight() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }
}

class FixedLeftIndexOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    return 0;
  }

  getFixedYOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return index.height + fixedTopHeight;
  }

  getFixedWidth() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return table.visualHeight() - (index.height + fixedTopHeight);
  }

  getCaptureX() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureX = difference.getCaptureX();
    const xOffset = this.getFixedXOffset();
    return xOffset + captureX;
  }

  getCaptureY() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureY = difference.getCaptureY();
    const yOffset = this.getFixedYOffset();
    return yOffset + captureY;
  }

  getDwXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwXOffset = difference.getDwXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + dwXOffset;
  }

  getDwYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwYOffset = difference.getDwYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + dwYOffset;
  }
}

// ================================= 动态内容 =================================

/**
 * 绘制图表顶部冻结的部分
 */
class FixedTop {

  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    const { table } = this;
    const { content } = table;
    return content.getXOffset();
  }

  getYOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const { height } = index;
    return height;
  }

  getWidth() {
    const { table } = this;
    const viewRange = table.getContentViewRange();
    return viewRange.w;
  }

  getHeight() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    return table.rows.sectionSumHeight(0, fxTop);
  }

  getScrollViewRange() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    const viewRange = table.getScrollViewRange();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sri = 0;
    viewRange.eri = fxTop;
    viewRange.w = width;
    viewRange.h = height;
    return viewRange;
  }

  getContentViewRange() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    const viewRange = table.getContentViewRange();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sri = 0;
    viewRange.eri = fxTop;
    viewRange.w = width;
    viewRange.h = height;
    return viewRange;
  }

  drawCells(viewRange, scrollViewXOffset, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cellsHelper, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格文字
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect, overflow) => {
        // console.log('rect>>>', rect);
        // console.log('i, c', i, c);
        // 绘制文字
        const { fontAttr } = cell;
        const { align } = fontAttr;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        font.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
      },
      startX: scrollViewXOffset,
    });
    // 绘制合并单元格文字
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制文字
        const { fontAttr } = cell;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow: null,
          attr: fontAttr,
        });
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
      },
      startX: scrollViewXOffset,
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridLineHandle.hLine(viewRange);
    const vLine = gridLineHandle.vLine(viewRange);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridLineHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridLineHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBorder(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, line, lineHandle, borderLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderLineHandle.htLine(viewRange);
    const hbLine = borderLineHandle.hbLine(viewRange);
    const vlLine = borderLineHandle.vlLine(viewRange);
    const vrLine = borderLineHandle.vrLine(viewRange);
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
    const htMergeLine = borderLineHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderLineHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderLineHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderLineHandle.vrMergeLine(coincideViewBrink);
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
    draw.restore();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cellsHelper,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格背景
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    // 绘制合并单元格背景
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const offset = table.fixedTopOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(x, y, width, height);
  }

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const { fixedTopOffset } = table;
    const scrollViewXOffset = table.getScrollViewXOffset();
    const scrollViewRange = this.getScrollViewRange();
    const contentViewRange = this.getContentViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const fixedWidth = fixedTopOffset.getFixedWidth();
    const fixedHeight = fixedTopOffset.getFixedHeight();
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: fixedWidth,
      height: fixedHeight,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
    this.renderClear();
    this.drawBackGround(scrollViewRange, offsetX, offsetY);
    this.drawCells(contentViewRange, scrollViewXOffset, offsetX, offsetY);
    if (settings.table.showGrid) {
      this.drawGrid(scrollViewRange, offsetX, offsetY);
    }
    this.drawBorder(scrollViewRange, offsetX, offsetY);
    crop.close();
  }
}

/**
 * 绘制图表左边冻结的部分
 */
class FixedLeft {

  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const { width } = index;
    return width;
  }

  getYOffset() {
    const { table } = this;
    const { content } = table;
    return content.getYOffset();
  }

  getWidth() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    // console.log('table.cols >>>', table.cols);
    return table.cols.sectionSumWidth(0, fxLeft);
  }

  getHeight() {
    const { table } = this;
    const viewRange = table.getContentViewRange();
    return viewRange.h;
  }

  getScrollViewRange() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const viewRange = table.getScrollViewRange();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sci = 0;
    viewRange.eci = fxLeft;
    viewRange.w = width;
    viewRange.h = height;
    return viewRange;
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridLineHandle.hLine(viewRange);
    const vLine = gridLineHandle.vLine(viewRange);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridLineHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridLineHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBorder(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, line, lineHandle, borderLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderLineHandle.htLine(viewRange);
    const hbLine = borderLineHandle.hbLine(viewRange);
    const vlLine = borderLineHandle.vlLine(viewRange);
    const vrLine = borderLineHandle.vrLine(viewRange);
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
    const htMergeLine = borderLineHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderLineHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderLineHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderLineHandle.vrMergeLine(coincideViewBrink);
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
    draw.restore();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cellsHelper,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格背景
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    // 绘制合并单元格背景
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cellsHelper, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格文字
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect, overflow) => {
        // 绘制文字
        const { fontAttr } = cell;
        const { align } = fontAttr;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        cell.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
      },
    });
    // 绘制合并单元格文字
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制文字
        const { fontAttr } = cell;
        const font = new Font({
          text: Format(cell.format, cell.text),
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
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const offset = table.fixedLeftOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(x, y, width, height);
  }

  render() {
    const { table } = this;
    const { draw, settings } = table;
    const { fixedLeftOffset } = table;
    const viewRange = this.getScrollViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const fixedWidth = fixedLeftOffset.getFixedWidth();
    const fixedHeight = fixedLeftOffset.getFixedHeight();
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: fixedWidth,
      height: fixedHeight,
    });
    const crop = new Crop({ draw, rect });
    crop.open();
    this.renderClear();
    this.drawBackGround(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    if (settings.table.showGrid) {
      this.drawGrid(viewRange, offsetX, offsetY);
    }
    this.drawBorder(viewRange, offsetX, offsetY);
    crop.close();
  }
}

/**
 * 绘制图表的主体内容
 */
class Content {

  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const { width } = index;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return fixedLeftWidth + width;
  }

  getYOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const { height } = index;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return height + fixedTopHeight;
  }

  getWidth() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const { width } = index;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return table.visualWidth() - (fixedLeftWidth + width);
  }

  getHeight() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const { height } = index;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return table.visualHeight() - (height + fixedTopHeight);
  }

  getScrollViewRange() {
    const { table } = this;
    return table.getScrollViewRange();
  }

  getContentWidth() {
    const { table } = this;
    const { cols, fixed } = table;
    const total = cols.totalWidth();
    const fixedWidth = cols.sectionSumWidth(0, fixed.fxLeft);
    return total - fixedWidth;
  }

  getContentHeight() {
    const { table } = this;
    const { rows, fixed } = table;
    const total = rows.totalHeight();
    const fixedHeight = rows.sectionSumHeight(0, fixed.fxTop);
    return total - fixedHeight;
  }

  drawCells(viewRange, scrollViewXOffset, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cellsHelper, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格文字
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect, overflow) => {
        // 绘制文字
        const { fontAttr } = cell;
        const { align } = fontAttr;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        font.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
        // Test
        // draw.attr({ globalAlpha: 0.3 });
        // draw.fillRect(rect.x, rect.y, cell.contentWidth, rect.height);
      },
      startX: scrollViewXOffset,
    });
    // 绘制合并单元格文字
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // console.log('rect >>>', rect);
        // 绘制文字
        const { fontAttr } = cell;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow: null,
          attr: fontAttr,
        });
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
      },
      startX: scrollViewXOffset,
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridLineHandle.hLine(viewRange);
    const vLine = gridLineHandle.vLine(viewRange);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridLineHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridLineHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBorder(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, line, lineHandle, borderLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderLineHandle.htLine(viewRange);
    const hbLine = borderLineHandle.hbLine(viewRange);
    const vlLine = borderLineHandle.vlLine(viewRange);
    const vrLine = borderLineHandle.vrLine(viewRange);
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
    const htMergeLine = borderLineHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderLineHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderLineHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderLineHandle.vrMergeLine(coincideViewBrink);
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
    draw.restore();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cellsHelper,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格背景
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    // 绘制合并单元格背景
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const { dynamicView } = table;
    const offset = table.contentOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    const dx = offset.getDwXOffset();
    const dy = offset.getDwYOffset();
    const cx = offset.getCaptureX();
    const cy = offset.getCaptureY();
    const { scroll } = table;
    const { canvas } = table;
    const { el } = canvas;
    const range = dynamicView.getScrollView();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM:
      case SCROLL_TYPE.V_TOP: {
        const [sx, ex, sy] = [x, x, y];
        draw.drawImage(el, sx, sy, width, height, ex, cy, width, height);
        draw.attr({ fillStyle: settings.table.background });
        // draw.attr({ fillStyle: "#000" });
        draw.fillRect(dx, dy, width, range.h);
        break;
      }
      case SCROLL_TYPE.H_RIGHT:
      case SCROLL_TYPE.H_LEFT: {
        const [sy, ey, sx] = [y, y, x];
        draw.drawImage(el, sx, sy, width, height, cx, ey, width, height);
        draw.attr({ fillStyle: settings.table.background });
        draw.fillRect(dx, dy, range.w, height);
        break;
      }
      default: {
        draw.attr({
          fillStyle: settings.table.background,
        });
        draw.fillRect(x, y, width, height);
      }
    }
  }

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const { contentOffset } = table;
    const { dynamicView } = table;
    const scrollXOffset = dynamicView.getScrollXOffset();
    const scrollView = dynamicView.getScrollView();
    const contentView = dynamicView.getContentView();
    const dx = contentOffset.getDwXOffset();
    const dy = contentOffset.getDwYOffset();
    const offsetX = contentOffset.getFixedXOffset();
    const offsetY = contentOffset.getFixedYOffset();
    const fixedWidth = contentOffset.getFixedWidth();
    const fixedHeight = contentOffset.getFixedHeight();
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: fixedWidth,
      height: fixedHeight,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
    this.renderClear();
    this.drawBackGround(scrollView, dx, dy);
    this.drawCells(contentView, scrollXOffset, offsetX, offsetY);
    if (settings.table.showGrid) {
      this.drawGrid(scrollView, dx, dy);
    }
    this.drawBorder(scrollView, dx, dy);
    crop.close();
  }
}

/**
 * 绘制图表顶部固定的索引栏
 */
class FixedTopIndex {

  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    const { table } = this;
    const { content } = table;
    return content.getXOffset();
  }

  getYOffset() {
    return 0;
  }

  getWidth() {
    const { table } = this;
    const viewRange = table.getScrollViewRange();
    const { sci, eci } = viewRange;
    return table.cols.sectionSumWidth(sci, eci);
  }

  getHeight() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const {
      draw, grid, cols, settings,
    } = table;
    const { sci, eci } = viewRange;
    draw.save();
    draw.offset(offsetX, offsetY);
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
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      grid.verticalLine(x, 0, x, height);
      if (i === eci) grid.verticalLine(x + cw, 0, x + cw, height);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const offset = table.fixedTopIndexOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(x, y, width, height);
  }

  render() {
    const { table } = this;
    const { fixedTopIndexOffset, grid, draw } = table;
    const viewRange = table.getScrollViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    const fixedWidth = fixedTopIndexOffset.getFixedWidth();
    const fixedHeight = fixedTopIndexOffset.getFixedHeight();
    viewRange.sri = 0;
    viewRange.eri = 0;
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: fixedWidth,
      height: fixedHeight,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
    this.renderClear();
    this.draw(viewRange, offsetX, offsetY, width, height);
    crop.close();
  }
}

/**
 * 绘制图表左边固定的索引栏
 */
class FixedLeftIndex {

  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    return 0;
  }

  getYOffset() {
    const { table } = this;
    const { content } = table;
    return content.getYOffset();
  }

  getWidth() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getHeight() {
    const { table } = this;
    const viewRange = table.getScrollViewRange();
    const { sri, eri } = viewRange;
    return table.rows.sectionSumHeight(sri, eri);
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const {
      draw, grid, rows, settings,
    } = table;
    const { sri, eri } = viewRange;
    draw.save();
    draw.offset(offsetX, offsetY);
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
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      grid.horizontalLine(0, y, width, y);
      if (i === eri) grid.horizontalLine(0, y + ch, width, y + ch);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const { dynamicView } = table;
    const offset = table.fixedLeftIndexOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    const dx = offset.getDwXOffset();
    const dy = offset.getDwYOffset();
    const cy = offset.getCaptureY();
    const { scroll } = table;
    const { canvas } = table;
    const { el } = canvas;
    const range = dynamicView.getScrollView();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM:
      case SCROLL_TYPE.V_TOP: {
        const [sx, ex, sy] = [x, x, y];
        draw.drawImage(el, sx, sy, width, height, ex, cy, width, height);
        draw.attr({ fillStyle: settings.table.background });
        draw.fillRect(dx, dy, width, range.h);
        break;
      }
      default: {
        draw.attr({
          fillStyle: settings.table.background,
        });
        draw.fillRect(x, y, width, height);
        break;
      }
    }
  }

  render() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixedLeftIndexOffset, grid, draw } = table;
    const scrollView = dynamicView.getScrollView();
    const dx = fixedLeftIndexOffset.getDwXOffset();
    const dy = fixedLeftIndexOffset.getDwYOffset();
    const fixedOffsetX = fixedLeftIndexOffset.getFixedXOffset();
    const fixedOffsetY = fixedLeftIndexOffset.getFixedYOffset();
    const fixedWidth = fixedLeftIndexOffset.getFixedWidth();
    const fixedHeight = fixedLeftIndexOffset.getFixedHeight();
    scrollView.sci = 0;
    scrollView.eci = 0;
    const rect = new Rect({
      x: fixedOffsetX,
      y: fixedOffsetY,
      width: fixedWidth,
      height: fixedHeight,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
    this.renderClear();
    this.draw(scrollView, dx, dy, fixedWidth, scrollView.h);
    crop.close();
  }
}

// ================================= 快捷键 ==================================

/**
 * tab 快捷键
 */
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

// ============================== X-Sheet Table ==============================

/**
 * 默认设置
 * @type {{tipsRenderTime: boolean,
 * data: [],
 * tipsScrollTime: boolean,
 * index: {
 * bgColor: string,
 * color: string,
 * width: number,
 * height: number},
 * fixed: {
 * fxLeft: number,
 * fxTop: number,
 * }
 * rows: {len: number,
 * height: number},
 * cols: {len: number,
 * width: number},
 * table: {borderColor: string,
 * background: string,
 * showGrid: boolean}, merges: []}}
 */
const defaultSettings = {
  tipsRenderTime: false,
  tipsScrollTime: false,
  index: {
    height: 30,
    width: 50,
    bgColor: '#f4f5f8',
    color: '#000000',
  },
  table: {
    background: '#ffffff',
    borderColor: '#e5e5e5',
    showGrid: true,
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
};

/**
 * Table
 * @author jerry
 */
class Table extends Widget {

  constructor(settings) {
    super(`${cssPrefix}-table`);
    this.settings = Utils.mergeDeep({}, defaultSettings, settings);
    this.canvas = new Widget(`${cssPrefix}-table-canvas`, 'canvas');
    // 动态区域计算
    this.dynamicView = new DynamicView(this);
    // 表格基本数据信息
    this.cells = new Cells({
      table: this,
      rows: this.rows,
      cols: this.cols,
      data: this.settings.data,
    });
    this.fixed = new Fixed(this.settings.fixed);
    this.rows = new Rows(this.settings.rows);
    this.cols = new Cols(this.settings.cols);
    this.merges = new Merges(this.settings.merges);
    this.scroll = new Scroll(this);
    // 帮助类
    this.cellsHelper = new CellsHelper({
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
    });
    // 焦点元素管理
    this.focus = new Focus(this);
    // 数据快照
    this.tableDataSnapshot = new TableDataSnapshot(this);
    // 鼠标指针
    this.mousePointer = new MousePointer(this);
    // 键盘快捷键
    this.keyboard = new Keyboard(this);
    // canvas 绘制资源
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
      color: this.settings.table.borderColor,
    });
    // 表格线段处理
    this.lineHandle = new LineHandle(this);
    this.borderLineHandle = new BorderLineHandle(this);
    this.gridLineHandle = new GridLineHandle(this);
    // table表绘制的各个部分位置和大小
    this.fixedTopOffset = new FixedTopOffset(this);
    this.fixedLeftOffset = new FixedLeftOffset(this);
    this.contentOffset = new ContentOffset(this);
    this.fixedTopIndexOffset = new FixedTopIndexOffset(this);
    this.fixedLeftIndexOffset = new FixedLeftIndexOffset(this);
    // table表绘制的各个部分
    this.content = new Content(this);
    this.fixedLeft = new FixedLeft(this);
    this.fixedTop = new FixedTop(this);
    this.fixedTopIndex = new FixedTopIndex(this);
    this.fixedLeftIndex = new FixedLeftIndex(this);
    this.frozenLeftTop = new FrozenLeftTop(this);
    this.frozenLeftIndex = new FrozenLeftIndex(this);
    this.frozenTopIndex = new FrozenTopIndex(this);
    this.frozenRect = new FrozenRect(this);
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
    const { mousePointer, dynamicView } = this;
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      dynamicView.computerRange();
      this.render();
    });
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      dynamicView.computerRange();
      this.render();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      dynamicView.computerRange();
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

  drawOptimization() {
    const { cellsHelper } = this;
    const viewRange = this.getContentViewRange();
    let enable = true;
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (r, c, cell) => {
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
      this.borderLineHandle.openDrawOptimization();
    } else {
      this.borderLineHandle.closeDrawOptimization();
    }
  }

  scrollX(x) {
    const {
      cols, fixed, settings, scroll,
    } = this;
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.time();
    }
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
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.log('滚动条计算耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
    }
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
    scroll.type = SCROLL_TYPE.UN;
  }

  scrollY(y) {
    const {
      rows, fixed, settings, scroll,
    } = this;
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.time();
    }
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
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.log('滚动条计算耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
    }
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
    scroll.type = SCROLL_TYPE.UN;
  }

  visualHeight() {
    return this.box().height;
  }

  visualWidth() {
    return this.box().width;
  }

  resize() {
    const { draw, dynamicView } = this;
    const [width, height] = [this.visualWidth(), this.visualHeight()];
    draw.resize(width, height);
    dynamicView.computerRange();
    this.render();
  }

  render() {
    const { settings, fixed } = this;
    if (settings.tipsRenderTime) {
      // eslint-disable-next-line no-console
      console.time();
    }
    this.drawOptimization();
    this.frozenRect.render();
    // 渲染固定冻结的内容
    if (fixed.fxLeft > -1 && fixed.fxTop > -1) {
      this.frozenLeftTop.render();
    }
    if (fixed.fxTop > -1) {
      this.fixedTop.render();
    }
    if (fixed.fxLeft > -1) {
      this.fixedLeft.render();
    }
    // 表格内容渲染
    this.content.render();
    // 冻结索引渲染
    if (fixed.fxTop > -1) {
      this.frozenTopIndex.render();
    }
    if (fixed.fxLeft > -1) {
      this.frozenLeftIndex.render();
    }
    // 固定索引渲染
    this.fixedLeftIndex.render();
    this.fixedTopIndex.render();
    if (settings.tipsRenderTime) {
      // eslint-disable-next-line no-console
      console.log('渲染界面耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
    }
  }

  getContentWidth() {
    return this.content.getContentWidth();
  }

  getContentHeight() {
    return this.content.getContentHeight();
  }

  getFixedWidth() {
    return this.fixedLeft.getWidth();
  }

  getFixedHeight() {
    return this.fixedTop.getHeight();
  }

  getContentViewRange() {
    const { dynamicView } = this;
    return dynamicView.getOriginContentView();
  }

  getScrollViewRange() {
    const { dynamicView } = this;
    return dynamicView.getOriginScrollView();
  }

  getScrollViewXOffset() {
    const { dynamicView } = this;
    return dynamicView.getScrollXOffset();
  }

  getRiCiByXy(x, y) {
    const {
      settings, fixed, rows, cols,
    } = this;
    const { index } = settings;
    const fixedHeight = this.fixedTop.getHeight();
    const fixedWidth = this.fixedLeft.getWidth();

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

  getIndexWidth() {
    const { settings } = this;
    return settings.index.width;
  }

  getIndexHeight() {
    const { settings } = this;
    return settings.index.height;
  }

  toString() {
    const data = {
      rows: {
        data: this.rows.getData(),
      },
      cols: {
        data: this.cols.getData(),
      },
      merges: {
        data: this.merges.getData(),
      },
    };
    return JSON.stringify(data);
  }
}


export {
  Table,
};
