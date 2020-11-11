import { PlainUtils } from '../../../../../utils/PlainUtils';
import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class LBorderHide {

  constructor({
    cells,
  }) {
    this.cells = cells;
  }

  run({
    row, col,
  }) {
    const { cells } = this;
    const cell = cells.getCell(row, col);
    if (PlainUtils.isUnDef(cell)) {
      return XLineIteratorFilter.RETURN_TYPE.EXEC;
    }
    const { left } = cell.borderAttr;
    return left.display
      ? XLineIteratorFilter.RETURN_TYPE.JUMP
      : XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  LBorderHide,
};
