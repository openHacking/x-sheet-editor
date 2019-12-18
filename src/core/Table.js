import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { h } from '../lib/Element';
import { Utils } from '../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Draw, npx, thinLineWidth } from '../canvas/Draw';
import { Scroll } from './Scroll';
import { RectRange } from './RectRange';
import { Cells } from './Cells';
import { Box } from '../canvas/Box';
import { Selector } from '../component/Selector';
import { Constant } from '../utils/Constant';

class Table extends Widget {
  constructor(options) {
    super(`${cssPrefix}-table`);
    this.options = Utils.mergeDeep({
      indexStyle: {
        background: {
          fillStyle: '#f4f5f8',
        },
        font: {
          textAlign: 'center',
          textBaseline: 'middle',
          font: `500 ${npx(12)}px Source Sans Pro`,
          fillStyle: '#585757',
          lineWidth: thinLineWidth(),
          strokeStyle: '#e6e6e6',
        },
      },
      indexColsHeight: 30,
      indexRowsWidth: 50,
      rows: {
        len: 88,
        height: 30,
      },
      cols: {
        len: 80,
        width: 150,
      },
      gridStyle: {
        fillStyle: '#fff',
        lineWidth: thinLineWidth,
        strokeStyle: '#e6e6e6',
      },
      data: [
        [{ text: '1' }, { text: '1' }, { text: '3' }, { text: '1' }, { text: '3' }],
        [{ text: '1' }, { text: '1' }, { text: '3' }, { text: '1' }, { text: '3' }],
      ],
    }, options);
    this.rows = new Rows(this.options.rows);
    this.cols = new Cols(this.options.cols);
    this.cells = new Cells({ rows: this.rows, cols: this.cols, data: this.options.data });
    this.selector = new Selector();
    this.canvas = h('canvas', `${cssPrefix}-table-canvas`);
    this.draw = new Draw(this.canvas.el);
    this.scroll = new Scroll();
    this.children(this.canvas, this.selector);
    this.downRectRange = null;
  }

  init() {
    this.render();
    this.bind();
  }

  renderGrid(viewRange, offsetX = 0, offsetY = 0) {
    const {
      sri, sci, eri, eci, w: width, h: height,
    } = viewRange;
    this.draw.save();
    this.draw.translate(offsetX, offsetY);
    this.draw.attr(this.options.gridStyle);
    this.rows.eachHeight(sri, eri, (i, ch, y) => {
      if (i !== sri) this.draw.line([0, y], [width, y]);
      if (i === eri) this.draw.line([0, y + ch], [width, y + ch]);
    });
    this.cols.eachWidth(sci, eci, (i, cw, x) => {
      if (i !== sci) this.draw.line([x, 0], [x, height]);
      if (i === eci) this.draw.line([x + cw, 0], [x + cw, height]);
    });
    this.draw.restore();
  }

  renderCell(viewRange, offsetX = 0, offsetY = 0) {
    this.draw.save();
    this.draw.translate(offsetX, offsetY);
    this.cells.getRectRangeCell(viewRange, (ri, ci, boxRange, cell) => {
      const box = new Box(this.draw, {
        style: {
          fillStyle: cell.style.bgColor || '#ffffff',
        },
      });
      this.draw.save();
      box.rect(boxRange);
      box.text(boxRange, cell.text, {
        align: cell.style.align,
        verticalAlign: cell.style.verticalAlign,
        font: cell.style.font,
        color: cell.style.color,
        strike: cell.style.strike,
        underline: cell.style.underline,
      });
      this.draw.restore();
    });
    this.draw.restore();
  }

  renderColsIndex(viewRange, offsetX = 0) {
    const { sci, eci } = viewRange;
    const sumWidth = this.cols.sectionSumWidth(sci, eci);
    this.draw.save();
    this.draw.translate(offsetX, 0);
    // 绘制背景
    this.draw.save();
    this.draw.attr(this.options.indexStyle.background);
    this.draw.fillRect(0, 0, sumWidth, this.options.indexColsHeight);
    this.draw.restore();
    // 绘制字母
    this.draw.save();
    this.draw.attr(this.options.indexStyle.font);
    this.cols.eachWidth(sci, eci, (i, cw, x) => {
      if (sci !== i) this.draw.line([x, 0], [x, this.options.indexColsHeight]);
      this.draw.line([x, this.options.indexColsHeight], [x + cw, this.options.indexColsHeight]);
      this.draw.fillText(Utils.stringAt(i), x + (cw / 2), this.options.indexColsHeight / 2);
    });
    this.draw.restore();
    this.draw.restore();
  }

