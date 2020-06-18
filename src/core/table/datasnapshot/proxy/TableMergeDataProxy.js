class TableMergeDataProxy {

  constructor(table, option = {
    on: {
      addMerge() {},
      deleteMerge() {},
    },
  }) {
    this.table = table;
    this.option = option;
  }

  deleteMerge(merge) {
    const { option, table } = this;
    const { on } = option;
    const { deleteMerge } = on;
    const { merges } = table;
    deleteMerge(merge);
    merges.deleteIntersects(merge);
  }

  addMerge(merge) {
    const { option, table } = this;
    const { on } = option;
    const { addMerge } = on;
    const { merges } = table;
    addMerge(merge);
    merges.add(merge);
  }
}

export { TableMergeDataProxy };
