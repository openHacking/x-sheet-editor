/**
 * 宽度单位
 */
class WidthUnit {

  /**
   * 宽度单位
   * @param draw
   * @param fontName
   * @param fontSize
   * @param fontBold
   * @param fontItalic
   */
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
    const standard = '1234567890';
    const measure = draw.measureText(standard);
    // 1个字符大约是unit个像素
    this.unit = measure.width / standard.length;
    draw.restore();
  }

  /**
   * 字符数转像素
   * @param nb
   * @return {number}
   */
  getPixel(nb) {
    return nb * this.unit;
  }

  /**
   * 像素转字符数
   * @param px
   * @return {number}
   */
  getNumber(px) {
    return px / this.unit;
  }

}

export {
  WidthUnit,
};
