class Rect {
  constructor({
    x, y, width, height,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  cohesionLocation(offset) {
    this.x -= offset;
    this.y -= offset;
    return this;
  }

  cohesionSize(offset) {
    this.width -= offset;
    this.height -= offset;
    return this;
  }

  cohesion(offset) {
    this.x += offset;
    this.y += offset;
    this.width -= offset;
    this.height -= offset;
    return this;
  }

  expansionLocation(offset) {
    this.x -= offset;
    this.y -= offset;
    return this;
  }

  expansionSize(offset) {
    this.width += offset;
    this.height += offset;
    return this;
  }

  expansion(offset) {
    this.x -= offset;
    this.y -= offset;
    this.width += offset;
    this.height += offset;
    return this;
  }
}


export { Rect };
