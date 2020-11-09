import { BaseLine } from '../BaseLine';
import { HorizontalMergeFilter } from '../linefilter/megeignore/HorizontalMergeFilter';
import { VerticalMergeFilter } from '../linefilter/megeignore/VerticalMergeFilter';
import { HorizontalBorderDisplayFilter } from '../linefilter/borderdisplay/HorizontalBorderDisplayFilter';
import { VerticalBorderDisplayFilter } from '../linefilter/borderdisplay/VerticalBorderDisplayFilter';

class TableGrid extends BaseLine {

  constructor({
    merges,
    rows,
    cols,
    cells,
    drawCheck = false,
    foldOnOff = true,
    getHeight = ri => rows.getHeight(ri),
    getWidth = ci => cols.getWidth(ci),
  }) {
    super({
      merges,
      rows,
      cols,
      cells,
      foldOnOff,
    });
    this.drawCheck = drawCheck;
    this.getHeight = getHeight;
    this.getWidth = getWidth;
    this.horizontalBorderDisplayFilter = new HorizontalBorderDisplayFilter({ cells });
    this.verticalBorderDisplayFilter = new VerticalBorderDisplayFilter({ cells });
    this.horizontalMergeFilter = new HorizontalMergeFilter({ merges });
    this.verticalMergeFilter = new VerticalMergeFilter({ merges });
  }

  computerHorizontalLine({
    viewRange,
    bx = 0,
    by = 0,
    filter,
  }) {
    const { getWidth, getHeight } = this;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    let breakpoint;
    this.horizontalIterate({
      viewRange,
      newRow: (row, y) => {
        const height = getHeight(row);
        sx = bx;
        sy = by + y + height;
        ex = sx;
        ey = sy;
        breakpoint = false;
      },
      filter,
      jump: (row, col) => {
        if (breakpoint) {
          breakpoint = false;
          line.push({ sx, sy, ex, ey });
        }
        const width = getWidth(col);
        sx = ex + width;
        ex = sx;
      },
      handle: (row, col) => {
        breakpoint = true;
        const width = getWidth(col);
        ex += width;
      },
      endRow: () => {
        if (breakpoint) {
          line.push({ sx, sy, ex, ey });
        }
      },
    });
    return line;
  }

  computerVerticalLine({
    viewRange,
    bx = 0,
    by = 0,
    filter,
  }) {
    const { getWidth, getHeight } = this;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    let breakpoint;
    this.verticalIterate({
      viewRange,
      newCol: (col, x) => {
        const width = getWidth(col);
        sx = bx + x + width;
        sy = by;
        ex = sx;
        ey = sy;
        breakpoint = false;
      },
      filter,
      jump: (col, row) => {
        if (breakpoint) {
          breakpoint = false;
          line.push({ sx, sy, ex, ey });
        }
        const height = getHeight(row);
        sy = ey + height;
        ey = sy;
      },
      handle: (col, row) => {
        breakpoint = true;
        const height = getHeight(row);
        ey += height;
      },
      endCol: () => {
        if (breakpoint) {
          line.push({ sx, sy, ex, ey });
        }
      },
    });
    return line;
  }

}

export { TableGrid };
