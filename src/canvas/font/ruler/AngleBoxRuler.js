import { BaseRuler } from '../BaseRuler';
import { RTSinKit } from '../../RTFunction';
import { PlainRuler } from '../PlainRuler';

class AngleBoxRuler extends PlainRuler {

  constructor({
    draw, text, size, angle, rect, overflow, align, verticalAlign, lineHeight = 4, padding,
  }) {
    super({
      draw, text,
    });

    this.size = size;
    this.angle = angle;
    this.rect = rect;
    this.overflow = overflow;
    this.align = align;
    this.verticalAlign = verticalAlign;
    this.lineHeight = lineHeight;
    this.padding = padding;

    this.overflowText = '';
    this.overflowTextWidth = 0;

    this.textWrapText = '';
    this.textWrapTextWidth = 0;
    this.textWrapTextArray = [];
    this.textWrapMaxLen = 0;
  }

  truncateRuler() {
    this.overflowRuler();
  }

  overflowRuler() {
    if (this.used) { return; }
    const { text } = this;
    const textWidth = this.textWidth(text);
    this.overflowText = text;
    this.overflowTextWidth = textWidth;
    this.used = BaseRuler.USED.OVER_FLOW;
  }

  textWrapRuler() {
    if (this.used) { return; }
    const { rect, angle, text, padding } = this;
    const { height } = rect;
    if (angle > 0) {
      const textHypotenuseWidth = RTSinKit.tilt({
        inverse: height - (padding * 2),
        angle,
      });
      // 折行文本计算
      const breakArray = this.textBreak();
      const textArray = [];
      const breakLen = breakArray.length;
      let bi = 0;
      let maxLen = 0;
      while (bi < breakLen) {
        const text = breakArray[bi];
        const textLen = text.length;
        const line = {
          str: '',
          len: 0,
          start: 0,
        };
        let ii = 0;
        while (ii < textLen) {
          const str = line.str + text.charAt(ii);
          const len = this.textWidth(str);
          if (len > textHypotenuseWidth) {
            if (line.len === 0) {
              textArray.push({
                text: str,
                len,
                tx: 0,
                ty: 0,
              });
              if (len > maxLen) {
                maxLen = len;
              }
              ii += 1;
            } else {
              textArray.push({
                text: line.str,
                len: line.len,
                tx: 0,
                ty: 0,
              });
              if (line.len > maxLen) {
                maxLen = line.len;
              }
            }
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
            ty: 0,
          });
        }
        if (line.len > maxLen) {
          maxLen = line.len;
        }
        bi += 1;
      }
      this.textWrapTextArray = textArray;
      this.textWrapMaxLen = maxLen;
    } else {
      const textHypotenuseWidth = RTSinKit.tilt({
        inverse: height - (padding * 2),
        angle,
      });
      // 折行文本计算
      const breakArray = this.textBreak();
      const textArray = [];
      const breakLen = breakArray.length;
      let bi = 0;
      let maxLen = 0;
      while (bi < breakLen) {
        const text = breakArray[bi];
        const textLen = text.length;
        const line = {
          str: '',
          len: 0,
          start: 0,
        };
        let ii = 0;
        while (ii < textLen) {
          const str = line.str + text.charAt(ii);
          const len = this.textWidth(str);
          if (len > textHypotenuseWidth) {
            if (line.len === 0) {
              textArray.push({
                text: str,
                len,
                tx: 0,
                ty: 0,
              });
              if (len > maxLen) {
                maxLen = len;
              }
              ii += 1;
            } else {
              textArray.push({
                text: line.str,
                len: line.len,
                tx: 0,
                ty: 0,
              });
              if (line.len > maxLen) {
                maxLen = line.len;
              }
            }
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
            ty: 0,
          });
        }
        if (line.len > maxLen) {
          maxLen = line.len;
        }
        bi += 1;
      }
      this.textWrapTextArray = textArray;
      this.textWrapMaxLen = maxLen;
    }
    const { textWrapTextArray } = this;
    if (textWrapTextArray.length === 0) {
      this.textWrapText = text;
      this.textWrapTextWidth = this.textWidth(text);
    }
    this.used = BaseRuler.USED.TEXT_WRAP;
  }

}

export {
  AngleBoxRuler,
};
