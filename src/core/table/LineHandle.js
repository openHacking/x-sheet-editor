import { RectRange } from './RectRange';
import { Rect } from '../../canvas/Rect';

class LineHandle {

  constructor(table) {
    this.table = table;
  }

  hEach({
    viewRange = new RectRange(0, 0, 0, 0),
    newRow = () => true,
    filter = () => true,
    jump = () => true,
    handle = () => true,
    endRow = () => true,
    bx = 0,
    by = 0,
  }) {
    const { table } = this;
    const { cols, rows } = table;
    const {
      sri, eri, sci, eci,
    } = viewRange;
    let y = by;
    for (let i = sri; i <= eri; i += 1) {
      const height = rows.getHeight(i);
      let x = bx;
      newRow(i, y);
      for (let j = sci; j <= eci; j += 1) {
        const width = cols.getWidth(j);
        const result = filter(i, j, x, y);
        if (result) {
          handle(i, j, x, y);
        } else {
          jump(i, j, x, y);
        }
        x += width;
      }
      endRow();
      y += height;
    }
  }

  vEach({
    viewRange = new RectRange(0, 0, 0, 0),
    newCol = () => true,
    filter = () => true,
    jump = () => true,
    handle = () => true,
    endCol = () => true,
    bx = 0,
    by = 0,
  }) {
    const { table } = this;
    const { cols, rows } = table;
    const {
      sri, eri, sci, eci,
    } = viewRange;
    let x = bx;
    for (let i = sci; i <= eci; i += 1) {
      const width = cols.getWidth(i);
      let y = by;
      newCol(i, x);
      for (let j = sri; j <= eri; j += 1) {
        const height = rows.getHeight(j);
        const result = filter(i, j, x, y);
        if (result) {
          handle(i, j, x, y);
        } else {
          jump(i, j, x, y);
        }
        y += height;
      }
      endCol();
      x += width;
    }
  }

  viewRangeAndMergeCoincideView({
    viewRange = new RectRange(0, 0, 0, 0),
  }) {
    const { table } = this;
    const { merges, cols, rows } = table;
    const filter = [];
    const result = [];
    this.hEach({
      viewRange,
      handle: (row, col) => {
        const view = merges.getFirstIncludes(row, col);
        if (view && filter.indexOf(view) === -1) {
          filter.push(view);
          const minSri = Math.min(viewRange.sri, view.sri);
          let maxSri = Math.max(viewRange.sri, view.sri);
          const minSci = Math.min(viewRange.sci, view.sci);
          let maxSci = Math.max(viewRange.sci, view.sci);
          maxSri -= 1;
          maxSci -= 1;
          let x = cols.sectionSumWidth(minSci, maxSci);
          let y = rows.sectionSumHeight(minSri, maxSri);
          x = viewRange.sci > view.sci ? x * -1 : x;
          y = viewRange.sri > view.sri ? y * -1 : y;
          const width = cols.sectionSumWidth(view.sci, view.eci);
          const height = rows.sectionSumHeight(view.sri, view.eri);
          const rect = new Rect({
            x,
            y,
            width,
            height,
          });
          result.push({ rect, view });
        }
      },
    });
    return result;
  }

  coincideViewBrink({
    coincideView,
  }) {
    const { table } = this;
    const { cols, rows } = table;
    const result = [];
    for (let i = 0; i < coincideView.length; i += 1) {
      const { view, rect } = coincideView[i];
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
      result.push({ top, left, bottom, right });
    }
    return result;
  }
}

export { LineHandle };
