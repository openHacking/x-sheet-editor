class Box {

  constructor({
    rect, draw, path, background,
  }) {
    this.draw = draw;
    this.path = path;
    this.rect = rect;
    this.background = background;
  }

  setPath({
    path,
  }) {
    this.path = path;
    return this;
  }

  setRect({
    rect,
  }) {
    this.rect = rect;
    return this;
  }

  setBackground({
    color,
  }) {
    this.background = color;
    return this;
  }

  render() {
    const { draw, rect, path, background } = this;
    if (rect && background) {
      draw.attr({
        fillStyle: background,
      });
      draw.fillRect(rect.x, rect.y, rect.width, rect.height);
      return this;
    }
    if (path && background) {
      draw.attr({
        fillStyle: background,
      });
      draw.fillPath(path);
    }
    return this;
  }

}

export { Box };
