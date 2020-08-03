import { BaseCellsHelper } from './BaseCellsHelper';
import { RectRange } from '../tablebase/RectRange';

class OperateCellsHelper extends BaseCellsHelper {

  getCellOrNewCellByViewRange({
    rectRange = new RectRange(-1, -1, -1, -1),
    callback = () => {},
  }) {
    const { cells } = this;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    for (let i = sri; i <= eri; i += 1) {
      for (let j = sci; j <= eci; j += 1) {
        const cell = cells.getCellOrNew(i, j);
        callback(i, j, cell);
      }
    }
  }

}

export {
  OperateCellsHelper,
};
