import { DataProxy } from '../DataProxy';
import { Constant } from '../../../../const/Constant';

class TableRowsDataProxy extends DataProxy {

  constructor(snapshot, option = {
    on: {
      setHeight() {},
    },
  }) {
    super();
    this.snapshot = snapshot;
    this.option = option;
  }

  $setHeight(ri, height) {
    this.change = true;
    const { snapshot } = this;
    const { rows } = snapshot;
    rows.setHeight(ri, height);
  }

  setHeight(ri, newHeight) {
    const { option, snapshot } = this;
    const { on } = option;
    const { setHeight } = on;
    const { rows } = snapshot;
    const oldHeight = rows.getHeight(ri);
    this.$setHeight(ri, newHeight);
    setHeight(ri, oldHeight, newHeight);
  }

  goNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT);
    }
    super.goNotice();
  }

  endNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT);
    }
    super.endNotice();
  }

  backNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT);
    }
    super.backNotice();
  }
}

export { TableRowsDataProxy };
