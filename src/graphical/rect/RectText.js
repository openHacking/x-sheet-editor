import { RectDraw } from './RectDraw';
import { npx } from '../Draw';
import { Utils } from '../../utils/Utils';
import { RectCut } from './RectCut';
import { Rect } from './Rect';

class RectText extends RectDraw {
  constructor(draw, rect, attr) {
    super(draw, rect);
    this.attr = attr;
    if (this.attr) {
      this.updateFontDrawAttr(this.attr);
    }
  }

  updateFontDrawAttr(attr) {
    const updateAttr = {};
    if (attr.align) {
      updateAttr.textAlign = attr.align;
    }
    if (attr.verticalAlign) {
      updateAttr.textBaseline = attr.verticalAlign;
    }
    if (attr.font) {
      updateAttr.font = `${attr.font.italic ? 'italic' : ''} ${attr.font.bold ? 'bold' : ''} ${npx(attr.font.size)}px ${attr.font.name}`;
    }
    if (attr.color) {
      updateAttr.fillStyle = attr.color;
      updateAttr.strokeStyle = attr.color;
    }
    if (Utils.isNotEmptyObject(updateAttr)) {
      this.draw.attr(updateAttr);
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

  text(txt, attr, maxWidth = 0) {
    const { draw, rect } = this;
    const { ctx } = draw;
    const isChange = !Utils.equal(attr, this.attr);
    if (isChange) {
      const addAttr = Utils.contrastDifference(attr, this.attr);
      this.attr = Utils.mergeDeep({}, this.attr, addAttr);
      this.updateFontDrawAttr(addAttr);
    }
    const {
      align, verticalAlign, font, strike, underline, textWrap,
    } = this.attr;
    const tx = this.textAlign(align);
    const txtWidth = ctx.measureText(txt).width;
    let hOffset = 0;
    if (textWrap) {
      const n = Math.ceil(txtWidth / rect.innerWidth());
      hOffset = ((n - 1) * font.size) / 2;
    }
    let ty = this.textVerticalAlign(verticalAlign, font.size, hOffset);
    if (textWrap && txtWidth > rect.innerWidth()) {
      const cut = new RectCut(draw, rect);
      cut.outwardCut(0);
      const textLine = {
        len: 0,
        start: 0,
      };
      // console.log('rect.innerWidth()>>>', rect.innerWidth());
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
        textLine.len += ctx.measureText(txt.charAt(i)).width;
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
      cut.closeCut();
    } else if (maxWidth > 0 && txtWidth > maxWidth) {
      const cut = new RectCut(draw, new Rect({
        x: rect.x,
        y: rect.y,
        width: maxWidth,
        height: rect.height,
      }));
      cut.outwardCut(0);
      draw.fillText(txt, tx, ty);
      if (strike) {
        this.drawFontLine('strike', tx, ty, align, verticalAlign, font.size, txtWidth);
      }
      if (underline) {
        this.drawFontLine('underline', tx, ty, align, verticalAlign, font.size, txtWidth);
      }
      cut.closeCut();
    } else {
      draw.fillText(txt, tx, ty);
      if (strike) {
        this.drawFontLine('strike', tx, ty, align, verticalAlign, font.size, txtWidth);
      }
      if (underline) {
        this.drawFontLine('underline', tx, ty, align, verticalAlign, font.size, txtWidth);
      }
    }
    return this;
  }
}

export { RectText };
