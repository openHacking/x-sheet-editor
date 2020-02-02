import { Rect } from '../../graphical/rect/Rect';
import { Utils } from '../../utils/Utils';
import { RectText } from '../../graphical/rect/RectText';

class Cells {
  constructor({ cols, rows, data = [] }) {
    this.cols = cols;
    this.rows = rows;
    this.defaultStyle = {
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
    };
    this._ = data;
  }

  getCell(ri, ci) {
    const row = this._[ri];
    if (row && row[ci]) {
      row[ci] = Utils.mergeDeep({
        text: '',
        style: {},
      }, row[ci]);
      return row[ci];
    }
    return null;
  }

  getCellOrNew(ri, ci) {
    if (!this._[ri]) {
      this._[ri] = [];
    }
    if (!this._[ri][ci]) {
      this._[ri][ci] = Utils.mergeDeep({
        text: '',
        style: {},
      });
    }
    return this._[ri][ci];
  }

  getCellContentMaxWidth(ri, ci) {
    let total = this.cols.getWidth(ci);
    for (let i = ci + 1; i < this.cols.len; i += 1) {
      const cell = this.getCell(ri, i);
      if (cell === null || Utils.isBlank(cell.text)) {
        total += this.cols.getWidth(i);
      } else {
        return total;
      }
    }
    return total;
  }

  getRectRangeCell(rectRange, cb, { sy = 0, sx = 0 } = {}) {
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = sy;
    for (let i = sri; i <= eri; i += 1) {
      const height = this.rows.getHeight(i);
      let x = sx;
      for (let j = sci; j <= eci; j += 1) {
        const width = this.cols.getWidth(j);
        const cell = this.getCell(i, j);
        if (cell) {
          cb(i, j, new Rect({
            x, y, width, height,
          }), cell);
        }
        x += width;
      }
      y += height;
    }
  }

  getRectText(draw, rect = null) {
    return new RectText(draw, rect, this.defaultStyle);
  }

  getData() {
    return this._;
  }

  setData(data) {
    this._ = data;
  }
}

export { Cells };
