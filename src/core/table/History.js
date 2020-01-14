class History {
  constructor(table) {
    this.table = table;
    this.data = [];
  }

  add(data) {
    this.data.push(data);
  }

  pop() {
    this.data.pop();
  }
}

export { History };
