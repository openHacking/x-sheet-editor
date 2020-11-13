import { PlainUtils } from '../../../../../utils/PlainUtils';
import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class AngleBarInRow {

  constructor({
    rows,
  }) {
    this.rows = rows;
  }

  run({
    row,
  }) {
    const { rows } = this;
    const rowObject = rows.get(row);
    if (PlainUtils.isUnDef(rowObject)) {
      return XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return rowObject.hasAngleCell()
      ? XLineIteratorFilter.RETURN_TYPE.EXEC
      : XLineIteratorFilter.RETURN_TYPE.JUMP;
  }

}

export {
  AngleBarInRow,
};
