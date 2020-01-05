import { RectDraw } from './RectDraw';
import { npx } from '../Draw';
import { Utils } from '../../utils/Utils';

class RectText extends RectDraw {
  constructor(draw, rect, attr) {
    super(draw, rect);
    this.attr = attr;
    if (this.attr) {
      draw.attr({
        textAlign: this.attr.align,
        textBaseline: this.attr.verticalAlign,
        font: `${this.attr.font.italic ? 'italic' : ''} ${this.attr.font.bold ? 'bold' : ''} ${npx(this.attr.font.size)}px ${this.attr.font.name}`,
        fillStyle: this.attr.color,
        strokeStyle: this.attr.color,
      });
    }
  }

  drawFontLine(type, tx, ty, align, verticalAlign, blHeight, blWidth) {
    const { draw } = this;
    const flOffset = { x: 0, y: 0 };
    if (type === 'underline') {
      if (verticalAlign === 'bottom') {
        flOffset.y = 0;
      } else if (verticalAlign === 'top') {
        flOffset.y = -(blHeight + 2);
      } else {
        flOffset.y = -blHeight / 2;
      }
    } else if (type === 'strike') {
      if (verticalAlign === 'bottom') {
        flOffset.y = blHeight / 2;
      } else if (verticalAlign === 'top') {
        flOffset.y = -((blHeight / 2) + 2);
      }
    }
    if (align === 'center') {
      flOffset.x = blWidth / 2;
    } else if (align === 'right') {
      flOffset.x = blWidth;
    }
    draw.line([tx - flOffset.x, ty - flOffset.y], [tx - flOffset.x + blWidth, ty - flOffset.y]);
  }

  textAlign(align) {
    const { rect } = this;
    const { width, padding } = rect;
    let { x } = rect;
    if (align === 'left') {
      x += padding;
    } else if (align === 'center') {
      x += width / 2;
    } else if (align === 'right') {
      x += width - padding;
    }
    return x;
  }

  textVerticalAlign(align, fontSize, hOffset) {
    const { rect } = this;
    const { height, padding } = rect;
    let { y } = this.rect;
    if (align === 'top') {
      y += padding;
    } else if (align === 'middle') {
      y = y + height / 2 - hOffset;
    } else if (align === 'bottom') {
      y += height - hOffset * 2 - padding;
    }
    return y;
  }

  text(txt, attr, textWrap = true) {
    const { draw, rect } = this;
    const { ctx } = draw;
    const addAttr = Utils.contrastDifference(attr, this.attr);
    const isChange = Utils.isNotEmptyObject(addAttr);
    if (isChange) {
      draw.save();
      const changeAttr = {};
      if (addAttr.align) {
        changeAttr.align = addAttr.align;
      }
      if (addAttr.verticalAlign) {
        changeAttr.textBaseline = addAttr.verticalAlign;
      }
      if (addAttr.font) {
        changeAttr.font = `${addAttr.font.italic ? 'italic' : ''} ${addAttr.font.bold ? 'bold' : ''} ${npx(addAttr.font.size)}px ${addAttr.font.name}`;
      }
      if (addAttr.color) {
        changeAttr.fillStyle = addAttr.color;
        changeAttr.strokeStyle = addAttr.color;
      }
      draw.attr(changeAttr);
    }
    const newAttr = Utils.mergeDeep({}, this.attr, addAttr);
    const {
      align, verticalAlign, font, strike, underline,
    } = newAttr;
    const tx = this.textAlign(align);
    const txtWidth = ctx.measureText(txt).width;
    let hOffset = 0;
    if (textWrap) {
      const n = Math.ceil(txtWidth / rect.innerWidth());
      hOffset = ((n - 1) * font.size) / 2;
    }
    let ty = this.textVerticalAlign(verticalAlign, font.size, hOffset);
    if (textWrap && txtWidth > rect.innerWidth()) {
      const textLine = {
        len: 0,
        start: 0,
      };
      for (let i = 0, len = txt.length; i < len; i += 1) {
        if (textLine.len >= rect.innerWidth()) {
          draw.fillText(txt.substring(textLine.start, i), tx, ty);
          if (strike) {
            this.drawFontLine('strike', tx, ty, align, verticalAlign, font.size, textLine.len);
          }
          if (underline) {
            this.drawFontLine('underline', tx, ty, align, verticalAlign, font.size, textLine.len);
          }
          ty += font.size + 2;
          textLine.len = 0;
          textLine.start = i;
        }
        textLine.len += ctx.measureText(txt[i]).width;
      }
      if (textLine.len > 0) {
        draw.fillText(txt.substring(textLine.start), tx, ty);
        if (strike) {
          this.drawFontLine('strike', tx, ty, align, verticalAlign, font.size, textLine.len);
        }
        if (underline) {
          this.drawFontLine('underline', tx, ty, align, verticalAlign, font.size, textLine.len);
        }
      }
    } else {
      draw.fillText(txt, tx, ty);
      if (strike) {
        this.drawFontLine('strike', tx, ty, align, verticalAlign, font.size, txtWidth);
      }
      if (underline) {
        this.drawFontLine('underline', tx, ty, align, verticalAlign, font.size, txtWidth);
      }
    }
    if (isChange) {
      draw.restore();
    }
    return this;
  }
}

export { RectText };
