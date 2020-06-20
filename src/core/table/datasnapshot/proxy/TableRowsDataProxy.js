import { DataProxy } from './DataProxy';
import { Constant } from '../../../constant/Constant';

class TableRowsDataProxy extends DataProxy {

  constructor(table, option = {
    on: {
      setHeight() {},
    },
  }) {
    super();
    this.table = table;
    this.option = option;
  }

  set(ri, height) {
    this.change = true;
    const { table } = this;
    const { rows } = table;
    rows.setHeight(ri, height);
  }

  setHeight(ri, newHeight) {
    const { option, table } = this;
    const { on } = option;
    const { setHeight } = on;
    const { rows } = table;
    const oldHeight = rows.getHeight(ri);
    setHeight(ri, oldHeight, newHeight);
    this.set(ri, newHeight);
  }

  end() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
    }
    super.end();
  }

  backNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
    }
    super.backNotice();
  }

  goNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
    }
    super.goNotice();
  }
}

export { TableRowsDataProxy };
