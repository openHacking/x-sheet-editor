import { Cell } from './Cell';
import { PlainUtils } from '../../../utils/PlainUtils';
import { XIteratorBuilder } from '../iterator/XIteratorBuilder';
import { XTableDataItems } from '../XTableDataItems';
import { XMerges } from '../xmerges/XMerges';

/**
 * Cells
 * @author jerry
 */
class Cells {

  /**
   * Cells
   * @param xIteratorBuilder
   * @param xTableData
   * @param onChange
   * @param merges
   */
  constructor({
    xIteratorBuilder = new XIteratorBuilder(),
    xTableData = new XTableDataItems([]),
    onChange = () => {},
    merges = new XMerges(),
  } = {}) {
    this.xTableData = xTableData;
    this.merges = merges;
    this.onChange = onChange;
    this.xIteratorBuilder = xIteratorBuilder;
  }

  emptyRectRange(rectRange) {
    let empty = true;
    rectRange.each(this.xIteratorBuilder, (ri, ci) => {
      const cell = this.getCell(ri, ci);
      if (PlainUtils.isNotEmptyObject(cell) && !cell.isEmpty()) {
        empty = false;
        return false;
      }
      return true;
    });
    return empty;
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
    const { merges } = this;
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

  getData() {
    return this.xTableData.getItems();
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

}

export {
  Cells,
};
