import { ALIGN, TEXT_WRAP } from '../../../canvas/Font';
import { Utils } from '../../../utils/Utils';

/**
 * GridLineHandle
 * @author jerry
 */
class GridLineHandle {

  /**
   * GridLineHandle
   * @param table
   */
  constructor(table) {
    this.table = table;
  }

  /**
   * 绘制垂直网格线段时
   * 判断网格左右的单元格中
   * 是否存在overflow裁剪类型
   * 的单元格, 如果有判断宽度是否
   * 覆盖了当前线段如果覆盖了
   * 则跳过该线段绘制
   * @param ci
   * @param ri
   */
  vLineOverFlowWidthChecked(ci, ri) {
    const { table } = this;
    const { cells, cols } = table;
    const { len } = cols;
    const master = cells.getCell(ri, ci);
    const next = cells.getCell(ri, ci + 1);

    let checkedRight = true;
    let checkedLeft = true;

    if (master) {
      const { fontAttr } = master;
      const { align } = fontAttr;
      const maxWidth = cols.getWidth(ci);
      if (align === ALIGN.left || align === ALIGN.center) {
        const width = this.getCellContentWidth(master, ci);
        if (width > maxWidth) {
          if (next === null || Utils.isBlank(next.text)) checkedLeft = false;
        }
      }
    }

    // 检查左边是否越界
    let leftWidth = cols.getWidth(ci - 1) + cols.getWidth(ci);
    for (let i = ci - 1; i >= 0; i -= 1, leftWidth += cols.getWidth(i)) {
      const cell = cells.getCell(ri, i);
      if (cell === null) continue;
      const { text } = cell;
      if (Utils.isBlank(text)) continue;
      const { fontAttr } = cell;
      const { align } = fontAttr;
      if (align === ALIGN.left || align === ALIGN.center) {
        const width = this.getCellContentWidth(cell, i);
        if (width > leftWidth) {
          if ((master === null || Utils.isBlank(master.text))
            && (next === null || Utils.isBlank(next.text))) {
            checkedLeft = false;
          }
        }
      }
      break;
    }

    // 检查右边是否越界
    let rightWidth = cols.getWidth(ci + 1);
    for (let j = ci + 1; j <= len; j += 1, rightWidth += cols.getWidth(j)) {
      const cell = cells.getCell(ri, j);
      if (cell === null) continue;
      const { text } = cell;
      if (Utils.isBlank(text)) continue;
      const { fontAttr } = cell;
      const { align } = fontAttr;
      if (align === ALIGN.right || align === ALIGN.center) {
        const width = this.getCellContentWidth(cell, j);
        if (width > rightWidth) {
          if (master === null || Utils.isBlank(master.text)) {
            checkedRight = false;
          }
        }
      }
      break;
    }

    return checkedLeft && checkedRight;
  }

  /**
   * 检查垂直线段是否需要绘制
   * @param ci
   * @param ri
   * @returns {boolean}
   */
  vLineBorderChecked(ci, ri) {
    const { table } = this;
    const { cells } = table;
    const cell = cells.getMergeCellOrCell(ri, ci);
    const nextCell = cells.getMergeCellOrCell(ri, ci + 1);
    // 跳过绘制边框的单元格
    if (cell && nextCell) {
      return !(cell.borderAttr.right.display || nextCell.borderAttr.left.display);
    }
    if (cell) {
      return !cell.borderAttr.right.display;
    }
    if (nextCell) {
      return !nextCell.borderAttr.left.display;
    }
    return true;
  }

  /**
   * 检查水平线段是否需要绘制
   * @param ri
   * @param ci
   * @returns {boolean}
   */
  hLineBorderChecked(ri, ci) {
    const { table } = this;
    const { cells } = table;
    const cell = cells.getMergeCellOrCell(ri, ci);
    const nextCell = cells.getMergeCellOrCell(ri + 1, ci);
    // 跳过绘制边框的单元格
    if (cell && nextCell) {
      return !(cell.borderAttr.bottom.display || nextCell.borderAttr.top.display);
    }
    if (cell) {
      return !cell.borderAttr.bottom.display;
    }
    if (nextCell) {
      return !nextCell.borderAttr.top.display;
    }
    return true;
  }

