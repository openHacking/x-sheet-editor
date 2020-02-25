import { dpr } from './Draw';

class GridLine {
  constructor({ draw, color }) {
    this.draw = draw;
    this.color = color;
  }

  lineWidth() {
    const width = Math.floor(dpr());
    return width < 1 ? 1 : width;
  }

  verticalLine(x, sy, ey) {
    const { draw, color } = this;
    const width = this.lineWidth();
    draw.attr({
      fillStyle: color,
    });
    const diff = ey - sy;
    draw.fillRect(x, sy, width, diff);
  }

  horizontalLine(y, sx, ex) {
    const { draw, color } = this;
    const width = this.lineWidth();
    draw.attr({
      fillStyle: color,
    });
    const diff = ex - sx;
    draw.fillRect(sx, y, diff, width);
  }
}

export { GridLine };
