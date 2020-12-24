import { VerticalVisual } from './VerticalVisual';
import { BaseRuler } from '../BaseRuler';

class VerticalRuler extends VerticalVisual {

  constructor({
    draw, text, size, rect, verticalAlign, spacing = 2, lineHeight = 8, padding,
  }) {
    super({
      draw, text, verticalAlign, padding,
    });

    this.size = size;
    this.rect = rect;
    this.spacing = spacing;
    this.lineHeight = lineHeight;
    this.used = BaseRuler.USED.DEFAULT_INI;

    this.truncateTextArray = [];
    this.truncateMaxLen = 0;

    this.textWrapTextArray = [];
    this.textWrapMaxLen = 0;
    this.textWrapWOffset = 0;
  }

  truncateRuler() {
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
    this.truncateTextArray = textArray;
    this.truncateMaxLen = maxLen;
    this.used = BaseRuler.USED.TRUNCATE;
  }

  overflowRuler() {
    this.truncateRuler();
  }

  textWrapRuler() {
    const { rect, size, spacing, lineHeight } = this;
    const { height } = rect;
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const breakArray = this.textBreak();
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
    this.textWrapTextArray = textArray;
    this.textWrapMaxLen = maxLen;
    this.textWrapWOffset = wOffset;
  }

}

export {
  VerticalRuler,
};
