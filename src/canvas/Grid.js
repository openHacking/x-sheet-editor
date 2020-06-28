import { dpr } from './Draw';
import { Utils } from '../utils/Utils';

const GRID_MODE = {
  INNER: 1,
  OUTER: 2,
};

class Grid {

  constructor(draw, attr = {}) {
    this.mode = GRID_MODE.INNER;
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
    if (this.mode === GRID_MODE.INNER) {
      draw.fillRect(sx - width, sy, width, diff);
    } else {
      draw.fillRect(sx, sy, width, diff);
    }
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
    if (this.mode === GRID_MODE.INNER) {
      draw.fillRect(sx, sy - width, diff, width);
    } else {
      draw.fillRect(sx, sy, diff, width);
    }
  }
}

export { Grid };
