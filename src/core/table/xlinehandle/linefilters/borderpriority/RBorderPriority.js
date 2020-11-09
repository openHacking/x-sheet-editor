import { XLineIteratorFilter } from '../../XLineIteratorFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class RBorderPriority {

  constructor({
    cells,
  }) {
    this.cells = cells;
  }

  run(row, col) {
    const { cells } = this;
    const next = cells.getCell(row, col + 1);
    const cell = cells.getCell(row, col);
    // 对面的单元格不存在
    if (PlainUtils.isUnDef(next)) {
      return XLineIteratorFilter.RETURN_TYPE.EXEC;
    }
    // 对面的单元格不需要显示
    const { left } = next.borderAttr;
    if (left.display) {
      const { right } = cell.borderAttr;
      const result = right.priority(left);
      return result === 1 || result === 0
        ? XLineIteratorFilter.RETURN_TYPE.EXEC
        : XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    // 对面单元格不存在则显示
    return XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  RBorderPriority,
};
