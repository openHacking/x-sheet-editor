class BorderLineHandle {
  constructor({ draw }) {
    this.draw = draw;
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
      // eslint-disable-next-line max-len
      interruptCkCb: (i, j) => {
        const isMergeCell = cells.checkedMergeCell(i, j);
        const isDisplay = cells.isDisplayTopBorder(i, j);
        const isDraw = cells.borderComparisonOfTime(i, j, i + 1, j) === 1;
        return isMergeCell || (isDisplay && isDraw);
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
            y: targetY,
            x: targetX,
            width: targetWidth,
          });
        }
        targetX = x + width;
      },
      endRowCb: (continuous) => {
        if (!continuous) {
          horizontalLines.push({
            y: targetY,
            x: targetX,
            width: targetWidth,
          });
        }
      },
    });
    return horizontalLines;
  }

  getLeftLineByRectRange() {}

  getRightLineByRectRange() {}

  getBottomLineByRectRange() {}
}

export { BorderLineHandle };
