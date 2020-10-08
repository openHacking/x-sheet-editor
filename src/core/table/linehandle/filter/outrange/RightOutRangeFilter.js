import { LineFilter } from '../LineFilter';
import { Utils } from '../../../../../utils/Utils';
import { BaseFont } from '../../../../../canvas/font/BaseFont';
import { ColsIterator } from '../../../iterator/ColsIterator';

class RightOutRangeFilter extends LineFilter {

  constructor({
    cells, cols, merges,
  }) {
    super((ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci + 1);
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

    const { cells, cols } = this;

    const next = cells.getCell(ri, ci + 1);
    const master = cells.getCell(ri, ci);

    if (Utils.isUnDef(master) || Utils.isBlank(master.text)) {
      return true;
    }
    const { fontAttr } = master;
    const { direction } = fontAttr;

    let checked = true;

    // 检查文本的绘制方向
    // 区别对待旋转文本
    if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
      const { angle, textWrap } = fontAttr;
      if (angle === 90 || angle === -90) {
        checked = false;
      }
      if (textWrap === BaseFont.TEXT_WRAP.TRUNCATE) {
        checked = false;
      }
    } else {
      // 跳过裁剪类型不是overflow
      // 类型的单元格
      const { textWrap } = fontAttr;
      if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
        checked = false;
      }
    }

    // 跳过对齐方式不是left和center
    // 类型的单元格
    const { align } = fontAttr;
    const maxWidth = cols.getWidth(ci);
    if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
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
      if (Utils.isUnDef(next) || Utils.isBlank(next.text)) {
        return false;
      }
    }

    return true;
  }

  left(ri, ci) {

    const {
      cells, cols, merges,
    } = this;
    const next = cells.getCell(ri, ci + 1);
    const master = cells.getCell(ri, ci);
    let find = true;
    let leftWidth = cols.getWidth(ci - 1) + cols.getWidth(ci);

    ColsIterator.getInstance()
      .setBegin(ci - 1)
      .setEnd(0)
      .setLoop((i) => {
        // 过滤掉空单元格
        const cell = cells.getCell(ri, i);
        if (Utils.isUnDef(cell)) {
          return true;
        }
        const merge = merges.getFirstIncludes(ri, i);
        if (Utils.isNotUnDef(merge)) {
          return true;
        }
        const { text } = cell;
        if (Utils.isBlank(text)) {
          return true;
        }

        const { fontAttr } = cell;
        const { direction } = fontAttr;

        // 检查文本的绘制方向
        // 区别对待旋转文本
        if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
          const { angle, textWrap } = fontAttr;
          if (angle === 90 || angle === -90) {
            return false;
          }
          if (textWrap === BaseFont.TEXT_WRAP.TRUNCATE) {
            return false;
          }
          // 跳过对齐方式不是left和center
          // 类型的单元格
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
            return false;
          }
        } else {
          const { textWrap } = fontAttr;
          // 跳过裁剪类型不是overflow
          // 类型的单元格
          if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
            return false;
          }
          // 跳过对齐方式不是left和center
          // 类型的单元格
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
            return false;
          }
        }

        // 检查当前单元格的内容
        // 宽度是否越界
        const width = cells.getCellBoundOutSize(ri, i);

        if (width > leftWidth) {
          // 只有master单元格和
          // next单元格都是空时
          // 才允许不绘制边框
          const masterBlank = Utils.isUnDef(master) || Utils.isBlank(master.text);
          const nextBlank = Utils.isUnDef(next) || Utils.isBlank(next.text);
          if (masterBlank && nextBlank) {
            find = false;
          }
        }
        return false;
      })
      .setNext((i) => {
        leftWidth += cols.getWidth(i);
      })
      .execute();
    return find;
  }

  right(ri, ci) {

    const {
      cells, cols, merges,
    } = this;
    const master = cells.getCell(ri, ci);
    const { len } = cols;
    let find = true;
    let rightWidth = cols.getWidth(ci + 1);

    ColsIterator.getInstance()
      .setBegin(ci + 1)
      .setEnd(len)
      .setLoop((j) => {
        // 过滤掉空单元格
        // 合并单元格
        const cell = cells.getCell(ri, j);
        if (Utils.isUnDef(cell)) {
          return true;
        }
        const merge = merges.getFirstIncludes(ri, j);
        if (Utils.isNotUnDef(merge)) {
          return true;
        }
        const { text } = cell;
        if (Utils.isBlank(text)) {
          return true;
        }

        // 检查文本的绘制方向
        // 区别对待旋转文本
        const { fontAttr } = cell;
        const { direction } = fontAttr;

        if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
          const { angle, textWrap } = fontAttr;
          if (angle === 90 || angle === -90) {
            return false;
          }
          if (textWrap === BaseFont.TEXT_WRAP.TRUNCATE) {
            return false;
          }
          // 跳过对齐方式不是right和center
          // 类型的单元格
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
            return false;
          }
        } else {
          // 跳过裁剪类型不是overflow
          // 类型的单元格
          const { textWrap } = fontAttr;
          if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
            return false;
          }
          // 跳过对齐方式不是right和center
          // 类型的单元格
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
            return false;
          }
        }

        // 检查当前单元格的内容
        // 宽度是否越界
        const width = cells.getCellBoundOutSize(ri, j);
        if (width > rightWidth) {
          // 只有master单元格为
          // 空时才允许不绘制边框
          if (master === null || Utils.isBlank(master.text)) {
            find = false;
          }
        }
        return false;
      })
      .setNext((j) => {
        rightWidth += cols.getWidth(j);
      })
      .execute();
    return find;
  }

}

export {
  RightOutRangeFilter,
};
