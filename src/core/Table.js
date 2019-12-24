import { cssPrefix } from '../config';
import { Utils } from '../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Cells } from './Cells';
import { Selector } from '../component/Selector';
import { Scroll } from './Scroll';
import { Fixed } from './Fixed';
import { h } from '../lib/Element';
import { Widget } from '../lib/Widget';
import { RectRange } from './RectRange';
import { Draw, npx } from '../graphical/Draw';
import { RectCut } from '../graphical/RectCut';
import { Rect } from '../graphical/Rect';

const defaultSettings = {
  index: {
    height: 30,
    width: 50,
    bgColor: '#f4f5f8',
    color: '#000000',
  },
  table: {
    borderWidth: 1,
    borderColor: '#fff',
    strokeColor: '#e6e6e6',
  },
  data: [
    [{
      text: '唐浩',
      merge: {
        rect: new RectRange(0, 0, 0, 1, 300, 30),
        master: { text: '唐浩' },
      },
    }, {
      text: '刁亚文',
      merge: {
        rect: new RectRange(0, 0, 0, 1, 300, 30),
        master: { text: '唐浩' },
      },
    }, { text: '叶家俊' }, { text: '刁军凯' }],
    [{ text: '唐标' }, { text: '唐伟春' }, { text: '唐伟' }, { text: '唐武' }],
  ],
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
    len: 500,
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
    const fixedTop = rows.sectionSumHeight(0, fixed.fxTop);
    return total - fixedTop;
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
    draw.beginPath();
    draw.translate(offsetX, offsetY);
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: 'red',
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
    rectCut.outwardCut(0.5);
    this.drawGrid(viewRange, offsetX, offsetY);
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
    draw.beginPath();
    draw.translate(offsetX, offsetY);
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: 'red',
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.line([0, y], [width, y]);
      if (i === eri) draw.line([0, y + ch], [width, y + ch]);
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      if (i !== sci) draw.line([x, 0], [x, height]);
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
    rectCut.outwardCut(0.5);
    this.drawGrid(viewRange, offsetX, offsetY);
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
    draw.beginPath();
    draw.translate(offsetX, offsetY);
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: 'red',
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      if (sri !== i) draw.line([0, y], [width, y]);
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.line([x, 0], [x, height]);
      if (i === eci) draw.line([x + cw, 0], [x + cw, height]);
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
    rectCut.outwardCut(0.5);
    this.drawGrid(viewRange, offsetX, offsetY);
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
    return content.getWidth();
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
      fillStyle: '#fff',
    });
    draw.fillRect(0, 0, width, height);
    draw.restore();
    // 绘制文字和边框
    cols.eachWidth(sci, eci, (i, cw, x) => {
      // 边框
      draw.save();
      draw.attr({
        fillStyle: settings.table.borderColor,
        lineWidth: settings.table.borderWidth,
        strokeStyle: 'red',
      });
      draw.line([x, 0], [x, height]);
      draw.line([x, height], [x + cw, height]);
      draw.restore();
      // 文字
      draw.save();
      draw.attr({
        textAlign: 'center',
        textBaseline: 'middle',
        font: `500 ${npx(12)}px Source Sans Pro`,
        fillStyle: '#585757',
        lineWidth: npx(1),
        strokeStyle: '#e6e6e6',
      });
      draw.fillText(Utils.stringAt(i), x + (cw / 2), height / 2);
      draw.restore();
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { content, draw } = table;
    const viewRange = content.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sri = 0;
    viewRange.eri = 0;
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(0.5);
    this.draw(viewRange, offsetX, offsetY, width, height);
    rectCut.closeCut();
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
    return content.getHeight();
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
      fillStyle: '#fff',
    });
    draw.fillRect(0, 0, width, height);
    draw.restore();
    // 绘制文字和边框
    rows.eachHeight(sri, eri, (i, ch, y) => {
      // 边框
      draw.save();
      draw.attr({
        fillStyle: settings.table.borderColor,
        lineWidth: settings.table.borderWidth,
        strokeStyle: 'red',
      });
      draw.line([0, y], [width, y]);
      draw.line([width, y], [width, y + ch]);
      draw.restore();
      // 文字
      draw.save();
      draw.attr({
        textAlign: 'center',
        textBaseline: 'middle',
        font: `500 ${npx(12)}px Source Sans Pro`,
        fillStyle: '#585757',
        lineWidth: npx(1),
        strokeStyle: '#e6e6e6',
      });
      draw.fillText(i + 1, width / 2, y + (ch / 2));
      draw.restore();
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { content, draw } = table;
    const viewRange = content.getViewRange();
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    viewRange.sci = 0;
    viewRange.eci = 0;
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(0.5);
    this.draw(viewRange, offsetX, offsetY, width, height);
    rectCut.closeCut();
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
    draw.beginPath();
    draw.translate(offsetX, offsetY);
    draw.attr({
      fillStyle: settings.table.borderColor,
      lineWidth: settings.table.borderWidth,
      strokeStyle: 'red',
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      if (sri !== i) draw.line([0, y], [width, y]);
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      if (sci !== i) draw.line([x, 0], [x, height]);
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { fixed, draw } = table;
    const { fxTop, fxLeft } = fixed;
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const width = this.getWidth();
    const height = this.getHeight();
    const viewRange = new RectRange(0, 0, fxTop, fxLeft, width, height);
    const rect = new Rect({
      x: offsetX,
      y: offsetY,
      width,
      height,
    });
    const rectCut = new RectCut(draw, rect);
    rectCut.outwardCut(0.5);
    this.drawGrid(viewRange, offsetX, offsetY);
    rectCut.closeCut();
  }
}

class FrozenLeftIndex {
  constructor(table) {
    this.table = table;
  }

  getXOffset() {}

  getYOffset() {}

  getWidth() {}

  getHeight() {}

  draw() {}

  render() {}
}

class FrozenTopIndex {
  constructor(table) {
    this.table = table;
  }

  getXOffset() {}

  getYOffset() {}

  getWidth() {}

  getHeight() {}

  draw() {}

  render() {}
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
    this.selector = new Selector();
    this.fixed = new Fixed();
    this.draw = new Draw(this.canvas.el);
    this.content = new Content(this);
    this.fixedLeft = new FixedLeft(this);
    this.fixedTop = new FixedTop(this);
    this.fixedTopIndex = new FixedTopIndex(this);
    this.fixedLeftIndex = new FixedLeftIndex(this);
    this.frozenLeftTop = new FrozenLeftTop(this);
    this.frozenLeftIndex = 呢我FrozenLeftIndex
    this.children(this.canvas, this.selector);
  }

  visualHeight() {
    return this.box().height;
  }

  visualWidth() {
    return this.box().width;
  }

  init() {
    this.render();
  }

  render() {
    const { draw } = this;
    draw.clear();
    const [width, height] = [this.visualWidth(), this.visualHeight()];
    draw.resize(width, height);
    this.fixedTopIndex.render();
    this.fixedLeftIndex.render();
    this.frozenLeftTop.render();
    this.fixedTop.render();
    this.fixedLeft.render();
    this.content.render();
  }

  scrollX(x) {
    this.content.scrollX(x);
  }

  scrollY(y) {
    this.content.scrollY(y);
  }
}

export { Table };
