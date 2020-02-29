
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
    return this.gridHLine(viewRange, 0, 0, (row, col) => {
      const notMerges = merges.getFirstIncludes(row, col) === null;
      const notBorderBottom = cells.isDisplayBottomBorder(row, col) === false;
      const notBorderTop = cells.isDisplayTopBorder(row + 1, col) === false;
      return notMerges && notBorderBottom && notBorderTop;
    });
  }

  vLine(viewRange) {
    const { table } = this;
    const { merges, cells } = table;
    return this.gridVLine(viewRange, 0, 0, (col, row) => {
      const notMerges = merges.getFirstIncludes(row, col) === null;
      const notBorderRight = cells.isDisplayRightBorder(row, col) === false;
      const notBorderLeft = cells.isDisplayLeftBorder(row + 1, col) === false;
      return notMerges && notBorderRight && notBorderLeft;
    });
  }

  hMergeLine(mergesBrink) {
    const { table } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { bottom } = brink;
      result = result.concat(this.gridHLine(bottom.view, bottom.x, bottom.y, (row, col) => {
        const notBorderBottom = cells.isDisplayBottomBorder(row, col) === false;
        const notBorderTop = cells.isDisplayTopBorder(row + 1, col) === false;
        return notBorderBottom && notBorderTop;
      }));
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
      result = result.concat(this.gridVLine(right.view, right.x, right.y, (col, row) => {
        const notBorderRight = cells.isDisplayRightBorder(row, col) === false;
        const notBorderLeft = cells.isDisplayLeftBorder(row + 1, col) === false;
        return notBorderRight && notBorderLeft;
      }));
    }
    return result;
  }
}

export { GridLineHandle };
