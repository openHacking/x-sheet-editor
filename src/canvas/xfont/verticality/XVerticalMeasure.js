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
    this.truncateHeight = 0;
    // 多行文本
    this.wrappingText = [];
    this.wrappingWidth = 0;
    this.wrappingHeight = 0;
  }

  truncateMeasure() {
    if (this.used) { return; }
    const { text, size, spacing } = this;
    const textArray = [];
    const textLen = text.length;
    let maxLen = 0;
    let hOffset = 0;
    let ii = 0;
    while (ii < textLen) {
      const char = text.charAt(ii);
      const width = this.textWidth(char);
      textArray.push({
        len: width,
        text: char,
        tx: size / 2 - width / 2,
        ty: hOffset,
      });
      hOffset += size + spacing;
      ii += 1;
    }
    if (hOffset > 0) {
      hOffset -= spacing;
    }
    if (hOffset > maxLen) {
      maxLen = hOffset;
    }
    this.truncateText = textArray;
    this.truncateHeight = hOffset;
    this.used = XMeasure.USED.TRUNCATE;
  }

  overflowMeasure() {
    this.truncateMeasure();
  }

  wrapTextMeasure() {
    if (this.used) { return; }
    const { text, size, rect, spacing, lineHeight } = this;
    const { height } = rect;
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const breakArray = this.textBreak(text);
    const textArray = [];
    const maxHeight = height - (verticalAlignPadding * 2);
    const breakLen = breakArray.length;
    let maxLen = 0;
    let wOffset = 0;
    let bi = 0;
    while (bi < breakLen) {
      const text = breakArray[bi];
      const textLen = text.length;
      let hOffset = 0;
      let ii = 0;
      while (ii < textLen) {
        const char = text.charAt(ii);
        const width = this.textWidth(char);
        const item = {
          len: width,
          text: char,
          tx: wOffset + (size / 2 - width / 2),
          ty: hOffset,
        };
        textArray.push(item);
        if (hOffset + size > maxHeight) {
          if (hOffset > maxLen) {
            maxLen = hOffset - spacing;
          }
          wOffset += size + lineHeight;
          hOffset = 0;
          item.tx = wOffset + (size / 2 - width / 2);
          item.ty = hOffset;
        }
        hOffset += size + spacing;
        ii += 1;
      }
      if (hOffset > maxLen) {
        maxLen = hOffset - spacing;
      }
      wOffset += size;
      bi += 1;
    }
    this.wrappingText = textArray;
    this.wrappingWidth = wOffset;
    this.wrappingHeight = maxLen;
    this.used = XMeasure.USED.TEXT_WRAP;
  }

}

export {
  XVerticalDrawFont,
};
