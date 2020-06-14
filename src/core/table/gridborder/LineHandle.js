import { RectRange } from '../RectRange';
import { Rect } from '../../../canvas/Rect';
import { Utils } from '../../../utils/Utils';
import { ALIGN, TEXT_DIRECTION, TEXT_WRAP } from '../../../canvas/Font';

class LineHandle {

  constructor(table) {
    this.table = table;
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
  vLineOverFlowChecked(ci, ri) {
    const { table } = this;
    const { cells, cols, merges } = table;
    const { len } = cols;
    const master = cells.getMergeCellOrCell(ri, ci);
    const next = cells.getMergeCellOrCell(ri, ci + 1);
    const merge = merges.getFirstIncludes(ri, ci + 1);

    if (merge) {
      return true;
    }

    let checkedRight = true;
    let checkedLeft = true;

    // 检查master单元格是否越界
    if (master && !Utils.isBlank(master.text)) {
      const { fontAttr } = master;
      const { direction } = fontAttr;
      let checked = true;
      // 检查文本的绘制方向
      // 区别对待旋转文本
      if (direction === TEXT_DIRECTION.ANGLE) {
        const { angle, textWrap } = fontAttr;
        if (angle === 90 || angle === -90) {
          checked = false;
        }
        if (textWrap === TEXT_WRAP.TRUNCATE) {
          checked = false;
        }
      } else {
        // 跳过裁剪类型不是overflow
        // 类型的单元格
        // eslint-disable-next-line no-lonely-if
        const { textWrap } = fontAttr;
        if (textWrap !== TEXT_WRAP.OVER_FLOW) {
          checked = false;
        }
      }
      // 跳过对齐方式不是left和center
      // 类型的单元格
      const { align } = fontAttr;
      const maxWidth = cols.getWidth(ci);
      if (align !== ALIGN.left && align !== ALIGN.center) {
        checked = false;
      }
      // 单元格符合检查条件
      // 则检查宽度是否越界
      if (checked) {
        // 检查当前单元格的内容
        // 宽度是否越界
        const width = this.getCellContentWidth(master, ci);
        if (width > maxWidth) {
          // 只有next单元格是空时
          // 才允许不绘制边框
          if (next === null || Utils.isBlank(next.text)) checkedLeft = false;
        }
      }
    }

    // 检查左边是否越界
    let leftWidth = cols.getWidth(ci - 1) + cols.getWidth(ci);
    for (let i = ci - 1; i >= 0; i -= 1, leftWidth += cols.getWidth(i)) {
      // 过滤掉空单元格
      const cell = cells.getCell(ri, i);
      if (cell === null) continue;
      const { text } = cell;
      if (Utils.isBlank(text)) continue;
      // 检查文本的绘制方向
      // 区别对待旋转文本
      const { fontAttr } = cell;
      const { direction } = fontAttr;
      if (direction === TEXT_DIRECTION.ANGLE) {
        const { angle, textWrap } = fontAttr;
        if (angle === 90 || angle === -90) { break; }
        if (textWrap === TEXT_WRAP.TRUNCATE) { break; }
      } else {
        // 跳过裁剪类型不是overflow
        // 类型的单元格
        const { textWrap } = fontAttr;
        if (textWrap !== TEXT_WRAP.OVER_FLOW) { break; }
        // 跳过对齐方式不是left和center
        // 类型的单元格
        const { align } = fontAttr;
        if (align !== ALIGN.left && align !== ALIGN.center) { break; }
      }
      // 检查当前单元格的内容
      // 宽度是否越界
      const width = this.getCellContentWidth(cell, i);
      if (width > leftWidth) {
        // 只有master单元格和
        // next单元格都是空时
        // 才允许不绘制边框
        const masterBlank = master === null || Utils.isBlank(master.text);
        const nextBlank = next === null || Utils.isBlank(next.text);
        if (masterBlank && nextBlank) {
          checkedLeft = false;
        }
      }
      break;
    }

    // 检查右边是否越界
    let rightWidth = cols.getWidth(ci + 1);
    for (let j = ci + 1; j <= len; j += 1, rightWidth += cols.getWidth(j)) {
      // 过滤掉空单元格
      const cell = cells.getCell(ri, j);
      if (cell === null) continue;
      const { text } = cell;
      if (Utils.isBlank(text)) continue;
      // 检查文本的绘制方向
      // 区别对待旋转文本
      const { fontAttr } = cell;
      const { direction } = fontAttr;
      if (direction === TEXT_DIRECTION.ANGLE) {
        const { angle, textWrap } = fontAttr;
        if (angle === 90 || angle === -90) { break; }
        if (textWrap === TEXT_WRAP.TRUNCATE) { break; }
      } else {
        // 跳过裁剪类型不是overflow
        // 类型的单元格
        const { textWrap } = fontAttr;
        if (textWrap !== TEXT_WRAP.OVER_FLOW) { break; }
        // 跳过对齐方式不是right和center
        // 类型的单元格
        const { align } = fontAttr;
        if (align !== ALIGN.right && align !== ALIGN.center) { break; }
      }
      // 检查当前单元格的内容
      // 宽度是否越界
      const width = this.getCellContentWidth(cell, j);
      if (width > rightWidth) {
        // 只有master单元格为
        // 空时才允许不绘制边框
        if (master === null || Utils.isBlank(master.text)) {
          checkedRight = false;
        }
      }
      break;
    }

    return checkedLeft && checkedRight;
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
        return colWidth + ((contentWidth - colWidth) / 2);
      default:
        return 0;
    }
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
