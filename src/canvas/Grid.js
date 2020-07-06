import { dpr } from './Draw';
import { Utils } from '../utils/Utils';

class Grid {

  constructor(draw, attr = {}) {
    this.draw = draw;
    this.color = '#000000';
    Utils.mergeDeep(this, attr);
  }

  lineWidth() {
    const width = Math.floor(dpr());
    return width > 2 ? width : 1;
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
    draw.fillRect(sx - width, sy, width, diff);
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
    draw.fillRect(sx, sy - width, diff, width);
  }
}

export { Grid };
