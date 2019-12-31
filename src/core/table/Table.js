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
import { RectCut } from '../../graphical/RectCut';
import { Rect } from '../../graphical/Rect';
import { RectText } from '../../graphical/RectText';
import { TextRect } from '../../graphical/TextRect';
import { Merges } from './Merges';
import { Selector } from './selector/Selector';
import { EventManage, TABLE_EVENT } from './EventManage';
import { Event } from './Event';

const defaultSettings = {
  index: {
    height: 30,
    width: 40,
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
    width: 150,
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
    const { table, scroll } = this;
    const { cols, fixed } = table;
    let { fxLeft } = fixed;
    fxLeft += 1;
    const [
      ci, left, width,
    ] = Utils.rangeReduceIf(fxLeft, cols.len, 0, 0, x, i => cols.getWidth(i));
    let x1 = left;
    if (x > 0) x1 += width;
    scroll.ci = ci;
    scroll.x = x1;
  }

  scrollY(y) {
    const { table, scroll } = this;
    const { rows, fixed } = table;
    let { fxTop } = fixed;
    fxTop += 1;
    const [
      ri, top, height,
    ] = Utils.rangeReduceIf(fxTop, rows.len, 0, 0, y, i => rows.getHeight(i));
    let y1 = top;
    if (y > 0) y1 += height;
    scroll.ri = ri;
    scroll.y = y1;
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
    const { fxLeft, fxRight } = fixed;
    const { width } = index;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    let fixedRightWidth = 0;
    if (fxRight !== -1) {
      fixedRightWidth = table.cols.sectionSumWidth(table.cols.len - fxRight, table.cols.len);
    }
    return table.visualWidth() - (fixedLeftWidth + width + fixedRightWidth);
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
    const total = cols.sectionSumWidth(0, cols.len - 1);
    const fixedWidth = cols.sectionSumWidth(0, fixed.fxLeft);
    return total - fixedWidth;
  }

  getContentHeight() {
    const { table } = this;
    const { rows, fixed } = table;
    const total = rows.sectionSumHeight(0, rows.len - 1);
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
      draw, cells,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    const rectText = new RectText(draw, null, {
      align: cells.defaultAttr.style.align,
      verticalAlign: cells.defaultAttr.style.verticalAlign,
      font: cells.defaultAttr.style.font,
      color: cells.defaultAttr.style.color,
      strike: cells.defaultAttr.style.strike,
      underline: cells.defaultAttr.style.underline,
    });
    cells.getRectRangeCell(viewRange, (i, c, rect, cell) => {
      if (cell.merge) {
        // TODO ...
        // ...
      } else {
        // 绘制文字
        const textRect = new TextRect(rect);
        const { style } = cell;
        rectText.setRect(textRect);
        rectText.text(cell.text, style);
      }
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
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(thinLineWidth() / 2);
    this.drawGrid(viewRange, offsetX, offsetY);
    rectCut.closeCut();
    this.drawCells(viewRange, offsetX, offsetY);
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
    return table.cols.sectionSumWidth(0, fxLeft);
  }

  getHeight() {
    const { table } = this;
    const { content } = table;
    return content.getHeight();
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
      if (i !== sci) draw.line([x, 0], [x, height]);
      draw.line([x, 0], [x, height]);
    });
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    const rectText = new RectText(draw, null, {
      align: cells.defaultAttr.style.align,
      verticalAlign: cells.defaultAttr.style.verticalAlign,
      font: cells.defaultAttr.style.font,
      color: cells.defaultAttr.style.color,
      strike: cells.defaultAttr.style.strike,
      underline: cells.defaultAttr.style.underline,
    });
    cells.getRectRangeCell(viewRange, (i, c, rect, cell) => {
      if (cell.merge) {
        // TODO ...
      } else {
        // 绘制文字
        const textRect = new TextRect(rect);
        const { style } = cell;
        rectText.setRect(textRect);
        rectText.text(cell.text, style);
      }
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { content, fixed, draw } = table;
    const { fxLeft } = fixed;
    const viewRange = content.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sci = 0;
    viewRange.eci = fxLeft;
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(thinLineWidth() / 2);
    this.drawGrid(viewRange, offsetX, offsetY);
    rectCut.closeCut();
    this.drawCells(viewRange, offsetX, offsetY);
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
    return content.getWidth();
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
      draw, cells,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    const rectText = new RectText(draw, null, {
      align: cells.defaultAttr.style.align,
      verticalAlign: cells.defaultAttr.style.verticalAlign,
      font: cells.defaultAttr.style.font,
      color: cells.defaultAttr.style.color,
      strike: cells.defaultAttr.style.strike,
      underline: cells.defaultAttr.style.underline,
    });
    cells.getRectRangeCell(viewRange, (i, c, rect, cell) => {
      if (cell.merge) {
        // TODO ...
      } else {
        // 绘制文字
        const textRect = new TextRect(rect);
        const { style } = cell;
        rectText.setRect(textRect);
        rectText.text(cell.text, style);
      }
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { content, fixed, draw } = table;
    const { fxTop } = fixed;
    const viewRange = content.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sri = 0;
    viewRange.eri = fxTop;
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(thinLineWidth() / 2);
    this.drawGrid(viewRange, offsetX, offsetY);
    rectCut.closeCut();
    this.drawCells(viewRange, offsetX, offsetY);
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
    draw.save();
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    draw.restore();
    // 绘制边框
    draw.save();
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.line([x, 0], [x, height]);
      if (i === eci) draw.line([x + cw, 0], [x + cw, height]);
    });
    draw.restore();
    // 绘制文字
    draw.save();
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
    draw.save();
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    draw.restore();
    // 绘制边框
    draw.save();
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
      if (i === eri) draw.line([0, y + ch], [width, y + ch]);
    });
    draw.restore();
    // 绘制文字
    draw.save();
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
      draw, cells,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    const rectText = new RectText(draw, null, {
      align: cells.defaultAttr.style.align,
      verticalAlign: cells.defaultAttr.style.verticalAlign,
      font: cells.defaultAttr.style.font,
      color: cells.defaultAttr.style.color,
      strike: cells.defaultAttr.style.strike,
      underline: cells.defaultAttr.style.underline,
    });
    cells.getRectRangeCell(viewRange, (i, c, rect, cell) => {
      if (cell.merge) {
        // TODO ...
      } else {
        // 绘制文字
        const textRect = new TextRect(rect);
        const { style } = cell;
        rectText.setRect(textRect);
        rectText.text(cell.text, style);
      }
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop, fxLeft } = fixed;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    const viewRange = new RectRange(0, 0, fxTop, fxLeft, width, height);
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawCells(viewRange, offsetX, offsetY);
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
    draw.save();
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    draw.restore();
    // 绘制边框
    draw.save();
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
    });
    draw.restore();
    // 绘制文字
    draw.save();
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
    draw.save();
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    draw.restore();
    // 绘制边框
    draw.save();
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.line([x, 0], [x, height]);
    });
    draw.restore();
    // 绘制文字
    draw.save();
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
    this.settings = Utils.mergeDeep(defaultSettings, settings);
    this.rows = new Rows(this.settings.rows);
    this.cols = new Cols(this.settings.cols);
    this.cells = new Cells({
      rows: this.rows,
      cols: this.cols,
      data: this.settings.data,
    });
    this.merges = new Merges();
    this.fixed = new Fixed();
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
    this.eventMange = new EventManage(this);
    this.selector = new Selector(this);
    this.children(...[
      this.canvas,
      this.selector,
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
    this.selector.init();
  }

  bind() {
    this.eventMange.addEvent(TABLE_EVENT.MOUSE_DOWN, () => {});
  }

  render() {
    const { draw } = this;
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
  }

  scrollX(x) {
    this.content.scrollX(x);
    this.render();
    this.eventMange.triggerEvent(TABLE_EVENT.SCROLL_X, new Event(null, { x }));
  }

  scrollY(y) {
    this.content.scrollY(y);
    this.render();
    this.eventMange.triggerEvent(TABLE_EVENT.SCROLL_Y, new Event(null, { y }));
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
    if (left <= fixedWidth) {
      let total = 0;
      for (let i = 0; i <= fixed.fxLeft; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total > left) break;
      }
    } else {
      let total = fixedWidth;
      const viewRange = content.getViewRange();
      for (let i = viewRange.sci; i <= viewRange.eci; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total > left) break;
      }
    }

    // top
    if (top < fixedHeight) {
      let total = 0;
      for (let i = 0; i <= fixed.fxTop; i += 1) {
        const height = rows.getHeight(i);
        total += height;
        ri = i;
        if (total > top) break;
      }
    } else {
      let total = fixedHeight;
      const viewRange = content.getViewRange();
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
}

export { Table };
