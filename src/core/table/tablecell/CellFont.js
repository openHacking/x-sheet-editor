import { BaseFont } from '../../../canvas/font/BaseFont';
import { XDraw } from '../../../canvas/XDraw';

/**
 *  CellFont
 *  @author jerry
 */
class CellFont {

  static setScaleAdapter(scaleAdapter) {
    CellFont.scaleAdapter = scaleAdapter;
  }

  /**
   * CellFont
   * @param align
   * @param verticalAlign
   * @param textWrap
   * @param strikethrough
   * @param underline
   * @param color
   * @param name
   * @param size
   * @param bold
   * @param italic
   * @param angle
   * @param direction
   * @param padding
   */
  constructor({
    align = BaseFont.ALIGN.left,
    verticalAlign = BaseFont.VERTICAL_ALIGN.center,
    textWrap = BaseFont.TEXT_WRAP.TRUNCATE,
    strikethrough = false,
    underline = false,
    color = 'rgb(0,0,0)',
    name = 'Arial',
    size = 12,
    bold = false,
    italic = false,
    angle = 0,
    direction = BaseFont.TEXT_DIRECTION.HORIZONTAL,
    padding = 5,
  }) {
    this.align = align;
    this.verticalAlign = verticalAlign;
    this.textWrap = textWrap;
    this.strikethrough = strikethrough;
    this.underline = underline;
    this.color = color;
    this.name = name;
    this.size = size;
    this.bold = bold;
    this.italic = italic;
    this.direction = direction;
    this.angle = angle;
    this.padding = padding;
  }

  toCssStyle() {
    const { scaleAdapter } = CellFont;
    const {
      align, size, color, bold, italic, name,
    } = this;

    // 水平对齐
    let textAlign = 'left';
    switch (align) {
      case BaseFont.ALIGN.left:
        textAlign = 'left';
        break;
      case BaseFont.ALIGN.center:
        textAlign = 'center';
        break;
      case BaseFont.ALIGN.right:
        textAlign = 'right';
        break;
    }

    // 文字大小
    let fontSize = size;
    if (scaleAdapter) {
      fontSize = scaleAdapter.goto(fontSize);
    } else {
      fontSize = XDraw.srcTransformCssPx(fontSize);
    }

    // output css
    return `
      text-align:${textAlign};
      font-size: ${XDraw.srcTransformCssPx(fontSize)}px;color: ${color};font-weight: ${bold ? 'bold' : 'initial'};
      font-style: ${italic ? 'italic' : 'initial'};
      font-family: ${name};
    `.replace(/\s/g, '');
  }

  clone() {
    const {
      align,
      verticalAlign,
      textWrap,
      strikethrough,
      underline,
      color,
      name,
      size,
      bold,
      italic,
      angle,
      direction,
      padding,
    } = this;
    return new CellFont({
      align,
      verticalAlign,
      textWrap,
      strikethrough,
      underline,
      color,
      name,
      size,
      bold,
      italic,
      angle,
      direction,
      padding,
    });
  }

}
CellFont.scaleAdapter = null;

export { CellFont };
