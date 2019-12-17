import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';
import { Utils } from '../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Draw } from '../canvas/Draw';
import { Scroll } from './Scroll';
import { CellRange } from './CellRange';
import { Grid } from '../canvas/Grid';

class Table extends Widget {
  constructor(options) {
    super(`${cssPrefix}-table`);
    this.options = Utils.mergeDeep({
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
    this.canvas = h('canvas', `${cssPrefix}-table-canvas`);
    this.scroll = new Scroll();
    this.children(this.canvas);
  }

  init() {
    this.render();
  }

  renderGrid({
    sri, sci, eri, eci, w: width, h: height,
  }) {
    this.draw.save();
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

  renderCell(viewRange) {

  }

  render() {
    const [vWidth, vHeight] = [this.visualWidth(), this.visualHeight()];
    const viewRange = this.viewRange();
    this.draw = new Draw(this.canvas.el, this.visualWidth(), this.visualHeight());
    this.draw.resize(vWidth, vHeight);
    this.draw.clear();
    this.renderGrid(viewRange);
  }

  visualHeight() {
    return this.box().height;
  }

  visualWidth() {
    return this.box().width;
  }

  rowsHeight() {}

  colsWidth() {}

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
    return new CellRange(ri, ci, eri, eci, width, height);
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
