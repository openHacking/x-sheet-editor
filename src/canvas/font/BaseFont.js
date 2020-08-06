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
  left: 'left',
  center: 'center',
  right: 'right',
};
BaseFont.TEXT_DIRECTION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  ANGLE: 'angle',
};
export {
  BaseFont,
};
