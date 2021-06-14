import { BaseRich } from '../BaseRich';

class RichHorizonDraw extends BaseRich {

  constructor({
    draw, ruler, rect, overflow, lineHeight = 4, attr,
  }) {
    super({
      draw, ruler, attr,
    });
    this.overflow = overflow;
    this.rect = rect;
    this.lineHeight = lineHeight;
  }


  drawingFont() {}

  drawingLine(type, tx, ty, textWidth, textHeight) {}

  truncateDraw() {}

  overflowDraw() {}

  textWrapDraw() {}

}

export {
  RichHorizonDraw,
};
