class CacheHeightItems {

  constructor() {
    this.items = [];
  }

  clear() {
    this.items = [];
  }

  get(sri, eri) {
    const line = this.items[sri] || [];
    return line[eri];
  }

  add(sri, eri, height) {
    const line = this.items[sri] || [];
    line[eri] = height;
    this.items[sri] = line;
  }

}

export {
  CacheHeightItems,
};
