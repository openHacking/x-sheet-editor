import { BaseFont } from '../../../canvas/font/BaseFont';

let tableCols = null;
let xTable = null;
let tableCells = null;

class Row {

  static seTableCols(cols) {
    tableCols = cols;
  }

  static setXTable(table) {
    xTable = table;
  }

  static setTableCells(cells) {
    tableCells = cells;
  }

  constructor(row, {
    height = 30,
  } = {}) {
    this.existAngelCell = false;
    this.row = row;
    this.height = height;
    this.renderId = -1;
  }

  hasAngleCell() {
    const { renderId } = xTable;
    if (renderId === this.renderId) {
      return this.existAngelCell;
    }
    const { len } = tableCols;
    const { row } = this;
    let existAngelCell = false;
    for (let i = 0; i < len; i += 1) {
      const cell = tableCells.getCell(row, i);
      if (cell) {
        const { fontAttr } = cell;
        const { direction } = fontAttr;
        if (direction === BaseFont.TEXT_DIRECTION.ANGLE) {
          existAngelCell = true;
          break;
        }
      }
    }
    this.existAngelCell = existAngelCell;
    this.renderId = renderId;
    return existAngelCell;
  }

}

export {
  Row,
};
