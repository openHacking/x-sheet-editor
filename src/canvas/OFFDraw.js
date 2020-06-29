/* global document */
import { Draw } from './Draw';

class OFFDraw {

  constructor(origin) {
    this.origin = origin;
    this.draw = new Draw(document.createElement('canvas'));
  }

  fullColor(hash = '#ffffff') {
    const { draw } = this;
    const { width, height } = draw;
    draw.attr({ fillStyle: hash });
    draw.fillRect(0, 0, width, height);
  }

  resize(width, height) {
    const { draw } = this;
    draw.resize(width, height);
  }

  mapping(sx, sy, sw, sh) {
    const { origin, draw } = this;
    draw.drawImage(origin.el, sx, sy, sw, sh, 0, 0, sw, sh);
  }

  reflection(tx, ty, tw, th) {
    const { origin, draw } = this;
    origin.drawImage(draw.el, 0, 0, tw, th, tx, ty, tw, th);
  }

}

export { OFFDraw };
