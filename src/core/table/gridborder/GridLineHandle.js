import { ALIGN } from '../../../canvas/Font';
import { Utils } from '../../../utils/Utils';

/**
 * GridLineHandle
 * @author jerry
 */
class GridLineHandle {

  /**
   * GridLineHandle
   * @param table
   */
  constructor(table) {
    this.table = table;
  }

  /**
   * 检查垂直线段是否需要绘制
   * @param ci
   * @param ri
   * @returns {boolean}
   */
  vLineBorderChecked(ci, ri) {
    const { table } = this;
    const { cells } = table;
    const cell = cells.getMergeCellOrCell(ri, ci);
    const nextCell = cells.getMergeCellOrCell(ri, ci + 1);
    // 跳过绘制边框的单元格
    if (cell && nextCell) {
      return !(cell.borderAttr.right.display || nextCell.borderAttr.left.display);
    }
    if (cell) {
      return !cell.borderAttr.right.display;
    }
    if (nextCell) {
      return !nextCell.borderAttr.left.display;
    }
    return true;
  }

  /**
   * 检查水平线段是否需要绘制
   * @param ri
   * @param ci
   * @returns {boolean}
   */
  hLineBorderChecked(ri, ci) {
    const { table } = this;
    const { cells } = table;
    const cell = cells.getMergeCellOrCell(ri, ci);
    const nextCell = cells.getMergeCellOrCell(ri + 1, ci);
    // 跳过绘制边框的单元格
    if (cell && nextCell) {
      return !(cell.borderAttr.bottom.display || nextCell.borderAttr.top.display);
    }
    if (cell) {
      return !cell.borderAttr.bottom.display;
    }
    if (nextCell) {
      return !nextCell.borderAttr.top.display;
    }
    return true;
  }

  /**
   * 绘制垂直网格线段时
   * 判断网格左右的单元格中
   * 是否存在overflow裁剪类型
   * 的单元格, 如果有判断宽度是否
   * 覆盖了当前线段如果覆盖了
   * 则跳过该线段绘制
   * @param ci
   * @param ri
   */
  vLineOverFlowWidthChecked(ci, ri) {
    const { table } = this;
    const { cols, cells } = table;
    const cell = cells.getCell(ri, ci);
    // 左边的下一个元素是否有值
    const next = cells.getCell(ri, ci + 1);
    if (cell && next) {
      if (!Utils.isBlank(next.text) && !Utils.isBlank(cell.text)) { return true; }
    }
    let checkDraw = true;
    // 检查左边是否需要绘制边框
    const leftMaxWidth = cols.sectionSumWidth(0, ci);
    let i = 0;
    let leftWidth = 0;
    for (; i <= ci; i += 1, leftWidth += cols.getWidth(i)) {
      const cell = cells.getCell(ri, i);
      if (Utils.isUnDef(cell)) {
        continue;
      }
      const { text, fontAttr } = cell;
      const { align } = fontAttr;
      const contentWidth = this.getCellContentWidth(cell, i);
      const notBlank = !Utils.isBlank(text);
      if (align !== ALIGN.left && align !== ALIGN.center) {
        if (notBlank) {
          checkDraw = true;
        }
        continue;
      }
      const overflow = contentWidth + leftWidth > leftMaxWidth;
      if (checkDraw === false && notBlank) {
        checkDraw = true;
      }
      if (checkDraw === true && overflow) {
        checkDraw = false;
      }
    }
    // 获取table的滚动可视区域
    const scrollViewRange = table.getScrollViewRange();
    const { eci } = scrollViewRange;
    // 检查右边是否需要绘制边框
    let j = ci + 1;
    let rightWidth = cols.getWidth(ci + 1);
    for (; j <= eci; j += 1, rightWidth += cols.getWidth(j)) {
      const cell = cells.getCell(ri, j);
      if (Utils.isUnDef(cell)) {
        continue;
      }
      const { text, fontAttr } = cell;
      const contentWidth = this.getCellContentWidth(cell, j);
      const { align } = fontAttr;
      if (align !== ALIGN.right && align !== ALIGN.center) {
        const notBlank = !Utils.isBlank(text);
        if (notBlank) {
          checkDraw = true;
          break;
        } else {
          continue;
        }
      }
      const overflow = contentWidth > rightWidth;
      if (checkDraw === true && overflow) {
        checkDraw = false;
        break;
      }
    }
    return checkDraw;
  }

