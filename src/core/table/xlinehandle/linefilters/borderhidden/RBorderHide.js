import { PlainUtils } from '../../../../../utils/PlainUtils';
import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class RBorderHide {

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
    const { right } = cell.borderAttr;
    return right.display
      ? XLineIteratorFilter.RETURN_TYPE.JUMP
      : XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  RBorderHide,
};
