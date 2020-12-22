class XHorizonDrawFont {

  constructor({
    text, rect, overflow, attr,
  }) {
    this.text = text;
    this.rect = rect;
    this.overflow = overflow;
    this.attr = attr;
  }

  truncateDraw() {}

  overflowDraw() {}

  wrapTextDraw() {}

}

export {
  XHorizonDrawFont,
};
