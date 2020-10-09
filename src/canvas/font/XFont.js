import { PlainUtils } from '../../utils/PlainUtils';
import { VerticalFont } from './VerticalFont';
import { AngleFont } from './AngleFont';
import { HorizontalFont } from './HorizontalFont';
import { BaseFont } from './BaseFont';

class XFont {

  constructor({
    overflow, text, dw, rect, attr,
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
      case BaseFont.TEXT_DIRECTION.HORIZONTAL:
        this.font = new HorizontalFont({
          text, rect, dw, overflow, attr: this.attr,
        });
        break;
      case BaseFont.TEXT_DIRECTION.ANGLE:
        this.font = new AngleFont({
          text, rect, dw, overflow, attr: this.attr,
        });
        break;
      case BaseFont.TEXT_DIRECTION.VERTICAL:
        this.font = new VerticalFont({
          text, rect, dw, overflow, attr: this.attr,
        });
        break;
    }
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

  draw() {
    return this.font.draw();
  }

}

export {
  XFont,
};
