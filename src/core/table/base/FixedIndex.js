class FixedIndex {

  constructor(table, {
    height = 33,
    width = 50,
    background = '#f6f7fa',
    color = '#585757',
    size = 11,
  }) {
    this.table = table;
    this.height = height;
    this.width = width;
    this.background = background;
    this.color = color;
    this.size = size;
  }

  getBackground() {
    const { background } = this;
    return background;
  }

  getColor() {
    const { color } = this;
    return color;
  }

  getSize() {
    const { table } = this;
    const { scale } = table;
    const { size } = this;
    return scale.to(size);
  }

  getHeight() {
    const { table } = this;
    const { scale } = table;
    const { height } = this;
    return scale.to(height);
  }

  getWidth() {
    const { table } = this;
    const { scale } = table;
    const { width } = this;
    return scale.to(width);
  }

}

export { FixedIndex };
