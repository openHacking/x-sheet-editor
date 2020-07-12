import { Font } from '../../../canvas/Font';

class FontBuilder {

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
      table, text, rect, attr, overflow, dw,
    } = this;
    const { scale } = table;
    const font = new Font({
      dw,
      text,
      rect,
      attr,
      overflow,
    });
    font.setPadding(scale.digitModeTo(attr.padding));
    font.setSize(scale.digitModeTo(attr.size));
    return font;
  }

}

export {
  FontBuilder,
};
