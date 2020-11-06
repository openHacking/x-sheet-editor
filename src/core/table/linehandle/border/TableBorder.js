import { BaseLine } from '../BaseLine';
import { HorizontalMergeFilter } from '../linefilter/mege/HorizontalMergeFilter';
import { VerticalMergeFilter } from '../linefilter/mege/VerticalMergeFilter';
import { BottomBorderDiffFilter } from '../linefilter/borderdiff/BottomBorderDiffFilter';
import { LeftBorderDiffFilter } from '../linefilter/borderdiff/LeftBorderDiffFilter';
import { RightBorderDiffFilter } from '../linefilter/borderdiff/RightBorderDiffFilter';
import { TopBorderDiffFilter } from '../linefilter/borderdiff/TopBorderDiffFilter';
import { RowsIterator } from '../../iterator/RowsIterator';
import { RightVerticalAngleBarIgnoreFilter } from '../linefilter/anglebarignore/RightVerticalAngleBarIgnoreFilter';
import { LeftVerticalAngleBarIgnoreFilter } from '../linefilter/anglebarignore/LeftVerticalAngleBarIgnoreFilter';
import { TopHorizontalAngleBarIgnoreFilter } from '../linefilter/anglebarignore/TopHorizontalAngleBarIgnoreFilter';
import { BottomHorizontalAngleBarIgnoreFilter } from '../linefilter/anglebarignore/BottomHorizontalAngleBarIgnoreFilter';

class TableBorder extends BaseLine {

  constructor({
    drawOptimization = false,
    merges,
    rows,
    cols,
    cells,
    foldOnOff = true,
  }) {
    super({
      merges,
      rows,
      cols,
      cells,
      foldOnOff,
    });
    this.drawOptimization = drawOptimization;
    // 合并单元格忽略
    this.horizontalMergeFilter = new HorizontalMergeFilter({ merges });
    this.verticalMergeFilter = new VerticalMergeFilter({ merges });
    // 边框优先级对比
    this.bottomBorderDiffFilter = new BottomBorderDiffFilter({ cells });
    this.leftBorderDiffFilter = new LeftBorderDiffFilter({ cells });
    this.rightBorderDiffFilter = new RightBorderDiffFilter({ cells });
    this.topBorderDiffFilter = new TopBorderDiffFilter({ cells });
    // AngleBar忽略
    this.rightVerticalAngleBarIgnoreFilter = new RightVerticalAngleBarIgnoreFilter({
      cells, cols, merges,
    });
    this.leftVerticalAngleBarIgnoreFilter = new LeftVerticalAngleBarIgnoreFilter({
      cells, cols, merges,
    });
    this.topHorizontalAngleBarIgnoreFilter = new TopHorizontalAngleBarIgnoreFilter({
      cells, cols, merges,
    });
    this.bottomHorizontalAngleBarIgnoreFilter = new BottomHorizontalAngleBarIgnoreFilter({
      cells, cols, merges,
    });
  }

  computerTopHorizontalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
    const { drawOptimization } = this;
    const { cols, cells } = this;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    this.horizontalIterate({
      viewRange,
      filter,
      newRow: (row, y) => {
        sx = bx;
        sy = by + y;
        ex = sx;
        ey = sy;
      },
      jump: (row, col) => {
        const width = cols.getWidth(col);
        sx = ex + width;
        ex = sx;
      },
      handle: (row, col) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        ex += width;
        line.push({ sx, sy, ex, ey, row, col, borderAttr });
        sx = ex;
      },
    });
    if (drawOptimization) {
      for (let i = 1; i < line.length;) {
        const item = line[i];
        const last = line[i - 1];
        const ck1 = item.borderAttr.top.equal(last.borderAttr.top);
        const ck2 = item.col - last.col === 1;
        const ck3 = item.row === last.row;
        if (ck1 && ck2 && ck3) {
          last.ex = item.ex;
          last.col = item.col;
          line.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return line;
  }

  computerBottomHorizontalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
    const { drawOptimization } = this;
    const { cols, rows, cells } = this;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    this.horizontalIterate({
      viewRange,
      filter,
      newRow: (row, y) => {
        const height = rows.getHeight(row);
        sx = bx;
        sy = by + y + height;
        ex = sx;
        ey = sy;
      },
      jump: (row, col) => {
        const width = cols.getWidth(col);
        sx = ex + width;
        ex = sx;
      },
      handle: (row, col) => {
        const width = cols.getWidth(col);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        ex += width;
        line.push({ sx, sy, ex, ey, row, col, borderAttr });
        sx = ex;
      },
    });
    if (drawOptimization) {
      for (let i = 1; i < line.length;) {
        const item = line[i];
        const last = line[i - 1];
        const ck1 = item.borderAttr.bottom.equal(last.borderAttr.bottom);
        const ck2 = item.col - last.col === 1;
        const ck3 = item.row === last.row;
        if (ck1 && ck2 && ck3) {
          last.ex = item.ex;
          last.col = item.col;
          line.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return line;
  }

  computerLeftVerticalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
    const { drawOptimization } = this;
    const { rows, cells } = this;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    this.verticalIterate({
      viewRange,
      filter,
      newCol: (col, x) => {
        sx = bx + x;
        sy = by;
        ex = sx;
        ey = sy;
      },
      jump: (col, row) => {
        const height = rows.getHeight(row);
        sy = ey + height;
        ey = sy;
      },
      handle: (col, row) => {
        const height = rows.getHeight(row);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        ey += height;
        line.push({ sx, sy, ex, ey, row, col, borderAttr });
        sy = ey;
      },
    });
    if (drawOptimization) {
      for (let i = 1; i < line.length;) {
        const item = line[i];
        const last = line[i - 1];
        const nextRow = RowsIterator.getInstance()
          .setBegin(last.row)
          .setEnd(item.row)
          .nextRow();
        const ck1 = item.borderAttr.left.equal(last.borderAttr.left);
        const ck2 = item.row === nextRow;
        const ck3 = item.col === last.col;
        if (ck1 && ck2 && ck3) {
          last.ey = item.ey;
          last.row = item.row;
          line.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return line;
  }

  computerRightVerticalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
    const { drawOptimization } = this;
    const { rows, cols, cells } = this;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    this.verticalIterate({
      viewRange,
      filter,
      newCol: (col, x) => {
        const width = cols.getWidth(col);
        sx = bx + x + width;
        sy = by;
        ex = sx;
        ey = sy;
      },
      jump: (col, row) => {
        const height = rows.getHeight(row);
        sy = ey + height;
        ey = sy;
      },
      handle: (col, row) => {
        const height = rows.getHeight(row);
        const cell = cells.getCell(row, col);
        const { borderAttr } = cell;
        ey += height;
        line.push({ sx, sy, ex, ey, row, col, borderAttr });
        sy = ey;
      },
    });
    if (drawOptimization) {
      for (let i = 1; i < line.length;) {
        const item = line[i];
        const last = line[i - 1];
        const nextRow = RowsIterator.getInstance()
          .setBegin(last.row)
          .setEnd(item.row)
          .nextRow();
        const ck1 = item.borderAttr.right.equal(last.borderAttr.right);
        const ck2 = item.row === nextRow;
        const ck3 = item.col === last.col;
        if (ck1 && ck2 && ck3) {
          last.ey = item.ey;
          last.row = item.row;
          line.splice(i, 1);
        } else {
          i += 1;
        }
      }
    }
    return line;
  }

  disableOptimization() {
    this.drawOptimization = false;
  }

  enableOptimization() {
    this.drawOptimization = true;
  }

}

export { TableBorder };
