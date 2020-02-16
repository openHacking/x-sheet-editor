import { Utils } from '../../utils/Utils';
import { DateUtils } from '../../utils/DateUtils';
import { Rect } from '../../canvas/Rect';
import { npx } from '../../canvas/Draw';
import {Font} from "../../canvas/Font";

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
  constructor({ table, cols, rows, data = [] }) {
    this.table = table;
    this.cols = cols;
    this.rows = rows;
    this._ = data;
  }

  initCell(cell) {
    if (Utils.isUnDef(cell.ID)) {
      const defaultAttr = this.getDefaultAttr();
      return Utils.mergeDeep(defaultAttr, cell);
    }
    return cell;
  }

  getDefaultAttr() {
    return {
      ID: Date.now().toString(),
      text: '',
      format: CELL_TEXT_FORMAT_TYPE.default,
      background: null,
      fontAttr: {
        align: 'left',
        verticalAlign: 'middle',
        textWrap: false,
        strike: false,
        underline: false,
        color: '#000000',
        name: 'Arial',
        size: npx(13),
        bold: false,
        italic: false,
      },
    };
  }

  getFormatText(cell) {
    if (cell) {
      return CELL_TEXT_FORMAT_FUNC[cell.format](cell.text);
    }
    return '';
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
            x,
            y,
            width,
            height,
          }), cell);
        }
        x += width;
      }
      y += height;
    }
  }

  getRectRangeMergeCell(viewRange, cb) {
    const { table } = this;
    const { merges, cols, rows } = table;
    const filter = [];
    this.getRectRangeCell(viewRange, (i, c) => {
      const rectRange = merges.getFirstIncludes(i, c);
      if (!rectRange || filter.find(item => item === rectRange)) return;
      filter.push(rectRange);
      const cell = this.getCell(rectRange.sri, rectRange.sci);
      const minSri = Math.min(viewRange.sri, rectRange.sri);
      let maxSri = Math.max(viewRange.sri, rectRange.sri);
      const minSci = Math.min(viewRange.sci, rectRange.sci);
      let maxSci = Math.max(viewRange.sci, rectRange.sci);
      maxSri -= 1;
      maxSci -= 1;
      let x = cols.sectionSumWidth(minSci, maxSci);
      let y = rows.sectionSumHeight(minSri, maxSri);
      x = viewRange.sci > rectRange.sci ? x * -1 : x;
      y = viewRange.sri > rectRange.sri ? y * -1 : y;
      const width = cols.sectionSumWidth(rectRange.sci, rectRange.eci);
      const height = rows.sectionSumHeight(rectRange.sri, rectRange.eri);
      const rect = new Rect({
        x,
        y,
        width,
        height,
      });
      cb(rect, cell);
    });
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
