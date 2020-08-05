class BaseFont {

  constructor({
    overflow,
    text,
    rect,
    dw,
    attr,
  }) {
    this.overflow = overflow;
    this.text = text;
    this.dw = dw;
    this.rect = rect;
    this.attr = attr;
  }

  textWidth(text) {
    const { dw } = this;
    return dw.measureText(text).width;
  }

  textBreak(text) {
    return text.split('\n');
  }

  truncate() {
    throw new TypeError('child impl');
  }

  overFlow() {
    throw new TypeError('child impl');
  }

  wrapText() {
    throw new TypeError('child impl');
  }

}

export {
  BaseFont,
};
