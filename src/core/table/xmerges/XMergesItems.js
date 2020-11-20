class XMergesItems {

  constructor() {
    this.items = [];
  }

  splice(s, e = 1) {
    return this.items.splice(s, e);
  }

  get(point) {
    return this.items[point];
  }

  add(item) {
    this.items.push(item);
    return this.items.length - 1;
  }

}

export {
  XMergesItems,
};
