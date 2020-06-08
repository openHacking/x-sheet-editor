/**
 * GridLineHandle
 * @author jerry
 */
class GridLineHandle {

  constructor(table) {
    this.table = table;
  }

  vLineFilter(ci, ri) {
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

  hLineFilter(ri, ci) {
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
    const { merges } = table;
    return this.gridHLine(viewRange, 0, 0, (ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        return false;
      }
      return this.hLineFilter(ri, ci);
    });
  }

  vLine(viewRange) {
    const { table } = this;
    const { merges } = table;
    return this.gridVLine(viewRange, 0, 0, (ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        return false;
      }
      return this.vLineFilter(ci, ri);
    });
  }

  hMergeLine(mergesBrink) {
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { bottom } = brink;
      if (bottom) {
        const { view, x, y } = bottom;
        const item = this.gridHLine(view, x, y, (ri, ci) => this.hLineFilter(ri, ci));
        result = result.concat(item);
      }
    }
    return result;
  }

  vMergeLine(mergesBrink) {
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { right } = brink;
      if (right) {
        const { view, x, y } = right;
        const item = this.gridVLine(view, x, y, (ci, ri) => this.vLineFilter(ci, ri));
        result = result.concat(item);
      }
    }
    return result;
  }
}

export { GridLineHandle };
