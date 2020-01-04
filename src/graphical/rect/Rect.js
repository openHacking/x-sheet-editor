class Rect {
  constructor({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    leftBorder = null,
    topBorder = null,
    rightBorder = null,
    bottomBorder = null,
  } = {}) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.leftBorder = leftBorder;
    this.topBorder = topBorder;
    this.rightBorder = rightBorder;
    this.bottomBorder = bottomBorder;
  }

  clone() {
    const {
      x, y, width, height,
      leftBorder, topBorder, rightBorder, bottomBorder,
    } = this;
    return new Rect({
      x,
      y,
      width,
      height,
      leftBorder,
      topBorder,
      rightBorder,
      bottomBorder,
    });
  }
}

export { Rect };
