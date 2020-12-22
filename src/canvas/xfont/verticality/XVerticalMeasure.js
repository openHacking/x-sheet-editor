import { XBaseTextMeasure } from './XBaseTextMeasure';
import { XMeasure } from '../XMeasure';

class XVerticalDrawFont extends XBaseTextMeasure {

  constructor({
    draw, text, size, rect, verticalAlign, padding, spacing = 2, lineHeight = 4,
  } = {}) {
    super({
      draw, text, size, verticalAlign, padding,
    });
    // 基本属性
    this.used = XMeasure.USED.DEFAULT_INI;
    this.rect = rect;
    this.verticalAlign = verticalAlign;
    this.spacing = spacing;
    this.lineHeight = lineHeight;
    // 截断文本
    this.truncateText = [];
    this.truncateWidth = 0;
    // 溢出文本
    this.overflowText = [];
    this.overflowWidth = 0;
    // 多行文本
    this.wrappingText = [];
    this.wrappingHeight = 0;
  }

  truncateMeasure() {
    const { rect, size, spacing } = this;
    const { text } = this.visibleText(rect);
    const length = text.length;
    const truncateText = [];
    let truncateWidth = 0;
    let hOffset = 0;
    let index = 0;
    while (index < length) {
      const char = text.charAt(index);
      const width = this.measureText(char);
      truncateText.push({
        len: width,
        text: char,
        tx: size / 2 - width / 2,
        ty: hOffset,
      });
      hOffset += size + spacing;
      index += 1;
    }
    if (hOffset > 0) {
      hOffset -= spacing;
    }
    if (hOffset > truncateWidth) {
      truncateWidth = hOffset;
    }
    this.truncateText = truncateText;
    this.truncateWidth = truncateWidth;
    this.used = XMeasure.USED.TRUNCATE;
  }

  overflowMeasure() {}

  wrapTextMeasure() {}

}

export {
  XVerticalDrawFont,
};
