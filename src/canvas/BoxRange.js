class BoxRange {
  constructor(x = 0, y = 0, width = 0, height = 0, padding = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.padding = padding;
  }

  innerWidth() {
    return this.width - (this.padding * 2);
  }

  innerHeight() {
    return this.height - (this.padding * 2);
  }
}

export { BoxRange };
