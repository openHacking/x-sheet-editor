import {
  ALIGN,
  TEXT_DIRECTION,
  TEXT_WRAP,
  VERTICAL_ALIGN,
} from '../../../canvas/Font';

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
    align = ALIGN.left,
    verticalAlign = VERTICAL_ALIGN.center,
    textWrap = TEXT_WRAP.OVER_FLOW,
    strikethrough = false,
    underline = false,
    color = 'rgb(0,0,0)',
    name = 'Arial',
    size = 12,
    bold = false,
    italic = false,
    angle = 0,
    direction = TEXT_DIRECTION.HORIZONTAL,
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