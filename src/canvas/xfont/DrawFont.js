import { BaseFont } from '../font/BaseFont';

class DrawFont {

  constructor({
    xDraw, attr,
  }) {
    this.xDraw = xDraw;
    this.attr = attr;
  }

  alignPadding() {
    const { attr } = this;
    const { align, padding } = attr;
    switch (align) {
      case BaseFont.ALIGN.left:
        return padding;
      case BaseFont.ALIGN.center:
        return 0;
      case BaseFont.ALIGN.right:
        return padding;
    }
    return 0;
  }

  verticalAlignPadding() {
    const { attr } = this;
    const { verticalAlign, padding } = attr;
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        return padding;
      case BaseFont.VERTICAL_ALIGN.center:
        return 0;
      case BaseFont.VERTICAL_ALIGN.bottom:
        return padding;
    }
    return 0;
  }

}

export {
  DrawFont,
};
