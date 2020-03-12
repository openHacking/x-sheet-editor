import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Scroll } from './Scroll';
import { Fixed } from './Fixed';
import { h } from '../../lib/Element';
import { Widget } from '../../lib/Widget';
import { RectRange } from './RectRange';
import { Merges } from './Merges';
import { Constant } from '../../utils/Constant';
import { EventBind } from '../../utils/EventBind';
import { Screen } from './screen/Screen';
import { ScreenSelector } from './selector/ScreenSelector';
import { ScreenCopyStyle } from './copystyle/ScreenCopyStyle';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { MousePointType } from './MousePoint';
import { ScreenAutoFill } from './autofill/ScreenAutoFill';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { Edit } from './Edit';
import { Cells } from './Cells';
import { Draw, floor, npx } from '../../canvas/Draw';
import { Font, TEXT_WRAP } from '../../canvas/Font';
import { Rect } from '../../canvas/Rect';
import { Crop } from '../../canvas/Crop';
import { Grid } from '../../canvas/Grid';
import { Box } from '../../canvas/Box';
import Format from './Format';
import { GridLineHandle } from './GridLineHandle';
import { DataSnapshot } from './DataSnapshot';
import { BorderLineHandle } from './BorderLineHandle';
import { Line, LINE_TYPE } from '../../canvas/Line';
import { LineHandle } from './LineHandle';

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

  getViewRange() {
    const width = this.getWidth();
    const height = this.getHeight();
    const { table } = this;
    const { fixed } = table;
    const { fxTop, fxLeft } = fixed;
    return new RectRange(0, 0, fxTop, fxLeft, width, height);
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cells,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    cells.getCellInViewRange(viewRange, (i, c, cell, rect) => {
      // 绘制背景
      rect.expandSize(grid.lineWidth());
      const box = new Box({ draw, rect });
      box.drawBackgroundColor(cell.background);
    });
    cells.getMergeCellInViewRange(viewRange, (rect, cell) => {
      // 绘制背景
      rect.expandSize(grid.lineWidth());
      const box = new Box({ draw, rect });
      box.drawBackgroundColor(cell.background);
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

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    cells.getCellInViewRange(viewRange, (i, c, cell, rect, overflow) => {
      // 绘制文字
      const font = new Font({
        text: Format(cell.format, cell.text),
        rect: rect.expandSize(grid.lineWidth()),
        dw: draw,
        overflow,
        attr: cell.fontAttr,
      });
      font.draw();
    });
    cells.getMergeCellInViewRange(viewRange, (rect, cell) => {
      // 绘制文字
      const font = new Font({
        text: Format(cell.format, cell.text),
        rect: rect.expandSize(grid.lineWidth()),
        dw: draw,
        overflow: null,
        attr: cell.fontAttr,
      });
      font.setTextWrap(TEXT_WRAP.WORD_WRAP);
      font.draw();
    });
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const { draw, grid } = table;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const viewRange = this.getViewRange();
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: viewRange.w,
      height: viewRange.h,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
    this.drawBackGround(viewRange, offsetX, offsetY);
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawBorder(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    crop.close();
  }
}

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

  getViewRange() {
    const { table } = this;
    return table.getViewRange();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cells,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    cells.getCellInViewRange(viewRange, (i, c, cell, rect) => {
      // 绘制背景
      rect.expandSize(grid.lineWidth());
      const box = new Box({ draw, rect });
      box.drawBackgroundColor(cell.background);
    });
    cells.getMergeCellInViewRange(viewRange, (rect, cell) => {
      // 绘制背景
      rect.expandSize(grid.lineWidth());
      const box = new Box({ draw, rect });
      box.drawBackgroundColor(cell.background);
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

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    cells.getCellInViewRange(viewRange, (i, c, cell, rect, overflow) => {
      // 绘制文字
      const font = new Font({
        text: Format(cell.format, cell.text),
        rect: rect.expandSize(grid.lineWidth()),
        dw: draw,
        overflow,
        attr: cell.fontAttr,
      });
      font.draw();
    });
    cells.getMergeCellInViewRange(viewRange, (rect, cell) => {
      // 绘制文字
      const font = new Font({
        text: Format(cell.format, cell.text),
        rect: rect.expandSize(grid.lineWidth()),
        dw: draw,
        overflow: null,
        attr: cell.fontAttr,
      });
      font.setTextWrap(TEXT_WRAP.WORD_WRAP);
      font.draw();
    });
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const { draw, grid } = table;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const viewRange = this.getViewRange();
    const width = viewRange.w;
    const height = viewRange.h;
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
    this.drawBackGround(viewRange, offsetX, offsetY);
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawBorder(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    crop.close();
  }
}

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
    const viewRange = table.getViewRange();
    return viewRange.h;
  }

  getViewRange() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const viewRange = table.getViewRange();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sci = 0;
    viewRange.eci = fxLeft;
    viewRange.w = width;
    viewRange.h = height;
    return viewRange;
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cells,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    cells.getCellInViewRange(viewRange, (i, c, cell, rect) => {
      // 绘制背景
      rect.expandSize(grid.lineWidth());
      const box = new Box({ draw, rect });
      box.drawBackgroundColor(cell.background);
    });
    cells.getMergeCellInViewRange(viewRange, (rect, cell) => {
      // 绘制背景
      rect.expandSize(grid.lineWidth());
      const box = new Box({ draw, rect });
      box.drawBackgroundColor(cell.background);
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

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    cells.getCellInViewRange(viewRange, (i, c, cell, rect, overflow) => {
      // 绘制文字
      const font = new Font({
        text: Format(cell.format, cell.text),
        rect: rect.expandSize(grid.lineWidth()),
        dw: draw,
        overflow,
        attr: cell.fontAttr,
      });
      font.draw();
    });
    cells.getMergeCellInViewRange(viewRange, (rect, cell) => {
      // 绘制文字
      const font = new Font({
        text: Format(cell.format, cell.text),
        rect: rect.expandSize(grid.lineWidth()),
        dw: draw,
        overflow: null,
        attr: cell.fontAttr,
      });
      font.setTextWrap(TEXT_WRAP.WORD_WRAP);
      font.draw();
    });
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const { draw } = table;
    const viewRange = this.getViewRange();
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
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawBorder(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    crop.close();
  }
}

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
    const viewRange = table.getViewRange();
    return viewRange.w;
  }

  getHeight() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    return table.rows.sectionSumHeight(0, fxTop);
  }

  getViewRange() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    const viewRange = table.getViewRange();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sri = 0;
    viewRange.eri = fxTop;
    viewRange.w = width;
    viewRange.h = height;
    return viewRange;
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cells,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    cells.getCellInViewRange(viewRange, (i, c, cell, rect) => {
      // 绘制背景
      rect.expandSize(grid.lineWidth());
      const box = new Box({ draw, rect });
      box.drawBackgroundColor(cell.background);
    });
    cells.getMergeCellInViewRange(viewRange, (rect, cell) => {
      // 绘制背景
      rect.expandSize(grid.lineWidth());
      const box = new Box({ draw, rect });
      box.drawBackgroundColor(cell.background);
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

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    cells.getCellInViewRange(viewRange, (i, c, cell, rect, overflow) => {
      // 绘制文字
      const font = new Font({
        text: Format(cell.format, cell.text),
        rect: rect.expandSize(grid.lineWidth()),
        dw: draw,
        overflow,
        attr: cell.fontAttr,
      });
      font.draw();
    });
    cells.getMergeCellInViewRange(viewRange, (rect, cell) => {
      // 绘制文字
      const font = new Font({
        text: Format(cell.format, cell.text),
        rect: rect.expandSize(grid.lineWidth()),
        dw: draw,
        overflow: null,
        attr: cell.fontAttr,
      });
      font.setTextWrap(TEXT_WRAP.WORD_WRAP);
      font.draw();
    });
    draw.offset(0, 0);
    draw.restore();
  }

  render() {
    const { table } = this;
    const { draw, grid } = table;
    const viewRange = this.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: viewRange.w,
      height: viewRange.h,
    });
    const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
    crop.open();
    this.drawBackGround(viewRange, offsetX, offsetY);
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawBorder(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    crop.close();
  }
}

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
    const viewRange = table.getViewRange();
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
    const viewRange = table.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sri = 0;
    viewRange.eri = 0;
    this.draw(viewRange, offsetX, offsetY, width, height);
  }
}

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
    const viewRange = table.getViewRange();
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
    const viewRange = table.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sci = 0;
    viewRange.eci = 0;
    this.draw(viewRange, offsetX, offsetY, width, height);
  }
}

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
    fxRight: -1,
  },
};

