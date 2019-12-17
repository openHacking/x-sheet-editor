import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';
import { Utils } from '../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Draw, npx, thinLineWidth } from '../canvas/Draw';
import { Scroll } from './Scroll';
import { Grid } from '../canvas/Grid';
import { RectRange } from './RectRange';
import { Cells } from './Cells';
import { Box } from '../canvas/Box';

const tableFixedHeaderCleanStyle = { fillStyle: '#f4f5f8' };

function tableFixedHeaderStyle() {
  return {
    textAlign: 'center',
    textBaseline: 'middle',
    font: `500 ${npx(12)}px Source Sans Pro`,
    fillStyle: '#585757',
    lineWidth: thinLineWidth(),
    strokeStyle: '#e6e6e6',
  };
}

class Table extends Widget {
  constructor(options) {
    super(`${cssPrefix}-table`);
    this.options = Utils.mergeDeep({
      colsIndexHeight: 30,
      rowsIndexWidth: 50,
      rows: {
        len: 100,
        height: 30,
      },
      cols: {
        len: 80,
        width: 150,
      },
    }, options);
    this.rows = new Rows(this.options.rows);
    this.cols = new Cols(this.options.cols);
    this.cells = new Cells({ rows: this.rows, cols: this.cols });
    this.canvas = h('canvas', `${cssPrefix}-table-canvas`);
    this.scroll = new Scroll();
    this.children(this.canvas);
  }

  init() {
    this.render();
  }

  renderGrid(viewRange, offsetX = 0, offsetY = 0) {
    const {
      sri, sci, eri, eci, w: width, h: height,
    } = viewRange;
    this.draw.save();
    this.draw.translate(offsetX, offsetY);
    const grid = new Grid(this.draw);
    this.rows.eachHeight(sri, eri, (i, ch, y) => {
      if (i !== sri) grid.line([0, y], [width, y]);
      if (i === eri) grid.line([0, y + ch], [width, y + ch]);
    });
    this.cols.eachWidth(sci, eci, (i, cw, x) => {
      if (i !== sci) grid.line([x, 0], [x, height]);
      if (i === eci) grid.line([x + cw, 0], [x + cw, height]);
    });
    this.draw.restore();
  }

  renderCell(viewRange, offsetX = 0, offsetY = 0) {
    viewRange.each((ri, ci) => {
      const boxRange = this.cells.getBoxRange(ri, ci);
      boxRange.x += offsetX;
      boxRange.y += offsetY;
      const cell = this.cells.getCell(ri, ci);
      const box = new Box(this.draw, {
        style: {
          fillStyle: cell.style.bgColor || '#',
        },
      });
      this.draw.save();
      box.rect(boxRange);
      box.text(boxRange, '12313', {
        align: cell.style.align,
        verticalAlign: cell.style.verticalAlign,
        font: cell.style.font,
        color: cell.style.color,
        strike: cell.style.strike,
        underline: cell.style.underline,
      });
      this.draw.restore();
    });
  }

  renderColsIndex(viewRange) {
    const {
      sci, eci,
    } = viewRange;
    const sumWidth = this.cols.sumWidth(sci, eci);
    this.draw.save();
    this.draw.attr(tableFixedHeaderCleanStyle);
    this.draw.fillRect(0, 0, sumWidth, this.options.colsIndexHeight);
    this.draw.restore();
    this.draw.attr(tableFixedHeaderStyle());
    this.draw.save();
    this.cols.eachWidth(sci, eci, (i, cw, x) => {
      const offsetX = x + this.options.rowsIndexWidth;
      this.draw.line([offsetX, 0], [offsetX, cw]);
      this.draw.fillText(Utils.stringAt(i), offsetX + (cw / 2), this.options.colsIndexHeight / 2);
    });
    this.draw.restore();
  }

  renderRowsIndex(viewRange) {
    const {
      sri, eri,
    } = viewRange;
    const sumHeight = this.rows.sumHeight(sri, eri);
    this.draw.save();
    this.draw.attr(tableFixedHeaderCleanStyle);
    this.draw.fillRect(0, 0, this.options.rowsIndexWidth, sumHeight);
    this.draw.restore();
  }

  renderColsRowsTop() {}

  render() {
    const [offsetX, offsetY] = [this.options.rowsIndexWidth, this.options.colsIndexHeight];
    const [vWidth, vHeight] = [this.visualWidth(), this.visualHeight()];
    const viewRange = this.viewRange();
    this.draw = new Draw(this.canvas.el, this.visualWidth(), this.visualHeight());
    this.draw.resize(vWidth, vHeight);
    this.draw.clear();
    this.renderGrid(viewRange, offsetX, offsetY);
    this.renderCell(viewRange, offsetX, offsetY);
    this.renderRowsIndex(viewRange);
    this.renderColsIndex(viewRange);
  }

  visualHeight() {
    return this.box().height;
  }

  visualWidth() {
    return this.box().width;
  }

  viewRange() {
    const {
      scroll, rows, cols,
    } = this;
    let [width, height] = [0, 0];
    const { ri, ci } = scroll;
    let [eri, eci] = [rows.len, cols.len];
    for (let i = ri; i < rows.len; i += 1) {
      height += rows.getHeight(i);
      eri = i;
      if (height > this.visualHeight()) break;
    }
    for (let j = ci; j < cols.len; j += 1) {
      width += cols.getWidth(j);
      eci = j;
      if (width > this.visualWidth()) break;
    }
    return new RectRange(ri, ci, eri, eci, width, height);
  }

  scrollYTo(y) {
    const { scroll, rows } = this;
    scroll.y = y;
    const [
      ri, top, height,
    ] = Utils.rangeReduceIf(0, rows.len, 0, 0, y, i => rows.getHeight(i));
    let y1 = top;
    if (y > 0) y1 += height;
    if (scroll.y !== y1) {
      scroll.ri = y > 0 ? ri : 0;
      scroll.y = y1;
    }
  }

  scrollXTo(x) {
    const { scroll, cols } = this;
    const [
      ci, left, width,
    ] = Utils.rangeReduceIf(0, cols.len, 0, 0, x, i => cols.getWidth(i));
    let x1 = left;
    if (x > 0) x1 += width;
    if (scroll.x !== x1) {
      scroll.ci = x > 0 ? ci : 0;
      scroll.x = x1;
    }
  }
}

export { Table };
