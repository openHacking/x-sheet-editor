import { cssPrefix } from '../../config';
import { Utils } from '../../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Cells } from './Cells';
import { Scroll } from './Scroll';
import { Fixed } from './Fixed';
import { h } from '../../lib/Element';
import { Widget } from '../../lib/Widget';
import { RectRange } from './RectRange';
import { Draw, npx, thinLineWidth } from '../../graphical/Draw';
import { RectCut } from '../../graphical/rect/RectCut';
import { Rect } from '../../graphical/rect/Rect';
import { TextAttr } from '../../graphical/rect/TextAttr';
import { Merges } from './Merges';
import { Constant } from '../../utils/Constant';
import { Screen } from './screen/Screen';
import { ScreenSelector } from './selector/ScreenSelector';
import { RectDraw } from '../../graphical/rect/RectDraw';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { MousePointType } from './MousePoint';
import { EventBind } from '../../utils/EventBind';
import { ScreenAutoFill } from './selector/ScreenAutoFill';

const defaultSettings = {
  tipsRenderTime: true,
  tipsScrollTime: true,
  index: {
    height: 30,
    width: 50,
    bgColor: '#f4f5f8',
    color: '#000000',
  },
  table: {
    borderWidth: thinLineWidth(),
    borderColor: '#e9e9e9',
  },
  data: [],
  cell: {
    bgColor: '#ffffff',
    align: 'left',
    verticalAlign: 'middle',
    textWrap: false,
    strike: false,
    underline: false,
    color: '#000000',
    font: {
      name: 'Arial',
      size: 13,
      bold: false,
      italic: false,
    },
  },
  rows: {
    len: 1000,
    height: 30,
  },
  cols: {
    len: 80,
    width: 130,
  },
  merges: [],
  fixed: {
    fxTop: -1,
    fxLeft: -1,
    fxRight: -1,
  },
};

class Content {
  constructor(table) {
    this.table = table;
    this.scroll = new Scroll();
    this.scrollX(0);
    this.scrollY(0);
  }

  scrollX(x) {
    const start = Date.now();
    const { table, scroll } = this;
    const { cols, fixed, settings } = table;
    let { fxLeft } = fixed;
    fxLeft += 1;
    const [
      ci, left, width,
    ] = Utils.rangeReduceIf(fxLeft, cols.len, 0, 0, x, i => cols.getWidth(i));
    let x1 = left;
    if (x > 0) x1 += width;
    scroll.ci = ci;
    scroll.x = x1;
    const end = Date.now();
    const consume = end - start;
    if (consume > 16 && settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.log('滚动条计算消耗的时间', consume);
    }
  }

