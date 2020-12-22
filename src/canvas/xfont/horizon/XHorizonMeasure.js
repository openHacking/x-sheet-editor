import { XBasicTextMeasure } from '../XBasicTextMeasure';
import { BaseFont } from '../../font/BaseFont';
import { PlainUtils } from '../../../utils/PlainUtils';

class XBasicHorizonMeasure extends XBasicTextMeasure {

  constructor({
    draw, text, size, rect, align, overflow, verticalAlign, lineHeight,
  }) {
    super({ draw });
    this.text = text;
    this.size = size;
    this.rect = rect;
    this.align = align;
    this.overflow = overflow;
    this.verticalAlign = verticalAlign;
    this.lineHeight = lineHeight;
  }

  visibleText(rect) {
    const { align } = this;
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
          const len = this.measureText(str);
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
          text: origin, textWidth: this.measureText(origin),
        };
      }
      case BaseFont.ALIGN.right: {
        let start = length - 1;
        let text = PlainUtils.EMPTY;
        let textWidth = 0;
        while (start >= 0) {
          const str = origin.charAt(start) + text;
          const len = this.measureText(str);
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

class XHorizonMeasure extends XBasicHorizonMeasure {

  constructor({
    draw, text, size, rect, align, overflow, verticalAlign, lineHeight = 4,
  } = {}) {
    super({
      draw, text, size, rect, align, overflow, verticalAlign, lineHeight,
    });
    // 是否已经测量
    this.used = false;
    // 截断文本测量
    this.truncateText = PlainUtils.EMPTY;
    this.truncateWidth = 0;
    // 溢出文本测量
    this.overflowText = PlainUtils.EMPTY;
    this.overflowWidth = 0;
    // 自动文本换行测量
    this.wrappingText = [];
    this.wrappingHeight = 0;
  }

  truncateMeasure() {
    if (this.used) {
      return;
    }
    const { rect } = this;
    const { text, textWidth } = this.displayFont(rect);
    this.truncateText = text;
    this.truncateWidth = textWidth;
    this.used = true;
  }

  overflowMeasure() {
    if (this.used) {
      return;
    }
    const { overflow } = this;
    const { text, textWidth } = this.displayFont(overflow);
    this.truncateText = text;
    this.truncateWidth = textWidth;
    this.used = true;
  }

  wrapTextMeasure() {

  }

}

export {
  XHorizonMeasure,
};
