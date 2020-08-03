import { LineFilter } from '../LineFilter';
import { Utils } from '../../../../../utils/Utils';
import {
  ALIGN,
  TEXT_DIRECTION,
  TEXT_WRAP,
} from '../../../../../canvas/Font';

class LeftOutRangeFilter extends LineFilter {

  constructor({
    cells, cols, merges,
  }) {
    super((ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci - 1);
      if (merge) {
        return true;
      }
      return this.master(ri, ci)
        && this.right(ri, ci)
        && this.left(ri, ci);
    });
    this.cells = cells;
    this.cols = cols;
    this.merges = merges;
  }

  master(ri, ci) {

    const {
      cells, cols,
    } = this;

    const last = cells.getCell(ri, ci - 1);
    const master = cells.getCell(ri, ci);

    if (Utils.isUnDef(master) || Utils.isBlank(master.text)) {
      return true;
    }

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
      const { textWrap } = fontAttr;
      if (textWrap !== TEXT_WRAP.OVER_FLOW) {
        checked = false;
      }
    }

    // 跳过对齐方式不是left和center
    // 类型的单元格
    const { align } = fontAttr;
    const maxWidth = cols.getWidth(ci);
    if (align !== ALIGN.right && align !== ALIGN.center) {
      checked = false;
    }

    // 单元格符合检查条件
    // 则检查宽度是否越界
    if (!checked) {
      return true;
    }

    // 检查当前单元格的内容
    // 宽度是否越界
    const width = cells.getCellBoundOutSize(ri, ci);
    if (width > maxWidth) {
      // 只有next单元格是空时
      // 才允许不绘制边框
      if (Utils.isUnDef(last) || Utils.isBlank(last.text)) {
        return false;
      }
    }

    return true;
  }

  right(ri, ci) {

    const {
      cells, cols,
    } = this;

    const { len } = cols;
    const last = cells.getCell(ri, ci - 1);
    const master = cells.getCell(ri, ci);

    let rightWidth = cols.getWidth(ci + 1) + cols.getWidth(ci);

    // 检查右边是否越界
    for (let j = ci + 1; j <= len; j += 1, rightWidth += cols.getWidth(j)) {

      // 过滤掉空单元格
      const cell = cells.getCell(ri, j);
      if (Utils.isUnDef(cell)) {
        continue;
      }
      const { text } = cell;
      if (Utils.isBlank(text)) {
        continue;
      }

      // 检查文本的绘制方向
      // 区别对待旋转文本
      const { fontAttr } = cell;
      const { direction } = fontAttr;
      if (direction === TEXT_DIRECTION.ANGLE) {
        const { angle, textWrap } = fontAttr;
        if (angle === 90 || angle === -90) {
          break;
        }
        if (textWrap === TEXT_WRAP.TRUNCATE) {
          break;
        }
      } else {
        // 跳过裁剪类型不是overflow
        // 类型的单元格
        const { textWrap } = fontAttr;
        if (textWrap !== TEXT_WRAP.OVER_FLOW) {
          break;
        }
        // 跳过对齐方式不是right和center
        // 类型的单元格
        const { align } = fontAttr;
        if (align !== ALIGN.right && align !== ALIGN.center) {
          break;
        }
      }

      // 检查当前单元格的内容
      // 宽度是否越界
      const width = cells.getCellBoundOutSize(ri, j);
      if (width > rightWidth) {
        // 只有master单元格和
        // last单元格都是空时
        // 才允许不绘制边框
        const masterBlank = Utils.isUnDef(master) || Utils.isBlank(master.text);
        const nextBlank = Utils.isUnDef(last) || Utils.isBlank(last.text);
        if (masterBlank && nextBlank) {
          return false;
        }
      }
      break;
    }

    return true;
  }

  left(ri, ci) {

    const {
      cells, cols,
    } = this;

    const master = cells.getCell(ri, ci);

    let leftWidth = cols.getWidth(ci - 1);

    // 检查左边是否越界
    for (let i = ci - 1; i >= 0; i -= 1, leftWidth += cols.getWidth(i)) {

      // 过滤掉空单元格
      const cell = cells.getCell(ri, i);
      if (cell === null) {
        continue;
      }
      const { text } = cell;
      if (Utils.isBlank(text)) {
        continue;
      }

      // 检查文本的绘制方向
      // 区别对待旋转文本
      const { fontAttr } = cell;
      const { direction } = fontAttr;
      if (direction === TEXT_DIRECTION.ANGLE) {
        const { angle, textWrap } = fontAttr;
        if (angle === 90 || angle === -90) {
          break;
        }
        if (textWrap === TEXT_WRAP.TRUNCATE) {
          break;
        }
      } else {
        // 跳过裁剪类型不是overflow
        // 类型的单元格
        const { textWrap } = fontAttr;
        if (textWrap !== TEXT_WRAP.OVER_FLOW) {
          break;
        }
        // 跳过对齐方式不是left和center
        // 类型的单元格
        const { align } = fontAttr;
        if (align !== ALIGN.left && align !== ALIGN.center) {
          break;
        }
      }

      // 检查当前单元格的内容
      // 宽度是否越界
      const width = cells.getCellBoundOutSize(ri, i);
      if (width > leftWidth) {
        // 只有master单元格为
        // 空时才允许不绘制边框
        if (Utils.isUnDef(master) || Utils.isBlank(master.text)) {
          return false;
        }
      }
      break;
    }

    return true;
  }

}

export {
  LeftOutRangeFilter,
};
