import { CellOutRange } from './CellOutRange';
import { XLineIteratorFilter } from '../../XLineIteratorFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';
import { BaseFont } from '../../../../../canvas/font/BaseFont';

class RCellOutRange extends CellOutRange {

  run({
    row, col,
  }) {
    return this.master({ row, col }) && this.right({ row, col }) && this.left({ row, col })
      ? XLineIteratorFilter.RETURN_TYPE.EXEC
      : XLineIteratorFilter.RETURN_TYPE.JUMP;
  }

  master({
    row, col,
  }) {
    const { cells, cols } = this;
    const next = cells.getCell(row, col + 1);
    const master = cells.getCell(row, col);

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
    const width = cells.getCellBoundOutSize(row, col);
    const maxWidth = cols.getWidth(col);
    if (width > maxWidth) {
      // 只有next单元格是空时
      // 才允许不绘制边框
      if (PlainUtils.isUnDef(next) || PlainUtils.isBlank(next.text)) {
        return false;
      }
    }
    return true;
  }

}

export {
  RCellOutRange,
};
