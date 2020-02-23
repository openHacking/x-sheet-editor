import { Utils } from '../../utils/Utils';
import { Rect } from '../../canvas/Rect';

class Cells {
  constructor({
    table, cols, rows, data = [],
  }) {
    this.table = table;
    this.cols = cols;
    this.rows = rows;
    this._ = data;
  }

  initCell(cell) {
    return Utils.isUnDef(cell.ID) ? Utils.mergeDeep(this.getDefaultAttr(), cell) : cell;
  }

  isMergeCell(i, j) {
    const { table } = this;
    const { merges } = table;
    return merges.getFirstIncludes(i, j) !== null;
  }

  isLeftBorder(i, j) {
    const cell = this.getCell(i, j);
    return cell && cell.borderAttr.left.display;
  }

  isTopBorder(i, j) {
    const cell = this.getCell(i, j);
    return cell && cell.borderAttr.top.display;
  }

  isRightBorder(i, j) {
    const cell = this.getCell(i, j);
    return cell && cell.borderAttr.right.display;
  }

  isBottomBorder(i, j) {
    const cell = this.getCell(i, j);
    return cell && cell.borderAttr.bottom.display;
  }

  getDefaultAttr() {
    return {
      ID: Date.now().toString(),
      text: '',
      format: 'default',
      background: null,
      fontAttr: {
        align: 'left',
        verticalAlign: 'middle',
        textWrap: false,
        strike: false,
        underline: false,
        color: '#000000',
        name: 'Arial',
        size: 13,
        bold: false,
        italic: false,
      },
      borderAttr: {
        left: { display: true },
        top: { display: true },
        right: { display: true },
        bottom: { display: true },
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

export { Cells };
