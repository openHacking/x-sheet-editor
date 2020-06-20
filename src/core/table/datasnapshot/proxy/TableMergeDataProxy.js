import { DataProxy } from '../DataProxy';

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
    merges.add(merge);
  }

  $deleteMerge(merge) {
    this.change = true;
    const { table } = this;
    const { merges } = table;
    merges.deleteIntersects(merge);
  }

  deleteMerge(merge) {
    const { option } = this;
    const { on } = option;
    const { deleteMerge } = on;
    deleteMerge(merge);
    this.$deleteMerge(merge);
  }

  addMerge(merge) {
    const { option } = this;
    const { on } = option;
    const { addMerge } = on;
    addMerge(merge);
    this.$addMerge(merge);
  }
}

export { TableMergeDataProxy };
