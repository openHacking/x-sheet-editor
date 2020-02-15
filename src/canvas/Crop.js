class Crop {
  constructor({
    rect, draw, offset = 0,
  }) {
    this.rect = rect;
    this.draw = draw;
    this.offset = offset;
  }

  open() {
    const { rect, draw, offset } = this;
    const {
      x, y, width, height,
    } = rect;
    draw.save();
    draw.rect(x - offset, y - offset, width + offset * 2, height + offset * 2);
    draw.clip();
  }

  close() {
    const { draw } = this;
    draw.restore();
  }
}

export { Crop };
