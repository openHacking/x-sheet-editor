class MousePointType {
  constructor(table) {
    this.table = table;
    this.switch = false;
    this.ignoreNames = [];
  }

  on(ignoredNames) {
    this.switch = true;
    this.ignoreNames = this.ignoreNames.concat(ignoredNames);
  }

  set(type, name) {
    if (this.switch && this.ignoreNames.indexOf(name) === -1) return;
    const { table } = this;
    table.css('cursor', type);
  }

  off() {
    this.switch = false;
    this.ignoreNames = [];
  }
}

export { MousePointType };
