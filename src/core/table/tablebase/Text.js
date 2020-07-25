import { Font } from '../../../canvas/Font';
import { ScaleAdapter } from './Scale';

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
    font.setPadding(scaleAdapter.goto(attr.padding));
    font.setSize(scaleAdapter.goto(attr.size));
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
