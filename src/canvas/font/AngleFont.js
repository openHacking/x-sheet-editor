import { BaseFont } from './BaseFont';
import { Utils } from '../../utils/Utils';

class AngleFont extends BaseFont {

  constructor({
    overflow,
    text,
    rect,
    dw,
    attr,
  }) {
    super({
      overflow,
      text,
      rect,
      dw,
      attr,
    });
    this.attr = Utils.mergeDeep({
      lineHeight: 4,
    }, this.attr);
  }

  truncateFont() {}

  overflowFont() {}

  wrapTextFont() {}

}
