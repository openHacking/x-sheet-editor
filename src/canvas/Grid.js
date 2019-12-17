import { thinLineWidth } from './Draw';

class Grid {
  constructor(draw) {
    this.draw = draw;
    this.style = {
      fillStyle: '#fff',
      lineWidth: thinLineWidth,
      strokeStyle: '#e6e6e6',
    };
    draw.attr(this.style);
  }

  line(...xys) {
    const { ctx, npxLine } = this.draw;
    if (xys.length > 1) {
      const [x, y] = xys[0];
      ctx.moveTo(npxLine(x), npxLine(y));
      for (let i = 1, len = xys.length; i < len; i += 1) {
        const [x1, y1] = xys[i];
        ctx.lineTo(npxLine(x1), npxLine(y1));
      }
      ctx.stroke();
    }
    return this;
  }
}

export { Grid };
