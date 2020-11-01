import { PlainUtils } from '../../utils/PlainUtils';
import { VerticalFont } from './VerticalFont';
import { AngleFont } from './AngleFont';
import { HorizontalFont } from './HorizontalFont';
import { BaseFont } from './BaseFont';

class XFont {

  constructor({
    text, dw, rect, attr, overflow,
  }) {
    this.attr = PlainUtils.mergeDeep({}, {
      verticalAlign: BaseFont.VERTICAL_ALIGN.center,
      direction: BaseFont.TEXT_DIRECTION.HORIZONTAL,
      name: 'Arial',
      size: 14,
      color: '#000000',
      underline: false,
      strikethrough: false,
      bold: false,
      italic: false,
      textWrap: BaseFont.TEXT_WRAP.TRUNCATE,
      align: BaseFont.ALIGN.left,
      angle: 0,
      padding: 8,
    }, attr);
    this.font = null;
    switch (attr.direction) {
      case BaseFont.TEXT_DIRECTION.ANGLE:
        this.font = new AngleFont({
          text, rect, dw, attr: this.attr, overflow,
        });
        break;
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        this.font = new HorizontalFont({
          text, rect, dw, attr: this.attr, overflow,
        });
        break;
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        this.font = new VerticalFont({
          text, rect, dw, attr: this.attr,
        });
        break;
    }
  }

  draw() {
    return this.font.draw();
  }

  setTextWrap(textWrap) {
    this.font.setTextWrap(textWrap);
  }

  setSize(size) {
    this.font.setSize(size);
  }

  setPadding(padding) {
    this.font.setPadding(padding);
  }

}

export {
  XFont,
};
