import { XLineIteratorItem } from '../XLineIteratorItem';
import { XLineIteratorFilter } from '../XLineIteratorFilter';
import { XLineIteratorLoop } from '../XLineIteratorLoop';
import { PlainUtils } from '../../../../utils/PlainUtils';
import { Rect } from '../../../../canvas/Rect';

class LineBorder {

  constructor({
    view, rows, cols, cells, merges, bx, by,
  }) {
    this.cells = cells;
    this.view = view;
    this.rows = rows;
    this.cols = cols;
    this.bx = bx;
    this.by = by;
    this.merges = merges;
    this.mergesCellArray = [];
  }

  tOffsetX({
    sx, ex, row, col,
  }) {
    const { cells } = this;
    const last = cells.getCell(row, col - 1);
    const next = cells.getCell(row, col + 1);
    let osx = sx;
    let oex = ex;
    if (last) {
      if (last.borderAttr.top.display) {
        osx -= last.rightSdistWidth;
      }
    }
    if (next) {
      if (next.borderAttr.top.display) {
        oex += next.leftSdistWidth;
      }
    }
    return { osx, oex };
  }

  hasMergeCell({
    merge,
  }) {
    const { mergeArray } = this;
    return PlainUtils.isUnDef(merge) || mergeArray.find(i => i.merge === merge);
  }

  addMergeCell({
    row, col, x, y,
  }) {
    const { merges } = this;
    const merge = merges.getFirstIncludes(row, col);
    if (this.hasMergeCell({ merge })) {
      return;
    }
    const { view, cols, rows, mergeArray } = this;
    const coincide = view.coincide(merge);
    const width = cols.sectionSumWidth(coincide.sci, coincide.eci);
    const height = rows.sectionSumHeight(coincide.sri, coincide.eri);
    const rect = new Rect({ x, y, width, height });
    mergeArray.push({
      merge, rect, coincide,
    });
  }

  run() {
    const { view, cols, rows, cells, bx, by } = this;
    this.mergesCellArray = [];
    // 左线段
    const lCols = [];
    const lLine = [];
    const l = new XLineIteratorItem({
      newCol: ({ col, x }) => {
        const sx = bx + x;
        const sy = by;
        const ex = sx;
        const ey = sy;
        lCols[col] = { sx, sy, ex, ey };
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [],
      }),
      exec: ({ row, col }) => {
        const item = lCols[col];
        const cell = cells.getCell(row, col);
        const height = rows.getHeight(row);
        const { borderAttr } = cell;
        item.ey += height;
        const { sx, sy, ex, ey } = item;
        lLine.push({ sx, sy, ex, ey, row, col, borderAttr });
        item.sy = item.ey;
      },
      jump: ({ row, col }) => {
        const height = rows.getHeight(row);
        const item = lCols[col];
        item.sy = item.ey + height;
        item.ey = item.sy;
      },
    });
    // 下线段
    const bRow = {};
    const bLine = [];
    const b = new XLineIteratorItem({
      newRow: ({ row, y }) => {
        const height = rows.getHeight(row);
        bRow.sx = bx;
        bRow.sy = by + y + height;
        bRow.ex = bRow.sx;
        bRow.ey = bRow.sy;
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [],
      }),
      exec: ({ row, col }) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        bRow.ex += width;
        const { sx, sy, ex, ey } = bRow;
        bLine.push({ sx, sy, ex, ey, row, col, borderAttr });
        bRow.sx = bRow.ex;
      },
      jump: ({ col }) => {
        const width = cols.getWidth(col);
        bRow.sx = bRow.ex + width;
        bRow.ex = bRow.sx;
      },
    });
    // 右线段
    const rCols = [];
    const rLine = [];
    const r = new XLineIteratorItem({
      newCol: ({ col, x }) => {
        const width = cols.getWidth(col);
        const sx = bx + x + width;
        const sy = by;
        const ex = sx;
        const ey = sy;
        rCols[col] = { sx, sy, ex, ey };
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [],
      }),
      exec: ({ row, col }) => {
        const height = rows.getHeight(row);
        const cell = cells.getCell(row, col);
        const item = rCols[col];
        const { borderAttr } = cell;
        item.ey += height;
        const { sx, sy, ex, ey } = item;
        rLine.push({ sx, sy, ex, ey, row, col, borderAttr });
        item.sy = item.ey;
      },
      jump: ({ row, col }) => {
        const height = rows.getHeight(row);
        const item = rCols[col];
        item.sy = item.ey + height;
        item.ey = item.sy;
      },
    });
    // 上线段
    const tRow = {};
    const tLine = [];
    const t = new XLineIteratorItem({
      newRow: ({ y }) => {
        tRow.sx = bx;
        tRow.sy = by + y;
        tRow.ex = tRow.sx;
        tRow.ey = tRow.sy;
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [],
      }),
      exec: ({ row, col }) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        tRow.ex += width;
        const { sx, sy, ex, ey } = tRow;
        const { osx, oex } = this.tOffsetX({ sx, ex, row, col });
        tLine.push({ sx: osx, sy, ex: oex, ey, row, col, borderAttr });
        tRow.sx = tRow.ex;
      },
      jump: ({ col }) => {
        const width = cols.getWidth(col);
        tRow.sx = tRow.ex + width;
        tRow.ex = tRow.sx;
      },
    });
    // 运算
    const loop = new XLineIteratorLoop({
      r,
      b,
      t,
      l,
      view,
      callback: (row, col, x, y) => {
        this.addMergeCell({
          row, col, x, y,
        });
      },
    });
    loop.run();
    // 返回处理结果
    return {
      rLine, bLine, lLine, tLine,
    };
  }

}

export {
  LineBorder,
};
