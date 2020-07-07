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

  $deleteMerge(index) {
    this.change = true;
    const { table } = this;
    const { merges } = table;
    merges.delete(index);
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
}

export { TableMergeDataProxy };
