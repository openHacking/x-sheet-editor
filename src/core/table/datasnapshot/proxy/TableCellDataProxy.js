import { DataProxy } from './DataProxy';
import { Constant } from '../../../constant/Constant';

class TableCellDataProxy extends DataProxy {

  constructor(table, option = {
    on: { setCell() {} },
  }) {
    super();
    this.table = table;
    this.option = option;
  }

  set(ri, ci, newCell) {
    this.change = true;
    const { table } = this;
    const { cells } = table;
    cells.setCellOrNew(ri, ci, newCell);
  }

  setCell(ri, ci, newCell) {
    const { option, table } = this;
    const { on } = option;
    const { setCell } = on;
    const { cells } = table;
    const oldCell = cells.getCell(ri, ci);
    setCell(ri, ci, oldCell, newCell);
    this.set(ri, ci, newCell);
  }

  end() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    }
    super.end();
  }

  goNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    }
    super.goNotice();
  }

  backNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    }
    super.backNotice();
  }
}

export { TableCellDataProxy };
