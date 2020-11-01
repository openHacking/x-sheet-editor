import { ScaleAdapter } from './Scale';
import { XDraw } from '../../../canvas/XDraw';
import { XFont } from '../../../canvas/font/XFont';

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

  build() {
    const { text, rect, attr, overflow, dw, scaleAdapter } = this;
    const xFont = new XFont({
      text, dw, overflow, rect, attr,
    });
    const size = XDraw.srcTransformStylePx(scaleAdapter.goto(attr.size));
    const padding = XDraw.srcTransformStylePx(scaleAdapter.goto(attr.padding));
    xFont.setSize(size);
    xFont.setPadding(padding);
    return xFont;
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
