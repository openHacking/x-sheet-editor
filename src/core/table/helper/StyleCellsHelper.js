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
    const { rows, cols, cells } = this;
    const { sri, eri, sci, eci } = view;
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
            const width = cols.getWidth(col);
            const cell = cells.getCell(row, col);
            if (cell) {
              const mergeInfo = this.mergeInfo({
                view, row, col,
              });
              const cellsINInfo = this.cellsINInfo({
                x, y, width, height,
              });
              if (mergeInfo) {
                const { rect, cell, merge } = mergeInfo;
                result = mergeCallback(row, col, cell, rect, merge);
              } else {
                const { rect } = cellsINInfo;
                result = cellsINCallback(row, col, cell, rect);
              }
              switch (result) {
                case STYLE_BREAK_LOOP.RETURN:
                case STYLE_BREAK_LOOP.ROW:
                  return false;
              }
            }
            x += width;
            return true;
          })
          .execute();
        y += height;
        return result !== STYLE_BREAK_LOOP.RETURN;
      })
      .execute();
  }

  mergeInfo({
    view,
    row,
    col,
  }) {
    const { rows, cols, merges, cells, filterMerges } = this;
    const merge = merges.getFirstIncludes(row, col);
    // 筛选掉不存在合并单元格
    if (PlainUtils.isUnDef(merge)) {
      return null;
    }
    // 筛选掉已处理合并单元格
    const find = filterMerges.find(item => item === merge);
    if (find) {
      return null;
    }
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
    return { rect, cell, merge };
  }

  cellsINInfo({
    height,
    width,
    x,
    y,
  }) {
    const rect = new Rect({ x, y, width, height });
    return { rect };
  }

}

export {
  StyleCellsHelper, STYLE_BREAK_LOOP,
};
