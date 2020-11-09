import { XLineIteratorItem } from '../XLineIteratorItem';
import { XLineIteratorLoop } from '../XLineIteratorLoop';
import { XLineIteratorFilter } from '../XLineIteratorFilter';

class LineGrid {

  constructor({
    view, bx, by, getWidth, getHeight,
  }) {
    this.view = view;
    this.bx = bx;
    this.by = by;
    this.getWidth = getWidth;
    this.getHeight = getHeight;
  }

  run() {
    const { view, bx, by, getWidth, getHeight } = this;
    // 下线段
    const bRow = {};
    const bLine = [];
    const b = new XLineIteratorItem({
      newRow: (row, y) => {
        const height = getHeight(row);
        bRow.sx = bx;
        bRow.sy = by + y + height;
        bRow.ex = bRow.sx;
        bRow.ey = bRow.sy;
        bRow.breakpoint = false;
      },
      endRow: () => {
        if (bRow.breakpoint) {
          const { sx, sy, ex, ey } = bRow;
          bLine.push({ sx, sy, ex, ey });
        }
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [],
      }),
      handle: (row, col) => {
        const width = getWidth(col);
        bRow.breakpoint = true;
        bRow.ex += width;
      },
      jump: (row, col) => {
        if (bRow.breakpoint) {
          const { sx, sy, ex, ey } = bRow;
          bRow.breakpoint = false;
          bLine.push({ sx, sy, ex, ey });
        }
        const width = getWidth(col);
        bRow.sx = bRow.ex + width;
        bRow.ex = bRow.sx;
      },
    });
    // 右线段
    const rCols = [];
    const rLine = [];
    const r = new XLineIteratorItem({
      newCol: (col, x) => {
        const width = getWidth(col);
        const sx = bx + x + width;
        const sy = by;
        const ex = sx;
        const ey = sy;
        const breakpoint = false;
        rCols[col] = { sx, sy, ex, ey, breakpoint };
      },
      endCol: (col) => {
        const item = rCols[col];
        if (item.breakpoint) {
          const { sx, sy, ex, ey } = item;
          rLine.push({ sx, sy, ex, ey });
        }
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [],
      }),
      handle: (row, col) => {
        const item = rCols[col];
        const height = getHeight(row);
        item.breakpoint = true;
        item.ey += height;
      },
      jump: (row, col) => {
        const item = rCols[col];
        const height = getHeight(row);
        if (item.breakpoint) {
          const { sx, sy, ex, ey } = item;
          item.breakpoint = false;
          rLine.push({ sx, sy, ex, ey });
        }
        item.sy = item.ey + height;
        item.ey = item.sy;
      },
    });
    // 运算
    const loop = new XLineIteratorLoop({ r, b, view });
    loop.run();
    // 返回处理结果
    return {
      rLine, bLine,
    };
  }

}

export {
  LineGrid,
};