class Table extends Widget {

  constructor(settings) {
    super(`${cssPrefix}-table`);
    this.viewRange = null;
    this.canvas = h('canvas', `${cssPrefix}-table-canvas`);
    this.settings = Utils.mergeDeep({}, defaultSettings, settings);
    this.fixed = new Fixed(this.settings.fixed);
    this.rows = new Rows(this.settings.rows);
    this.cols = new Cols(this.settings.cols);
    this.cells = new Cells({
      table: this,
      rows: this.rows,
      cols: this.cols,
      data: this.settings.data,
    });
    this.merges = new Merges(this.settings.merges);
    this.scroll = new Scroll(this);
    // 表格线段处理
    this.lineHandle = new LineHandle(this);
    this.gridLineHandle = new GridLineHandle(this);
    this.borderLineHandle = new BorderLineHandle(this);
    // 撤销/反撤销
    this.dataSnapshot = new DataSnapshot(this);
    // 鼠标指针
    this.mousePointType = new MousePointType(this);
    // canvas 绘制资源
    this.draw = new Draw(this.canvas.el);
    this.line = new Line(this.draw, {
      convert: (sx, sy, ex, ey, row, col, pos) => {
        const internal = { sx, sy, ex, ey };
        const padding = 2;
        const merge = this.merges.getFirstIncludes(row, col);
        let external = { sx, sy, ex, ey };
        switch (pos) {
          case 'top': {
            const left = this.cells.isDisplayLeftBorder(row, col);
            const right = this.cells.isDisplayRightBorder(row, col);
            const left1 = this.cells.isDisplayLeftBorder(row - 1, col + 1);
            const right1 = this.cells.isDisplayRightBorder(row - 1, col - 1);
            const left2 = this.cells.isDisplayLeftBorder(row - 1, col);
            const right2 = this.cells.isDisplayRightBorder(row - 1, col);
            external.sy -= padding;
            external.ey -= padding;
            if (left) external.sx = sx - padding;
            if (right1 || left2) external.sx = sx + padding;
            if (right) external.ex = ex + padding;
            if (left1 || right2) external.ex = ex - padding;
            break;
          }
          case 'left': {
            const top = this.cells.isDisplayTopBorder(row, col);
            const bottom = this.cells.isDisplayBottomBorder(row, col);
            const top1 = this.cells.isDisplayTopBorder(row + 1, col - 1);
            const bottom1 = this.cells.isDisplayBottomBorder(row - 1, col - 1);
            const top2 = this.cells.isDisplayTopBorder(row, col - 1);
            const bottom2 = this.cells.isDisplayBottomBorder(row, col - 1);
            external.sx -= padding;
            external.ex -= padding;
            if (top) external.sy = sy - padding;
            if (bottom1 || top2) external.sy = sy + padding;
            if (bottom) external.ey = ey + padding;
            if (top1 || bottom2) external.ey = ey - padding;
            break;
          }
          case 'bottom': {
            const left = this.cells.isDisplayLeftBorder(row, col);
            const right = this.cells.isDisplayRightBorder(row, col);
            const left1 = this.cells.isDisplayLeftBorder(row + 1, col + 1);
            const right1 = this.cells.isDisplayRightBorder(row + 1, col - 1);
            const left2 = this.cells.isDisplayLeftBorder(row + 1, col);
            const right2 = this.cells.isDisplayRightBorder(row + 1, col);
            external.sy += padding;
            external.ey += padding;
            if (left) external.sx = sx - padding;
            if (right1 || left2) external.sx = sx + padding;
            if (right) external.ex = ex + padding;
            if (left1 || right2) external.ex = ex - padding;
            break;
          }
          case 'right': {
            const top = this.cells.isDisplayTopBorder(row, col);
            const bottom = this.cells.isDisplayBottomBorder(row, col);
            const top1 = this.cells.isDisplayTopBorder(row + 1, col + 1);
            const bottom1 = this.cells.isDisplayBottomBorder(row - 1, col + 1);
            const top2 = this.cells.isDisplayTopBorder(row, col + 1);
            const bottom2 = this.cells.isDisplayBottomBorder(row, col + 1);
            external.sx += padding;
            external.ex += padding;
            if (top) external.sy = sy - padding;
            if (bottom1 || top2) external.sy = sy + padding;
            if (bottom) external.ey = ey + padding;
            if (top1 || bottom2) external.ey = ey - padding;
            break;
          }
          default: break;
        }
        if (merge) {
          switch (pos) {
            case 'top': {
              const lastCol = merge.eci === col;
              internal.sx += padding;
              internal.ex += padding;
              internal.sy += padding;
              internal.ey += padding;
              if (lastCol) internal.ex = ex - padding;
              break;
            }
            case 'left': {
              const lastRow = merge.eri === row;
              internal.sx += padding;
              internal.ex += padding;
              internal.sy += padding;
              internal.ey += padding;
              if (lastRow) internal.ey = ey - padding;
              break;
            }
            case 'bottom': {
              const lastCol = merge.eci === col;
              internal.sx += padding;
              internal.ex += padding;
              internal.sy -= padding;
              internal.ey -= padding;
              if (lastCol) internal.ex = ex - padding;
              break;
            }
            case 'right': {
              const lastRow = merge.eri === row;
              internal.sx -= padding;
              internal.ex -= padding;
              internal.sy += padding;
              internal.ey += padding;
              if (lastRow) internal.ey = ey - padding;
              break;
            }
            default: break;
          }
        } else {
          switch (pos) {
            case 'top': {
              const left = this.cells.isDisplayLeftBorder(row, col);
              const right = this.cells.isDisplayRightBorder(row, col);
              const left1 = this.cells.isDisplayLeftBorder(row, col + 1);
              const right1 = this.cells.isDisplayRightBorder(row, col - 1);
              const left2 = this.cells.isDisplayLeftBorder(row - 1, col + 1);
              const right2 = this.cells.isDisplayRightBorder(row - 1, col - 1);
              const left3 = this.cells.isDisplayLeftBorder(row - 1, col);
              const right3 = this.cells.isDisplayRightBorder(row - 1, col);
              internal.sy += padding;
              internal.ey += padding;
              if (right2 || left3) internal.sx = sx - padding;
              if (left || right1) internal.sx = sx + padding;
              if (left2 || right3) internal.ex = ex + padding;
              if (right || left1) internal.ex = ex - padding;
              break;
            }
            case 'left': {
              const top = this.cells.isDisplayTopBorder(row, col);
              const bottom = this.cells.isDisplayBottomBorder(row, col);
              const top1 = this.cells.isDisplayTopBorder(row + 1, col);
              const bottom1 = this.cells.isDisplayBottomBorder(row - 1, col);
              const top2 = this.cells.isDisplayTopBorder(row + 1, col - 1);
              const bottom2 = this.cells.isDisplayBottomBorder(row - 1, col - 1);
              const top3 = this.cells.isDisplayTopBorder(row, col - 1);
              const bottom3 = this.cells.isDisplayBottomBorder(row, col - 1);
              internal.sx += padding;
              internal.ex += padding;
              if (bottom2 || top3) internal.sy = sy - padding;
              if (top || bottom1) internal.sy = sy + padding;
              if (top2 || bottom3) internal.ey = ey + padding;
              if (bottom || top1) internal.ey = ey - padding;
              break;
            }
            case 'bottom': {
              const left = this.cells.isDisplayLeftBorder(row, col);
              const right = this.cells.isDisplayRightBorder(row, col);
              const left1 = this.cells.isDisplayLeftBorder(row, col + 1);
              const right1 = this.cells.isDisplayRightBorder(row, col - 1);
              const left2 = this.cells.isDisplayLeftBorder(row + 1, col + 1);
              const right2 = this.cells.isDisplayRightBorder(row + 1, col - 1);
              const left3 = this.cells.isDisplayLeftBorder(row + 1, col);
              const right3 = this.cells.isDisplayRightBorder(row + 1, col);
              internal.sy -= padding;
              internal.ey -= padding;
              if (right2 || left3) internal.sx = sx - padding;
              if (left || right1) internal.sx = sx + padding;
              if (left2 || right3) internal.ex = ex + padding;
              if (right || left1) internal.ex = ex - padding;
              break;
            }
            case 'right': {
              const top = this.cells.isDisplayTopBorder(row, col);
              const bottom = this.cells.isDisplayBottomBorder(row, col);
              const top1 = this.cells.isDisplayTopBorder(row + 1, col);
              const bottom1 = this.cells.isDisplayBottomBorder(row - 1, col);
              const top2 = this.cells.isDisplayTopBorder(row + 1, col + 1);
              const bottom2 = this.cells.isDisplayBottomBorder(row - 1, col + 1);
              const top3 = this.cells.isDisplayTopBorder(row, col + 1);
              const bottom3 = this.cells.isDisplayBottomBorder(row, col + 1);
              internal.sx -= padding;
              internal.ex -= padding;
              if (bottom2 || top3) internal.sy = sy - padding;
              if (top || bottom1) internal.sy = sy + padding;
              if (top2 || bottom3) internal.ey = ey + padding;
              if (bottom || top1) internal.ey = ey - padding;
              break;
            }
            default: break;
          }
        }
        switch (pos) {
          case 'top': {
            const bottom = this.cells.isDisplayBottomBorder(row - 1, col);
            if (bottom) external = null;
            break;
          }
          case 'left': {
            const right = this.cells.isDisplayRightBorder(row, col - 1);
            if (right) external = null;
            break;
          }
          case 'bottom': {
            const top = this.cells.isDisplayTopBorder(row + 1, col);
            if (top) external = null;
            break;
          }
          case 'right': {
            const left = this.cells.isDisplayLeftBorder(row, col + 1);
            if (left) external = null;
            break;
          }
          default: break;
        }
        return { external, internal };
      },
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
    this.children(this.canvas);
    this.children(this.screen);
    this.children(this.xReSizer);
    this.children(this.yReSizer);
    this.children(this.xHeightLight);
    this.children(this.yHeightLight);
    this.children(this.edit);
    this.bind();
  }

  initScreenWidget() {
    const { dataSnapshot } = this;
    // 单元格筛选组件
    const screenSelector = new ScreenSelector(this.screen);
    screenSelector.addSelectChangeCb(() => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
    });
    screenSelector.addDownSelectCb(() => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN);
    });
    this.screen.addWidget(screenSelector);
    // 自动填充组件
    const screenAutoFill = new ScreenAutoFill(this.screen, {
      onAfterAutoFill: (count) => {
        if (count > 0) {
          dataSnapshot.snapshot(true);
        }
      },
    });
    this.screen.addWidget(screenAutoFill);
    // 样式复制
    const copyStyle = new ScreenCopyStyle(this.screen, {});
    this.screen.addWidget(copyStyle);
  }

  init() {
    this.initScreenWidget();
    this.screen.init();
    this.xReSizer.init();
    this.yReSizer.init();
    this.xHeightLight.init();
    this.yHeightLight.init();
    this.edit.init();
    this.resize();
  }

  checkedEnableBorderDrawOptimization() {
    const viewRange = this.getViewRange();
    let enable = true;
    this.cells.getCellInRectRange(viewRange, (r, c, cell) => {
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
    });
    if (enable) {
      this.borderLineHandle.openDrawOptimization();
      this.borderLineHandle.openBorderOptimization();
    } else {
      this.borderLineHandle.closeDrawOptimization();
      this.borderLineHandle.closeBorderOptimization();
    }
  }

  bind() {
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      const { x, y } = this.computeEventXy(e);
      const { ri, ci } = this.getRiCiByXy(x, y);
      if (ri === -1 && ci === -1) {
        this.mousePointType.set('cell', 'table-cell');
      } else if (ri === -1) {
        this.mousePointType.set('s-resize', 'table-ci');
      } else if (ci === -1) {
        this.mousePointType.set('e-resize', 'table-ri');
      } else {
        this.mousePointType.set('cell', 'table-cell');
      }
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.viewRange = null;
      this.render();
    });
  }

  resize() {
    const { draw } = this;
    const [width, height] = [this.visualWidth(), this.visualHeight()];
    draw.resize(width, height);
    this.render();
  }

  clear() {
    const { draw, settings } = this;
    const { width, height } = draw;
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(0, 0, width, height);
  }

  render() {
    const { settings, fixed } = this;
    if (settings.tipsRenderTime) {
      // eslint-disable-next-line no-console
      console.time();
    }
    this.checkedEnableBorderDrawOptimization();
    this.clear();
    this.frozenRect.render();
    // 冻结区域渲染
    if (fixed.fxLeft > -1 && fixed.fxTop > -1) {
      this.frozenLeftTop.render();
    }
    if (fixed.fxTop > -1) {
      this.fixedTop.render();
      this.frozenTopIndex.render();
    }
    if (fixed.fxLeft > -1) {
      this.fixedLeft.render();
      this.frozenLeftIndex.render();
    }
    // 固定索引渲染
    this.fixedLeftIndex.render();
    this.fixedTopIndex.render();
    // 表格内容渲染
    this.content.render();
    if (settings.tipsRenderTime) {
      // eslint-disable-next-line no-console
      console.log('渲染界面耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
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
      const viewRange = this.getViewRange();
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
      const viewRange = this.getViewRange();
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

  getViewRange() {
    if (this.viewRange === null) {
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
      this.viewRange = new RectRange(ri, ci, eri, eci, width, height);
    }
    return this.viewRange.clone();
  }

  getFixedWidth() {
    return this.fixedLeft.getWidth();
  }

  getFixedHeight() {
    return this.fixedTop.getHeight();
  }

  getIndexWidth() {
    const { settings } = this;
    return settings.index.width;
  }

  getIndexHeight() {
    const { settings } = this;
    return settings.index.height;
  }

  getContentWidth() {
    return this.content.getContentWidth();
  }

  getContentHeight() {
    return this.content.getContentHeight();
  }

  getCell(ri, ci) {
    const { cells } = this;
    return Utils.mergeDeep({}, cells.getCell(ri, ci));
  }

  setCell(ri, ci, cell) {
    const { cells, dataSnapshot } = this;
    Utils.mergeDeep(cells.getCellOrNew(ri, ci), cell);
    dataSnapshot.snapshot(true);
    this.render();
  }

  setWidth(ci, width) {
    const { cols } = this;
    cols.setWidth(ci, floor(width));
    this.render();
    this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH);
  }

  setHeight(ri, height) {
    const { rows } = this;
    rows.setHeight(ri, floor(height));
    this.render();
    this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
  }
}

export { Table };
