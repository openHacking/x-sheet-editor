import { XLineIteratorFilter } from '../../XLineIteratorFilter';
import { PlainUtils } from '../../../../../utils/PlainUtils';

class RBorderShow {

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
      return XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    const { right } = cell.borderAttr;
    return right.display
      ? XLineIteratorFilter.RETURN_TYPE.EXEC
      : XLineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  RBorderShow,
};
