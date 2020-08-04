class FontDraw {

  constructor({
    text, rect, dw, overflow, attr,
  }) {
    this.text = text;
    this.dw = dw;
    this.rect = rect;
    this.overflow = overflow;
    this.attr = attr;
  }

  textWidth(text) {
    const { dw } = this;
    return dw.measureText(text).width;
  }

  boxWidth() {
    const { rect, attr } = this;
    const { padding } = attr;
    const { width } = rect;
    return width - padding * 2;
  }

  boxHeight() {
    const { rect } = this;
    const { height } = rect;
    return height;
  }

}

class HorizontalFontDraw extends FontDraw {

  drawLine(type, tx, ty, textWidth) {}

  drawText(textArr) {
    const { text, dw, attr, rect } = this;
    const {
      size, underline, strikethrough, align, verticalAlign,
    } = attr;
    const rectHeight = rect.height;
    const rectWidth = rect.width;
    const boxHeight = this.boxHeight();
    const boxWidth = this.boxWidth();
    // 计算
    const result = [];
    const line = {
      len: 0,
      start: 0,
    };
  }

  wrapText() {}

  truncate() {}

  overFlow() {}
}