  /**
   * 计算单元格内容宽度
   * @param cell
   * @param ci
   * @returns {number|*}
   */
  getCellContentWidth(cell, ci) {
    const { table } = this;
    const { cols } = table;
    const colWidth = cols.getWidth(ci);
    const { contentWidth, fontAttr } = cell;
    const { align } = fontAttr;
    switch (align) {
      case ALIGN.right:
      case ALIGN.left:
        return contentWidth;
      case ALIGN.center:
        return colWidth + (contentWidth - colWidth) / 2;
      default:
        return 0;
    }
  }

  /**
   * 水平线段位置计算
   * @param viewRange
   * @param bx
   * @param by
   * @param filter
   * @returns {[]}
   */
  gridHLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table } = this;
    const { lineHandle, cols, rows } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    let breakpoint;
    lineHandle.hEach({
      viewRange,
      newRow: (row, y) => {
        const height = rows.getHeight(row);
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
        const width = cols.getWidth(col);
        sx = ex + width;
        ex = sx;
      },
      handle: (row, col) => {
        breakpoint = true;
        const width = cols.getWidth(col);
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

  /**
   * 垂直线段位置计算
   * @param viewRange
   * @param bx
   * @param by
   * @param filter
   * @returns {[]}
   */
  gridVLine(viewRange, bx = 0, by = 0, filter = () => true) {
    const { table } = this;
    const { lineHandle, cols, rows } = table;
    const line = [];
    let sx;
    let sy;
    let ex;
    let ey;
    let breakpoint;
    lineHandle.vEach({
      viewRange,
      newCol: (col, x) => {
        const width = cols.getWidth(col);
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
        const height = rows.getHeight(row);
        sy = ey + height;
        ey = sy;
      },
      handle: (col, row) => {
        breakpoint = true;
        const height = rows.getHeight(row);
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

  /**
   * 水平线段位置计算
   * 检查水平线段是否需要绘制
   * @param viewRange
   * @returns {*[]}
   */
  hLine(viewRange) {
    const { table } = this;
    const { merges } = table;
    return this.gridHLine(viewRange, 0, 0, (ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        return false;
      }
      return this.hLineBorderChecked(ri, ci);
    });
  }

  /**
   * 垂直线段位置计算
   * 检查水平线段是否需要绘制
   * @param viewRange
   * @returns {*[]}
   */
  vLine(viewRange) {
    const { table } = this;
    const { merges } = table;
    return this.gridVLine(viewRange, 0, 0, (ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        return false;
      }
      if (!this.vLineBorderChecked(ci, ri)) {
        return false;
      }
      return this.vLineOverFlowWidthChecked(ci, ri);
    });
  }

  /**
   * 水平合并单元格线段位置计算
   * 检查水平线段是否需要绘制
   * @param mergesBrink
   * @returns {*[]}
   */
  hMergeLine(mergesBrink) {
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { bottom } = brink;
      if (bottom) {
        const { view, x, y } = bottom;
        const item = this.gridHLine(view, x, y, (ri, ci) => this.hLineBorderChecked(ri, ci));
        result = result.concat(item);
      }
    }
    return result;
  }

  /**
   *  垂直合并单元格线段位置计算
   * 检查水平线段是否需要绘制
   * @param mergesBrink
   * @returns {*[]}
   */
  vMergeLine(mergesBrink) {
    let result = [];
    for (let i = 0; i < mergesBrink.length; i += 1) {
      const brink = mergesBrink[i];
      const { right } = brink;
      if (right) {
        const { view, x, y } = right;
        const item = this.gridVLine(view, x, y, (ci, ri) => {
          if (!this.vLineBorderChecked(ci, ri)) {
            return false;
          }
          return this.vLineOverFlowWidthChecked(ci, ri);
        });
        result = result.concat(item);
      }
    }
    return result;
  }
}

export {
  GridLineHandle,
};
