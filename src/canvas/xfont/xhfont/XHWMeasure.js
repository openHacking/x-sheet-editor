import { Measure } from '../Measure';
import { PlainUtils } from '../../../utils/PlainUtils';

class XHWMeasure extends Measure {

  constructor({
    text, size, align, rect, padding, xDraw,
  }) {
    super({ xDraw, align, padding });
    // 显示的文本
    this.group = PlainUtils.EMPTY;
    // 文本的总行高
    this.measure = 0;
    // 原始的文本
    this.origin = text;
    // 原始文本的高度
    this.size = size;
    // 文本默认行高
    this.lineHeight = 6;
    // 文本显示区域
    this.rect = rect;
    // 文本的对齐方式
    this.align = align;
  }

  measureText() {
    const { origin, size, rect, lineHeight } = this;
    const maxWidth = rect.width - this.alignPadding();
    const breakArray = this.textBreak(origin);
    const breakLen = breakArray.length;
    const group = [];
    let measure = 0;
    let bi = 0;
    while (bi < breakLen) {
      if (bi > 0) {
        measure += size + lineHeight;
      }
      const text = breakArray[bi];
      const textLen = text.length;
      let ii = 0;
      const line = {
        str: PlainUtils.EMPTY, len: 0, start: 0,
      };
      while (ii < textLen) {
        const str = line.str + text.charAt(ii);
        const len = this.textWidth(str);
        if (len > maxWidth) {
          if (line.len === 0) {
            group.push({
              text: str, len, tx: 0, ty: measure,
            });
            ii += 1;
          } else {
            group.push({
              text: line.str, len: line.len, tx: 0, ty: measure,
            });
          }
          measure += size + lineHeight;
          line.str = PlainUtils.EMPTY;
          line.len = 0;
          line.start = ii;
        } else {
          line.str = str;
          line.len = len;
          ii += 1;
        }
      }
      if (line.len > 0) {
        group.push({
          text: line.str, len: line.len, tx: 0, ty: measure,
        });
      }
      bi += 1;
    }
    if (measure > 0) {
      measure -= lineHeight;
    }
    this.measure = measure;
    this.group = group;
  }

}

export {
  XHWMeasure,
};
