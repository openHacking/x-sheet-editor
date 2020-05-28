import { Rect } from '../../../canvas/Rect';
import { ALIGN, TEXT_DIRECTION, TEXT_WRAP, VERTICAL_ALIGN } from '../../../canvas/Font';
import { Utils } from '../../../utils/Utils';

/**
 * CellsHelper
 * @author jerry
 */
class CellsHelper {

  /**
   * CellsHelper
   * @param cells
   * @param merges
   * @param rows
   * @param cols
   */
  constructor({ cells, merges, rows, cols }) {
    this.cells = cells;
    this.merges = merges;
    this.rows = rows;
    this.cols = cols;
  }

  /**
   * 获取指定单元格中文字的最大绘制宽度
   * @param ri
   * @param ci
   */
  getCellTextMaxWidth(ri, ci) {
    const { cells, cols } = this;
    const cell = cells.getCell(ri, ci);
    const { fontAttr } = cell;
    const { align } = fontAttr;
    let width = 0;
    let offset = 0;
    if (align === ALIGN.left) {
      for (let i = ci, { len } = cols; i <= len; i += 1) {
        const cell = cells.getCell(ri, i);
        if (i === ci) {
          width += cols.getWidth(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          width += cols.getWidth(i);
        } else {
          break;
        }
      }
    }
    if (align === ALIGN.center) {
      for (let i = ci, { len } = cols; i <= len; i += 1) {
        const cell = cells.getCell(ri, i);
        if (i === ci) {
          width += cols.getWidth(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          width += cols.getWidth(i);
        } else {
          break;
        }
      }
      for (let i = ci - 1; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          const tmp = cols.getWidth(i);
          width += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
    }
    if (align === ALIGN.right) {
      for (let i = ci; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        if (i === ci) {
          width += cols.getWidth(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          const tmp = cols.getWidth(i);
          width += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
    }
    return { width, offset };
  }

  /**
   * 获取指定单元格中文字的最大绘制高度
   * @param ri
   * @param ci
   */
  getCellTextMaxHeight(ri, ci) {
    const { cells, rows } = this;
    const cell = cells.getCell(ri, ci);
    const { fontAttr } = cell;
    const { verticalAlign } = fontAttr;
    let height = 0;
    let offset = 0;
    if (verticalAlign === VERTICAL_ALIGN.top) {
      for (let i = ri, { len } = rows; i <= len; i += 1) {
        const cell = cells.getCell(i, ci);
        if (i === ci) {
          height += rows.getHeight(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          height += rows.getHeight(i);
        } else {
          break;
        }
      }
    }
    if (verticalAlign === VERTICAL_ALIGN.center) {
      for (let i = ri, { len } = rows; i <= len; i += 1) {
        const cell = cells.getCell(i, ci);
        if (i === ci) {
          height += rows.getHeight(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          height += rows.getHeight(i);
        } else {
          break;
        }
      }
      for (let i = ri - 1; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          const tmp = rows.getHeight(i);
          height += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
    }
    if (verticalAlign === VERTICAL_ALIGN.bottom) {
      for (let i = ri; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        if (i === ci) {
          height += rows.getHeight(i);
        } else if (Utils.isUnDef(cell) || Utils.isBlank(cell.text)) {
          const tmp = rows.getHeight(i);
          height += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
    }
    return { height, offset };
  }

  /**
   * 获取指定视图区域中的单元格
   * @param rectRange
   * @param callback
   * @param startX
   * @param startY
   */
  getCellByViewRange({
    rectRange, callback, startX = 0, startY = 0,
  }) {
    const { rows, cols, cells } = this;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = startY;
    for (let i = sri; i <= eri; i += 1) {
      const height = rows.getHeight(i);
      let x = startX;
      for (let j = sci; j <= eci; j += 1) {
        let overFlow;
        const width = cols.getWidth(j);
        const cell = cells.getCell(i, j);
        if (cell) {
          const rect = new Rect({ x, y, width, height });
          const { fontAttr } = cell;
          const { direction, textWrap } = fontAttr;
          if (textWrap === TEXT_WRAP.OVER_FLOW) {
            if (direction === TEXT_DIRECTION.VERTICAL) {
              const max = this.getCellTextMaxHeight(i, j);
              overFlow = new Rect({ x, y: y + max.offset, width, height: max.height });
            } else {
              const max = this.getCellTextMaxWidth(i, j);
              overFlow = new Rect({ x: x + max.offset, y, width: max.width, height });
            }
          }
          const result = callback(i, j, cell, rect, overFlow);
          if (result === false) {
            return;
          }
        }
        x += width;
      }
      y += height;
    }
  }

  /**
   * 获取指定区域中的合并单元格
   * @param rectRange
   * @param callback
   */
  getMergeCellByViewRange({ rectRange, callback }) {
    const { cells, merges, cols, rows } = this;
    const filter = [];
    this.getCellByViewRange({
      rectRange,
      callback: (ri, ci) => {
        const merge = merges.getFirstIncludes(ri, ci);
        if (!merge || filter.find(item => item === merge)) {
          return;
        }
        filter.push(merge);
        const cell = cells.getCell(merge.sri, merge.sci);
        const minSri = Math.min(rectRange.sri, merge.sri);
        let maxSri = Math.max(rectRange.sri, merge.sri);
        const minSci = Math.min(rectRange.sci, merge.sci);
        let maxSci = Math.max(rectRange.sci, merge.sci);
        maxSri -= 1;
        maxSci -= 1;
        let x = cols.sectionSumWidth(minSci, maxSci);
        let y = rows.sectionSumHeight(minSri, maxSri);
        x = rectRange.sci > merge.sci ? x * -1 : x;
        y = rectRange.sri > merge.sri ? y * -1 : y;
        const width = cols.sectionSumWidth(merge.sci, merge.eci);
        const height = rows.sectionSumHeight(merge.sri, merge.eri);
        const rect = new Rect({ x, y, width, height });
        callback(rect, cell);
      },
    });
  }

  /**
   * 获取指定区域中的单元格
   * 跳过合并单元格
   * @param rectRange
   * @param callback
   */
  getCellSkipMergeCellByViewRange({ rectRange, callback }) {
    const { merges } = this;
    this.getCellByViewRange({
      rectRange,
      callback: (ri, ci, cell, rect, overflow) => {
        const merge = merges.getFirstIncludes(ri, ci);
        if (merge === null) {
          callback(ri, ci, cell, rect, overflow);
        }
      },
    });
  }

  /**
   * 获取指定视图区域中的单元格
   * 如果单元格不存在则创建一个新的
   * @param rectRange
   * @param callback
   * @param startX
   * @param startY
   */
  getCellOrNewCellByViewRange({
    rectRange, callback, startX = 0, startY = 0,
  }) {
    const { rows, cols, cells } = this;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = startY;
    for (let i = sri; i <= eri; i += 1) {
      const height = rows.getHeight(i);
      let x = startX;
      for (let j = sci; j <= eci; j += 1) {
        let overFlow;
        const width = cols.getWidth(j);
        const cell = cells.getCellOrNew(i, j);
        const rect = new Rect({ x, y, width, height });
        const { fontAttr } = cell;
        const { direction, textWrap } = fontAttr;
        if (textWrap === TEXT_WRAP.OVER_FLOW) {
          if (direction === TEXT_DIRECTION.VERTICAL) {
            const max = this.getCellTextMaxHeight(i, j);
            overFlow = new Rect({ x, y: y + max.offset, width, height: max.height });
          } else {
            const max = this.getCellTextMaxWidth(i, j);
            overFlow = new Rect({ x: x + max.offset, y, width: max.width, height });
          }
        }
        const result = callback(i, j, cell, rect, overFlow);
        if (result === false) {
          return;
        }
        x += width;
      }
      y += height;
    }
  }

  /**
   * 获取指定区域中的合并单元格
   * 如果单元格不存在则创建新的
   * @param rectRange
   * @param callback
   */
  getMergeCellOrNewCellByViewRange({ rectRange, callback }) {
    const { cells, merges, cols, rows } = this;
    const filter = [];
    this.getCellOrNewCellByViewRange({
      rectRange,
      callback: (ri, ci) => {
        const merge = merges.getFirstIncludes(ri, ci);
        if (!merge || filter.find(item => item === merge)) {
          return;
        }
        filter.push(merge);
        const cell = cells.getCell(merge.sri, merge.sci);
        const minSri = Math.min(rectRange.sri, merge.sri);
        let maxSri = Math.max(rectRange.sri, merge.sri);
        const minSci = Math.min(rectRange.sci, merge.sci);
        let maxSci = Math.max(rectRange.sci, merge.sci);
        maxSri -= 1;
        maxSci -= 1;
        let x = cols.sectionSumWidth(minSci, maxSci);
        let y = rows.sectionSumHeight(minSri, maxSri);
        x = rectRange.sci > merge.sci ? x * -1 : x;
        y = rectRange.sri > merge.sri ? y * -1 : y;
        const width = cols.sectionSumWidth(merge.sci, merge.eci);
        const height = rows.sectionSumHeight(merge.sri, merge.eri);
        const rect = new Rect({ x, y, width, height });
        callback(rect, cell);
      },
    });
  }
}

export { CellsHelper };
