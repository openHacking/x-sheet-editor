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
    return text.split(/\\n/);
  }

  isBlank(text) {
    return text === null || text === undefined || text.toString().trim() === '';
  }

  setTextWrap(textWrap) {
    this.attr.textWrap = textWrap;
  }

  setSize(size) {
    this.attr.size = size;
  }

  setPadding(padding) {
    this.attr.padding = padding;
  }

  truncateFont() {
    throw new TypeError('child impl');
  }

  overflowFont() {
    throw new TypeError('child impl');
  }

  wrapTextFont() {
    throw new TypeError('child impl');
  }

  draw() {
    throw new TypeError('child impl');
  }

}
BaseFont.VERTICAL_ALIGN = {
  top: 'top',
  center: 'middle',
  bottom: 'bottom',
};
BaseFont.ALIGN = {
  left: 'left',
  center: 'center',
  right: 'right',
};
BaseFont.TEXT_WRAP = {
  OVER_FLOW: 1,
  WORD_WRAP: 2,
  TRUNCATE: 3,
};
BaseFont.TEXT_DIRECTION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  ANGLE: 'angle',
};
export {
  BaseFont,
};
