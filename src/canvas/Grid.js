import { Utils } from '../utils/Utils';

class Grid {

  constructor(draw, attr = {}) {
    this.draw = draw;
    this.color = '#000000';
    Utils.mergeDeep(this, attr);
  }

  horizontalLine(sx, sy, ex, ey) {
    if (sy !== ey) {
      throw new Error('coordinate errors sy should be equal to ey !!!');
    }
    const { draw, color } = this;
    draw.attr({
      strokeStyle: color,
      lineWidth: 1,
    });
    draw.line([sx, sy], [ex, ey]);
  }

  verticalLine(sx, sy, ex, ey) {
    if (sx !== ex) {
      throw new Error('coordinate errors sx should be equal to ex !!!');
    }
    const { draw, color } = this;
    draw.attr({
      strokeStyle: color,
      lineWidth: 1,
    });
    draw.line([sx, sy], [ex, ey]);
  }
}

export { Grid };
