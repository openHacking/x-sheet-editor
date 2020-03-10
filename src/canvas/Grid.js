import {dpr, floor} from './Draw';
import { Utils } from '../utils/Utils';

class Grid {
  constructor(draw, attr = {}) {
    this.draw = draw;
    this.color = '#000000';
    Utils.mergeDeep(this, attr);
  }

  lineWidth() {
    const n = floor(dpr());
    return n > 2 ? n : 1;
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

export { Grid };