  scrollY(y) {
    const start = Date.now();
    const { table, scroll } = this;
    const { rows, fixed, settings } = table;
    let { fxTop } = fixed;
    fxTop += 1;
    const [
      ri, top, height,
    ] = Utils.rangeReduceIf(fxTop, rows.len, 0, 0, y, i => rows.getHeight(i));
    let y1 = top;
    if (y > 0) y1 += height;
    scroll.ri = ri;
    scroll.y = y1;
    const end = Date.now();
    const consume = end - start;
    if (consume > 16 && settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.log('滚动条计算消耗的时间', consume);
    }
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
    const { scroll, table } = this;
    const { rows, cols } = table;
    let [width, height] = [0, 0];
    const { ri, ci } = scroll;
    let [eri, eci] = [rows.len, cols.len];
    for (let i = ri; i < rows.len; i += 1) {
      height += rows.getHeight(i);
      eri = i;
      if (height > this.getHeight()) break;
    }
    for (let j = ci; j < cols.len; j += 1) {
      width += cols.getWidth(j);
      eci = j;
      if (width > this.getWidth()) break;
    }
    return new RectRange(ri, ci, eri, eci, width, height);
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, settings, rows, cols,
    } = table;
    const {
      sri, sci, eri, eci, w: width, h: height,
    } = viewRange;
    draw.save();
    draw.translate(offsetX, offsetY);
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
      if (i === eri) draw.line([0, y + ch], [width, y + ch]);
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.line([x, 0], [x, height]);
      if (i === eci) draw.line([x + cw, 0], [x + cw, height]);
    });
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, merges,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    const rectText = cells.getRectText(draw);
    cells.getRectRangeCell(viewRange, (i, c, rect, cell) => {
      // 剔除合并单元格
      if (merges.getFirstIncludes(i, c)) {
        return;
      }
      // 绘制文字
      const textAttr = new TextAttr(rect);
      const { style } = cell;
      rectText.setRect(textAttr);
      rectText.text(cell.text, style);
    });
    draw.restore();
  }

  drawMerge(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, merges, cols, rows, settings,
    } = table;
    let { borderWidth } = settings.table;
    borderWidth += 0.5;
    draw.save();
    draw.translate(offsetX, offsetY);
    const filter = [];
    const rectText = cells.getRectText(draw);
    cells.getRectRangeCell(viewRange, (i, c) => {
      const rectRange = merges.getFirstIncludes(i, c);
      if (!rectRange || filter.find(item => item === rectRange)) return;
      filter.push(rectRange);
      const cell = cells.getCell(rectRange.sri, rectRange.sci);
      const minSri = Math.min(viewRange.sri, rectRange.sri);
      let maxSri = Math.max(viewRange.sri, rectRange.sri);
      const minSci = Math.min(viewRange.sci, rectRange.sci);
      let maxSci = Math.max(viewRange.sci, rectRange.sci);
      maxSri -= 1;
      maxSci -= 1;
      let x = cols.sectionSumWidth(minSci, maxSci);
      let y = rows.sectionSumHeight(minSri, maxSri);
      x = viewRange.sci > rectRange.sci ? x * -1 : x;
      y = viewRange.sri > rectRange.sri ? y * -1 : y;
      const width = cols.sectionSumWidth(rectRange.sci, rectRange.eci);
      const height = rows.sectionSumHeight(rectRange.sri, rectRange.eri);
      const rect = new Rect({
        x: x + borderWidth,
        y: y + borderWidth,
        width: width - (borderWidth * 2),
        height: height - (borderWidth * 2),
      });
      const rectDraw = new RectDraw(draw, rect);
      rectDraw.fill('#fff');
      // 绘制文字
      const textAttr = new TextAttr(rect);
      const { style } = cell;
      rectText.setRect(textAttr);
      rectText.text(cell.text, style);
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { draw } = table;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    const viewRange = this.getViewRange();
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(thinLineWidth() / 2);
    this.drawMerge(viewRange, offsetX, offsetY);
    rectCut.closeCut();
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
    const { content } = table;
    const viewRange = content.getViewRange();
    return viewRange.h;
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, settings, rows, cols,
    } = table;
    const {
      sri, sci, eri, eci, w: width, h: height,
    } = viewRange;
    draw.save();
    draw.translate(offsetX, offsetY);
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    // console.log('width>>>', width);
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
      if (i === eri) draw.line([0, y + ch], [width, y + ch]);
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      if (i !== sci) draw.line([x, 0], [x, height]);
      draw.line([x, 0], [x, height]);
    });
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, merges,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    const rectText = cells.getRectText(draw);
    cells.getRectRangeCell(viewRange, (i, c, rect, cell) => {
      // 剔除合并单元格
      if (merges.getFirstIncludes(i, c)) {
        return;
      }
      // 绘制文字
      const textAttr = new TextAttr(rect);
      const { style } = cell;
      rectText.setRect(textAttr);
      rectText.text(cell.text, style);
    });
    draw.restore();
  }

  drawMerge(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, merges, cols, rows, settings,
    } = table;
    let { borderWidth } = settings.table;
    borderWidth += 0.5;
    draw.save();
    draw.translate(offsetX, offsetY);
    const filter = [];
    const rectText = cells.getRectText(draw);
    cells.getRectRangeCell(viewRange, (i, c) => {
      const rectRange = merges.getFirstIncludes(i, c);
      if (!rectRange || filter.find(item => item === rectRange)) return;
      filter.push(rectRange);
      const cell = cells.getCell(rectRange.sri, rectRange.sci);
      const minSri = Math.min(viewRange.sri, rectRange.sri);
      let maxSri = Math.max(viewRange.sri, rectRange.sri);
      const minSci = Math.min(viewRange.sci, rectRange.sci);
      let maxSci = Math.max(viewRange.sci, rectRange.sci);
      maxSri -= 1;
      maxSci -= 1;
      let x = cols.sectionSumWidth(minSci, maxSci);
      let y = rows.sectionSumHeight(minSri, maxSri);
      x = viewRange.sci > rectRange.sci ? x * -1 : x;
      y = viewRange.sri > rectRange.sri ? y * -1 : y;
      const width = cols.sectionSumWidth(rectRange.sci, rectRange.eci);
      const height = rows.sectionSumHeight(rectRange.sri, rectRange.eri);
      const rect = new Rect({
        x: x + borderWidth,
        y: y + borderWidth,
        width: width - (borderWidth * 2),
        height: height - (borderWidth * 2),
      });
      const rectDraw = new RectDraw(draw, rect);
      rectDraw.fill('#fff');
      // 绘制文字
      const textAttr = new TextAttr(rect);
      const { style } = cell;
      rectText.setRect(textAttr);
      rectText.text(cell.text, style);
    });
    draw.restore();
  }

  getViewRange() {
    const { table } = this;
    const { content, fixed } = table;
    const { fxLeft } = fixed;
    const viewRange = content.getViewRange();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sci = 0;
    viewRange.eci = fxLeft;
    viewRange.w = width;
    viewRange.h = height;
    return viewRange;
  }

  render() {
    const { table } = this;
    const { draw } = table;
    const viewRange = this.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: viewRange.w,
      height: viewRange.h,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(thinLineWidth() / 2);
    this.drawMerge(viewRange, offsetX, offsetY);
    rectCut.closeCut();
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
    const { content } = table;
    const viewRange = content.getViewRange();
    return viewRange.w;
  }

  getHeight() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    return table.rows.sectionSumHeight(0, fxTop);
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, settings, rows, cols,
    } = table;
    const {
      sri, sci, eri, eci, w: width, h: height,
    } = viewRange;
    draw.save();
    draw.translate(offsetX, offsetY);
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
      if (sri !== i) draw.line([0, y], [width, y]);
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.line([x, 0], [x, height]);
      if (i === eci) draw.line([x + cw, 0], [x + cw, height]);
    });
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, merges,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    const rectText = cells.getRectText(draw);
    cells.getRectRangeCell(viewRange, (i, c, rect, cell) => {
      // 剔除合并单元格
      if (merges.getFirstIncludes(i, c)) {
        return;
      }
      // 绘制文字
      const textAttr = new TextAttr(rect);
      const { style } = cell;
      rectText.setRect(textAttr);
      rectText.text(cell.text, style);
    });
    draw.restore();
  }

  drawMerge(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, merges, cols, rows, settings,
    } = table;
    let { borderWidth } = settings.table;
    borderWidth += 0.5;
    draw.save();
    draw.translate(offsetX, offsetY);
    const filter = [];
    const rectText = cells.getRectText(draw);
    cells.getRectRangeCell(viewRange, (i, c) => {
      const rectRange = merges.getFirstIncludes(i, c);
      if (!rectRange || filter.find(item => item === rectRange)) return;
      filter.push(rectRange);
      const cell = cells.getCell(rectRange.sri, rectRange.sci);
      const minSri = Math.min(viewRange.sri, rectRange.sri);
      let maxSri = Math.max(viewRange.sri, rectRange.sri);
      const minSci = Math.min(viewRange.sci, rectRange.sci);
      let maxSci = Math.max(viewRange.sci, rectRange.sci);
      maxSri -= 1;
      maxSci -= 1;
      let x = cols.sectionSumWidth(minSci, maxSci);
      let y = rows.sectionSumHeight(minSri, maxSri);
      x = viewRange.sci > rectRange.sci ? x * -1 : x;
      y = viewRange.sri > rectRange.sri ? y * -1 : y;
      const width = cols.sectionSumWidth(rectRange.sci, rectRange.eci);
      const height = rows.sectionSumHeight(rectRange.sri, rectRange.eri);
      const rect = new Rect({
        x: x + borderWidth,
        y: y + borderWidth,
        width: width - (borderWidth * 2),
        height: height - (borderWidth * 2),
      });
      const rectDraw = new RectDraw(draw, rect);
      rectDraw.fill('#fff');
      // 绘制文字
      const textAttr = new TextAttr(rect);
      const { style } = cell;
      rectText.setRect(textAttr);
      rectText.text(cell.text, style);
    });
    draw.restore();
  }

  getViewRange() {
    const { table } = this;
    const { content, fixed } = table;
    const { fxTop } = fixed;
    const viewRange = content.getViewRange();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sri = 0;
    viewRange.eri = fxTop;
    viewRange.w = width;
    viewRange.h = height;
    return viewRange;
  }

  render() {
    const { table } = this;
    const { draw } = table;
    const viewRange = this.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: viewRange.w,
      height: viewRange.h,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(thinLineWidth() / 2);
    this.drawMerge(viewRange, offsetX, offsetY);
    rectCut.closeCut();
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
    const { content } = table;
    const viewRange = content.getViewRange();
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
    const { draw, cols, settings } = table;
    const { sci, eci } = viewRange;
    draw.save();
    draw.translate(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制边框
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.line([x, 0], [x, height]);
      if (i === eci) draw.line([x + cw, 0], [x + cw, height]);
    });
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `500 ${npx(10)}px Arial`,
      fillStyle: '#585757',
      lineWidth: thinLineWidth(),
      strokeStyle: '#e6e6e6',
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.fillText(Utils.stringAt(i), x + (cw / 2), height / 2);
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { content } = table;
    const viewRange = content.getViewRange();
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
    const { content } = table;
    const viewRange = content.getViewRange();
    const { sri, eri } = viewRange;
    return table.rows.sectionSumHeight(sri, eri);
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const { draw, rows, settings } = table;
    const { sri, eri } = viewRange;
    draw.save();
    draw.translate(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制边框
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
      if (i === eri) draw.line([0, y + ch], [width, y + ch]);
    });
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `500 ${npx(10)}px Arial`,
      fillStyle: '#585757',
      lineWidth: thinLineWidth(),
      strokeStyle: '#e6e6e6',
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.fillText(i + 1, width / 2, y + (ch / 2));
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { content } = table;
    const viewRange = content.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sci = 0;
    viewRange.eci = 0;
    this.draw(viewRange, offsetX, offsetY, width, height);
  }
}

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

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, settings, rows, cols,
    } = table;
    const {
      sri, sci, eri, eci, w: width, h: height,
    } = viewRange;
    draw.save();
    draw.translate(offsetX, offsetY);
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
      if (sri !== i) draw.line([0, y], [width, y]);
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.line([x, 0], [x, height]);
      if (sci !== i) draw.line([x, 0], [x, height]);
    });
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, merges,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    const rectText = cells.getRectText(draw);
    cells.getRectRangeCell(viewRange, (i, c, rect, cell) => {
      // 剔除合并单元格
      if (merges.getFirstIncludes(i, c)) {
        return;
      }
      // 绘制文字
      const textAttr = new TextAttr(rect);
      const { style } = cell;
      rectText.setRect(textAttr);
      rectText.text(cell.text, style);
    });
    draw.restore();
  }

  drawMerge(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, merges, cols, rows, settings,
    } = table;
    let { borderWidth } = settings.table;
    borderWidth += 0.5;
    draw.save();
    draw.translate(offsetX, offsetY);
    const filter = [];
    const rectText = cells.getRectText(draw);
    cells.getRectRangeCell(viewRange, (i, c) => {
      const rectRange = merges.getFirstIncludes(i, c);
      if (!rectRange || filter.find(item => item === rectRange)) return;
      filter.push(rectRange);
      const cell = cells.getCell(rectRange.sri, rectRange.sci);
      const minSri = Math.min(viewRange.sri, rectRange.sri);
      let maxSri = Math.max(viewRange.sri, rectRange.sri);
      const minSci = Math.min(viewRange.sci, rectRange.sci);
      let maxSci = Math.max(viewRange.sci, rectRange.sci);
      maxSri -= 1;
      maxSci -= 1;
      let x = cols.sectionSumWidth(minSci, maxSci);
      let y = rows.sectionSumHeight(minSri, maxSri);
      x = viewRange.sci > rectRange.sci ? x * -1 : x;
      y = viewRange.sri > rectRange.sri ? y * -1 : y;
      const width = cols.sectionSumWidth(rectRange.sci, rectRange.eci);
      const height = rows.sectionSumHeight(rectRange.sri, rectRange.eri);
      const rect = new Rect({
        x: x + borderWidth,
        y: y + borderWidth,
        width: width - (borderWidth * 2),
        height: height - (borderWidth * 2),
      });
      const rectDraw = new RectDraw(draw, rect);
      rectDraw.fill('#fff');
      // 绘制文字
      const textAttr = new TextAttr(rect);
      const { style } = cell;
      rectText.setRect(textAttr);
      rectText.text(cell.text, style);
    });
    draw.restore();
  }

  getViewRange() {
    const width = this.getWidth();
    const height = this.getHeight();
    const { table } = this;
    const { fixed } = table;
    const { fxTop, fxLeft } = fixed;
    return new RectRange(0, 0, fxTop, fxLeft, width, height);
  }

  render() {
    const { table } = this;
    const { draw } = table;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const viewRange = this.getViewRange();
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width: viewRange.w,
      height: viewRange.h,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(thinLineWidth() / 2);
    this.drawMerge(viewRange, offsetX, offsetY);
    rectCut.closeCut();
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
    const { draw, rows, settings } = table;
    const { sri, eri } = viewRange;
    draw.save();
    draw.translate(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制边框
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
    });
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `500 ${npx(10)}px Arial`,
      fillStyle: '#585757',
      lineWidth: thinLineWidth(),
      strokeStyle: '#e6e6e6',
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.fillText(i + 1, width / 2, y + (ch / 2));
    });
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
    const { draw, cols, settings } = table;
    const { sci, eci } = viewRange;
    draw.save();
    draw.translate(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制边框
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.line([x, 0], [x, height]);
    });
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `500 ${npx(10)}px Arial`,
      fillStyle: '#585757',
      lineWidth: thinLineWidth(),
      strokeStyle: '#e6e6e6',
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.fillText(Utils.stringAt(i), x + (cw / 2), height / 2);
    });
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

