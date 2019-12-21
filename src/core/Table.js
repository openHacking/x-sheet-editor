import { Draw, thinLineWidth } from '../canvas/Draw';
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
import { Box } from '../canvas/Box';

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
    borderWidth: thinLineWidth,
    borderColor: '#fff',
    strokeColor: '#e6e6e6',
  },
  data: [],
  rows: {
    len: 88,
    height: 30,
  },
  cols: {
    len: 80,
    width: 150,
  },
};

class FixedLeft {
  constructor(table) {
    this.table = table;
  }
}

class FixedTop {
  constructor(table) {
    this.table = table;
  }

  getYOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const { height } = index;
    return height;
  }

  render() {
    const { table } = this;
    const { content, fixed } = table;
    const { fxTop } = fixed;
    const viewRange = content.getViewRange();
    const offsetX = content.getXOffset();
    const offsetY = this.getYOffset();
    viewRange.sri = 0;
    viewRange.eri = fxTop;
    content.drawGrid(viewRange, offsetX, offsetY);
    content.drawCell(viewRange, offsetX, offsetY);
  }
}

class FixedTopLeft {}

class Content {
  constructor(table) {
    this.scroll = new Scroll();
    this.table = table;
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
      strokeStyle: settings.table.strokeColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      if (i !== sri) draw.line([0, y], [width, y]);
      if (i === eri) draw.line([0, y + ch], [width, y + ch]);
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      if (i !== sci) draw.line([x, 0], [x, height]);
      if (i === eci) draw.line([x + cw, 0], [x + cw, height]);
    });
    draw.restore();
  }

  drawCell(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cells, settings,
    } = table;
    draw.save();
    draw.translate(offsetX, offsetY);
    cells.getRectRangeCell(viewRange, (ri, ci, boxRange, cell) => {
      const style = Utils.mergeDeep({}, settings.cell, cell.style);
      const box = new Box(draw, {
        style: {
          fillStyle: style.bgColor || '#ffffff',
        },
      });
      draw.save();
      box.rect(boxRange);
      box.text(boxRange, cell.text, {
        align: style.align,
        verticalAlign: style.verticalAlign,
        font: style.font,
        color: style.color,
        strike: style.strike,
        underline: style.underline,
      });
      draw.restore();
    });
    draw.restore();
  }

  render() {
    const offsetX = this.getXOffset();
    const offsetY = this.getYOffset();
    const viewRange = this.getViewRange();
    this.drawGrid(viewRange, offsetX, offsetY);
    this.drawCell(viewRange, offsetX, offsetY);
  }
}

class FixedTopIndex {
  constructor(table) {
    this.table = table;
  }

  getYOffset() {
    return 0;
  }

  draw(viewRange, offsetX, offsetY) {
    const { table } = this;
    const { cols, settings, draw } = table;
    const { sci, eci } = viewRange;
    const sumWidth = cols.sectionSumWidth(sci, eci);
    draw.save();
    draw.translate(offsetX, offsetY);
    // 绘制背景
    draw.save();
    draw.attr({
      fillStyle: settings.index.bgColor,
    });
    draw.fillRect(0, 0, sumWidth, settings.index.height);
    draw.restore();
    // 绘制字母
    cols.eachWidth(sci, eci, (i, cw, x) => {
      // 线条
      draw.save();
      draw.attr({
        fillStyle: settings.table.borderColor,
        lineWidth: settings.table.borderWidth,
        strokeStyle: settings.table.strokeColor,
      });
      if (sci !== i) draw.line([x, 0], [x, settings.index.height]);
      draw.line([x, settings.index.height], [x + cw, settings.index.height]);
      draw.restore();
      // 文字
      draw.save();
      draw.attr({
        textAlign: 'center',
        textBaseline: 'middle',
        font: 'bold 13px Arial',
        fillStyle: '#000000',
      });
      draw.fillText(Utils.stringAt(i), x + (cw / 2), settings.index.height / 2);
      draw.restore();
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { content } = table;
    const offsetX = content.getXOffset();
    const offsetY = this.getYOffset();
    const viewRange = content.getViewRange();
    this.draw(viewRange, offsetX, offsetY);
  }
}

class FixedLeftIndex {
  constructor(table) {
    this.table = table;
  }

  getXOffset() {
    return 0;
  }

  draw(viewRange, offsetX, offsetY) {
    const { table } = this;
    const { rows, settings, draw } = table;
    const { sri, eri } = viewRange;
    const sumHeight = rows.sectionSumHeight(sri, eri);
    draw.save();
    draw.translate(offsetX, offsetY);
    // 绘制背景
    draw.save();
    draw.attr({
      fillStyle: settings.index.bgColor,
    });
    draw.fillRect(0, 0, settings.index.width, sumHeight);
    draw.restore();
    // 绘制数字
    rows.eachHeight(sri, eri, (i, ch, y) => {
      // 边框
      draw.save();
      draw.attr({
        fillStyle: settings.table.borderColor,
        lineWidth: settings.table.borderWidth,
        strokeStyle: settings.table.strokeColor,
      });
      if (sri !== i) draw.line([0, y], [settings.index.width, y]);
      draw.line([settings.index.width, y], [settings.index.width, y + ch]);
      draw.restore();
      // 数字
      draw.save();
      draw.attr({
        textAlign: 'center',
        textBaseline: 'middle',
        font: 'bold 13px Arial',
        fillStyle: '#000000',
      });
      draw.fillText(i + 1, settings.index.width / 2, y + (ch / 2));
      draw.restore();
    });
    draw.restore();
  }

  render() {
    const { table } = this;
    const { content } = table;
    const offsetX = this.getXOffset();
    const offsetY = content.getYOffset();
    const viewRange = content.getViewRange();
    this.draw(viewRange, offsetX, offsetY);
  }
}

class FixedTopLeftIndex {}

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
    this.fixedLeftIndex = new FixedLeftIndex(this);
    this.fixedTop = new FixedTop(this);
    this.fixedTopIndex = new FixedTopIndex(this);
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
    this.content.render();
    this.fixedTop.render();
    this.fixedTopIndex.render();
    this.fixedLeftIndex.render();
  }

  scrollX(x) {
    this.content.scrollX(x);
    this.render();
  }

  scrollY(y) {
    this.content.scrollY(y);
    this.render();
  }
}

export { Table };
