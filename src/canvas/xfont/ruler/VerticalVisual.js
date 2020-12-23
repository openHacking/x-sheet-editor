import { BaseRuler } from '../BaseRuler';
import { BaseFont } from '../BaseFont';

class VerticalVisual extends BaseRuler {

  constructor({
    draw, verticalAlign, padding,
  }) {
    super({ draw });
    this.verticalAlign = verticalAlign;
    this.padding = padding;
  }

  getVerticalAlignPadding() {
    if (this.verticalAlign === BaseFont.VERTICAL_ALIGN.center) {
      return 0;
    }
    return this.padding;
  }

}

export {
  VerticalVisual,
};
