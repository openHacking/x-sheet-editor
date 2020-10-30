import { LineFilter } from '../LineFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';
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
    if (PlainUtils.isUnDef(master) || PlainUtils.isBlank(master.text)) {
      return true;
    }

    const { fontAttr } = master;
    const { direction } = fontAttr;
    let checked = true;
    if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
      const { angle } = fontAttr;
      if (angle === 90 || angle === -90) {
        checked = false;
      }
    } else {
      const { textWrap } = fontAttr;
      if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
        checked = false;
      }
    }

    const { align } = fontAttr;
    const maxWidth = cols.getWidth(ci);
    if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
      checked = false;
    }

    if (!checked) {
      return true;
    }

    const width = cells.getCellBoundOutSize(ri, ci);
    if (width > maxWidth) {
      // 只有next单元格是空时
      // 才允许不绘制边框
      if (PlainUtils.isUnDef(next) || PlainUtils.isBlank(next.text)) {
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

        const cell = cells.getCell(ri, i);
        if (PlainUtils.isUnDef(cell)) {
          return true;
        }

        const merge = merges.getFirstIncludes(ri, i);
        if (PlainUtils.isNotUnDef(merge)) {
          return true;
        }

        const { text } = cell;
        if (PlainUtils.isBlank(text)) {
          return true;
        }

        const { fontAttr } = cell;
        const { direction } = fontAttr;
        if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
          const { angle } = fontAttr;
          if (angle === 90 || angle === -90) {
            return false;
          }
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
            return false;
          }
        } else {
          const { textWrap } = fontAttr;
          if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
            return false;
          }
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
            return false;
          }
        }

        const width = cells.getCellBoundOutSize(ri, i);
        if (width > leftWidth) {
          // 只有master单元格和
          // next单元格都是空时
          // 才允许不绘制边框
          const masterBlank = PlainUtils.isUnDef(master) || PlainUtils.isBlank(master.text);
          const nextBlank = PlainUtils.isUnDef(next) || PlainUtils.isBlank(next.text);
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

        const cell = cells.getCell(ri, j);
        if (PlainUtils.isUnDef(cell)) {
          return true;
        }

        const merge = merges.getFirstIncludes(ri, j);
        if (PlainUtils.isNotUnDef(merge)) {
          return true;
        }

        const { text } = cell;
        if (PlainUtils.isBlank(text)) {
          return true;
        }

        const { fontAttr } = cell;
        const { direction } = fontAttr;
        if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
          const { angle } = fontAttr;
          if (angle === 90 || angle === -90) {
            return false;
          }
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
            return false;
          }
        } else {
          const { textWrap } = fontAttr;
          if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
            return false;
          }
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
            return false;
          }
        }

        const width = cells.getCellBoundOutSize(ri, j);
        if (width > rightWidth) {
          // 只有master单元格为
          // 空时才允许不绘制边框
          if (master === null || PlainUtils.isBlank(master.text)) {
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
