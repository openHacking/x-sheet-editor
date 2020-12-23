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
    // 折行文本计算
    const { text, rect, size, lineHeight } = this;
    const { width } = rect;
    const alignPadding = this.getAlignPadding();
    const breakArray = this.textBreak(text);
    const textArray = [];
    const maxWidth = width - (alignPadding * 2);
    const breakLen = breakArray.length;
    let bi = 0;
    let hOffset = 0;
    while (bi < breakLen) {
      if (bi > 0) {
        hOffset += size + lineHeight;
      }
      const text = breakArray[bi];
      const textLen = text.length;
      let ii = 0;
      const line = {
        str: '',
        len: 0,
        start: 0,
      };
      while (ii < textLen) {
        const str = line.str + text.charAt(ii);
        const len = this.textWidth(str);
        if (len > maxWidth) {
          if (line.len === 0) {
            textArray.push({
              text: str,
              len,
              tx: 0,
              ty: hOffset,
            });
            ii += 1;
          } else {
            textArray.push({
              text: line.str,
              len: line.len,
              tx: 0,
              ty: hOffset,
            });
          }
          hOffset += size + lineHeight;
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
        textArray.push({
          text: line.str,
          len: line.len,
          tx: 0,
          ty: hOffset,
        });
      }
      bi += 1;
    }
    if (hOffset > 0) {
      hOffset -= lineHeight;
    }
    // 保存计算结果
    this.wrappingText = textArray;
    this.wrappingHeight = hOffset;
    this.used = XMeasure.USED.TEXT_WRAP;
  }

}

export {
  XHorizonMeasure,
};
