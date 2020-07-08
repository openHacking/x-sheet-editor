/**
 * GridLineHandle
 * @author jerry
 */

class GridLineHandle {

  constructor(table, options) {
    this.table = table;
    const { cols, rows } = table;
    this.options = Object.assign({
      getWidth: col => cols.getWidth(col),
      getHeight: row => rows.getHeight(row),
      checked: true,
    }, options);
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
   * 水平线段位置计算
   * @param viewRange
   * @param bx
   * @param by
   * @param filter
   * @returns {[]}
   */
  gridHLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table, options } = this;
    const { lineHandle } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    let breakpoint;
    lineHandle.hEach({
      viewRange,
      newRow: (row, y) => {
        const height = options.getHeight(row);
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
        const width = options.getWidth(col);
        sx = ex + width;
        ex = sx;
      },
      handle: (row, col) => {
        breakpoint = true;
        const width = options.getWidth(col);
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
    const { table, options } = this;
    const { lineHandle } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    let breakpoint;
    lineHandle.vEach({
      viewRange,
      newCol: (col, x) => {
        const width = options.getWidth(col);
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
        const height = options.getHeight(row);
        sy = ey + height;
        ey = sy;
      },
      handle: (col, row) => {
        breakpoint = true;
        const height = options.getHeight(row);
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
    if (this.options.checked) {
      return this.gridHLine(viewRange, 0, 0, (ri, ci) => {
        const merge = merges.getFirstIncludes(ri, ci);
        if (merge) {
          return false;
        }
        return this.hLineBorderChecked(ri, ci);
      });
    }
    return this.gridHLine(viewRange, 0, 0);
  }

  /**
   * 垂直线段位置计算
   * 检查水平线段是否需要绘制
   * @param viewRange
   * @returns {*[]}
   */
  vLine(viewRange) {
    const { table } = this;
    const { merges, lineHandle } = table;
    if (this.options.checked) {
      return this.gridVLine(viewRange, 0, 0, (ci, ri) => {
        const merge = merges.getFirstIncludes(ri, ci);
        if (merge) {
          return false;
        }
        if (this.vLineBorderChecked(ci, ri) === false) {
          return false;
        }
        return lineHandle.vLineRightBoundOut(ci, ri);
      });
    }
    return this.gridVLine(viewRange, 0, 0);
  }

  /**
   * 水平合并单元格线段位置计算
   * 检查水平线段是否需要绘制
   * @param mergesBrink
   * @returns {*[]}
   */
  hMergeLine(mergesBrink) {
    let result = [];
    if (this.options.checked) {
      for (let i = 0; i < mergesBrink.length; i += 1) {
        const brink = mergesBrink[i];
        const { bottom } = brink;
        if (bottom) {
          const { view, x, y } = bottom;
          const item = this.gridHLine(view, x, y, (ri, ci) => this.hLineBorderChecked(ri, ci));
          result = result.concat(item);
        }
      }
    } else {
      for (let i = 0; i < mergesBrink.length; i += 1) {
        const brink = mergesBrink[i];
        const { bottom } = brink;
        if (bottom) {
          const { view, x, y } = bottom;
          const item = this.gridHLine(view, x, y);
          result = result.concat(item);
        }
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
    if (this.options.checked) {
      for (let i = 0; i < mergesBrink.length; i += 1) {
        const brink = mergesBrink[i];
        const { right } = brink;
        if (right) {
          const { view, x, y } = right;
          const item = this.gridVLine(view, x, y, (ci, ri) => this.vLineBorderChecked(ci, ri));
          result = result.concat(item);
        }
      }
    } else {
      for (let i = 0; i < mergesBrink.length; i += 1) {
        const brink = mergesBrink[i];
        const { right } = brink;
        if (right) {
          const { view, x, y } = right;
          const item = this.gridVLine(view, x, y);
          result = result.concat(item);
        }
      }
    }
    return result;
  }
}

export {
  GridLineHandle,
};
