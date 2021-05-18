import { BaseFont } from '../../BaseFont';

class RichDrawFontBuilder {

  constructor({
    draw, rich, rect, overflow, attr
  }) {
    this.attr = Object.assign({}, BaseFont.DEFAULT_RICH_ATTR, attr);
    this.rich = rich;
    this.rect = rect;
    this.draw = draw;
    this.overflow = overflow;
  }

  buildFont() {}

}
