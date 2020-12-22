class XBasicTextMeasure {

  constructor({ draw }) {
    this.draw = draw;
  }

  measureText(text) {
    const { draw } = this;
    return draw.measureText(text).width;
  }

  textWrapBlock(text) {
    return text.split(/\n/);
  }

}

export {
  XBasicTextMeasure,
};
