import { Cell } from './Cell';
import { Utils } from '../../../utils/Utils';
import { ALIGN } from '../../../canvas/Font';

/**
 * Cells
 * @author jerry
 */
class Cells {

  /**
   * Cells
   * @param table
   * @param cols
   * @param rows
   * @param data
   */
  constructor(table, {
    cols, rows, data = [],
  }) {
    this.table = table;
    this.cols = cols;
    this.rows = rows;
    this.data = data;
  }

  /**
   * 获取单元格内容的越界宽度
   * @param ri
   * @param ci
   * @returns {number}
   */
  getCellBoundOutSize(ri, ci) {
    const { table } = this;
    const { cols } = table;
    const cell = this.getCell(ri, ci);
    if (cell) {
      const colWidth = cols.getWidth(ci);
      const { contentWidth, fontAttr } = cell;
      const { align } = fontAttr;
      switch (align) {
        case ALIGN.right:
        case ALIGN.left:
          return contentWidth;
        case ALIGN.center:
          return colWidth + ((contentWidth - colWidth) / 2);
        default:
          return 0;
      }
    }
    return 0;
  }

  /**
   * 获取指定行和列的单元格
   * @param ri
   * @param ci
   */
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

  /**
   * 获取指定行和列的单元格，如果获取到的
   * 单元格是合并单元格的部分则返回合并单元格起始
   * 单元格
   * @param ri
   * @param ci
   */
  getMergeCellOrCell(ri, ci) {
    const { table } = this;
    const { merges } = table;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
    }
    return this.getCell(ri, ci);
  }

  /**
   * 获取指定行列的单元格如果没有返回新的
   * @param ri
   * @param ci
   */
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

  /**
   * 设置指定单元格
   * @param ri
   * @param ci
   * @param cell
   */
  setCell(ri, ci, cell) {
    const row = this.data[ri];
    if (row && row[ci]) {
      row[ci] = cell;
    }
  }

  /**
   * 设置指定单元格
   * 如果不存在则创建
   * @param ri
   * @param ci
   * @param cell
   */
  setCellOrNew(ri, ci, cell) {
    if (Utils.isUnDef(this.data[ri])) {
      this.data[ri] = [];
    }
    this.data[ri][ci] = cell;
  }

  /**
   * getData
   * @returns {*[]}
   */
  getData() {
    return this.data;
  }

  /**
   * setData
   * @param data
   * @returns {Cells}
   */
  setData(data = []) {
    this.data = data;
    return this;
  }
}

export { Cells };
