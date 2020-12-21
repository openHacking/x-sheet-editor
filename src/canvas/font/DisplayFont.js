import { BaseFont } from './BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';

class DisplayFont extends BaseFont {

  displayFont(rect) {
    const { attr } = this;
    const { align } = attr;
    const { width } = rect;
    const origin = this.text;
    const length = origin.length;
    switch (align) {
      case BaseFont.ALIGN.left: {
        let text = PlainUtils.EMPTY;
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
        let text = PlainUtils.EMPTY;
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
      text: PlainUtils.EMPTY,
      textWidth: 0,
    };
  }

}

export {
  DisplayFont,
};