  renderRowsIndex(viewRange, offsetY = 0) {
    const { sri, eri } = viewRange;
    const sumHeight = this.rows.sectionSumHeight(sri, eri);
    this.draw.save();
    this.draw.translate(0, offsetY);
    // 绘制背景
    this.draw.save();
    this.draw.attr(this.options.indexStyle.background);
    this.draw.fillRect(0, 0, this.options.indexRowsWidth, sumHeight);
    this.draw.restore();
    // 绘制数字
    this.draw.save();
    this.draw.attr(this.options.indexStyle.font);
    this.rows.eachHeight(sri, eri, (i, ch, y) => {
      if (sri !== i) this.draw.line([0, y], [this.options.indexRowsWidth, y]);
      this.draw.line([this.options.indexRowsWidth, y], [this.options.indexRowsWidth, y + ch]);
      this.draw.fillText(i + 1, this.options.indexRowsWidth / 2, y + (ch / 2));
    });
    this.draw.restore();
    this.draw.restore();
  }

  renderColsRowsTop(width, height) {
    this.draw.save();
    this.draw.attr(this.options.indexStyle.background);
    this.draw.fillRect(0, 0, width, height);
    this.draw.restore();
    this.draw.save();
    this.draw.attr(this.options.indexStyle.font);
    this.draw.line([width, 0], [width, height]);
    this.draw.line([0, height], [width, height]);
    this.draw.restore();
  }

  render() {
    const [offsetX, offsetY] = [this.options.indexRowsWidth, this.options.indexColsHeight];
    const [vWidth, vHeight] = [this.visualWidth(), this.visualHeight()];
    const viewRange = this.viewRange();
    this.draw.clear();
    this.draw.resize(vWidth, vHeight);
    this.renderGrid(viewRange, offsetX, offsetY);
    this.renderCell(viewRange, offsetX, offsetY);
    this.renderRowsIndex(viewRange, offsetY);
    this.renderColsIndex(viewRange, offsetX);
    this.renderColsRowsTop(offsetX, offsetY);
  }

  visualHeight() {
    return this.box().height;
  }

  visualWidth() {
    return this.box().width;
  }

  gridVisualHeight() {
    return this.visualHeight() - this.options.indexColsHeight;
  }

  gridVisualWidth() {
    return this.visualWidth() - this.options.indexRowsWidth;
  }

  gridContentHeight() {
    return this.rows.totalHeight();
  }

  gridContentWidth() {
    return this.cols.totalWidth();
  }

  viewRange() {
    const { scroll, rows, cols } = this;
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

  xYRange(eventX, eventY) {
    let [x, y] = [eventX, eventY];
    x -= this.options.indexRowsWidth;
    y -= this.options.indexColsHeight;
    const { scroll, cols, rows } = this;
    let [width, height] = [0, 0];
    let [totalWidth, totalHeight] = [0, 0];
    const { ri, ci } = scroll;
    let [eri, eci] = [rows.len, cols.len];
    if (x >= 0) {
      for (let j = ci; j < cols.len; j += 1) {
        width = cols.getWidth(j);
        totalWidth += width;
        eci = j;
        if (totalWidth > x) break;
      }
    } else { eci = -1; }
    if (y >= 0) {
      for (let i = ri; i < rows.len; i += 1) {
        height = rows.getHeight(i);
        totalHeight += height;
        eri = i;
        if (totalHeight > y) break;
      }
    } else { eri = -1; }
    return new RectRange(eri, eci, eri, eci, width, height);
  }

  selectedRange() {

  }

  scrollYTo(y) {
    const { scroll, rows } = this;
    const [
      ri, top, height,
    ] = Utils.rangeReduceIf(0, rows.len, 0, 0, y, i => rows.getHeight(i));
    let y1 = top;
    if (y > 0) y1 += height;
    if (scroll.y !== y1) {
      scroll.ri = y > 0 ? ri : 0;
      scroll.y = y1;
    }
    this.render();
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
    this.render();
  }

  bind() {
    this.on(Constant.EVENT_TYPE.MOUSE_MOVE, () => {});
    this.on(Constant.EVENT_TYPE.MOUSE_DOWN, (event) => {
      const { x, y } = this.computerEventXy(event);
      this.downRectRange = this.xYRange(x, y);
    });
    this.on(Constant.EVENT_TYPE.MOUSE_UP, () => {});
  }
}

export { Table };
