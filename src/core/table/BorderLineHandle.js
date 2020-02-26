class BorderLineHandle {
  constructor(table) {
    this.table = table;
  }

  horizontalLineEach({
    rectRange, interruptCkCb, startRowCb, handleCb, interruptHandleCb, endRowCb,
  }) {
    const { table } = this;
    const { cols, rows } = table;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = 0;
    for (let i = sri; i <= eri; i += 1) {
      const height = rows.getHeight(i);
      let x = 0;
      let continuous = true;
      startRowCb(y, height);
      for (let j = sci; j <= eci; j += 1) {
        const width = cols.getWidth(j);
        if (interruptCkCb(i, j)) {
          interruptHandleCb(x, width, continuous);
          continuous = true;
        } else {
          continuous = false;
        }
        handleCb(width);
        x += width;
      }
      endRowCb(continuous);
      y += height;
    }
  }

  verticalLineEach({
    rectRange, interruptCkCb, startColCb, handleCb, interruptHandleCb, endColCb,
  }) {
    const { table } = this;
    const { cols, rows } = table;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let x = 0;
    for (let i = sci; i <= eci; i += 1) {
      const width = cols.getWidth(i);
      let y = 0;
      let continuous = true;
      startColCb(x, width);
      for (let j = sri; j <= eri; j += 1) {
        const height = rows.getHeight(j);
        if (interruptCkCb(i, j)) {
          interruptHandleCb(y, height, continuous);
          continuous = true;
        } else {
          continuous = false;
        }
        handleCb(height);
        y += height;
      }
      endColCb(continuous);
      x += width;
    }
  }

  getMergesInfoByRectRange(rectRange) {
    const filter = [];
    const result = [];
    const { table } = this;
    const {
      merges, rows, cols, cells,
    } = table;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = 0;
    for (let i = sri; i <= eri; i += 1) {
      let x = 0;
      const rowsHeight = rows.getHeight(i);
      for (let j = sci; j <= eci; j += 1) {
        const colsWidth = cols.getWidth(j);
        const merge = merges.getFirstIncludes(i, j);
        if (merge && filter.indexOf(merge) === -1) {
          const cell = cells.getCell(merge.sri, merge.sci);
          const rect = rectRange.coincide(merge);
          const width = cols.sectionSumWidth(rect.sci, rect.eci);
          const height = rows.sectionSumHeight(rect.sri, rect.eri);
          filter.push(merge);
          result.push({
            x, y, width, height, cell, rect,
          });
        }
        x += colsWidth;
      }
      y += rowsHeight;
    }
    return result;
  }

  getTopLineByRectRange(rectRange) {
    const horizontalLines = [];
    const { table } = this;
    const { cells } = table;
    let targetX = 0;
    let targetY = 0;
    let targetWidth = 0;
    this.horizontalLineEach({
      rectRange,
      interruptCkCb: (i, j) => {
        const isMergeCell = cells.checkedMergeCell(i, j);
        const isDisplayTopBorder = cells.isDisplayTopBorder(i, j);
        const isDisplayBottomBorder = cells.isDisplayBottomBorder(i - 1, j);
        const priorityComparison = cells.borderComparisonOfTime(i, j, i - 1, j);
        if (isMergeCell) {
          return true;
        }
        if (isDisplayTopBorder && isDisplayBottomBorder) {
          if (priorityComparison === 1) {
            return false;
          }
        }
        return !isDisplayTopBorder;
      },
      startRowCb: (y) => {
        targetY = y;
        targetX = 0;
        targetWidth = 0;
      },
      handleCb: (width) => {
        targetWidth += width;
      },
      interruptHandleCb: (x, width, continuous) => {
        if (!continuous) {
          horizontalLines.push({
            sy: targetY,
            sx: targetX,
            ey: targetY,
            ex: targetWidth,
          });
        }
        targetX = x + width;
      },
      endRowCb: (continuous) => {
        if (!continuous) {
          horizontalLines.push({
            sy: targetY,
            sx: targetX,
            ey: targetY,
            ex: targetWidth,
          });
        }
      },
    });
    return horizontalLines;
  }

  getLeftLineByRectRange(rectRange) {
    const verticalLines = [];
    const { table } = this;
    const { cells } = table;
    let targetX = 0;
    let targetY = 0;
    let targetHeight = 0;
    this.verticalLineEach({
      rectRange,
      interruptCkCb: (i, j) => {
        const isMergeCell = cells.checkedMergeCell(j, i);
        const isDisplayLeftBorder = cells.isDisplayLeftBorder(j, i);
        const isDisplayRightBorder = cells.isDisplayRightBorder(j, i - 1);
        const priorityComparison = cells.borderComparisonOfTime(j, i, j, i - 1);
        if (isMergeCell) {
          return true;
        }
        if (isDisplayLeftBorder && isDisplayRightBorder) {
          if (priorityComparison === 1 || priorityComparison === 0) {
            return false;
          }
        }
        return !isDisplayLeftBorder;
      },
      startColCb: (x) => {
        targetX = x;
        targetY = 0;
        targetHeight = 0;
      },
      handleCb: (height) => {
        targetHeight += height;
      },
      interruptHandleCb: (y, height, continuous) => {
        if (!continuous) {
          verticalLines.push({
            sx: targetX,
            sy: targetY,
            ex: targetX,
            ey: targetHeight,
          });
        }
        targetY = y + height;
      },
      endColCb: (continuous) => {
        if (!continuous) {
          verticalLines.push({
            sx: targetX,
            sy: targetY,
            ex: targetX,
            ey: targetHeight,
          });
        }
      },
    });
    return verticalLines;
  }

  getRightLineByRectRange(rectRange) {
    const verticalLines = [];
    const { table } = this;
    const { cells } = table;
    let targetX = 0;
    let targetY = 0;
    let targetHeight = 0;
    this.verticalLineEach({
      rectRange,
      interruptCkCb: (i, j) => {
        const isMergeCell = cells.checkedMergeCell(j, i);
        const isDisplayRightBorder = cells.isDisplayRightBorder(j, i);
        const isDisplayLeftBorder = cells.isDisplayLeftBorder(j, i + 1);
        const priorityComparison = cells.borderComparisonOfTime(j, i, j, i + 1);
        if (isMergeCell) {
          return true;
        }
        if (isDisplayRightBorder && isDisplayLeftBorder) {
          if (priorityComparison === 1) {
            return false;
          }
        }
        if (isDisplayRightBorder) {
          return false;
        }
        return !isDisplayRightBorder;
      },
      startColCb: (x, width) => {
        targetX = x + width;
        targetY = 0;
        targetHeight = 0;
      },
      handleCb: (height) => {
        targetHeight += height;
      },
      interruptHandleCb: (y, height, continuous) => {
        if (!continuous) {
          verticalLines.push({
            sx: targetX,
            sy: targetY,
            ex: targetX,
            ey: targetHeight,
          });
        }
        targetY = y + height;
      },
      endColCb: (continuous) => {
        if (!continuous) {
          verticalLines.push({
            sx: targetX,
            sy: targetY,
            ex: targetX,
            ey: targetHeight,
          });
        }
      },
    });
    return verticalLines;
  }

  getBottomLineByRectRange(rectRange) {
    const horizontalLines = [];
    const { table } = this;
    const { cells } = table;
    let targetX = 0;
    let targetY = 0;
    let targetWidth = 0;
    this.horizontalLineEach({
      rectRange,
      interruptCkCb: (i, j) => {
        const isMergeCell = cells.checkedMergeCell(i, j);
        const isDisplayBottomBorder = cells.isDisplayBottomBorder(i, j);
        const isDisplayTopBorder = cells.isDisplayTopBorder(i + 1, j);
        const priorityComparison = cells.borderComparisonOfTime(i, j, i + 1, j);
        if (isMergeCell) {
          return true;
        }
        if (isDisplayBottomBorder && isDisplayTopBorder) {
          if (priorityComparison === 1 || priorityComparison === 0) {
            return false;
          }
        }
        return !isDisplayBottomBorder;
      },
      startRowCb: (y, height) => {
        targetY = y + height;
        targetX = 0;
        targetWidth = 0;
      },
      handleCb: (width) => {
        targetWidth += width;
      },
      interruptHandleCb: (x, width, continuous) => {
        if (!continuous) {
          horizontalLines.push({
            sy: targetY,
            sx: targetX,
            ey: targetY,
            ex: targetWidth,
          });
        }
        targetX = x + width;
      },
      endRowCb: (continuous) => {
        if (!continuous) {
          horizontalLines.push({
            sy: targetY,
            sx: targetX,
            ey: targetY,
            ex: targetWidth,
          });
        }
      },
    });
    return horizontalLines;
  }
}

export { BorderLineHandle };
