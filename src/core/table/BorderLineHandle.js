class BorderLineHandle {

  constructor(table) {
    this.table = table;
  }

  borderHTLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table } = this;
    const { lineHandle, cols } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    lineHandle.hEach({
      viewRange,
      newRow: (row, y) => {
        sx = bx;
        sy = by + y;
        ex = sx;
        ey = sy;
      },
      filter,
      jump: (row, col) => {
        const width = cols.getWidth(col);
        sx = ex + width;
        ex = sx;
      },
      handle: (row, col) => {
        const width = cols.getWidth(col);
        ex += width;
        line.push({ sx, sy, ex, ey });
        sx = ex;
      },
    });
    return line;
  }

  borderHBLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table } = this;
    const { lineHandle, cols, rows } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    lineHandle.hEach({
      viewRange,
      newRow: (row, y) => {
        const height = rows.getHeight(row);
        sx = bx;
        sy = by + y + height;
        ex = sx;
        ey = sy;
      },
      filter,
      jump: (row, col) => {
        const width = cols.getWidth(col);
        sx = ex + width;
        ex = sx;
      },
      handle: (row, col) => {
        const width = cols.getWidth(col);
        ex += width;
        line.push({ sx, sy, ex, ey });
        sx = ex;
      },
    });
    return line;
  }

  borderVLLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table } = this;
    const { lineHandle, rows } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    lineHandle.vEach({
      viewRange,
      newCol: (col, x) => {
        sx = bx + x;
        sy = by;
        ex = sx;
        ey = sy;
      },
      filter,
      jump: (col, row) => {
        const height = rows.getHeight(row);
        sy = ey + height;
        ey = sy;
      },
      handle: (col, row) => {
        const height = rows.getHeight(row);
        ey += height;
        line.push({ sx, sy, ex, ey });
        sy = ey;
      },
    });
    return line;
  }

  borderVRLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table } = this;
    const { lineHandle, rows, cols } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    lineHandle.vEach({
      viewRange,
      newCol: (col, x) => {
        const width = cols.getWidth(col);
        sx = bx + x + width;
        sy = by;
        ex = sx;
        ey = sy;
      },
      filter,
      jump: (col, row) => {
        const height = rows.getHeight(row);
        sy = ey + height;
        ey = sy;
      },
      handle: (col, row) => {
        const height = rows.getHeight(row);
        ey += height;
        line.push({ sx, sy, ex, ey });
        sy = ey;
      },
    });
    return line;
  }

  htLine(viewRange) {
    const { table } = this;
    const { merges, cells } = table;
    return this.borderHTLine(viewRange, 0, 0, (row, col) => {
      const notMerges = merges.getFirstIncludes(row, col) === null;
      const borderTop = cells.isDisplayTopBorder(row, col);
      const borderBottom = cells.isDisplayBottomBorder(row - 1, col);
      const borderDiff = cells.borderComparisonOfTime(row, col, row - 1, col);
      if (borderTop && borderBottom) {
        return borderDiff === 1;
      }
      return notMerges && borderTop;
    });
  }

  hbLine(viewRange) {
    const { table } = this;
    const { merges, cells } = table;
    return this.borderHBLine(viewRange, 0, 0, (row, col) => {
      const notMerges = merges.getFirstIncludes(row, col) === null;
      const borderBottom = cells.isDisplayBottomBorder(row, col);
      const borderTop = cells.isDisplayTopBorder(row + 1, col);
      const borderDiff = cells.borderComparisonOfTime(row, col, row + 1, col);
      if (borderBottom && borderTop) {
        return borderDiff === 1 || borderDiff === 0;
      }
      return notMerges && borderBottom;
    });
  }

  vlLine(viewRange) {
    const { table } = this;
    const { merges, cells } = table;
    return this.borderVLLine(viewRange, 0, 0, (row, col) => {
      const notMerges = merges.getFirstIncludes(row, col) === null;
      const borderLeft = cells.isDisplayLeftBorder(row, col);
      const borderRight = cells.isDisplayRightBorder(row, col - 1);
      const borderDiff = cells.borderComparisonOfTime(row, col, row, col - 1);
      if (borderLeft && borderRight) {
        return borderDiff === 1;
      }
      return notMerges && borderLeft;
    });
  }

  vrLine(viewRange) {
    const { table } = this;
    const { merges, cells } = table;
    return this.borderVRLine(viewRange, 0, 0, (row, col) => {
      const notMerges = merges.getFirstIncludes(row, col) === null;
      const borderRight = cells.isDisplayRightBorder(row, col);
      const borderLeft = cells.isDisplayLeftBorder(row + 1, col);
      const borderDiff = cells.borderComparisonOfTime(row, col, row + 1, col);
      if (borderRight && borderLeft) {
        return borderDiff === 1 && borderDiff === 0;
      }
      return notMerges && borderRight;
    });
  }

  htMergeLine(mergesBrink) {
    const { table } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { top } = brink;
      result = result.concat(this.borderHTLine(top.view, top.x, top.y, (row, col) => {
        const borderTop = cells.isDisplayTopBorder(row, col);
        const borderBottom = cells.isDisplayBottomBorder(row - 1, col);
        const borderDiff = cells.borderComparisonOfTime(row, col, row - 1, col);
        if (borderTop && borderBottom) {
          return borderDiff === 1;
        }
        return borderTop;
      }));
    }
    return result;
  }

  hbMergeLine(mergesBrink) {
    const { table } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { bottom } = brink;
      result = result.concat(this.borderHBLine(bottom.view, bottom.x, bottom.y, (row, col) => {
        const borderBottom = cells.isDisplayBottomBorder(row, col);
        const borderTop = cells.isDisplayTopBorder(row + 1, col);
        const borderDiff = cells.borderComparisonOfTime(row, col, row + 1, col);
        if (borderBottom && borderTop) {
          return borderDiff === 1 && borderDiff === 0;
        }
        return borderBottom;
      }));
    }
    return result;
  }

  vlMergeLine(mergesBrink) {
    const { table } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { left } = brink;
      result = result.concat(this.borderVLLine(left.view, left.x, left.y, (col, row) => {
        const borderLeft = cells.isDisplayLeftBorder(row, col);
        const borderRight = cells.isDisplayRightBorder(row, col - 1);
        const borderDiff = cells.borderComparisonOfTime(row, col, row, col - 1);
        if (borderLeft && borderRight) {
          return borderDiff === 1;
        }
        return borderLeft;
      }));
    }
    return result;
  }

  vrMergeLine(mergesBrink) {
    const { table } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { right } = brink;
      result = result.concat(this.borderVRLine(right.view, right.x, right.y, (col, row) => {
        const borderRight = cells.isDisplayRightBorder(row, col);
        const borderLeft = cells.isDisplayLeftBorder(row, col + 1);
        const borderDiff = cells.borderComparisonOfTime(row, col, row, col + 1);
        if (borderRight && borderLeft) {
          return borderDiff === 1 && borderDiff === 0;
        }
        return borderRight;
      }));
    }
    return result;
  }
}

export { BorderLineHandle };
