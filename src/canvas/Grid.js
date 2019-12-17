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
    this.draw.line(...xys);
    return this;
  }
}

export { Grid };
