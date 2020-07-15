import { Font } from '../../../canvas/Font';
import { Utils } from '../../../utils/Utils';

class TextBuilder {

  constructor(table) {
    this.table = table;
    this.text = null;
    this.rect = null;
    this.attr = null;
    this.dw = null;
    this.overflow = null;
    this.mergeWidth = null;
    this.cellWidth = null;
  }

  setReMergeWidth(sci, eci) {
    const { table } = this;
    const {
      cols, scale,
    } = table;

    // 避免缩放时换行
    // 宽度使用浮点运算
    scale.useFloat();
    this.mergeWidth = cols.sectionSumWidth(sci, eci);
    scale.notFloat();
  }

  setReCellWidth(ci) {
    const { table } = this;
    const {
      cols, scale,
    } = table;

    // 避免缩放时换行
    // 宽度使用浮点运算
    scale.useFloat();
    this.cellWidth = cols.getWidth(ci);
    scale.notFloat();
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

    const {
      mergeWidth, cellWidth,
    } = this;

    // 避免缩放时换行
    // 宽度使用浮点运算
    const { scale } = table;
    scale.useFloat();

    if (Utils.isNumber(cellWidth)) {
      rect.width = cellWidth;
    } else if (Utils.isNumber(mergeWidth)) {
      rect.width = mergeWidth;
    }

    const font = new Font({
      dw, text, rect, attr, overflow,
    });
    font.setPadding(scale.goto(attr.padding));
    font.setSize(scale.goto(attr.size));

    scale.notFloat();

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
