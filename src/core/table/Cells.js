import { Rect } from '../../graphical/rect/Rect';
import { Utils } from '../../utils/Utils';
import { RectText } from '../../graphical/rect/RectText';
import { DateUtils } from '../../utils/DateUtils';

const parserToDate = (text) => {
  let result = DateUtils.parserToDate(text, 'yyyy/MM/dd hh:mm:ss');
  if (result) return result;
  result = DateUtils.parserToDate(text, 'yyyy/MM/dd');
  if (result) return result;
  result = DateUtils.parserToDate(text, 'hh:mm:ss');
  if (result) return result;
  result = DateUtils.parserToDate(text, 'MM月dd日');
  if (result) return result;
  result = DateUtils.parserToDate(text, 'yyyy年MM月');
  if (result) return result;
  result = DateUtils.parserToDate(text, 'yyyy年MM月dd日');
  if (result) return result;
  return null;
};

const CELL_TEXT_FORMAT_FUNC = {
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
  fraction: (v) => {
    if (Utils.isFraction(v)) {
      const left = v.split('/')[0];
      const right = v.split('/')[1];
      return Utils.parseInt(left) / Utils.parseInt(right);
    }
    return v;
  },
  ENotation: (v) => {
    if (Utils.isNumber(v)) {
      const number = Utils.parseFloat(v);
      return number.toExponential(2);
    }
    return v;
  },

  rmb: (v) => {
    if (Utils.isNumber(v)) {
      return `￥${v}`;
    }
    return v;
  },
  hk: (v) => {
    if (Utils.isNumber(v)) {
      return `HK${v}`;
    }
    return v;
  },
  dollar: (v) => {
    if (Utils.isNumber(v)) {
      return `$${v}`;
    }
    return v;
  },

  date1: (v) => {
    const result = parserToDate(v);
    if (result) return DateUtils.dateFormat('yyyy/MM/dd', result);
    return v;
  },
  date2: (v) => {
    const result = parserToDate(v);
    if (result) return DateUtils.dateFormat('MM月dd日', result);
    return v;
  },
  date3: (v) => {
    const result = parserToDate(v);
    if (result) return DateUtils.dateFormat('yyyy年MM月', result);
    return v;
  },
  date4: (v) => {
    const result = parserToDate(v);
    if (result) return DateUtils.dateFormat('yyyy年MM月dd日', result);
    return v;
  },
  date5: (v) => {
    const result = parserToDate(v);
    if (result) return DateUtils.dateFormat('yyyy/MM/dd hh:mm:ss', result);
    return v;
  },
  time: (v) => {
    const result = parserToDate(v);
    if (result) return DateUtils.dateFormat('hh:mm:ss', result);
    return v;
  },
};

const CELL_TEXT_FORMAT_TYPE = {
  default: 'default',
  text: 'text',

  number: 'number',
  percentage: 'percentage',
  fraction: 'fraction',
  ENotation: 'ENotation',

  rmb: 'rmb',
  hk: 'hk',
  dollar: 'dollar',

  date1: 'date1',
  date2: 'date2',
  date3: 'date3',
  date4: 'date4',
  date5: 'date5',
  time: 'time',
};

class Cells {
  constructor({ cols, rows, data = [] }) {
    this.cols = cols;
    this.rows = rows;
    this._ = data;
  }

  initCell(cell) {
    if (cell.ini === true) return cell;
    return Utils.mergeDeep({
      text: '',
      format: CELL_TEXT_FORMAT_TYPE.default,
      style: this.getDefaultStyle(),
      ini: true,
    }, cell);
  }

  getDefaultStyle() {
    return {
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
  }

  getCell(ri, ci) {
    const row = this._[ri];
    if (row && row[ci]) {
      row[ci] = this.initCell(row[ci]);
      return row[ci];
    }
    return null;
  }

  getCellOrNew(ri, ci) {
    if (!this._[ri]) {
      this._[ri] = [];
    }
    if (!this._[ri][ci]) {
      this._[ri][ci] = {};
    }
    this._[ri][ci] = this.initCell(this._[ri][ci]);
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
    return new RectText(draw, rect, this.getDefaultStyle());
  }

  getData() {
    return this._;
  }

  setData(data = []) {
    this._ = data;
    return this;
  }
}

export { Cells, CELL_TEXT_FORMAT_FUNC, CELL_TEXT_FORMAT_TYPE };
