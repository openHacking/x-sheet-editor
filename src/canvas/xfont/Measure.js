import { BaseFont } from '../font/BaseFont';

class Measure {

  constructor({
    xDraw, align, padding,
  }) {
    this.xDraw = xDraw;
    this.align = align;
    this.padding = padding;
  }

  measureText() {
    throw new TypeError('child impl');
  }

  alignPadding() {
    const { align, padding } = this;
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

  textWidth(text) {
    return this.xDraw.measureText(text).width;
  }

  textBreak(text) {
    return text.split(/\n/);
  }

}

export {
  Measure,
};
