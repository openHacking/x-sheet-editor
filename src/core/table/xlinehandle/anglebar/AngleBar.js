import { XLineIteratorItem } from '../XLineIteratorItem';
import { XLineIteratorFilter } from '../XLineIteratorFilter';
import { BBorderShow } from '../linefilters/borderdisplay/BBorderShow';
import { BBorderPriority } from '../linefilters/borderpriority/BBorderPriority';
import { MergeBNullEdge } from '../linefilters/mergenulledge/MergeBNullEdge';
import { TBorderShow } from '../linefilters/borderdisplay/TBorderShow';
import { TBorderPriority } from '../linefilters/borderpriority/TBorderPriority';
import { MergeTNullEdge } from '../linefilters/mergenulledge/MergeTNullEdge';
import { RBorderShow } from '../linefilters/borderdisplay/RBorderShow';
import { RBorderPriority } from '../linefilters/borderpriority/RBorderPriority';
import { MergeRNullEdge } from '../linefilters/mergenulledge/MergeRNullEdge';
import { LBorderShow } from '../linefilters/borderdisplay/LBorderShow';
import { LBorderPriority } from '../linefilters/borderpriority/LBorderPriority';
import { MergeLNullEdge } from '../linefilters/mergenulledge/MergeLNullEdge';
import { AngleBarShow } from '../linefilters/anglebardisplay/AngleBarShow';
import { AngleBarInRow } from '../linefilters/anglebarinrow/AngleBarInRow';

class AngleBar {

  constructor({
    rows, cols, cells, merges, bx = 0, by = 0,
  }) {
    this.cells = cells;
    this.rows = rows;
    this.cols = cols;
    this.merges = merges;
    this.bx = bx;
    this.by = by;
    this.lLine = [];
    this.tLine = [];
    this.rLine = [];
    this.bLine = [];
  }

  offsetX({
    sx, ex, row, col,
  }) {
    const { cells } = this;
    const cell = cells.getCell(row, col);
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    if (angle > 0) {
      sx += cell.leftSdistWidth;
      ex += cell.leftSdistWidth;
    } else {
      sx -= cell.rightSdistWidth;
      ex -= cell.rightSdistWidth;
    }
    return {
      osx: sx,
      oex: ex,
    };
  }

  getBItem() {
    const { cols, rows, cells, bx, by, merges } = this;
    const bLine = [];
    const bRow = {};
    return new XLineIteratorItem({
      newRow: ({ row, y }) => {
        const height = rows.getHeight(row);
        bRow.sx = bx;
        bRow.sy = by + y + height;
        bRow.ex = bRow.sx;
        bRow.ey = bRow.sy;
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [
          new AngleBarInRow({ rows }),
          new BBorderShow({ cells }),
          new AngleBarShow({ cells }),
          new BBorderPriority({ cells }),
          new MergeBNullEdge({ merges }),
        ],
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
      complete: () => {
        this.bLine = bLine;
      },
    });
  }

  getTItem() {
    const { cols, rows, cells, bx, by, merges } = this;
    const tLine = [];
    const tRow = {};
    return new XLineIteratorItem({
      newRow: ({ y }) => {
        tRow.sx = bx;
        tRow.sy = by + y;
        tRow.ex = tRow.sx;
        tRow.ey = tRow.sy;
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [
          new AngleBarInRow({ rows }),
          new TBorderShow({ cells }),
          new AngleBarShow({ cells }),
          new TBorderPriority({ cells }),
          new MergeTNullEdge({ merges }),
        ],
      }),
      exec: ({ row, col }) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        tRow.ex += width;
        const { sx, sy, ex, ey } = tRow;
        const { osx, oex } = this.offsetX({
          row, col, sx, ex,
        });
        tLine.push({ sx: osx, sy, ex: oex, ey, row, col, borderAttr });
        tRow.sx = tRow.ex;
      },
      jump: ({ col }) => {
        const width = cols.getWidth(col);
        tRow.sx = tRow.ex + width;
        tRow.ex = tRow.sx;
      },
      complete: () => {
        this.tLine = tLine;
      },
    });
  }

  getRItem() {
    const { cols, rows, cells, bx, by, merges } = this;
    const rCols = [];
    return new XLineIteratorItem({
      newCol: ({ col, x }) => {
        const width = cols.getWidth(col);
        const sx = bx + x + width;
        const sy = by;
        const ex = sx;
        const ey = sy;
        const rLine = [];
        rCols[col] = { sx, sy, ex, ey, rLine };
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [
          new AngleBarInRow({ rows }),
          new RBorderShow({ cells }),
          new AngleBarShow({ cells }),
          new RBorderPriority({ cells }),
          new MergeRNullEdge({ merges }),
        ],
      }),
      exec: ({ row, col }) => {
        const height = rows.getHeight(row);
        const cell = cells.getCell(row, col);
        const item = rCols[col];
        const { borderAttr } = cell;
        item.ey += height;
        const { sx, sy, ex, ey, rLine } = item;
        const { osx } = this.offsetX({
          row, col, sx, ex,
        });
        rLine.push({ sx: osx, sy, ex, ey, row, col, borderAttr });
        item.sy = item.ey;
      },
      jump: ({ row, col }) => {
        const height = rows.getHeight(row);
        const item = rCols[col];
        item.sy = item.ey + height;
        item.ey = item.sy;
      },
      complete: () => {
        let rLine = [];
        for (let idx = 0; idx < rCols.length; idx++) {
          const item = rCols[idx];
          if (item) {
            rLine = rLine.concat(item.rLine);
          }
        }
        this.rLine = rLine;
      },
    });
  }

  getLItem() {
    const { rows, cols, cells, bx, by, merges } = this;
    const lCols = [];
    return new XLineIteratorItem({
      newCol: ({ col, x }) => {
        const sx = bx + x;
        const sy = by;
        const ex = sx;
        const ey = sy;
        const lLine = [];
        lCols[col] = { sx, sy, ex, ey, lLine };
      },
      filter: new XLineIteratorFilter({
        logic: XLineIteratorFilter.FILTER_LOGIC.AND,
        stack: [
          new AngleBarInRow({ rows }),
          new LBorderShow({ cells }),
          new AngleBarShow({ cells }),
          new LBorderPriority({ cells }),
          new MergeLNullEdge({ merges }),
        ],
      }),
      exec: ({ row, col }) => {
        const item = lCols[col];
        const cell = cells.getCell(row, col);
        const height = rows.getHeight(row);
        const { borderAttr } = cell;
        item.ey += height;
        const { sx, sy, ex, ey, lLine } = item;
        const { osx } = this.offsetX({
          row, col, sx, ex,
        });
        lLine.push({ sx: osx, sy, ex, ey, row, col, borderAttr });
        item.sy = item.ey;
      },
      jump: ({ row, col }) => {
        const height = rows.getHeight(row);
        const item = lCols[col];
        item.sy = item.ey + height;
        item.ey = item.sy;
      },
      complete: () => {
        let lLine = [];
        for (let idx = 0; idx < lCols.length; idx++) {
          const item = lCols[idx];
          if (item) {
            lLine = lLine.concat(item.lLine);
          }
        }
        this.lLine = lLine;
      },
    });
  }

  getItems() {
    return [
      this.getBItem(),
      this.getTItem(),
      this.getRItem(),
      this.getLItem(),
    ];
  }

  getResult() {
    const { rLine, bLine, lLine, tLine } = this;
    return {
      rLine, bLine, lLine, tLine,
    };
  }

}

export {
  AngleBar,
};
