import { Rect } from '../../canvas/Rect';
import { ALIGN, TEXT_DIRECTION, TEXT_WRAP, VERTICAL_ALIGN } from '../../canvas/Font';
import { Utils } from '../../utils/Utils';

/**
 * CellsHelper
 * @author jerry
 */
class CellsHelper {

  constructor({ cells, merges, rows, cols }) {
    this.cells = cells;
    this.merges = merges;
    this.rows = rows;
    this.cols = cols;
  }

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

  getCellTextMaxWidth(ri, ci) {
    const { cells, cols, merges } = this;
    const cell = cells.getCell(ri, ci);
    const { fontAttr } = cell;
    const { align } = fontAttr;
    let width = 0;
    let offset = 0;
    // 左边对齐
    if (align === ALIGN.left) {
      // 计算当前单元格右边
      // 空白的单元格的总宽度
      for (let i = ci, { len } = cols; i <= len; i += 1) {
        const cell = cells.getCell(ri, i);
        const merge = merges.getFirstIncludes(ri, i);
        if (i === ci) {
          width += cols.getWidth(i);
        } else if ((Utils.isUnDef(cell) || Utils.isBlank(cell.text)) && Utils.isUnDef(merge)) {
          width += cols.getWidth(i);
        } else {
          break;
        }
      }
    }
    // 居中对其
    if (align === ALIGN.center) {
      let rightWidth = 0;
      let leftWidth = 0;
      for (let i = ci + 1, { len } = cols; i <= len; i += 1) {
        const cell = cells.getCell(ri, i);
        const merge = merges.getFirstIncludes(ri, i);
        if ((Utils.isUnDef(cell) || Utils.isBlank(cell.text)) && Utils.isUnDef(merge)) {
          rightWidth += cols.getWidth(i);
        } else {
          break;
        }
      }
      for (let i = ci - 1; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        const merge = merges.getFirstIncludes(ri, i);
        if ((Utils.isUnDef(cell) || Utils.isBlank(cell.text)) && Utils.isUnDef(merge)) {
          const tmp = cols.getWidth(i);
          leftWidth += tmp;
          offset -= tmp;
        } else {
          break;
        }
      }
      width = cols.getWidth(ci) + leftWidth + rightWidth;
    }
    // 右边对其
    if (align === ALIGN.right) {
      // 计算当前单元格左边
      // 空白的单元格的总宽度
      for (let i = ci; i >= 0; i -= 1) {
        const cell = cells.getCell(ri, i);
        const merge = merges.getFirstIncludes(ri, i);
        if (i === ci) {
          width += cols.getWidth(i);
        } else if ((Utils.isUnDef(cell) || Utils.isBlank(cell.text)) && Utils.isUnDef(merge)) {
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

  getCellOverFlow(ri, ci, rect, cell) {
    const { fontAttr } = cell;
    const { direction, textWrap } = fontAttr;
    const { x, y, width, height } = rect;
    if (textWrap === TEXT_WRAP.OVER_FLOW) {
      if (direction === TEXT_DIRECTION.VERTICAL) {
        const max = this.getCellTextMaxHeight(ri, ci);
        return new Rect({ x, y: y + max.offset, width, height: max.height });
      }
      const max = this.getCellTextMaxWidth(ri, ci);
      return new Rect({ x: x + max.offset, y, width: max.width, height });
    }
    return null;
  }

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
        const width = cols.getWidth(j);
        const cell = cells.getCell(i, j);
        if (cell) {
          const rect = new Rect({ x, y, width, height });
          const overFlow = this.getCellOverFlow(i, j, rect, cell);
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
        const width = cols.getWidth(j);
        const cell = cells.getCellOrNew(i, j);
        const rect = new Rect({ x, y, width, height });
        const overFlow = this.getCellOverFlow(i, j, rect, cell);
        const result = callback(i, j, cell, rect, overFlow);
        if (result === false) {
          return;
        }
        x += width;
      }
      y += height;
    }
  }

  getMergeCellByViewRange({
    rectRange, callback, startX = 0, startY = 0,
  }) {
    const { rows, cols, cells, merges } = this;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    const filter = [];
    for (let i = sri; i <= eri; i += 1) {
      for (let j = sci; j <= eci; j += 1) {
        const merge = merges.getFirstIncludes(i, j);
        if (merge && !filter.find(item => item === merge)) {
          filter.push(merge);
          const cell = cells.getCellOrNew(merge.sri, merge.sci);
          const width = cols.sectionSumWidth(merge.sci, merge.eci);
          const height = rows.sectionSumHeight(merge.sri, merge.eri);
          const minSri = Math.min(rectRange.sri, merge.sri);
          const minSci = Math.min(rectRange.sci, merge.sci);
          let maxSri = Math.max(rectRange.sri, merge.sri);
          let maxSci = Math.max(rectRange.sci, merge.sci);
          maxSri -= 1;
          maxSci -= 1;
          let x = cols.sectionSumWidth(minSci, maxSci);
          let y = rows.sectionSumHeight(minSri, maxSri);
          x = rectRange.sci > merge.sci ? x * -1 : x;
          y = rectRange.sri > merge.sri ? y * -1 : y;
          x += startX;
          y += startY;
          const rect = new Rect({ x, y, width, height });
          callback(rect, cell);
        }
      }
    }
  }

  getCellSkipMergeCellByViewRange({
    rectRange, callback, startX = 0, startY = 0,
  }) {
    const { merges } = this;
    this.getCellByViewRange({
      rectRange,
      callback: (ri, ci, cell, rect, overflow) => {
        const merge = merges.getFirstIncludes(ri, ci);
        if (merge === null) {
          callback(ri, ci, cell, rect, overflow);
        }
      },
      startX,
      startY,
    });
  }
}

export { CellsHelper };
