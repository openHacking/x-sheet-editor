import { BaseLine } from '../BaseLine';
import { HorizontalAngleBarMustFilter } from '../linefilter/anglebarmust/HorizontalAngleBarMustFilter';
import { VerticalAngleBarMuseFilter } from '../linefilter/anglebarmust/VerticalAngleBarMuseFilter';
import { HorizontalMergeFilter } from '../linefilter/megeignore/HorizontalMergeFilter';
import { VerticalMergeFilter } from '../linefilter/megeignore/VerticalMergeFilter';
import { BottomBorderDiffFilter } from '../linefilter/borderdiff/BottomBorderDiffFilter';
import { LeftBorderDiffFilter } from '../linefilter/borderdiff/LeftBorderDiffFilter';
import { RightBorderDiffFilter } from '../linefilter/borderdiff/RightBorderDiffFilter';
import { TopBorderDiffFilter } from '../linefilter/borderdiff/TopBorderDiffFilter';
import { HorizontalAngleBarRowHas } from '../linefilter/anglebarrowhas/HorizontalAngleBarRowHas';
import { VerticalAngleBarRowHas } from '../linefilter/anglebarrowhas/VerticalAngleBarRowHas';

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
    // AngleBar单元格检查
    this.horizontalAngleBarMustFilter = new HorizontalAngleBarMustFilter({
      cells, cols, merges,
    });
    this.verticalAngleBarMuseFilter = new VerticalAngleBarMuseFilter({
      cells, cols, merges,
    });
    // 是否具有合并单元格
    this.horizontalAngleBarRowHas = new HorizontalAngleBarRowHas({
      cells, cols, merges, rows,
    });
    this.verticalAngleBarRowHas = new VerticalAngleBarRowHas({
      cells, cols, merges, rows,
    });
  }

  getAngleOffsetX(ri, ci, sx, ex) {
    const { cells } = this;
    const cell = cells.getCell(ri, ci);
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

  computerTopHorizontalLine({
    viewRange = null,
    bx = 0,
    by = 0,
    filter = null,
  }) {
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
        ex += cols.getWidth(col);
        const { osx, oex } = this.getAngleOffsetX(row, col, sx, ex);
        const { borderAttr } = cells.getCell(row, col);
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
        ex += cols.getWidth(col);
        const { borderAttr } = cells.getCell(row, col);
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
        ey += rows.getHeight(row);
        const { osx } = this.getAngleOffsetX(row, col, sx, ex);
        const { borderAttr } = cells.getCell(row, col);
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
        ey += rows.getHeight(row);
        const { osx } = this.getAngleOffsetX(row, col, sx, ex);
        const { borderAttr } = cells.getCell(row, col);
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
