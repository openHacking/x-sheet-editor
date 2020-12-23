import { BaseRuler } from '../BaseRuler';
import { BaseFont } from '../BaseFont';

class HorizonVisual extends BaseRuler {

  constructor({
    draw, align, padding,
  }) {
    super({ draw });
    this.align = align;
    this.padding = padding;
  }

  displayFont(rect) {
    const { align } = this;
    const { width } = rect;
    const origin = this.text;
    const length = origin.length;
    switch (align) {
      case BaseFont.ALIGN.left: {
        let text = '';
        let textWidth = 0;
        let start = 0;
        while (start < length) {
          const str = text + origin.charAt(start);
          const len = this.textWidth(str);
          if (len >= width) {
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
          text: origin, textWidth: this.textWidth(origin),
        };
      }
      case BaseFont.ALIGN.right: {
        let start = length - 1;
        let text = '';
        let textWidth = 0;
        while (start >= 0) {
          const str = origin.charAt(start) + text;
          const len = this.textWidth(str);
          if (len >= width) {
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
    if (this.align === BaseFont.ALIGN.center) {
      return 0;
    }
    return this.padding;
  }

}

export {
  HorizonVisual,
};
