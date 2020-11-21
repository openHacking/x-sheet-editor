import { Cell } from './Cell';
import { PlainUtils } from '../../../utils/PlainUtils';
import { BaseFont } from '../../../canvas/font/BaseFont';

/**
 * Cells
 * @author jerry
 */
class Cells {

  constructor({
    onChange = () => {},
    table,
    xTableData,
  }) {
    this.table = table;
    this.xTableData = xTableData;
    this.onChange = onChange;
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

  setCell(ri, ci, cell) {
    const item = this.xTableData.get(ri, ci);
    if (item) {
      item.setCell(cell);
      this.onChange(ri, ci);
    }
  }

  setCellOrNew(ri, ci, cell) {
    const item = this.xTableData.getOrNew(ri, ci);
    item.setCell(cell);
    this.onChange(ri, ci);
  }

  getCellOrNew(ri, ci) {
    const item = this.xTableData.getOrNew(ri, ci);
    const find = item.getCell();
    if (find) {
      return find;
    }
    const cell = new Cell({ text: PlainUtils.EMPTY });
    item.setCell(cell);
    return cell;
  }

  getCellOrMergeCell(ri, ci) {
    const { table } = this;
    const { merges } = table;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
    }
    return this.getCell(ri, ci);
  }

  getCell(ri, ci) {
    const item = this.xTableData.get(ri, ci);
    if (item) {
      return item.getCell();
    }
    return null;
  }

  getCellBoundOutSize(ri, ci) {
    const { table } = this;
    const { cols } = table;
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
        if (table.isAngleBarCell(ri, ci)) {
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
    return this.xTableData.getItems().map(item => item.getCell());
  }

}

export {
  Cells,
};
