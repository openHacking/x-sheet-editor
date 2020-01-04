class RectDraw {
  constructor(draw, rect) {
    this.draw = draw;
    this.rect = rect;
  }

  border() {
    const { draw, rect } = this;
    const {
      leftBorder, topBorder, rightBorder, bottomBorder,
    } = rect;
    // left
    draw.save();
    draw.attr({
      strokeStyle: leftBorder.color,
      lineWidth: leftBorder.width,
    });
    draw.line([rect.x, rect.y], [rect.x, rect.y + rect.height]);
    draw.restore();
    // top
    draw.save();
    draw.attr({
      strokeStyle: topBorder.color,
      lineWidth: topBorder.width,
    });
    draw.line([rect.x, rect.y], [rect.x + rect.width, rect.y]);
    draw.restore();
    // right
    draw.save();
    draw.attr({
      strokeStyle: rightBorder.color,
      lineWidth: rightBorder.width,
    });
    draw.line([rect.x + rect.width, rect.y], [rect.x + rect.width, rect.y + rect.height]);
    draw.restore();
    // bottom
    draw.save();
    draw.attr({
      strokeStyle: bottomBorder.color,
      lineWidth: bottomBorder.width,
    });
    draw.line([rect.x, rect.y + rect.height], [rect.x + rect.width, rect.y + rect.height]);
    draw.restore();
  }

  setRect(rect) {
    this.rect = rect;
  }

  fill(color = '#000000') {
    const { draw, rect } = this;
    draw.save();
    draw.rect(rect.x, rect.y, rect.width, rect.height);
    draw.attr({
      fillStyle: color,
    });
    draw.fill();
    draw.restore();
  }
}

export { RectDraw };
