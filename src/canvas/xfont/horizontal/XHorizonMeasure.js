import { XBaseTextMeasure } from './XBaseTextMeasure';
import { XMeasure } from '../XMeasure';

class XHorizonMeasure extends XBaseTextMeasure {

  constructor({
    draw, text, size, rect, align, overflow, lineHeight = 4, padding,
  } = {}) {
    super({
      draw, text, align, padding,
    });
    // 基本属性
    this.used = XMeasure.USED.DEFAULT_INI;
    this.size = size;
    this.rect = rect;
    this.overflow = overflow;
    this.lineHeight = lineHeight;
    // 截断文本
    this.truncateText = '';
    this.truncateWidth = 0;
    // 溢出文本
    this.overflowText = '';
    this.overflowWidth = 0;
    // 多行文本
    this.wrappingText = [];
    this.wrappingHeight = 0;
  }

  truncateMeasure() {
    if (this.used) { return; }
    const { rect } = this;
    const { text, textWidth } = this.visibleText(rect);
    this.truncateText = text;
    this.truncateWidth = textWidth;
    this.used = XMeasure.USED.TRUNCATE;
  }

  overflowMeasure() {
    if (this.used) { return; }
    const { overflow } = this;
    const { text, textWidth } = this.visibleText(overflow);
    this.truncateText = text;
    this.truncateWidth = textWidth;
    this.used = XMeasure.USED.OVERFLOW;
  }

  wrapTextMeasure() {
    if (this.used) { return; }
    const { text, rect, size, lineHeight } = this;
    const alignPadding = this.getAlignPadding();
    const textWrapBlock = this.textWrapBlock(text);
    const length = textWrapBlock.length;
    const maxWidth = rect.width - (alignPadding * 2);
    const wrappingText = [];
    let wrappingHeight = 0;
    let blockIndex = 0;
    while (blockIndex < length) {
      if (blockIndex > 0) {
        wrappingHeight += size + lineHeight;
      }
      const text = textWrapBlock[blockIndex];
      const length = text.length;
      let ii = 0;
      const line = {
        str: '',
        len: 0,
        start: 0,
      };
      while (ii < length) {
        const str = line.str + text.charAt(ii);
        const len = this.textWidth(str);
        if (len > maxWidth) {
          if (line.len === 0) {
            wrappingText.push({
              text: str,
              len,
              tx: 0,
              ty: wrappingHeight,
            });
            ii += 1;
          } else {
            wrappingText.push({
              text: line.str,
              len: line.len,
              tx: 0,
              ty: wrappingHeight,
            });
          }
          wrappingHeight += size + lineHeight;
          line.str = '';
          line.len = 0;
          line.start = ii;
        } else {
          line.str = str;
          line.len = len;
          ii += 1;
        }
      }
      if (line.len > 0) {
        wrappingText.push({
          text: line.str,
          len: line.len,
          tx: 0,
          ty: wrappingHeight,
        });
      }
      blockIndex += 1;
    }
    if (wrappingHeight > 0) {
      wrappingHeight -= lineHeight;
    }
    this.wrappingText = wrappingText;
    this.wrappingHeight = wrappingHeight;
    this.used = XMeasure.USED.TEXT_WRAP;
  }

}

export {
  XHorizonMeasure,
};
