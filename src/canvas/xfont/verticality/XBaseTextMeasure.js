import { XMeasure } from '../XMeasure';
import { BaseFont } from '../../font/BaseFont';

class XBaseTextMeasure extends XMeasure {

  constructor({
    draw, text, size, verticalAlign, padding,
  }) {
    super({ draw, padding });
    this.text = text;
    this.size = size;
    this.verticalAlign = verticalAlign;
  }

  visibleText(rect) {
    const { verticalAlign, size } = this;
    const maxHeight = rect.height - this.getVerticalAlignPadding();
    const origin = this.text;
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top: {
        const index = Math.ceil(maxHeight / size);
        return {
          text: origin.substring(0, index),
          textWidth: index * size,
        };
      }
      case BaseFont.VERTICAL_ALIGN.center: {
        return {
          text: origin,
          textWidth: size * origin.length,
        };
      }
      case BaseFont.VERTICAL_ALIGN.bottom: {
        const index = Math.ceil(maxHeight / size);
        return {
          text: origin.substring(origin.length - index - 1, origin.length),
          textWidth: index * size,
        };
      }
    }
    return {
      text: '',
      textWidth: 0,
    };
  }

  getVerticalAlignPadding() {
    const { verticalAlign, padding } = this;
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
  XBaseTextMeasure,
};
