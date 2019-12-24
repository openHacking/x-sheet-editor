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
import { Draw } from '../graphical/Draw';
import { RectCut } from '../graphical/RectCut';
import { Rect } from '../graphical/Rect';

const defaultSettings = {
  index: {
    height: 30,
    width: 50,
    bgColor: '#f4f5f8',
    color: '#000000',
  },
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
