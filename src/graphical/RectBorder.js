class RectBorder {
  constructor({
    width = 0, color = '#000000',
  } = {}) {
    this.width = width;
    this.color = color;
  }

  clone() {
    const { width, color } = this;
    return new RectBorder({ width, color });
  }
}

export { RectBorder };
