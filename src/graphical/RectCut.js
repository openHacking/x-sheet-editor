import { RectDraw } from './RectDraw';

class RectCut extends RectDraw {
  outwardCut(offset = 0.5) {
    const { draw, rect } = this;
    const [x, y, width, height] = [
      rect.x - offset,
      rect.y - offset,
      rect.width + offset * 2,
      rect.height + offset * 2,
    ];
    draw.save();
    draw.attr({
      fillStyle: 'transparent',
    });
    draw.rect(x, y, width, height);
    draw.clip();
  }

  closeCut() {
    const { draw } = this;
    draw.restore();
  }
}

export { RectCut };
