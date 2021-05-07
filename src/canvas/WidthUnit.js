class WidthUnit {

  constructor(draw, {
    fontName = 'Arial',
    fontSize = 12,
    fontBold = false,
    fontItalic = false,
  } = {}) {
    const italic = `${fontItalic ? 'italic' : ''}`;
    const bold = `${fontBold ? 'bold' : ''}`;
    const name = `${fontName}`;
    const size = `${fontSize}px`;
    const fontStyle = `${italic} ${bold} ${size} ${name}`;
    draw.save();
    draw.attr({
      font: fontStyle.trim(),
    });
    const measure = draw.measureText("0123456789");
    // 1个字符大约是unit个像素
    this.unit = measure.width / 10;
    draw.restore();
  }

  /**
   * 像素转字符数
   * @param px
   * @return {number}
   */
  getNumber(px) {
    return px / this.unit;
  }

  /**
   * 字符数转像素
   * @param nb
   * @return {number}
   */
  getPixel(nb) {
    return nb * this.unit;
  }

}

export {
  WidthUnit,
};
