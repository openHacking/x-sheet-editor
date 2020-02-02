import { Rect } from './Rect';

class TextAttr extends Rect {
  constructor({
    x = 0,
    y = 0,
    width = 0,
    height = 0,
    padding = 5,
    leftBorder = null,
    topBorder = null,
    rightBorder = null,
    bottomBorder = null,
  } = {}) {
    super({
      x, y, width, height, leftBorder, topBorder, rightBorder, bottomBorder,
    });
    this.padding = padding;
  }

  innerWidth() {
    return this.width - this.padding;
  }

  innerHeight() {
    return this.height - this.padding;
  }
}

export { TextAttr };
