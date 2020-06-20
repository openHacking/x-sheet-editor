import { DataProxy } from './DataProxy';
import { Constant } from '../../../constant/Constant';

class TableColsDataProxy extends DataProxy {

  constructor(table, option = {
    on: { setWidth() {} },
  }) {
    super();
    this.table = table;
    this.option = option;
  }

  set(ci, width) {
    this.change = true;
    const { table } = this;
    const { cols } = table;
    cols.setWidth(ci, width);
  }

  setWidth(ci, newWidth) {
    const { option, table } = this;
    const { on } = option;
    const { setWidth } = on;
    const { cols } = table;
    const oldWidth = cols.getWidth(ci);
    setWidth(ci, oldWidth, newWidth);
    this.set(ci, newWidth);
  }

  end() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH);
    }
    super.end();
  }

  backNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH);
    }
    super.backNotice();
  }

  goNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH);
    }
    super.goNotice();
  }
}

export { TableColsDataProxy };
