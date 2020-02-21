
class GridLineHandle {
  constructor(table) {
    this.table = table;
  }

  horizontalLineEach(rectRange, interruptCkCb, startRowCb, handleCb, interruptHandleCb, endRowCb) {
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

  verticalLineEach(rectRange, interruptCkCb, startColCb, handleCb, interruptHandleCb, endColCb) {
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

  getHorizontalLineByRectRange(rectRange) {
    const lineArray = [];
    const { table } = this;
    const { cells, merges } = table;
    let targetX = 0;
    let targetY = 0;
    let targetWidth = 0;
    this.horizontalLineEach(rectRange, (i, j) => {
      const cell = cells.getCell(i, j);
      const merge = merges.getFirstIncludes(i, j);
      return cell && merge;
    }, (y, height) => {
      targetY = y + height;
      targetX = 0;
      targetWidth = 0;
    }, (width) => {
      targetWidth += width;
    }, (x, width, continuous) => {
      if (!continuous) {
        lineArray.push({
          y: targetY,
          x: targetX,
          width: targetWidth,
        });
      }
      targetX = x + width;
    }, (continuous) => {
      if (!continuous) {
        lineArray.push({
          y: targetY,
          x: targetX,
          width: targetWidth,
        });
      }
    });
    return lineArray;
  }

  getVerticalLineByRectRange(rectRange) {
    const lineArray = [];
    const { table } = this;
    const { cells, merges } = table;
    let targetX = 0;
    let targetY = 0;
    let targetHeight = 0;
    this.verticalLineEach(rectRange, (i, j) => {
      const cell = cells.getCell(j, i);
      const merge = merges.getFirstIncludes(j, i);
      return cell && merge;
    }, (x, width) => {
      targetX = x + width;
      targetY = 0;
      targetHeight = 0;
    }, (height) => {
      targetHeight += height;
    }, (y, height, continuous) => {
      if (!continuous) {
        lineArray.push({
          x: targetX,
          y: targetY,
          height: targetHeight,
        });
      }
      targetY = y + height;
    }, (continuous) => {
      if (!continuous) {
        lineArray.push({
          x: targetX,
          y: targetY,
          height: targetHeight,
        });
      }
    });
    return lineArray;
  }

  getMergeHorizontalLineByRectRange(rectRange) {
    const lineArray = [];
    const filter = [];
    const { table } = this;
    const {
      merges, cols, rows,
    } = table;
    let merge = null;
    let targetY = 0;
    this.horizontalLineEach(rectRange, (i, j) => {
      merge = merges.getFirstIncludes(i, j);
      if (merge && filter.indexOf(merge) === -1) {
        filter.push(merge);
        return true;
      }
      return false;
    }, (y) => {
      targetY = y;
    }, () => {}, (x) => {
      const rect = rectRange.coincide(merge);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      lineArray.push({
        x,
        y: targetY + height,
        width: x + width,
      });
    }, () => {});
    return lineArray;
  }

  getMergeVerticalLineByRectRange(rectRange) {
    const lineArray = [];
    const filter = [];
    const { table } = this;
    const {
      merges, cols, rows,
    } = table;
    let merge = null;
    let targetX = 0;
    this.verticalLineEach(rectRange, (i, j) => {
      merge = merges.getFirstIncludes(j, i);
      if (merge && filter.indexOf(merge) === -1) {
        filter.push(merge);
        return true;
      }
      return false;
    }, (x) => {
      targetX = x;
    }, () => {}, (y) => {
      const rect = rectRange.coincide(merge);
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      lineArray.push({
        x: targetX + width,
        y,
        height: y + height,
      });
    }, () => {});
    return lineArray;
  }
}

export { GridLineHandle };
