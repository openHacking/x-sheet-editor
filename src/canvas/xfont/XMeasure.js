class XMeasure {

  constructor({ draw, padding }) {
    this.draw = draw;
    this.padding = padding;
  }

  measureText(text) {
    const { draw } = this;
    return draw.measureText(text).width;
  }

  textWrapBlock(text) {
    return text.split(/\n/);
  }

}

XMeasure.USED = {
  DEFAULT_INI: 0,
  OVERFLOW: 1,
  TRUNCATE: 2,
  TEXT_WRAP: 3,
};

export {
  XMeasure,
};
