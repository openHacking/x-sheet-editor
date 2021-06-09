class CacheWidthItems {

  constructor() {
    this.items = [];
  }

  clear() {
    this.items = [];
  }

  get(sci, eci) {
    const line = this.items[sci] || [];
    return line[eci];
  }

  add(sci, eci, width) {
    const line = this.items[sci] || [];
    line[eci] = width;
    this.items[sci] = line;
  }

}

export {
  CacheWidthItems,
};
