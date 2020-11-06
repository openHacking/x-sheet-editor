import { BaseLine } from '../BaseLine';
import { HorizontalAngleBarMustFilter } from '../linefilter/anglebarmust/HorizontalAngleBarMustFilter';
import { VerticalAngleBarMuseFilter } from '../linefilter/anglebarmust/VerticalAngleBarMuseFilter';
import { HorizontalMergeFilter } from '../linefilter/mege/HorizontalMergeFilter';
import { VerticalMergeFilter } from '../linefilter/mege/VerticalMergeFilter';
import { BottomBorderDiffFilter } from '../linefilter/borderdiff/BottomBorderDiffFilter';
import { LeftBorderDiffFilter } from '../linefilter/borderdiff/LeftBorderDiffFilter';
import { RightBorderDiffFilter } from '../linefilter/borderdiff/RightBorderDiffFilter';
import { TopBorderDiffFilter } from '../linefilter/borderdiff/TopBorderDiffFilter';
import { RTCosKit, RTSinKit } from '../../../../canvas/RTFunction';

class TableAngleBar extends BaseLine {

  constructor({
    rows,
    cells,
    cols,
    merges,
    foldOnOff = true,
  }) {
    super({
      merges,
      rows,
      cols,
      cells,
      foldOnOff,
    });
    // 合并单元格忽略
    this.horizontalMergeFilter = new HorizontalMergeFilter({ merges });
    this.verticalMergeFilter = new VerticalMergeFilter({ merges });
    // 边框优先级对比
    this.bottomBorderDiffFilter = new BottomBorderDiffFilter({ cells });
    this.leftBorderDiffFilter = new LeftBorderDiffFilter({ cells });
    this.rightBorderDiffFilter = new RightBorderDiffFilter({ cells });
    this.topBorderDiffFilter = new TopBorderDiffFilter({ cells });
    // AngleBar 检查
    this.horizontalAngleBarMustFilter = new HorizontalAngleBarMustFilter({
      cells, cols, merges,
    });
    this.verticalAngleBarMuseFilter = new VerticalAngleBarMuseFilter({
      cells, cols, merges,
    });
  }

  getAngleOffsetX(ri, ci, sx, ex) {
    const { cells, rows } = this;
    const height = rows.getHeight(ri);
    const cell = cells.getCell(ri, ci);
    const { fontAttr } = cell;
    const { angle } = fontAttr;
    const tilt = RTSinKit.tilt({ inverse: height, angle });
    const nearby = RTCosKit.nearby({ tilt, angle });
    if (angle > 0) {
      sx += nearby;
      ex += nearby;
    } else {
      sx -= nearby;
      ex -= nearby;
    }
    return {
      osx: sx,
      oex: ex,
    };
  }

  getAngleBorderAttr(ri, ci) {
    const { cells } = this;
    const last = cells.getCell(ri - 1, ci);
    const cell = cells.getCell(ri, ci);
    if (last) {
      const lastTop = last.borderAttr.top;
      const cellTop = cell.borderAttr.top;
      if (cellTop.priority(lastTop) !== 1) {
        return last.borderAttr;
      }
    }
    return cell.borderAttr;
  }

  computerTopHorizontalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
    const { cols } = this;
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
        ex += cols.getWidth(col);
        const { osx, oex } = this.getAngleOffsetX(row, col, sx, ex);
        const borderAttr = this.getAngleBorderAttr(row, col);
        line.push({ sx: osx, sy, ex: oex, ey, row, col, borderAttr });
        sx = ex;
      },
    });
    return line;
  }

  computerBottomHorizontalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
    const { cols, rows } = this;
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
        ex += cols.getWidth(col);
        const borderAttr = this.getAngleBorderAttr(row, col);
        line.push({ sx, sy, ex, ey, row, col, borderAttr });
        sx = ex;
      },
    });
    return line;
  }

  computerLeftVerticalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
    const { rows } = this;
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
        ey += rows.getHeight(row);
        const { osx } = this.getAngleOffsetX(row, col, sx, ex);
        const borderAttr = this.getAngleBorderAttr(row, col);
        line.push({ sx: osx, sy, ex, ey, row, col, borderAttr });
        sy = ey;
      },
    });
    return line;
  }

  computerRightVerticalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
    const { rows, cols } = this;
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
        ey += rows.getHeight(row);
        const { osx } = this.getAngleOffsetX(row, col, sx, ex);
        const borderAttr = this.getAngleBorderAttr(row, col);
        line.push({ sx: osx, sy, ex, ey, row, col, borderAttr });
        sy = ey;
      },
    });
    return line;
  }

}

export {
  TableAngleBar,
};
