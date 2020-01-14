class History {
  constructor(table) {
    this.table = table;
    this._ = [];
  }

  add(data) {
    this._.push(data);
  }

  pop() {
    this._.pop();
  }

  isEmpty() {
    return this._.length === 0;
  }
}

export { History };