class FrozenRect {
  constructor(table) {
    this.table = table;
  }

  draw(offsetX, offsetY, width, height) {
    const { table } = this;
    const { draw } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    draw.restore();
  }

  render() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    this.draw(0, 0, index.width, index.height);
  }
}

class Table extends Widget {
  constructor(settings) {
    super(`${cssPrefix}-table`);
    this.canvas = h('canvas', `${cssPrefix}-table-canvas`);
    this.settings = Utils.mergeDeep({}, defaultSettings, settings);
    this.rows = new Rows(this.settings.rows);
    this.cols = new Cols(this.settings.cols);
    this.cells = new Cells({
      rows: this.rows,
      cols: this.cols,
      data: this.settings.data,
    });
    this.mousePointType = new MousePointType(this);
    this.merges = new Merges(this.settings.merges);
    // console.log('this.settings.fixed >>>', this.settings.fixed);
    this.fixed = new Fixed(this.settings.fixed);
    this.draw = new Draw(this.canvas.el);
    this.content = new Content(this);
    this.fixedLeft = new FixedLeft(this);
    this.fixedTop = new FixedTop(this);
    this.fixedTopIndex = new FixedTopIndex(this);
    this.fixedLeftIndex = new FixedLeftIndex(this);
    this.frozenLeftTop = new FrozenLeftTop(this);
    this.frozenLeftIndex = new FrozenLeftIndex(this);
    this.frozenTopIndex = new FrozenTopIndex(this);
    this.frozenRect = new FrozenRect(this);
    // 组件
    this.screen = new Screen(this);
    this.xReSizer = new XReSizer(this);
    this.yReSizer = new YReSizer(this);
    this.children(...[
      this.canvas,
      this.screen,
      this.xReSizer,
      this.yReSizer,
    ]);
    this.bind();
  }

