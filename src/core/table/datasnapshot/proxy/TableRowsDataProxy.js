import { DataProxy } from '../DataProxy';
import { Constant } from '../../../../const/Constant';

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

  $setHeight(ri, height) {
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
    this.$setHeight(ri, newHeight);
    setHeight(ri, oldHeight, newHeight);
  }

  endNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
    }
    super.endNotice();
  }

  backNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
    }
    super.backNotice();
  }

  goNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
    }
    super.goNotice();
  }
}

export { TableRowsDataProxy };
