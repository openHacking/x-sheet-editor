import {
  ALIGN,
  TEXT_DIRECTION,
  TEXT_WRAP,
  VERTICAL_ALIGN,
} from '../../../canvas/Font';
import { Utils } from '../../../utils/Utils';

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
   * @param width
   */
  constructor({
    align = ALIGN.left,
    verticalAlign = VERTICAL_ALIGN.center,
    textWrap = TEXT_WRAP.OVER_FLOW,
    strikethrough = false,
    underline = false,
    color = 'rgb(0,0,0)',
    name = 'Arial',
    size = 14,
    bold = false,
    italic = false,
    angle = 0,
    direction = TEXT_DIRECTION.HORIZONTAL,
    width = Utils.Undef,
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
    this.width = width;
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
      width,
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
      width,
    });
  }
}

export { CellFont };
