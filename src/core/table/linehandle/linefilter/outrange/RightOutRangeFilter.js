import { LineFilter } from '../LineFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { BaseFont } from '../../../../../canvas/font/BaseFont';
import { ColsIterator } from '../../../iterator/ColsIterator';

class RightOutRangeFilter extends LineFilter {

  constructor({
    cells, cols, merges, rows,
  }) {
    super((ci, ri) => {
      const merge = merges.getFirstIncludes(ri, ci + 1);
      if (merge) {
        return LineFilter.RETURN_TYPE.HANDLE;
      }
      return this.master(ri, ci) && this.right(ri, ci) && this.left(ri, ci)
        ? LineFilter.RETURN_TYPE.HANDLE
        : LineFilter.RETURN_TYPE.JUMP;
    });
    this.cells = cells;
    this.cols = cols;
    this.merges = merges;
    this.rows = rows;
  }

  master(ri, ci) {
    const { cells, cols } = this;
    const next = cells.getCell(ri, ci + 1);
    const master = cells.getCell(ri, ci);

    // 是否是空单元格
    if (PlainUtils.isUnDef(master) || PlainUtils.isBlank(master.text)) {
      return true;
    }
    // 文字属性检查
    const { fontAttr } = master;
    const { direction } = fontAttr;
    // 是否旋转文本
    if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
      const { angle } = fontAttr;
      if (master.isAngleBarCell()) {
        return angle < 0;
      }
      if (angle === 90 || angle === -90) {
        return true;
      }
    } else {
      const { textWrap } = fontAttr;
      if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
        return true;
      }
    }
    // 对其方式检查
    const { align } = fontAttr;
    if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
      return true;
    }
    // 文本是否越界
    const width = cells.getCellBoundOutSize(ri, ci);
    const maxWidth = cols.getWidth(ci);
    if (width > maxWidth) {
      // 只有next单元格是空时
      // 才允许不绘制边框
      if (direction === BaseFont.TEXT_DIRECTION.ANGLE
        || PlainUtils.isUnDef(next) || PlainUtils.isBlank(next.text)) {
        return false;
      }
    }
    return true;
  }

  left(ri, ci) {
    const { cells, cols, merges, rows } = this;
    const row = rows.getOrNew(ri);
    const next = cells.getCell(ri, ci + 1);
    const master = cells.getCell(ri, ci);
    let find = true;
    let leftWidth = cols.getWidth(ci - 1) + cols.getWidth(ci);

    // 左方向越界检查
    if (row.hasAngleCell()) {
      ColsIterator.getInstance()
        .setBegin(ci - 1)
        .setEnd(0)
        .setLoop((i) => {
          // 检查空单元格
          const cell = cells.getCell(ri, i);
          if (PlainUtils.isUnDef(cell)) {
            return true;
          }
          // 检查合并单元格
          const merge = merges.getFirstIncludes(ri, i);
          if (PlainUtils.isNotUnDef(merge)) {
            return true;
          }
          // 检查空文本单元格
          const { text } = cell;
          if (PlainUtils.isBlank(text)) {
            return true;
          }
          // 检查文本类型
          const { fontAttr } = cell;
          const { direction } = fontAttr;
          // 是否旋转文本
          if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
            const { angle } = fontAttr;
            // 忽略反方向旋转的angleBar单元格
            if (cell.isAngleBarCell()) {
              if (angle < 0) {
                return true;
              }
            } else {
              // 旋转方向忽略正负90度
              if (angle === 90 || angle === -90) {
                return true;
              }
              // 检查对其方式
              const { align } = fontAttr;
              if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
                return true;
              }
            }
          } else {
            // 检查裁剪类型
            const { textWrap } = fontAttr;
            if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
              return true;
            }
            // 检查对其方式
            const { align } = fontAttr;
            if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
              return true;
            }
          }
          // 文本是否越界
          const width = cells.getCellBoundOutSize(ri, i);
          if (width > leftWidth) {
            // 只有master单元格和
            // next单元格都是空时
            // 才允许不绘制边框
            const masterBlank = PlainUtils.isUnDef(master) || PlainUtils.isBlank(master.text);
            const nextBlank = PlainUtils.isUnDef(next) || PlainUtils.isBlank(next.text);
            if (direction === BaseFont.TEXT_DIRECTION.ANGLE
              || (masterBlank && nextBlank)) {
              find = false;
            }
          }
          return false;
        })
        .setNext((i) => {
          leftWidth += cols.getWidth(i);
        })
        .execute();
    } else {
      ColsIterator.getInstance()
        .setBegin(ci - 1)
        .setEnd(0)
        .setLoop((i) => {
          // 检查空单元格
          const cell = cells.getCell(ri, i);
          if (PlainUtils.isUnDef(cell)) {
            return true;
          }
          // 检查合并单元格
          const merge = merges.getFirstIncludes(ri, i);
          if (PlainUtils.isNotUnDef(merge)) {
            return true;
          }
          // 检查空文本单元格
          const { text } = cell;
          if (PlainUtils.isBlank(text)) {
            return true;
          }
          // 检查文本类型
          const { fontAttr } = cell;
          const { textWrap } = fontAttr;
          // 检查裁剪类型
          if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
            return false;
          }
          // 检查对其方式
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.left && align !== BaseFont.ALIGN.center) {
            return false;
          }
          // 文本是否越界
          const width = cells.getCellBoundOutSize(ri, i);
          // 文本是否越界
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
    }
    return find;
  }

  right(ri, ci) {
    const { cells, cols, merges, rows } = this;
    const { len } = cols;
    const row = rows.getOrNew(ri);
    const master = cells.getCell(ri, ci);
    let find = true;
    let rightWidth = cols.getWidth(ci + 1);

    // 右方向越界检查
    if (row.hasAngleCell()) {
      ColsIterator.getInstance()
        .setBegin(ci + 1)
        .setEnd(len)
        .setLoop((j) => {
          // 空单元格检查
          const cell = cells.getCell(ri, j);
          if (PlainUtils.isUnDef(cell)) {
            return true;
          }
          // 合并单元格检查
          const merge = merges.getFirstIncludes(ri, j);
          if (PlainUtils.isNotUnDef(merge)) {
            return true;
          }
          // 空文本单检查
          const { text } = cell;
          if (PlainUtils.isBlank(text)) {
            return true;
          }
          // 文本属性检查
          const { fontAttr } = cell;
          const { direction } = fontAttr;
          // 文本旋转方向
          if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
            const { angle } = fontAttr;
            // 忽略反方向旋转的angleBar单元格
            if (cell.isAngleBarCell()) {
              if (angle > 0) {
                return true;
              }
            } else {
              // 旋转方向忽略正负90度
              if (angle === 90 || angle === -90) {
                return true;
              }
              // 检查对其方式
              const { align } = fontAttr;
              if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
                return true;
              }
            }
          } else {
            // 检查文本裁剪类型
            const { textWrap } = fontAttr;
            if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
              return true;
            }
            // 检查文本对齐方式
            const { align } = fontAttr;
            if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
              return true;
            }
          }
          // 检查文本是否越界
          const width = cells.getCellBoundOutSize(ri, j);
          if (width > rightWidth) {
            // 只有master单元格为
            // 空时才允许不绘制边框
            if (PlainUtils.isUnDef(master) || PlainUtils.isBlank(master.text)) {
              find = false;
              return false;
            }
          }
          return true;
        })
        .setNext((j) => {
          rightWidth += cols.getWidth(j);
        })
        .execute();
    } else {
      ColsIterator.getInstance()
        .setBegin(ci + 1)
        .setEnd(len)
        .setLoop((j) => {
          // 空单元格检查
          const cell = cells.getCell(ri, j);
          if (PlainUtils.isUnDef(cell)) {
            return true;
          }
          // 合并单元格检查
          const merge = merges.getFirstIncludes(ri, j);
          if (PlainUtils.isNotUnDef(merge)) {
            return true;
          }
          // 空文本单检查
          const { text } = cell;
          if (PlainUtils.isBlank(text)) {
            return true;
          }
          // 文本属性检查
          const { fontAttr } = cell;
          const { textWrap } = fontAttr;
          // 裁剪类型检查
          if (textWrap !== BaseFont.TEXT_WRAP.OVER_FLOW) {
            return false;
          }
          // 文本对齐方式检查
          const { align } = fontAttr;
          if (align !== BaseFont.ALIGN.right && align !== BaseFont.ALIGN.center) {
            return false;
          }
          // 文本越界检查
          const width = cells.getCellBoundOutSize(ri, j);
          if (width > rightWidth) {
            // 只有master单元格为
            // 空时才允许不绘制边框
            if (PlainUtils.isUnDef(master) || PlainUtils.isBlank(master.text)) {
              find = false;
            }
          }
          return false;
        })
        .setNext((j) => {
          rightWidth += cols.getWidth(j);
        })
        .execute();
    }
    return find;
  }

}

export {
  RightOutRangeFilter,
};
