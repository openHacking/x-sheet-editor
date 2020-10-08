import { BaseCellsHelper } from './BaseCellsHelper';
import { RectRange } from '../tablebase/RectRange';
import { ColsIterator } from '../iterator/ColsIterator';
import { RowsIterator } from '../iterator/RowsIterator';

class OperateCellsHelper extends BaseCellsHelper {

  getCellOrNewCellByViewRange({
    rectRange = new RectRange(-1, -1, -1, -1),
    callback = () => {},
  }) {
    const { cells } = this;
    const {
      sri, eri, sci, eci,
    } = rectRange;
    RowsIterator.getInstance()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((i) => {
        ColsIterator.getInstance()
          .setBegin(sci)
          .setEnd(eci)
          .setLoop((j) => {
            const cell = cells.getCellOrNew(i, j);
            callback(i, j, cell);
          })
          .execute();
      })
      .execute();
  }

}

export {
  OperateCellsHelper,
};
