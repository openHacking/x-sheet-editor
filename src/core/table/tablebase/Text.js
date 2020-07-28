import { Font } from '../../../canvas/Font';
import { ScaleAdapter } from './Scale';
import { XDraw } from '../../../canvas/XDraw';

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

  setDraw(dw) {
    this.dw = dw;
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

  setOverFlow(overflow) {
    this.overflow = overflow;
  }

  build() {
    const {
      text, rect, attr, overflow, dw,
    } = this;
    const { scaleAdapter } = this;
    const font = new Font({
      dw, text, rect, attr, overflow,
    });
    const size = XDraw.dpx(scaleAdapter.goto(attr.size));
    const padding = XDraw.dpx(scaleAdapter.goto(attr.padding));
    font.setSize(size);
    font.setPadding(padding);
    return font;
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
