import { cssPrefix, Constant } from '../../constant/Constant';
import Format from './Format';
import { Utils } from '../../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Scroll } from './Scroll';
import { Fixed } from './Fixed';
import { Widget } from '../../lib/Widget';
import { RectRange } from './RectRange';
import { Merges } from './Merges';

import { EventBind } from '../../utils/EventBind';
import { Screen } from './screen/Screen';
import { SCREEN_SELECT_EVENT, ScreenSelector } from './screenwiget/selector/ScreenSelector';
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

// ========================= 冻结区域绘制 =======================

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
    draw.attr({
      globalAlpha: 0.3,
    });
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
    let lineHeight = 0;
    draw.attr({
      globalAlpha: 0.3,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      lineHeight += ch;
      grid.horizontalLine(0, y, width, y);
    });
    grid.verticalLine(width, 0, width, lineHeight);
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
    let lineWidth = 0;
    draw.attr({
      globalAlpha: 0.3,
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      lineWidth += cw;
      grid.verticalLine(x, 0, x, height);
    });
    grid.horizontalLine(0, height, lineWidth, height);
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

// ========================= 动态区域绘制 =======================

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

  drawClear() {
    const { table } = this;
    const { settings, draw, fixedTop } = table;
    const topHeight = fixedTop.getHeight();
    const indexHeight = table.getIndexHeight();
    const indexWidth = table.getIndexWidth();
    const selfWidth = this.getWidth();
    const selfHeight = this.getHeight();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(indexWidth, indexHeight + topHeight, selfWidth, selfHeight);
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    draw.attr({
      globalAlpha: 0.3,
    });
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
    const { draw, settings } = table;
    const viewRange = this.getScrollViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: viewRange.w,
      height: viewRange.h,
    });
    const crop = new Crop({ draw, rect });
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

  getScrollViewXOffset() {
    const { table } = this;
    return table.getScrollViewXOffset();
  }

  getScrollViewRange() {
    const { table } = this;
    return table.getScrollViewRange();
  }

  getContentViewRange() {
    const { table } = this;
    return table.getContentViewRange();
  }

  drawClear() {
    const { table } = this;
    const { settings, draw, fixedTop, fixedLeft } = table;
    const topHeight = fixedTop.getHeight();
    const leftWidth = fixedLeft.getWidth();
    const indexHeight = table.getIndexHeight();
    const indexWidth = table.getIndexWidth();
    const selfWidth = this.getWidth();
    const selfHeight = this.getHeight();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(indexWidth + leftWidth, indexHeight + topHeight, selfWidth, selfHeight);
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
    draw.attr({
      globalAlpha: 0.3,
    });
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

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const scrollViewXOffset = this.getScrollViewXOffset();
    const scrollViewRange = this.getScrollViewRange();
    const contentViewRange = this.getContentViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = scrollViewRange.w;
    const height = scrollViewRange.h;
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
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

  drawClear() {
    const { table } = this;
    const { settings, draw, fixedLeft } = table;
    const leftWidth = fixedLeft.getWidth();
    const indexHeight = table.getIndexHeight();
    const indexWidth = table.getIndexWidth();
    const selfWidth = this.getWidth();
    const selfHeight = this.getHeight();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(indexWidth + leftWidth, indexHeight, selfWidth, selfHeight);
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
    draw.attr({
      globalAlpha: 0.3,
    });
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

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const scrollViewXOffset = table.getScrollViewXOffset();
    const scrollViewRange = this.getScrollViewRange();
    const contentViewRange = this.getContentViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: scrollViewRange.w,
      height: scrollViewRange.h,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
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

  drawClear() {
    const { table } = this;
    const { settings, draw, fixedLeft } = table;
    const leftWidth = fixedLeft.getWidth();
    const indexWidth = table.getIndexWidth();
    const width = table.visualWidth();
    const selfHeight = this.getHeight();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(indexWidth + leftWidth, 0, width - (indexWidth + leftWidth), selfHeight);
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
    let lineWidth = 0;
    draw.attr({
      globalAlpha: 0.3,
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      lineWidth += cw;
      grid.verticalLine(x, 0, x, height);
      if (i === eci) grid.verticalLine(x + cw, 0, x + cw, height);
    });
    grid.horizontalLine(0, height, lineWidth, height);
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const viewRange = table.getScrollViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sri = 0;
    viewRange.eri = 0;
    this.draw(viewRange, offsetX, offsetY, width, height);
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

  drawClear() {
    const { table } = this;
    const { settings, draw, fixedTop } = table;
    const topHeight = fixedTop.getHeight();
    const indexHeight = table.getIndexHeight();
    const selfWidth = this.getWidth();
    const height = table.visualHeight();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(0, indexHeight + topHeight, selfWidth, height - (indexHeight + topHeight));
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
    let lineHeight = 0;
    draw.attr({
      globalAlpha: 0.3,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      lineHeight += ch;
      grid.horizontalLine(0, y, width, y);
      if (i === eri) grid.horizontalLine(0, y + ch, width, y + ch);
    });
    grid.verticalLine(width, 0, width, lineHeight);
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const viewRange = table.getScrollViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sci = 0;
    viewRange.eci = 0;
    this.draw(viewRange, offsetX, offsetY, width, height);
  }
}

// =========================== 快捷键 ==========================

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

// ======================== X-Sheet Table =======================

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
    borderColor: '#a7a7a7',
    showGrid: true,
  },
  data: [],
  rows: {
    len: 1000,
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
    // 绘制区域 & 绘制区域偏移量
    this.drawLastScrollViewRange = null;
    this.drawScrollViewRange = null;
    this.drawContentViewRange = null;
    this.drawScrollViewXOffset = null;
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
    // 表格线段处理
    this.lineHandle = new LineHandle(this);
    this.gridLineHandle = new GridLineHandle(this);
    this.borderLineHandle = new BorderLineHandle(this);
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
    const { mousePointer } = this;
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.reComputerViewRange();
      this.render();
    });
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.reComputerViewRange();
      this.render();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.reComputerViewRange();
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
    scroll.ci = ci;
    scroll.x = x1;
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.log('滚动条计算耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
    }
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
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
    scroll.ri = ri;
    scroll.y = y1;
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.log('滚动条计算耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
    }
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
  }


  visualHeight() {
    return this.box().height;
  }

  visualWidth() {
    return this.box().width;
  }


  resize() {
    const { draw } = this;
    const [width, height] = [this.visualWidth(), this.visualHeight()];
    draw.resize(width, height);
    this.reComputerViewRange();
    this.renderFrozen();
    this.render();
  }

  renderClear() {
    const {
      fixedLeft, content, fixedTop, fixedTopIndex, fixedLeftIndex,
    } = this;
    fixedLeft.drawClear();
    content.drawClear();
    fixedTop.drawClear();
    fixedTopIndex.drawClear();
    fixedLeftIndex.drawClear();
  }

  renderOptimization() {
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

  renderFrozen() {
    const { fixed } = this;
    // 冻结索引渲染
    this.frozenRect.render();
    if (fixed.fxTop > -1) {
      this.frozenTopIndex.render();
    }
    if (fixed.fxLeft > -1) {
      this.frozenLeftIndex.render();
    }
  }

  renderFixed() {
    const { fixed } = this;
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
    // 固定索引渲染
    this.fixedLeftIndex.render();
    this.fixedTopIndex.render();
  }

  renderContent() {
    // 表格内容渲染
    this.content.render();
  }

  render() {
    const { settings } = this;
    if (settings.tipsRenderTime) {
      // eslint-disable-next-line no-console
      console.time();
    }
    this.renderClear();
    this.renderOptimization();
    this.renderFixed();
    this.renderContent();
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


  reComputerViewRange() {
    // 渲染区域重置
    this.drawLastScrollViewRange = this.drawScrollViewRange;
    this.drawScrollViewRange = null;
    this.drawContentViewRange = null;
    this.drawScrollViewXOffset = null;
    // 当前渲染区域和上一次渲染区域
    // 多出来的部分和减少的部分
    this.drawScrollViewRangeReduced = null;
    this.drawScrollViewRangeAdded = null;
    // 重新计算绘制区域
    this.computerScrollViewRange();
    this.computerScrollViewXOffset();
    this.computerContentViewRange();
    this.computedScrollViewDifference();
  }

  computerScrollViewRange() {
    const {
      rows, cols, scroll, content,
    } = this;
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
    this.drawScrollViewRange = new RectRange(ri, ci, eri, eci, width, height);
  }

  computerScrollViewXOffset() {
    const { scroll, cols } = this;
    const { ci } = scroll;
    this.drawScrollViewXOffset = -cols.sectionSumWidth(0, ci - 1);
  }

  computerContentViewRange() {
    const scrollViewRange = this.getScrollViewRange();
    const { sri, eri } = scrollViewRange;
    const { cols } = this;
    scrollViewRange.set(sri, 0, eri, cols.len);
    scrollViewRange.w = cols.sectionSumWidth(0, scrollViewRange.eci);
    this.drawContentViewRange = scrollViewRange;
  }

  computedScrollViewDifference() {
    if (this.drawLastScrollViewRange) {
      // eslint-disable-next-line max-len
      const [drawScrollViewRangeReduced] = this.drawLastScrollViewRange.difference(this.drawScrollViewRange);
      if (drawScrollViewRangeReduced) this.drawScrollViewRangeReduced = drawScrollViewRangeReduced;
      // eslint-disable-next-line max-len
      const [drawScrollViewRangeAdded] = this.drawScrollViewRange.difference(this.drawLastScrollViewRange);
      if (drawScrollViewRangeAdded) this.drawScrollViewRangeAdded = drawScrollViewRangeAdded;
    }
  }

  getLastScrollViewRange() {
    const { drawScrollViewDifference } = this;
    if (drawScrollViewDifference) {
      return drawScrollViewDifference.clone();
    }
    return null;
  }

  getScrollViewRange() {
    const { drawScrollViewRange } = this;
    if (drawScrollViewRange) {
      return drawScrollViewRange.clone();
    }
    return null;
  }

  getScrollViewXOffset() {
    const { drawScrollViewXOffset } = this;
    if (drawScrollViewXOffset) {
      return drawScrollViewXOffset;
    }
    return 0;
  }

  getContentViewRange() {
    const { drawContentViewRange } = this;
    if (drawContentViewRange) {
      return drawContentViewRange.clone();
    }
    return null;
  }

  getScrollViewRangeAdded() {
    const { drawScrollViewRangeAdded } = this;
    if (drawScrollViewRangeAdded) {
      return drawScrollViewRangeAdded.clone();
    }
    return null;
  }

  getScrollViewRangeReduced() {
    const { drawScrollViewRangeReduced } = this;
    if (drawScrollViewRangeReduced) {
      return drawScrollViewRangeReduced.clone();
    }
    return null;
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
