import { BaseCellsHelper } from './BaseCellsHelper';
import { Rect } from '../../../canvas/Rect';
import { Utils } from '../../../utils/Utils';

class TextCellsHelper extends BaseCellsHelper {

  /**
   * 遍历指定区域中的单元格
   * @param reverseRows
   * @param reverseCols
   * @param rectRange
   * @param callback
   * @param startX
   * @param startY
   */
  getCellByViewRange({
    reverseRows = false,
    reverseCols = false,
    rectRange,
    callback,
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
        for (let j = eci; sci <= j; j -= 1) {
          const width = cols.getWidth(j);
          const cell = cells.getCell(i, j);
          if (cell) {
            const rect = new Rect({
              x, y, width, height,
            });
            const overFlow = this.getCellOverFlow(i, j, rect, cell);
            const result = callback(i, j, cell, rect, overFlow);
            if (result === false) {
              return;
            }
          }
          x -= width;
        }
        y -= height;
      }
    } else if (reverseRows) {
      let y = startY;
      for (let i = eri; sri <= i; i -= 1) {
        const height = rows.getHeight(i);
        let x = startX;
        for (let j = sci; j <= eci; j += 1) {
          const width = cols.getWidth(j);
          const cell = cells.getCell(i, j);
          if (cell) {
            const rect = new Rect({
              x, y, width, height,
            });
            const overFlow = this.getCellOverFlow(i, j, rect, cell);
            const result = callback(i, j, cell, rect, overFlow);
            if (result === false) {
              return;
            }
          }
          x += width;
        }
        y -= height;
      }
    } else if (reverseCols) {
      let y = startY;
      for (let i = sri; i <= eri; i += 1) {
        const height = rows.getHeight(i);
        let x = startX;
        for (let j = eci; sci <= j; j -= 1) {
          const width = cols.getWidth(j);
          const cell = cells.getCell(i, j);
          if (cell) {
            const rect = new Rect({
              x, y, width, height,
            });
            const overFlow = this.getCellOverFlow(i, j, rect, cell);
            const result = callback(i, j, cell, rect, overFlow);
            if (result === false) {
              return;
            }
          }
          x -= width;
        }
        y += height;
      }
    } else {
      let y = startY;
      for (let i = sri; i <= eri; i += 1) {
        const height = rows.getHeight(i);
        let x = startX;
        for (let j = sci; j <= eci; j += 1) {
          const width = cols.getWidth(j);
          const cell = cells.getCell(i, j);
          if (cell) {
            const rect = new Rect({
              x, y, width, height,
            });
            const overFlow = this.getCellOverFlow(i, j, rect, cell);
            const result = callback(i, j, cell, rect, overFlow);
            if (result === false) {
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
   * @param callback
   * @param startX
   * @param startY
   */
  getCellSkipMergeCellByViewRange({
    reverseRows = false,
    reverseCols = false,
    rectRange,
    callback,
    startX = 0,
    startY = 0,
  }) {
    const { merges } = this;
    this.getCellByViewRange({
      reverseRows,
      reverseCols,
      rectRange,
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
  TextCellsHelper,
};
