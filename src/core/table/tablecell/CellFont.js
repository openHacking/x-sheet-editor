import { BaseFont } from '../../../canvas/font/BaseFont';
import { XDraw } from '../../../canvas/XDraw';

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
    const {
      align, size, color, bold, italic, name, verticalAlign,
    } = this;
    let justifyContent = 'left';
    let alignItems = 'center';
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.center: {
        alignItems = 'center';
        break;
      }
      case BaseFont.VERTICAL_ALIGN.top: {
        alignItems = 'flex-start';
        break;
      }
      case BaseFont.VERTICAL_ALIGN.bottom: {
        alignItems = 'flex-end';
        break;
      }
    }
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
      font-size: ${XDraw.transformCssPx(size)}px;color: ${color};font-weight: ${bold ? 'bold' : 'initial'};
      font-style: ${italic ? 'italic' : 'initial'};
      font-family: ${name};
      align-items: ${alignItems};
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
