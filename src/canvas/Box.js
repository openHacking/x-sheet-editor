class Box {
  constructor({ rect, draw }) {
    this.draw = draw;
    this.rect = rect;
    this.backgroundColor = null;
  }

  drawBackgroundColor(color) {
    if (color) {
      this.backgroundColor = color;
      if (color) {
        const { draw, rect } = this;
        draw.attr({
          fillStyle: color,
        });
        draw.fillRect(rect.x, rect.y, rect.width, rect.height);
      }
    }
  }
}

export { Box };
