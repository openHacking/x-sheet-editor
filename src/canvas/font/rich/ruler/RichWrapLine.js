class RichWrapLine {

  constructor() {
    this.index = 0;
    this.items = [];
    this.width = 0;
    this.height = 0;
  }

  increase() {
    if (this.items.length) {
      this.index++;
    } else {
      this.index = 0;
    }
  }

  reset() {
    this.index = 0;
    this.items = [];
    this.width = 0;
    this.height = 0;
  }

  getOrNew(options) {
    const item = this.items[this.index];
    if (item) {
      return item;
    }
    this.items[this.index] = { ...options };
    return this.items[this.index];
  }

}

export {
  RichWrapLine,
};
