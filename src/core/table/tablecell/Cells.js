import { Cell } from './Cell';
import { PlainUtils } from '../../../utils/PlainUtils';
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
    this.rows = rows;
    this.cols = cols;
    this.data = data;
  }

  emptyRectRange(rectRange) {
    let empty = true;
    rectRange.each((ri, ci) => {
      const cell = this.getCell(ri, ci);
      if (PlainUtils.isNotEmptyObject(cell) && !PlainUtils.isBlank(cell.text)) {
        empty = false;
        return false;
      }
      return true;
    });
    return empty;
  }

  setCellOrNew(ri, ci, cell) {
    if (PlainUtils.isUnDef(this.data[ri])) {
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
    if (PlainUtils.isUnDef(this.data[ri])) {
      this.data[ri] = [];
    }
    if (PlainUtils.isUnDef(this.data[ri][ci])) {
      this.data[ri][ci] = {
        text: '',
      };
    }
    return this.getCell(ri, ci);
  }

  getCellOrMergeCell(ri, ci) {
    const { merges } = this;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
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
      if (PlainUtils.isString(item)) {
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
    if (!cell) {
      return 0;
    }
    const { contentWidth, fontAttr } = cell;
    const { align } = fontAttr;
    let boundOutWidth = 0;
    const colWidth = cols.getWidth(ci);
    switch (align) {
      case BaseFont.ALIGN.right:
      case BaseFont.ALIGN.left: {
        boundOutWidth = contentWidth;
        break;
      }
      case BaseFont.ALIGN.center: {
        if (cell.isAngleBarCell()) {
          boundOutWidth = contentWidth;
        } else {
          boundOutWidth = colWidth + ((contentWidth - colWidth) / 2);
        }
        break;
      }
    }
    return boundOutWidth;
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
