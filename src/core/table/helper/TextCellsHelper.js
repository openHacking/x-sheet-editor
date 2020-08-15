import { BaseCellsHelper } from './BaseCellsHelper';
import { Rect } from '../../../canvas/Rect';
import { Utils } from '../../../utils/Utils';
import { RectRange } from '../tablebase/RectRange';

const BREAK_LOOP = {
  CONTINUE: 3,
  ROW: 1,
  RETURN: 2,
};

class TextCellsHelper extends BaseCellsHelper {

  /**
   * 遍历指定区域中的单元格
   * @param reverseRows
   * @param reverseCols
   * @param rectRange
   * @param newRow
   * @param newCol
   * @param callback
   * @param startX
   * @param startY
   */
  getCellByViewRange({
    reverseRows = false,
    reverseCols = false,
    rectRange = new RectRange(0, 0, 0, 0, 0, 0),
    newRow = () => {},
    newCol = () => {},
    callback = () => {},
    startX = 0,
    startY = 0,
  }) {
    const {
      rows, cols, cells,
    } = this;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    if (reverseRows && reverseCols) {
      let y = startY;
      for (let i = eri; sri <= i; i -= 1) {
        const height = rows.getHeight(i);
        let x = startX;
        newRow(i);
        y -= height;
        for (let j = eci; sci <= j; j -= 1) {
          const width = cols.getWidth(j);
          const cell = cells.getCell(i, j);
          newCol(j);
          x -= width;
          if (cell) {
            const rect = new Rect({
              x, y, width, height,
            });
            const overFlow = this.getCellOverFlow(i, j, rect, cell);
            const result = callback(i, j, cell, rect, overFlow);
            if (result === BREAK_LOOP.ROW) {
              break;
            }
            if (result === BREAK_LOOP.RETURN) {
              return;
            }
          }
        }
      }
    } else if (reverseRows) {
      let y = startY;
      for (let i = eri; sri <= i; i -= 1) {
        const height = rows.getHeight(i);
        let x = startX;
        newRow(i);
        y -= height;
        for (let j = sci; j <= eci; j += 1) {
          const width = cols.getWidth(j);
          const cell = cells.getCell(i, j);
          newCol(j);
          if (cell) {
            const rect = new Rect({
              x, y, width, height,
            });
            const overFlow = this.getCellOverFlow(i, j, rect, cell);
            const result = callback(i, j, cell, rect, overFlow);
            if (result === BREAK_LOOP.ROW) {
              break;
            }
            if (result === BREAK_LOOP.RETURN) {
              return;
            }
          }
          x += width;
        }
      }
    } else if (reverseCols) {
      let y = startY;
      for (let i = sri; i <= eri; i += 1) {
        const height = rows.getHeight(i);
        let x = startX;
        newRow(i);
        for (let j = eci; sci <= j; j -= 1) {
          const width = cols.getWidth(j);
          const cell = cells.getCell(i, j);
          newCol(j);
          x -= width;
          if (cell) {
            const rect = new Rect({
              x, y, width, height,
            });
            const overFlow = this.getCellOverFlow(i, j, rect, cell);
            const result = callback(i, j, cell, rect, overFlow);
            if (result === BREAK_LOOP.ROW) {
              break;
            }
            if (result === BREAK_LOOP.RETURN) {
              return;
            }
          }
        }
        y += height;
      }
    } else {
      let y = startY;
      for (let i = sri; i <= eri; i += 1) {
        const height = rows.getHeight(i);
        let x = startX;
        newRow(i);
        for (let j = sci; j <= eci; j += 1) {
          const width = cols.getWidth(j);
          const cell = cells.getCell(i, j);
          newCol(j);
          if (cell) {
            const rect = new Rect({
              x, y, width, height,
            });
            const overFlow = this.getCellOverFlow(i, j, rect, cell);
            const result = callback(i, j, cell, rect, overFlow);
            if (result === BREAK_LOOP.ROW) {
              break;
            }
            if (result === BREAK_LOOP.RETURN) {
              return;
            }
          }
          x += width;
        }
        y += height;
      }
    }
  }

  /**
   * 遍历指定区域中的合并单元格
   * @param rectRange
   * @param callback
   * @param startX
   * @param startY
   */
  getMergeCellByViewRange({
    rectRange,
    callback,
    startX = 0,
    startY = 0,
  }) {
    const {
      rows, cols, cells, merges,
    } = this;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    const filter = [];
    for (let i = sri; i <= eri; i += 1) {
      for (let j = sci; j <= eci; j += 1) {
        const merge = merges.getFirstIncludes(i, j);
        if (Utils.isUnDef(merge) || filter.find(item => item === merge)) {
          continue;
        }
        // 计算坐标
        const minSri = Math.min(rectRange.sri, merge.sri);
        const minSci = Math.min(rectRange.sci, merge.sci);
        let maxSri = Math.max(rectRange.sri, merge.sri);
        let maxSci = Math.max(rectRange.sci, merge.sci);
        maxSri -= 1;
        maxSci -= 1;
        let x = cols.sectionSumWidth(minSci, maxSci);
        let y = rows.sectionSumHeight(minSri, maxSri);
        x = rectRange.sci > merge.sci ? x * -1 : x;
        y = rectRange.sri > merge.sri ? y * -1 : y;
        x += startX;
        y += startY;
        // 计算尺寸
        const height = rows.sectionSumHeight(merge.sri, merge.eri);
        const width = cols.sectionSumWidth(merge.sci, merge.eci);
        const cell = cells.getCellOrNew(merge.sri, merge.sci);
        const rect = new Rect({ x, y, width, height });
        callback(rect, cell, merge);
        filter.push(merge);
      }
    }
  }

  /**
   * 遍历指定区域中的非合并单元格
   * 的普通单元格
   * @param reverseRows
   * @param reverseCols
   * @param rectRange
   * @param newRow
   * @param newCol
   * @param callback
   * @param startX
   * @param startY
   */
  getCellSkipMergeCellByViewRange({
    reverseRows,
    reverseCols,
    rectRange,
    newRow,
    newCol,
    callback,
    startX,
    startY,
  }) {
    const { merges } = this;
    this.getCellByViewRange({
      reverseRows,
      reverseCols,
      rectRange,
      newRow,
      newCol,
      callback: (ri, ci, cell, rect, overflow) => {
        const merge = merges.getFirstIncludes(ri, ci);
        if (merge === null) {
          callback(ri, ci, cell, rect, overflow);
        }
      },
      startX,
      startY,
    });
  }
}

export {
  TextCellsHelper, BREAK_LOOP,
};
