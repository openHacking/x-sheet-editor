import { DataProxy } from '../DataProxy';
import { Constant } from '../../../../const/Constant';

class TableMergeDataProxy extends DataProxy {

  constructor(table, option = {
    on: {
      addMerge() {}, deleteMerge() {},
    },
  }) {
    super();
    this.table = table;
    this.option = option;
  }

  $addMerge(merge) {
    this.change = true;
    const { table } = this;
    const { merges } = table;
    return merges.add(merge);
  }

  $deleteMerge(index) {
    this.change = true;
    const { table } = this;
    const { merges } = table;
    return merges.delete(index);
  }

  deleteMerge(index) {
    const { option } = this;
    const { on } = option;
    const { deleteMerge } = on;
    const merge = this.$deleteMerge(index);
    deleteMerge(merge);
  }

  addMerge(merge) {
    const { option } = this;
    const { on } = option;
    const { addMerge } = on;
    const index = this.$addMerge(merge);
    addMerge(index);
  }

  endNotice() {
    const { table } = this;
    if (this.change) {
      table.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    }
    super.endNotice();
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

export { TableMergeDataProxy };
