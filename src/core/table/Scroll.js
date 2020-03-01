class Scroll {

  constructor(table) {
    this.table = table;
    this.x = 0; // left
    this.y = 0; // top
    this.ri = table.fixed.fxTop + 1; // cell row-index
    this.ci = table.fixed.fxLeft + 1; // cell col-index
  }
}

export { Scroll };
