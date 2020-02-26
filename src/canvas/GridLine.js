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

  verticalLine(sx, sy, ex, ey) {
    if (sx !== ex) {
      throw new Error('coordinate errors sx should be equal to ex !!!');
    }
    const { draw, color } = this;
    const width = this.lineWidth();
    draw.attr({
      fillStyle: color,
    });
    const diff = ey - sy;
    draw.fillRect(sx, sy, width, diff);
  }

  horizontalLine(sx, sy, ex, ey) {
    if (sy !== ey) {
      throw new Error('coordinate errors sy should be equal to ey !!!');
    }
    const { draw, color } = this;
    const width = this.lineWidth();
    draw.attr({
      fillStyle: color,
    });
    const diff = ex - sx;
    draw.fillRect(sx, sy, diff, width);
  }
}

export { GridLine };
