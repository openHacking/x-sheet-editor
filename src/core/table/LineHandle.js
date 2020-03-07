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
      handle: (row, col, x, y) => {
        const merge = merges.getFirstIncludes(row, col);
        if (merge && filter.indexOf(merge) === -1) {
          filter.push(merge);
          const view = viewRange.coincide(merge);
          const width = cols.sectionSumWidth(view.sci, view.eci);
          const height = rows.sectionSumHeight(view.sri, view.eri);
          const rect = new Rect({ x, y, width, height });
          result.push({ rect, view, merge });
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
      const { view, rect, merge } = coincideView[i];
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
}

export { LineHandle };
