import { ScaleAdapter } from './Scale';
import { XDraw } from '../../../canvas/XDraw';
import { XFontBuilder } from '../../../canvas/font/XFontBuilder';
import { BaseFont } from '../../../canvas/font/BaseFont';

class TextBuilder {

  constructor({
    scaleAdapter,
  }) {
    this.scaleAdapter = scaleAdapter;
    this.text = null;
    this.rect = null;
    this.attr = null;
    this.dw = null;
    this.overflow = null;
    this.border = null;
  }

  borderDisplay() {
    const { border } = this;
    if (border) {
      return border.isDisplay();
    }
    return false;
  }

  setText(text) {
    this.text = text;
  }

  setRect(rect) {
    this.rect = rect;
  }

  setAttr(attr) {
    this.attr = attr;
  }

  setDraw(dw) {
    this.dw = dw;
  }

  setOverFlow(overflow) {
    this.overflow = overflow;
  }

  setBorder(border) {
    this.border = border;
  }

  build() {
    const { text, rect, attr, overflow, dw, scaleAdapter } = this;
    const size = XDraw.srcTransformStylePx(scaleAdapter.goto(attr.size));
    const padding = XDraw.srcTransformStylePx(scaleAdapter.goto(attr.padding));
    const builder = new XFontBuilder({
      text, dw, overflow, rect, attr,
    });
    builder.setSize(size);
    builder.setPadding(padding);
    if (attr.direction === BaseFont.TEXT_DIRECTION.ANGLE) {
      if (this.borderDisplay()) {
        builder.setDirection(BaseFont.TEXT_DIRECTION.ANGLE_BAR);
      }
    }
    return builder.build();
  }

}

class Text {

  constructor({
    scaleAdapter = new ScaleAdapter(),
  }) {
    this.scaleAdapter = scaleAdapter;
  }

  getBuilder() {
    const { scaleAdapter } = this;
    return new TextBuilder({
      scaleAdapter,
    });
  }

}

export {
  Text,
};
