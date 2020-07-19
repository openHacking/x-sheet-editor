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
    merges.getIncludes(merge, merge => this.deleteMerge(merge));
    merges.add(merge, false);
  }

  $deleteMerge(merge) {
    this.change = true;
    const { table } = this;
    const { merges } = table;
    merges.delete(merge);
  }

  deleteMerge(merge) {
    const { option } = this;
    const { on } = option;
    const { deleteMerge } = on;
    this.$deleteMerge(merge);
    deleteMerge(merge);
  }

  addMerge(merge) {
    const { option } = this;
    const { on } = option;
    const { addMerge } = on;
    this.$addMerge(merge);
    addMerge(merge);
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
