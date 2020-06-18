class TableCellDataProxy {

  constructor(table, option = {
    on: {
      setCell() {},
    },
  }) {
    this.table = table;
    this.option = option;
  }

  setCell(ri, ci, newCell) {
    const { option, table } = this;
    const { on } = option;
    const { setCell } = on;
    const { cells } = table;
    const oldCell = cells.getCell(ri, ci);
    setCell(ri, ci, oldCell, newCell);
    cells.setCellOrNew(ri, ci, newCell);
  }
}

export { TableCellDataProxy };
