import { Rect } from '../../graphical/rect/Rect';
import { Utils } from '../../utils/Utils';
import { RectText } from '../../graphical/rect/RectText';

const CELL_TEXT_FORMAT = {
  default: v => v,
  text: v => v,

  number: (v) => {
    if (Utils.isNumber(v)) {
      if (v.toString().indexOf('.') !== -1) {
        const lastIndex = v.toString().lastIndexOf('.') + 1;
        return v.toString().substring(0, lastIndex + 2);
      }
      return `${v}.00`;
    }
    return v;
  },
  percentage: (v) => {
    if (Utils.isNumber(v)) {
      return `${v}%`;
    }
    return v;
  },
  fraction: v => v,
  ENotation: v => v,

  rmb: v => v,
  hk: v => v,
  dollar: v => v,

  date1: v => v,
  date2: v => v,
  date3: v => v,
  date4: v => v,
  date5: v => v,
  time: v => v,
};

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
        format: CELL_TEXT_FORMAT.default,
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
      this._[ri][ci] = {
        text: '',
        format: CELL_TEXT_FORMAT.default,
        style: {},
      };
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

  getRectRangeCell(rectRange, cb, { sy = 0, sx = 0 } = {}, createNew = false) {
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = sy;
    for (let i = sri; i <= eri; i += 1) {
      const height = this.rows.getHeight(i);
      let x = sx;
      for (let j = sci; j <= eci; j += 1) {
        const width = this.cols.getWidth(j);
        const cell = createNew ? this.getCellOrNew(i, j) : this.getCell(i, j);
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

  setData(data = []) {
    this._ = data;
    return this;
  }
}

export { Cells, CELL_TEXT_FORMAT };
