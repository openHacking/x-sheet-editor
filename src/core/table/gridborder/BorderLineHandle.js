
/**
 * BorderLineHandle
 * @author jerry
 */
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
        const ck1 = item.borderAttr.top.equal(last.borderAttr.top);
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
        const ck1 = item.borderAttr.bottom.equal(last.borderAttr.bottom);
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
        const ck1 = item.borderAttr.left.equal(last.borderAttr.left);
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
        const ck1 = item.borderAttr.right.equal(last.borderAttr.right);
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
    return this.borderHTLine(viewRange, 0, 0, (ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      const cell = cells.getMergeCellOrCell(ri, ci);
      const nextCell = cells.getMergeCellOrCell(ri - 1, ci);
      // 跳过合并单元格
      if (!cell || merge) {
        return false;
      }
      // 边框绘制优先级比较
      if (nextCell && borderOptimization) {
        const display = cell.borderAttr.top.display && nextCell.borderAttr.bottom.display;
        const compareTime = cell.borderAttr.top.compareTime(nextCell.borderAttr.bottom);
        if (display) {
          return compareTime === 1;
        }
      }
      // 边框是否显示
      return cell.borderAttr.top.display;
    });
  }

  hbLine(viewRange) {
    const { table, borderOptimization } = this;
    const { merges, cells } = table;
    return this.borderHBLine(viewRange, 0, 0, (ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      const cell = cells.getMergeCellOrCell(ri, ci);
      const nextCell = cells.getMergeCellOrCell(ri + 1, ci);
      // 跳过合并单元格
      if (!cell || merge) {
        return false;
      }
      // 边框绘制优先级比较
      if (nextCell && borderOptimization) {
        const display = cell.borderAttr.bottom.display && nextCell.borderAttr.top.display;
        const compareTime = cell.borderAttr.bottom.compareTime(nextCell.borderAttr.top);
        if (display) {
          return compareTime === 1 || compareTime === 0;
        }
      }
      // 边框是否显示
      return cell.borderAttr.bottom.display;
    });
  }

  vlLine(viewRange) {
    const { table, borderOptimization } = this;
    const { merges, cells, lineHandle } = table;
    return this.borderVLLine(viewRange, 0, 0, (ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci);
      const cell = cells.getMergeCellOrCell(ri, ci);
      const nextCell = cells.getMergeCellOrCell(ri, ci - 1);
      // 跳过合并单元格
      if (!cell || merge) {
        return false;
      }
      // 边框绘制优先级比较
      if (nextCell && borderOptimization) {
        const display = cell.borderAttr.left.display && nextCell.borderAttr.right.display;
        // 是否左右两边线段都需要显示
        if (display) {
          // 检查两个边框的更新时间
          // 由更新时间判断优先显示
          // 那边的边框
          const compareTime = cell.borderAttr.left.compareTime(nextCell.borderAttr.right);
          const diff = compareTime === 1;
          if (diff) {
            return lineHandle.vLineLeftOverFlowChecked(ci, ri);
          }
          return false;
        }
      }
      // 边框是否显示
      if (cell.borderAttr.left.display) {
        return lineHandle.vLineLeftOverFlowChecked(ci, ri);
      }
      return cell.borderAttr.left.display;
    });
  }

  vrLine(viewRange) {
    const { table, borderOptimization } = this;
    const { merges, cells, lineHandle } = table;
    return this.borderVRLine(viewRange, 0, 0, (ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci);
      const cell = cells.getMergeCellOrCell(ri, ci);
      const nextCell = cells.getMergeCellOrCell(ri, ci + 1);
      // 跳过合并单元格
      if (!cell || merge) {
        return false;
      }
      // 边框绘制优先级比较
      if (nextCell && borderOptimization) {
        const display = cell.borderAttr.right.display && nextCell.borderAttr.left.display;
        // 是否左右两边线段都需要显示
        if (display) {
          // 检查两个边框的更新时间
          // 由更新时间判断优先显示
          // 那边的边框
          const compareTime = cell.borderAttr.right.compareTime(nextCell.borderAttr.left);
          const diff = compareTime === 1 || compareTime === 0;
          if (diff) {
            return lineHandle.vLineRightOverFlowChecked(ci, ri);
          }
          return false;
        }
      }
      // 边框是否显示
      if (cell.borderAttr.right.display) {
        return lineHandle.vLineRightOverFlowChecked(ci, ri);
      }
      return cell.borderAttr.right.display;
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
        const item = this.borderHTLine(top.view, top.x, top.y, (ri, ci) => {
          const cell = cells.getCell(ri, ci);
          const nextCell = cells.getCell(ri - 1, ci);
          if (!cell) {
            return false;
          }
          // 边框绘制优先级比较
          if (nextCell && borderOptimization) {
            const display = cell.borderAttr.top.display && nextCell.borderAttr.bottom.display;
            const compareTime = cell.borderAttr.top.compareTime(nextCell.borderAttr.bottom);
            if (display) {
              return compareTime === 1;
            }
          }
          // 边框是否显示
          return cell.borderAttr.top.display;
        });
        result = result.concat(item);
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
        const item = this.borderHBLine(bottom.view, bottom.x, bottom.y, (ri, ci) => {
          const cell = cells.getCell(ri, ci);
          const nextCell = cells.getCell(ri + 1, ci);
          if (!cell) {
            return false;
          }
          // 边框绘制优先级比较
          if (nextCell && borderOptimization) {
            const display = cell.borderAttr.bottom.display && nextCell.borderAttr.top.display;
            const compareTime = cell.borderAttr.bottom.compareTime(nextCell.borderAttr.top);
            if (display) {
              return compareTime === 1 || compareTime === 0;
            }
          }
          // 边框是否显示
          return cell.borderAttr.bottom.display;
        });
        result = result.concat(item);
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
        const item = this.borderVLLine(left.view, left.x, left.y, (ci, ri) => {
          const cell = cells.getCell(ri, ci);
          const nextCell = cells.getCell(ri, ci - 1);
          if (!cell) {
            return false;
          }
          // 边框绘制优先级比较
          if (nextCell && borderOptimization) {
            const display = cell.borderAttr.left.display && nextCell.borderAttr.right.display;
            const compareTime = cell.borderAttr.left.compareTime(nextCell.borderAttr.right);
            if (display) {
              return compareTime === 1;
            }
          }
          // 边框是否显示
          return cell.borderAttr.left.display;
        });
        result = result.concat(item);
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
        const item = this.borderVRLine(right.view, right.x, right.y, (ci, ri) => {
          const cell = cells.getCell(ri, ci);
          const nextCell = cells.getCell(ri, ci + 1);
          if (!cell) {
            return false;
          }
          // 边框绘制优先级比较
          if (nextCell && borderOptimization) {
            const display = cell.borderAttr.right.display && nextCell.borderAttr.left.display;
            const compareTime = cell.borderAttr.right.compareTime(nextCell.borderAttr.left);
            if (display) {
              return compareTime === 1 || compareTime === 0;
            }
          }
          // 边框是否显示
          return cell.borderAttr.right.display;
        });
        result = result.concat(item);
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
