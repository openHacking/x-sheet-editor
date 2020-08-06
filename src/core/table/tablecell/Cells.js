import { Cell } from './Cell';
import { Utils } from '../../../utils/Utils';
import { BaseFont } from '../../../canvas/font/BaseFont';

/**
 * Cells
 * @author jerry
 */
class Cells {

  constructor({
    merges,
    cols,
    rows,
    data = [],
  }) {
    this.merges = merges;
    this.cols = cols;
    this.rows = rows;
    this.data = data;
  }

  setCellOrNew(ri, ci, cell) {
    if (Utils.isUnDef(this.data[ri])) {
      this.data[ri] = [];
    }
    this.data[ri][ci] = cell;
  }

  setCell(ri, ci, cell) {
    const row = this.data[ri];
    if (row && row[ci]) {
      row[ci] = cell;
    }
  }

  getCellOrNew(ri, ci) {
    if (Utils.isUnDef(this.data[ri])) {
      this.data[ri] = [];
    }
    if (Utils.isUnDef(this.data[ri][ci])) {
      this.data[ri][ci] = {
        text: '',
      };
    }
    return this.getCell(ri, ci);
  }

  getCell(ri, ci) {
    const row = this.data[ri];
    if (row && row[ci]) {
      let item = row[ci];
      if (item instanceof Cell) {
        return row[ci];
      }
      if (Utils.isString(item)) {
        item = {
          text: item,
        };
      }
      row[ci] = new Cell(item);
      return row[ci];
    }
    return null;
  }

  getCellBoundOutSize(ri, ci) {
    const { cols } = this;
    const cell = this.getCell(ri, ci);
    if (cell) {
      const colWidth = cols.getWidth(ci);
      const { contentWidth, fontAttr } = cell;
      const { align } = fontAttr;
      switch (align) {
        case BaseFont.ALIGN.right:
        case BaseFont.ALIGN.left:
          return contentWidth;
        case BaseFont.ALIGN.center:
          return colWidth + ((contentWidth - colWidth) / 2);
        default:
          return 0;
      }
    }
    return 0;
  }

  getData() {
    return this.data;
  }

  setData(data = []) {
    this.data = data;
    return this;
  }
}

export {
  Cells,
};