  /**
   * 计算单元格内容宽度
   * @param cell
   * @param ci
   * @returns {number|*}
   */
  getCellContentWidth(cell, ci) {
    const { table } = this;
    const { cols } = table;
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

  /**
   * 水平线段位置计算
   * @param viewRange
   * @param bx
   * @param by
   * @param filter
   * @returns {[]}
   */
  gridHLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table } = this;
    const { lineHandle, cols, rows } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    let breakpoint;
    lineHandle.hEach({
      viewRange,
      newRow: (row, y) => {
        const height = rows.getHeight(row);
        sx = bx;
        sy = by + y + height;
        ex = sx;
        ey = sy;
        breakpoint = false;
      },
      filter,
      jump: (row, col) => {
        if (breakpoint) {
          breakpoint = false;
          line.push({ sx, sy, ex, ey });
        }
        const width = cols.getWidth(col);
        sx = ex + width;
        ex = sx;
      },
      handle: (row, col) => {
        breakpoint = true;
        const width = cols.getWidth(col);
        ex += width;
      },
      endRow: () => {
        if (breakpoint) {
          line.push({ sx, sy, ex, ey });
        }
      },
    });
    return line;
  }

  /**
   * 垂直线段位置计算
   * @param viewRange
   * @param bx
   * @param by
   * @param filter
   * @returns {[]}
   */
  gridVLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table } = this;
    const { lineHandle, cols, rows } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    let breakpoint;
    lineHandle.vEach({
      viewRange,
      newCol: (col, x) => {
        const width = cols.getWidth(col);
        sx = bx + x + width;
        sy = by;
        ex = sx;
        ey = sy;
        breakpoint = false;
      },
      filter,
      jump: (col, row) => {
        if (breakpoint) {
          breakpoint = false;
          line.push({ sx, sy, ex, ey });
        }
        const height = rows.getHeight(row);
        sy = ey + height;
        ey = sy;
      },
      handle: (col, row) => {
        breakpoint = true;
        const height = rows.getHeight(row);
        ey += height;
      },
      endCol: () => {
        if (breakpoint) {
          line.push({ sx, sy, ex, ey });
        }
      },
    });
    return line;
  }

  /**
   * 水平线段位置计算
   * 检查水平线段是否需要绘制
   * @param viewRange
   * @returns {*[]}
   */
  hLine(viewRange) {
    const { table } = this;
    const { merges } = table;
    return this.gridHLine(viewRange, 0, 0, (ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        return false;
      }
      return this.hLineBorderChecked(ri, ci);
    });
  }

  /**
   * 垂直线段位置计算
   * 检查水平线段是否需要绘制
   * @param viewRange
   * @returns {*[]}
   */
  vLine(viewRange) {
    const { table } = this;
    const { merges } = table;
    return this.gridVLine(viewRange, 0, 0, (ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        return false;
      }
      if (!this.vLineBorderChecked(ci, ri)) {
        return false;
      }
      return this.vLineOverFlowWidthChecked(ci, ri);
    });
  }

  /**
   * 水平合并单元格线段位置计算
   * 检查水平线段是否需要绘制
   * @param mergesBrink
   * @returns {*[]}
   */
  hMergeLine(mergesBrink) {
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { bottom } = brink;
      if (bottom) {
        const { view, x, y } = bottom;
        const item = this.gridHLine(view, x, y, (ri, ci) => this.hLineBorderChecked(ri, ci));
        result = result.concat(item);
      }
    }
    return result;
  }

  /**
   *  垂直合并单元格线段位置计算
   * 检查水平线段是否需要绘制
   * @param mergesBrink
   * @returns {*[]}
   */
  vMergeLine(mergesBrink) {
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { right } = brink;
      if (right) {
        const { view, x, y } = right;
        const item = this.gridVLine(view, x, y, (ci, ri) => {
          if (!this.vLineBorderChecked(ci, ri)) {
            return false;
          }
          return this.vLineOverFlowWidthChecked(ci, ri);
        });
        result = result.concat(item);
      }
    }
    return result;
  }
}

export {
  GridLineHandle,
};
