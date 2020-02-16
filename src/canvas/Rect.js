class Rect {
  constructor({
    x, y, width, height,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  cohesion(offset) {
    this.x += offset;
    this.y += offset;
    this.width -= offset * 2;
    this.height -= offset * 2;
    return this;
  }

  expansion(offset) {
    this.x -= offset;
    this.y -= offset;
    this.width += offset * 2;
    this.height += offset * 2;
    return this;
  }
}


export { Rect };
