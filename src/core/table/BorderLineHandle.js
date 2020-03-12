class BorderLineHandle {

  constructor(table) {
    this.table = table;
    this.drawOptimization = true;
    this.borderOptimization = true;
  }

  borderHTLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table, drawOptimization } = this;
    const { lineHandle, cols, cells } = table;
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
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        ex += width;
        line.push({
          sx,
          sy,
          ex,
          ey,
          row,
          col,
          borderAttr,
        });
        sx = ex;
      },
    });
    if (drawOptimization) {
      for (let i = 1; i < line.length;) {
        const item = line[i];
        const last = line[i - 1];
        const ck1 = cells.borderEqual(item.borderAttr.bottom, last.borderAttr.bottom);
        const ck2 = item.col - last.col === 1;
        const ck3 = item.row === last.row;
        if (ck1 && ck2 && ck3) {
          last.ex = item.ex;
          last.col = item.col;
          line.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return line;
  }

  borderHBLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table, drawOptimization } = this;
    const { lineHandle, cols, rows, cells } = table;
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
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        ex += width;
        line.push({
          sx,
          sy,
          ex,
          ey,
          row,
          col,
          borderAttr,
        });
        sx = ex;
      },
    });
    if (drawOptimization) {
      for (let i = 1; i < line.length;) {
        const item = line[i];
        const last = line[i - 1];
        const ck1 = cells.borderEqual(item.borderAttr.bottom, last.borderAttr.bottom);
        const ck2 = item.col - last.col === 1;
        const ck3 = item.row === last.row;
        if (ck1 && ck2 && ck3) {
          last.ex = item.ex;
          last.col = item.col;
          line.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return line;
  }

  borderVLLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table, drawOptimization } = this;
    const { lineHandle, rows, cells } = table;
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
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        ey += height;
        line.push({
          sx,
          sy,
          ex,
          ey,
          row,
          col,
          borderAttr,
        });
        sy = ey;
      },
    });
    if (drawOptimization) {
      for (let i = 1; i < line.length;) {
        const item = line[i];
        const last = line[i - 1];
        const ck1 = cells.borderEqual(item.borderAttr.left, last.borderAttr.left);
        const ck2 = item.row - last.row === 1;
        const ck3 = item.col === last.col;
        if (ck1 && ck2 && ck3) {
          last.ey = item.ey;
          last.row = item.row;
          line.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return line;
  }

  borderVRLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table, drawOptimization } = this;
    const { lineHandle, rows, cols, cells } = table;
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
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        ey += height;
        line.push({
          sx,
          sy,
          ex,
          ey,
          row,
          col,
          borderAttr,
        });
        sy = ey;
      },
    });
    if (drawOptimization) {
      for (let i = 1; i < line.length;) {
        const item = line[i];
        const last = line[i - 1];
        const ck1 = cells.borderEqual(item.borderAttr.right, last.borderAttr.right);
        const ck2 = item.row - last.row === 1;
        const ck3 = item.col === last.col;
        if (ck1 && ck2 && ck3) {
          last.ey = item.ey;
          last.row = item.row;
          line.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return line;
  }

  htLine(viewRange) {
    const { table, borderOptimization } = this;
    const { merges, cells } = table;
    return this.borderHTLine(viewRange, 0, 0, (row, col) => {
      const merge = merges.getFirstIncludes(row, col);
      const borderTop = cells.isDisplayTopBorder(row, col);
      const borderBottom = cells.isDisplayBottomBorder(row - 1, col);
      const borderDiff = cells.borderComparisonOfTime(row, col, row - 1, col);
      if (merge) {
        return false;
      }
      if (borderOptimization) {
        if (borderTop && borderBottom) {
          return borderDiff === 1;
        }
      }
      return borderTop;
    });
  }

  hbLine(viewRange) {
    const { table, borderOptimization } = this;
    const { merges, cells } = table;
    return this.borderHBLine(viewRange, 0, 0, (row, col) => {
      const merge = merges.getFirstIncludes(row, col);
      const borderBottom = cells.isDisplayBottomBorder(row, col);
      const borderTop = cells.isDisplayTopBorder(row + 1, col);
      const borderDiff = cells.borderComparisonOfTime(row, col, row + 1, col);
      if (merge) {
        return false;
      }
      if (borderOptimization) {
        if (borderBottom && borderTop) {
          return borderDiff === 1 || borderDiff === 0;
        }
      }
      return borderBottom;
    });
  }

  vlLine(viewRange) {
    const { table, borderOptimization } = this;
    const { merges, cells } = table;
    return this.borderVLLine(viewRange, 0, 0, (col, row) => {
      const merge = merges.getFirstIncludes(row, col);
      const borderLeft = cells.isDisplayLeftBorder(row, col);
      const borderRight = cells.isDisplayRightBorder(row, col - 1);
      const borderDiff = cells.borderComparisonOfTime(row, col, row, col - 1);
      if (merge) {
        return false;
      }
      if (borderOptimization) {
        if (borderLeft && borderRight) {
          return borderDiff === 1;
        }
      }
      return borderLeft;
    });
  }

  vrLine(viewRange) {
    const { table, borderOptimization } = this;
    const { merges, cells } = table;
    return this.borderVRLine(viewRange, 0, 0, (col, row) => {
      const merge = merges.getFirstIncludes(row, col);
      const borderRight = cells.isDisplayRightBorder(row, col);
      const borderLeft = cells.isDisplayLeftBorder(row, col + 1);
      const borderDiff = cells.borderComparisonOfTime(row, col, row, col + 1);
      if (merge) {
        return false;
      }
      if (borderOptimization) {
        if (borderRight && borderLeft) {
          return borderDiff === 1 || borderDiff === 0;
        }
      }
      return borderRight;
    });
  }

  htMergeLine(mergesBrink) {
    const { table, borderOptimization } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { top } = brink;
      if (top) {
        result = result.concat(this.borderHTLine(top.view, top.x, top.y, (row, col) => {
          const borderTop = cells.isDisplayTopBorder(row, col);
          const borderBottom = cells.isDisplayBottomBorder(row - 1, col);
          const borderDiff = cells.borderComparisonOfTime(row, col, row - 1, col);
          if (borderOptimization) {
            if (borderTop && borderBottom) {
              return borderDiff === 1;
            }
          }
          return borderTop;
        }));
      }
    }
    return result;
  }

  hbMergeLine(mergesBrink) {
    const { table, borderOptimization } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { bottom } = brink;
      if (bottom) {
        result = result.concat(this.borderHBLine(bottom.view, bottom.x, bottom.y, (row, col) => {
          const borderBottom = cells.isDisplayBottomBorder(row, col);
          const borderTop = cells.isDisplayTopBorder(row + 1, col);
          const borderDiff = cells.borderComparisonOfTime(row, col, row + 1, col);
          if (borderOptimization) {
            if (borderBottom && borderTop) {
              return borderDiff === 1 || borderDiff === 0;
            }
          }
          return borderBottom;
        }));
      }
    }
    return result;
  }

  vlMergeLine(mergesBrink) {
    const { table, borderOptimization } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { left } = brink;
      if (left) {
        result = result.concat(this.borderVLLine(left.view, left.x, left.y, (col, row) => {
          const borderLeft = cells.isDisplayLeftBorder(row, col);
          const borderRight = cells.isDisplayRightBorder(row, col - 1);
          const borderDiff = cells.borderComparisonOfTime(row, col, row, col - 1);
          if (borderOptimization) {
            if (borderLeft && borderRight) {
              return borderDiff === 1;
            }
          }
          return borderLeft;
        }));
      }
    }
    return result;
  }

  vrMergeLine(mergesBrink) {
    const { table, borderOptimization } = this;
    const { cells } = table;
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { right } = brink;
      if (right) {
        result = result.concat(this.borderVRLine(right.view, right.x, right.y, (col, row) => {
          const borderRight = cells.isDisplayRightBorder(row, col);
          const borderLeft = cells.isDisplayLeftBorder(row, col + 1);
          const borderDiff = cells.borderComparisonOfTime(row, col, row, col + 1);
          if (borderOptimization) {
            if (borderRight && borderLeft) {
              return borderDiff === 1 || borderDiff === 0;
            }
          }
          return borderRight;
        }));
      }
    }
    return result;
  }

  openDrawOptimization() {
    this.drawOptimization = true;
  }

  closeDrawOptimization() {
    this.drawOptimization = false;
  }

  openBorderOptimization() {
    this.borderOptimization = true;
  }

  closeBorderOptimization() {
    this.borderOptimization = false;
  }
}

export { BorderLineHandle };
