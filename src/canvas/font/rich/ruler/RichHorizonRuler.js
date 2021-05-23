import { RichRuler } from '../RichRuler';
import { BaseRuler } from '../../BaseRuler';

class RichHorizonRuler extends RichRuler {

  constructor({
    draw, rich, size, rect, overflow, align, textWrap, lineHeight = 8, padding,
  }) {
    super({
      rich, draw, align, padding,
    });

    this.overflow = overflow;
    this.textWrap = textWrap;
    this.size = size;
    this.rect = rect;
    this.lineHeight = lineHeight;
    this.align = align;
    this.padding = padding;
    this.used = BaseRuler.USED.DEFAULT_INI;

    // 裁剪文本
    this.truncateText = []; // [[x,y],[x,y],....]
    this.truncateTextWidth = 0;
    this.truncateTextHeight = 0;
    this.truncateTextAscent = 0;

    // 溢出文本
    this.overflowText = []; // [[x,y],[x,y],....]
    this.overflowTextWidth = 0;
    this.overflowTextHeight = 0;
    this.overflowTextAscent = 0;

    // 自动换行文本
    this.textWrapTextArray = []; // [[x,y],[x,y],....]
    this.textWrapTextHeight = 0;
  }

}

export {
  RichHorizonRuler,
};