  visualHeight() {
    return this.box().height;
  }

  visualWidth() {
    return this.box().width;
  }

  init() {
    this.screen.init();
    this.xReSizer.init();
    this.yReSizer.init();
    this.initScreenWidget();
  }

  bind() {
    EventBind.bind(this, Constant.EVENT_TYPE.MOUSE_MOVE, (e) => {
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
  }

  initScreenWidget() {
    const screenSelector = new ScreenSelector(this.screen);
    this.screen.addWidget(screenSelector);
    const screenAutoFill = new ScreenAutoFill(this.screen);
    this.screen.addWidget(screenAutoFill);
  }

  render() {
    const start = Date.now();
    const { draw, settings } = this;
    draw.clear();
    const [width, height] = [this.visualWidth(), this.visualHeight()];
    draw.resize(width, height);
    this.frozenRect.render();
    this.frozenLeftTop.render();
    this.frozenLeftIndex.render();
    this.frozenTopIndex.render();
    this.fixedTopIndex.render();
    this.fixedLeftIndex.render();
    this.fixedTop.render();
    this.fixedLeft.render();
    this.content.render();
    const end = Date.now();
    const consume = end - start;
    if (consume > 16 && settings.tipsRenderTime) {
      // eslint-disable-next-line no-console
      console.log('渲染界面消耗的时间', consume);
    }
  }

  scrollX(x) {
    this.content.scrollX(x);
    this.render();
    this.trigger(Constant.EVENT_TYPE.SCROLL);
  }

  scrollY(y) {
    this.content.scrollY(y);
    this.render();
    this.trigger(Constant.EVENT_TYPE.SCROLL);
  }

  getRiCiByXy(x, y) {
    const {
      settings, fixed, rows, cols, content,
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
      const viewRange = content.getViewRange();
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
      const viewRange = content.getViewRange();
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

  getRowTop(ri) {
    const { settings, rows } = this;
    const { index } = settings;
    return rows.getTop(ri) + index.height;
  }

  getColLeft(ci) {
    const { settings, cols } = this;
    const { index } = settings;
    return cols.getLeft(ci) + index.width;
  }

  getFixedWidth() {
    return this.fixedLeft.getWidth();
  }

  getFixedHeight() {
    return this.fixedTop.getHeight();
  }

  getScroll() {
    return this.content.scroll;
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

  setWidth(ci, width) {
    const { cols } = this;
    cols.setWidth(ci, width);
    this.render();
    this.trigger(Constant.EVENT_TYPE.CHANGE_WIDTH);
  }

  setHeight(ri, height) {
    const { rows } = this;
    rows.setHeight(ri, height);
    this.render();
    this.trigger(Constant.EVENT_TYPE.CHANGE_HEIGHT);
  }
}

export { Table };
