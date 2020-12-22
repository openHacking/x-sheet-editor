import { XMeasure } from '../XMeasure';
import { BaseFont } from '../../font/BaseFont';

class XBaseTextMeasure extends XMeasure {

  constructor({
    draw, text, align, padding,
  }) {
    super({ draw, padding });
    this.text = text;
    this.align = align;
  }

  visibleText(rect) {
    const { align } = this;
    const maxWidth = rect.width - this.getAlignPadding();
    const origin = this.text;
    const length = origin.length;
    switch (align) {
      case BaseFont.ALIGN.left: {
        let text = '';
        let textWidth = 0;
        let start = 0;
        while (start < length) {
          const str = text + origin.charAt(start);
          const len = this.measureText(str);
          if (len >= maxWidth) {
            break;
          }
          text = str;
          textWidth = len;
          start += 1;
        }
        return {
          text, textWidth,
        };
      }
      case BaseFont.ALIGN.center: {
        return {
          text: origin, textWidth: this.measureText(origin),
        };
      }
      case BaseFont.ALIGN.right: {
        let start = length - 1;
        let text = '';
        let textWidth = 0;
        while (start >= 0) {
          const str = origin.charAt(start) + text;
          const len = this.measureText(str);
          if (len >= maxWidth) {
            break;
          }
          text = str;
          textWidth = len;
          start -= 1;
        }
        return {
          text, textWidth,
        };
      }
    }
    return {
      text: '',
      textWidth: 0,
    };
  }

  getAlignPadding() {
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

}

export {
  XBaseTextMeasure,
};
