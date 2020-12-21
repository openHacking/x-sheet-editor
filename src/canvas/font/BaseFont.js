/**
 * BaseFont
 */
class BaseFont {

  /**
   * BaseFont
   * @param text
   * @param draw
   * @param attr
   * @param rect
   */
  constructor({
    text, draw, attr, rect,
  }) {
    this.text = text;
    this.draw = draw;
    this.attr = attr;
    this.rect = rect;
  }

  truncateFont() {
    throw new TypeError('child impl');
  }

  overflowFont() {
    throw new TypeError('child impl');
  }

  wrapTextFont() {
    throw new TypeError('child impl');
  }

  drawFont() {
    throw new TypeError('child impl');
  }

  /**
   * 文字宽度测量(性能杀手,考虑缓存优化)
   * @param text
   * @returns {number}
   */
  textWidth(text) {
    return this.draw.measureText(text).width;
  }

  /**
   * 文本换行
   * @param text
   * @returns {void|*|string[]|[]}
   */
  textBreak(text) {
    return text.split(/\n/);
  }

  /**
   * 是否具有换行符
   * @param text
   * @returns {boolean}
   */
  hasBreak(text) {
    return text.indexOf('\n') > -1;
  }

  /**
   * 是否为空字符
   * @param text
   * @returns {boolean}
   */
  isBlank(text) {
    return text === null || text === undefined || text.toString().trim() === '';
  }

  /**
   * 获取水平对齐的填充
   * @returns {number|*}
   */
  getAlignPadding() {
    if (this.attr.align === BaseFont.ALIGN.center) {
      return 0;
    }
    return this.attr.padding;
  }

  /**
   * 获取垂直对齐的填充
   * @returns {number|*}
   */
  getVerticalAlignPadding() {
    if (this.attr.verticalAlign === BaseFont.VERTICAL_ALIGN.center) {
      return 0;
    }
    return this.attr.padding;
  }

}
BaseFont.VERTICAL_ALIGN = {
  top: 'top',
  center: 'middle',
  bottom: 'bottom',
};
BaseFont.ALIGN = {
  left: 'left',
  center: 'center',
  right: 'right',
};
BaseFont.TEXT_WRAP = {
  OVER_FLOW: 1,
  WORD_WRAP: 2,
  TRUNCATE: 3,
};
BaseFont.TEXT_DIRECTION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
  ANGLE: 'angle',
  ANGLE_BAR: 'anglebar',
};
export {
  BaseFont,
};
