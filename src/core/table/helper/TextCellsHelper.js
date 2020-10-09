import { BaseCellsHelper } from './BaseCellsHelper';
import { Rect } from '../../../canvas/Rect';
import { PlainUtils } from '../../../utils/PlainUtils';
import { RectRange } from '../tablebase/RectRange';
import { ColsIterator } from '../iterator/ColsIterator';
import { RowsIterator } from '../iterator/RowsIterator';

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
      RowsIterator.getInstance()
        .setBegin(eri)
        .setEnd(sri)
        .setLoop((i) => {
          const height = rows.getHeight(i);
          let result = null;
          let x = startX;
          newRow(i);
          y -= height;
          ColsIterator.getInstance()
            .setBegin(eci)
            .setEnd(sci)
            .setLoop((j) => {
              const width = cols.getWidth(j);
              const cell = cells.getCell(i, j);
              newCol(j);
              x -= width;
              if (cell) {
                const rect = new Rect({
                  x, y, width, height,
                });
                const overFlow = this.getCellOverFlow(i, j, rect, cell);
                result = callback(i, j, cell, rect, overFlow);
                if (result === BREAK_LOOP.ROW) {
                  return false;
                }
              }
              return true;
            })
            .execute();
          return result !== BREAK_LOOP.RETURN;
        })
        .execute();
    } else if (reverseRows) {
      let y = startY;
      RowsIterator.getInstance()
        .setBegin(eri)
        .setEnd(sri)
        .setLoop((i) => {
          const height = rows.getHeight(i);
          let result = null;
          let x = startX;
          newRow(i);
          y -= height;
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((j) => {
              const width = cols.getWidth(j);
              const cell = cells.getCell(i, j);
              newCol(j);
              if (cell) {
                const rect = new Rect({
                  x, y, width, height,
                });
                const overFlow = this.getCellOverFlow(i, j, rect, cell);
                result = callback(i, j, cell, rect, overFlow);
                if (result === BREAK_LOOP.ROW) {
                  return false;
                }
              }
              x += width;
              return true;
            })
            .execute();
          return result !== BREAK_LOOP.RETURN;
        })
        .execute();
    } else if (reverseCols) {
      let y = startY;
      RowsIterator.getInstance()
        .setBegin(sri)
        .setEnd(eri)
        .setLoop((i) => {
          const height = rows.getHeight(i);
          let result = null;
          let x = startX;
          newRow(i);
          ColsIterator.getInstance()
            .setBegin(eci)
            .setEnd(sci)
            .setLoop((j) => {
              const width = cols.getWidth(j);
              const cell = cells.getCell(i, j);
              newCol(j);
              x -= width;
              if (cell) {
                const rect = new Rect({
                  x, y, width, height,
                });
                const overFlow = this.getCellOverFlow(i, j, rect, cell);
                result = callback(i, j, cell, rect, overFlow);
                if (result === BREAK_LOOP.ROW) {
                  return false;
                }
              }
              return true;
            })
            .execute();
          y += height;
          return result !== BREAK_LOOP.RETURN;
        })
        .execute();
    } else {
      let y = startY;
      RowsIterator.getInstance()
        .setBegin(sri)
        .setEnd(eri)
        .setLoop((i) => {
          const height = rows.getHeight(i);
          let result = null;
          let x = startX;
          newRow(i);
          ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(eci)
            .setLoop((j) => {
              const width = cols.getWidth(j);
              const cell = cells.getCell(i, j);
              newCol(j);
              if (cell) {
                const rect = new Rect({
                  x, y, width, height,
                });
                const overFlow = this.getCellOverFlow(i, j, rect, cell);
                result = callback(i, j, cell, rect, overFlow);
                if (result === BREAK_LOOP.ROW) {
                  return false;
                }
              }
              x += width;
              return true;
            })
            .execute();
          y += height;
          return result !== BREAK_LOOP.RETURN;
        })
        .execute();
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
    RowsIterator.getInstance()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        ColsIterator.getInstance()
          .setBegin(sci)
          .setEnd(eci)
          .setLoop((j) => {
            const merge = merges.getFirstIncludes(i, j);
            if (PlainUtils.isUnDef(merge) || filter.find(item => item === merge)) {
              return;
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
          })
          .execute();
      })
      .execute();
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
