class RichFont {

  constructor({
    text, color, name, size, italic, bold, underline, strikethrough, scaleAdapter,
  } = {}) {
    this.text = text;
    this.color = color;
    this.name = name;
    this.size = size;
    this.italic = italic;
    this.bold = bold;
    this.underline = underline;
    this.strikethrough = strikethrough;
    this.scaleAdapter = scaleAdapter;
  }

  clone() {
    const {
      text, color, name, size, italic, bold, underline, strikethrough, scaleAdapter,
    } = this;
    return new RichFont({
      text, color, name, size, italic, bold, underline, strikethrough, scaleAdapter,
    });
  }

  setScaleAdapter(scaleAdapter) {
    if (this.scaleAdapter !== scaleAdapter) {
      this.scaleAdapter = scaleAdapter;
      if (this.size) {
        this.size = this.scaleAdapter.goto(this.size);
      }
    }
  }

}

export {
  RichFont,
};
