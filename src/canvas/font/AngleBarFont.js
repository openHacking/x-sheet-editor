import { BaseFont } from './BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';

class AngleBarFont extends BaseFont {

  constructor({
    text, rect, dw, attr, overflow,
  }) {
    super({
      text, rect, dw, attr,
    });
    this.attr = PlainUtils.mergeDeep({
      lineHeight: 4,
    }, this.attr);
    this.overflow = overflow;
  }

  drawLine(type, tx, ty, textWidth) {

  }

  truncateFont() {
    return this.overflowFont();
  }

  overflowFont() {
    const { text, dw, attr, rect, overflow } = this;
    const { x, y, width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
  }

  wrapTextFont() {}

}

export {
  AngleBarFont,
};
