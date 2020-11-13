import { BaseCellsHelper } from './BaseCellsHelper';
import { Rect } from '../../../canvas/Rect';
import { PlainUtils } from '../../../utils/PlainUtils';
import { RowsIterator } from '../iterator/RowsIterator';
import { ColsIterator } from '../iterator/ColsIterator';

const STYLE_BREAK_LOOP = {
  CONTINUE: 3,
  ROW: 1,
  RETURN: 2,
};

class StyleCellsHelper extends BaseCellsHelper {

  constructor({
    merges,
    cells,
    rows,
    cols,
    tableDataSnapshot,
    xTableAreaView,
  }) {
    super({
      cells,
      merges,
      rows,
      cols,
      tableDataSnapshot,
      xTableAreaView,
    });
    this.filterMerges = [];
  }

  getCellByViewRange({
    startX = 0,
    startY = 0,
    view,
    cellsINCallback = () => {},
    mergeCallback = () => {},
  }) {
    const { rows, cols, cells, merges } = this;
    const { sri, eri, sci, eci } = view;
    const filter = [];
    let y = startY;
    RowsIterator.getInstance()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((row) => {
        const height = rows.getHeight(row);
        let result = null;
        let x = startX;
        ColsIterator.getInstance()
          .setBegin(sci)
          .setEnd(eci)
          .setLoop((col) => {
            const merge = merges.getFirstIncludes(row, col);
            const width = cols.getWidth(col);
            if (merge) {
              const find = filter.find(i => i === merge);
              if (PlainUtils.isUnDef(find)) {
                filter.push(merge);
                const mergeInfo = this.mergeInfo({
                  view, merge,
                });
                const { rect, cell } = mergeInfo;
                result = mergeCallback(row, col, cell, rect, merge);
              }
            } else {
              const cell = cells.getCell(row, col);
              if (cell) {
                const cellsINInfo = this.cellsINInfo({
                  x, y, width, height,
                });
                const { rect } = cellsINInfo;
                result = cellsINCallback(row, col, cell, rect);
              }
            }
            x += width;
            switch (result) {
              case STYLE_BREAK_LOOP.RETURN:
              case STYLE_BREAK_LOOP.ROW:
                return false;
              default: return true;
            }
          })
          .execute();
        y += height;
        switch (result) {
          case STYLE_BREAK_LOOP.RETURN:
            return false;
          default: return true;
        }
      })
      .execute();
  }

  mergeInfo({
    view, merge,
  }) {
    const { rows, cols, cells } = this;
    // 计算坐标
    const minSri = Math.min(view.sri, merge.sri);
    const minSci = Math.min(view.sci, merge.sci);
    let maxSri = Math.max(view.sri, merge.sri);
    let maxSci = Math.max(view.sci, merge.sci);
    maxSri -= 1;
    maxSci -= 1;
    let x = cols.sectionSumWidth(minSci, maxSci);
    let y = rows.sectionSumHeight(minSri, maxSri);
    x = view.sci > merge.sci ? x * -1 : x;
    y = view.sri > merge.sri ? y * -1 : y;
    // 计算尺寸
    const height = rows.sectionSumHeight(merge.sri, merge.eri);
    const width = cols.sectionSumWidth(merge.sci, merge.eci);
    const cell = cells.getCellOrNew(merge.sri, merge.sci);
    const rect = new Rect({ x, y, width, height });
    return { rect, cell };
  }

  cellsINInfo({
    height, width, x, y,
  }) {
    const rect = new Rect({ x, y, width, height });
    return { rect };
  }

}

export {
  StyleCellsHelper, STYLE_BREAK_LOOP,
};
