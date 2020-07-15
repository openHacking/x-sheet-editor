import { Font } from '../../../canvas/Font';

class TextBuilder {

  constructor(table) {
    this.table = table;
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
      text, rect, attr, overflow, dw, table,
    } = this;
    const { scale } = table;
    const font = new Font({
      dw, text, rect, attr, overflow,
    });
    font.setPadding(scale.goto(attr.padding));
    font.setSize(scale.goto(attr.size));
    return font;
  }

}

class Text {

  constructor(table) {
    this.table = table;
  }

  getBuilder() {
    return new TextBuilder(this.table);
  }

}

export {
  Text,
};
