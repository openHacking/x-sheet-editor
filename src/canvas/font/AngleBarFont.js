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

}

export {
  AngleBarFont,
};
