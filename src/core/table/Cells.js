import { Utils } from '../../utils/Utils';
import { Rect } from '../../canvas/Rect';
import { CellsBorder } from './CellsBorder';
import { ALIGN, TEXT_WRAP, VERTICAL_ALIGN } from '../../canvas/Font';

class Cells extends CellsBorder {

  constructor({
    table, cols, rows, data = [],
  }) {
    super();
    this.table = table;
    this.cols = cols;
    this.rows = rows;
    this._ = data;
  }

  static getDefaultAttr() {
    const fontAttr = {
      align: ALIGN.left,
      verticalAlign: VERTICAL_ALIGN.center,
      textWrap: TEXT_WRAP.OVER_FLOW,
      strike: false,
      underline: false,
      color: '#000000',
      name: 'Arial',
      size: 14,
      bold: false,
      italic: false,
    };
    const borderAttr = {
      time: Utils.now(),
      left: { display: false },
      top: { display: false },
      right: { display: false },
      bottom: { display: false },
    };
    return {
      ID: Utils.now(),
      text: '',
      format: 'default',
      background: null,
      fontAttr,
      borderAttr,
    };
  }

  checkAttributeIntegrity(cell) {
    return Utils.isUnDef(cell.ID) ? Utils.mergeDeep(Cells.getDefaultAttr(), cell) : cell;
  }

  checkedMergeCell(ri, ci) {
    const { table } = this;
    const { merges } = table;
    return merges.getFirstIncludes(ri, ci) !== null;
  }

  getCell(ri, ci) {
    const row = this._[ri];
    if (row && row[ci]) {
      row[ci] = this.checkAttributeIntegrity(row[ci]);
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
    this._[ri][ci] = this.checkAttributeIntegrity(this._[ri][ci]);
    return this._[ri][ci];
  }

  getMergeCellOrCell(ri, ci) {
    const { table } = this;
    const { merges } = table;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
    }
    return this.getCell(ri, ci);
  }

  getCellInRectRange(rectRange, cb, { sy = 0, sx = 0 } = {}, createNew = false) {
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

  getMergeCellInRectRange(viewRange, cb) {
    const { table } = this;
    const { merges, cols, rows } = table;
    const filter = [];
    this.getCellInRectRange(viewRange, (i, c) => {
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
