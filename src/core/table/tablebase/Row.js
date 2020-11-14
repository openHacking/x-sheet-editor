class Row {

  constructor(row, {
    height = 30,
  } = {}) {
    this.hasAngelCell = false;
    this.renderId = -1;
    this.row = row;
    this.height = height;
  }

  setRenderId(renderId) {
    this.renderId = renderId;
  }

  setHasAngelCell(exist) {
    this.hasAngelCell = exist;
  }

}

export {
  Row,
};
