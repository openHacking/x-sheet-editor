import { DataProxy } from '../DataProxy';
import { Constant } from '../../../../const/Constant';

class TableColsWidthDataProxy extends DataProxy {

  constructor(snapshot, option = {
    on: { setWidth() {} },
  }) {
    super();
    this.snapshot = snapshot;
    this.option = option;
  }

  $setWidth(ci, width) {
    this.change = true;
    const { snapshot } = this;
    const { cols } = snapshot;
    cols.setWidth(ci, width);
  }

  setWidth(ci, newWidth) {
    const { option, snapshot } = this;
    const { on } = option;
    const { setWidth } = on;
    const { cols } = snapshot;
    const oldWidth = cols.getWidth(ci);
    this.$setWidth(ci, newWidth);
    setWidth(ci, oldWidth, newWidth);
  }

  goNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH);
    }
    super.goNotice();
  }

  endNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH);
    }
    super.endNotice();
  }

  backNotice() {
    const { snapshot } = this;
    const { table } = snapshot;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      table.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH);
    }
    super.backNotice();
  }

}

export { TableColsWidthDataProxy };
