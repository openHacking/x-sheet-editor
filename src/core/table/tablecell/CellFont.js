import { BaseFont } from '../../../canvas/font/BaseFont';

/**
 *  CellFont
 *  @author jerry
 */
class CellFont {

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
    textWrap = BaseFont.TEXT_WRAP.OVER_FLOW,
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
    const {
      align, size, color, bold, italic, name,
    } = this;
    let justifyContent = 'left';
    switch (align) {
      case BaseFont.ALIGN.left:
        justifyContent = 'flex-start';
        break;
      case BaseFont.ALIGN.center:
        justifyContent = 'center';
        break;
      case BaseFont.ALIGN.right:
        justifyContent = 'flex-end';
        break;
    }
    let css = `
      justify-content:${justifyContent};
      font-size: ${size}px;color: ${color};font-weight: ${bold ? 'bold' : 'initial'};
      font-style: ${italic ? 'italic' : 'initial'};
      font-family: ${name};
    `;
    css = css.replace(/\s/g, '');
    return css;
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

export { CellFont };
