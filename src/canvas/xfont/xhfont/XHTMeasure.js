import { Measure } from '../Measure';
import { PlainUtils } from '../../../utils/PlainUtils';
import { BaseFont } from '../../font/BaseFont';

class XHTMeasure extends Measure {

  constructor({
    text, align, rect, padding, xDraw,
  }) {
    super({
      xDraw, align, padding,
    });
    // 显示的文本
    this.text = PlainUtils.EMPTY;
    // 文本的宽度
    this.measure = 0;
    // 原始的文本
    this.origin = text;
    // 文本显示区域
    this.rect = rect;
    // 对齐的方式
    this.align = align;
  }

  measureText() {
    const { align } = this;
    switch (align) {
      case BaseFont.ALIGN.left: {
        this.measureLText();
        break;
      }
      case BaseFont.ALIGN.center: {
        this.measureCText();
        break;
      }
      case BaseFont.ALIGN.right: {
        this.measureRText();
        break;
      }
    }
  }

  measureLText() {
    const { origin, rect } = this;
    const maxWidth = rect.width - this.alignPadding();
    const textLength = origin.length;
    let text = PlainUtils.EMPTY;
    let measure = 0;
    let start = 0;
    while (start < textLength) {
      const str = text + origin.charAt(start);
      const len = this.textWidth(str);
      if (len >= maxWidth) {
        break;
      }
      text = str;
      measure = len;
      start += 1;
    }
    this.text = text;
    this.measure = measure;
  }

  measureCText() {
    const { origin, rect } = this;
    const textWidth = this.textWidth(origin);
    const maxWidth = rect.width;
    const textLength = origin.length;
    const lOffset = maxWidth / 2 - textWidth / 2;
    if (lOffset < 0) {
      // 起始
      let temp = PlainUtils.EMPTY;
      let start = 0;
      while (start < textLength) {
        const str = temp + origin.charAt(start);
        if (lOffset + this.textWidth(str) >= 0) {
          break;
        }
        temp = str;
        start += 1;
      }
      // 右边
      let text = PlainUtils.EMPTY;
      let measure = 0;
      let over = start;
      while (over < textLength) {
        const str = text + origin.charAt(over);
        const len = this.textWidth(str);
        if (len >= maxWidth) {
          break;
        }
        text = str;
        measure = len;
        over += 1;
      }
      // 记录
      this.text = text;
      this.measure = measure;
    } else {
      // 记录
      this.text = origin;
      this.measure = textWidth;
    }
  }

  measureRText() {
    const { origin, rect } = this;
    const maxWidth = rect.width - this.alignPadding();
    const textLength = origin.length;
    let text = PlainUtils.EMPTY;
    let measure = 0;
    let start = textLength - 1;
    while (start >= 0) {
      const str = origin.charAt(start) + text;
      const len = this.textWidth(str);
      if (len >= maxWidth) {
        break;
      }
      text = str;
      measure = len;
      start -= 1;
    }
    this.text = text;
    this.measure = measure;
  }

}

export {
  XHTMeasure,
};
