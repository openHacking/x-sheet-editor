import { Font } from '../../../canvas/Font';

class FontBuilder {

  constructor(table) {
    this.table = table;
    this.text = null;
    this.rect = null;
    this.attr = null;
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

  setOverFlow(overflow) {
    this.overflow = overflow;
  }

  build() {
    const {
      table, text, rect, attr, overflow,
    } = this;
    const { scale } = table;
    const font = new Font({
      dw: this.table.draw,
      text,
      rect,
      attr,
      overflow,
    });
    font.setSize(scale.to(attr.size));
    return font;
  }

}

export {
  FontBuilder,
};
