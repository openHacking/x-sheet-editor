import { RectRange } from '../tablebase/RectRange';
import { Rect } from '../../../canvas/Rect';
import { LeftOutRangeFilter } from './filter/outrange/LeftOutRangeFilter';
import { RightOutRangeFilter } from './filter/outrange/RightOutRangeFilter';
import { LineFilter } from './filter/LineFilter';
import { PlainUtils } from '../../../utils/PlainUtils';
import { ColsIterator } from '../iterator/ColsIterator';
import { RowsIterator } from '../iterator/RowsIterator';

class BaseLine {

  constructor({
    merges,
    rows,
    cols,
    cells,
  }) {
    this.merges = merges;
    this.cells = cells;
    this.rows = rows;
    this.cols = cols;
    this.rightOutRangeFilter = new RightOutRangeFilter({ cells, cols, merges });
    this.leftOutRangeFilter = new LeftOutRangeFilter({ cells, cols, merges });
  }

  getMergeCoincideRange({
    viewRange = new RectRange(0, 0, 0, 0),
  }) {
    const { merges, cols, rows } = this;
    const filter = [];
    const result = [];
    this.horizontalIterate({
      viewRange,
      filter: new LineFilter((row, col) => {
        const merge = merges.getFirstIncludes(row, col);
        return PlainUtils.isNotUnDef(merge)
          && filter.indexOf(merge) === -1;
      }),
      handle: (row, col, x, y) => {
        const merge = merges.getFirstIncludes(row, col);
        filter.push(merge);
        const view = viewRange.coincide(merge);
        const width = cols.sectionSumWidth(view.sci, view.eci);
        const height = rows.sectionSumHeight(view.sri, view.eri);
        const rect = new Rect({ x, y, width, height });
        result.push({ rect, view, merge });
      },
    });
    return result;
  }

  getCoincideRangeBrink({
    coincide = new RectRange(0, 0, 0, 0),
  }) {
    const { cols, rows } = this;
    const result = [];
    for (let i = 0; i < coincide.length; i += 1) {
      const { view, rect, merge } = coincide[i];
      const brink = view.brink();
      const top = {
        view: brink.top,
        x: rect.x,
        y: rect.y,
      };
      const left = {
        view: brink.left,
        x: rect.x,
        y: rect.y,
      };
      const bottom = {
        view: brink.bottom,
        x: rect.x,
        y: rect.y + rect.height - rows.rectRangeSumHeight(brink.bottom),
      };
      const right = {
        view: brink.right,
        x: rect.x + rect.width - cols.rectRangeSumWidth(brink.right),
        y: rect.y,
      };
      const item = {};
      if (merge.sri === view.sri) {
        item.top = top;
      }
      if (merge.sci === view.sci) {
        item.left = left;
      }
      if (merge.eri === view.eri) {
        item.bottom = bottom;
      }
      if (merge.eci === view.eci) {
        item.right = right;
      }
      result.push(item);
    }
    return result;
  }

  horizontalIterate({
    viewRange = new RectRange(0, 0, 0, 0),
    newRow = () => true,
    filter = new LineFilter(() => true),
    jump = () => true,
    handle = () => true,
    endRow = () => true,
    bx = 0,
    by = 0,
  }) {
    const { cols, rows } = this;
    const {
      sri, eri, sci, eci,
    } = viewRange;
    let y = by;
    RowsIterator.getInstance()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        const height = rows.getHeight(i);
        let x = bx;
        newRow(i, y);
        ColsIterator.getInstance()
          .setBegin(sci)
          .setEnd(eci)
          .setLoop((j) => {
            const result = filter.execute(i, j, x, y);
            const width = cols.getWidth(j);
            if (result) {
              handle(i, j, x, y);
            } else {
              jump(i, j, x, y);
            }
            x += width;
          })
          .execute();
        endRow();
        y += height;
      })
      .execute();
  }

  verticalIterate({
    viewRange = new RectRange(0, 0, 0, 0),
    newCol = () => true,
    filter = new LineFilter(() => true),
    jump = () => true,
    handle = () => true,
    endCol = () => true,
    bx = 0,
    by = 0,
  }) {
    const { cols, rows } = this;
    const {
      sri, eri, sci, eci,
    } = viewRange;
    let x = bx;
    ColsIterator.getInstance()
      .setBegin(sci)
      .setEnd(eci)
      .setLoop((i) => {
        const width = cols.getWidth(i);
        let y = by;
        newCol(i, x);
        RowsIterator.getInstance()
          .setBegin(sri)
          .setEnd(eri)
          .setLoop((j) => {
            const height = rows.getHeight(j);
            const result = filter.execute(i, j, x, y);
            if (result) {
              handle(i, j, x, y);
            } else {
              jump(i, j, x, y);
            }
            y += height;
          })
          .execute();
        endCol();
        x += width;
      })
      .execute();
  }

}

export { BaseLine };
