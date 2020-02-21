class Rect {
  constructor({
    x, y, width, height,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  expandSize(size) {
    this.width += size;
    this.height += size;
    return this;
  }
}


export { Rect };
