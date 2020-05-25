
/**
 * GridLineHandle
 * @author jerry
 */
class GridLineHandle {

  constructor(table) {
    this.table = table;
  }

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

  hLine(viewRange) {
    const { table } = this;
    const { merges, cells } = table;
    return this.gridHLine(viewRange, 0, 0, (ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      const cell = cells.getMergeCellOrCell(ri, ci);
      const nextCell = cells.getMergeCellOrCell(ri + 1, ci);
      // 跳过合并单元格
      if (merge) {
        return false;
      }
      // 跳过绘制边框的单元格
      if (cell && nextCell) {
        return !cell.borderAttr.bottom.display
          || !nextCell.borderAttr.top.display;
      }
      if (cell) {
        return !cell.borderAttr.bottom.display;
      }
      if (nextCell) {
        return !nextCell.borderAttr.top.display;
      }
      return true;
    });
  }

  vLine(viewRange) {
    const { table } = this;
    const { merges, cells } = table;
    return this.gridVLine(viewRange, 0, 0, (ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci);
      const cell = cells.getMergeCellOrCell(ri, ci);
      const nextCell = cells.getMergeCellOrCell(ri, ci + 1);
      // 跳过合并单元格
      if (merge) {
        return false;
      }
      // 跳过绘制边框的单元格
      if (cell && nextCell) {
        return !cell.borderAttr.right.display
          || !nextCell.borderAttr.left.display;
      }
      if (cell) {
        return !cell.borderAttr.right.display;
      }
      if (nextCell) {
        return !nextCell.borderAttr.left.display;
      }
      return true;
    });
  }

  hMergeLine(mergesBrink) {
    const { table } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { bottom } = brink;
      if (bottom) {
        const item = this.gridHLine(bottom.view, bottom.x, bottom.y, (ri, ci) => {
          const cell = cells.getCell(ri, ci);
          const nextCell = cells.getCell(ri + 1, ci);
          // 跳过绘制边框的单元格
          if (cell && nextCell) {
            return !cell.borderAttr.bottom.display
              || !nextCell.borderAttr.top.display;
          }
          if (cell) {
            return !cell.borderAttr.bottom.display;
          }
          if (nextCell) {
            return !nextCell.borderAttr.top.display;
          }
          return true;
        });
        result = result.concat(item);
      }
    }
    return result;
  }

  vMergeLine(mergesBrink) {
    const { table } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { right } = brink;
      if (right) {
        const item = this.gridVLine(right.view, right.x, right.y, (ci, ri) => {
          const cell = cells.getCell(ri, ci);
          const nextCell = cells.getCell(ri, ci + 1);
          // 跳过绘制边框的单元格
          if (cell && nextCell) {
            return !cell.borderAttr.right.display
              || !nextCell.borderAttr.left.display;
          }
          if (cell) {
            return !cell.borderAttr.right.display;
          }
          if (nextCell) {
            return !nextCell.borderAttr.left.display;
          }
          return true;
        });
        result = result.concat(item);
      }
    }
    return result;
  }
}

export { GridLineHandle };
