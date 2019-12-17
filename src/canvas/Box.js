import { Utils } from '../utils/Utils';
import { npx, npxLine } from './Draw';

class Box {
  constructor(draw, options) {
    this.draw = draw;
    this.options = Utils.mergeDeep({
      style: {},
    }, options);
    draw.attr(this.options.style);
  }

  // ==================矩形绘制==================

  rect(boxRange) {
    const { ctx } = this.draw;
    ctx.rect(
      npxLine(boxRange.x + 1),
      npxLine(boxRange.y + 1),
      npx(boxRange.width - 2),
      npx(boxRange.height - 2),
    );
    ctx.clip();
    ctx.fill();
  }

  // ==================文字绘制==================

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

  textAlign(boxRange, align) {
    const { width, padding } = boxRange;
    let { x } = boxRange;
    if (align === 'left') {
      x += padding;
    } else if (align === 'center') {
      x += width / 2;
    } else if (align === 'right') {
      x += width - padding;
    }
    return x;
  }

  textVerticalAlign(boxRange, align, fontSize, hOffset) {
    const { height, padding } = boxRange;
    let { y } = boxRange;
    if (align === 'top') {
      y += padding;
    } else if (align === 'middle') {
      y = y + height / 2 - hOffset;
    } else if (align === 'bottom') {
      y += height - hOffset * 2 - padding;
    }
    return y;
  }

  text(boxRange, txt, attr = {}, textWrap = true) {
    const { draw } = this;
    const { ctx } = draw;
    const {
      align, verticalAlign, font, color, strike, underline,
    } = attr;
    const tx = this.textAlign(boxRange, align);
    draw.attr({
      textAlign: align,
      textBaseline: verticalAlign,
      font: `${font.italic ? 'italic' : ''} ${font.bold ? 'bold' : ''} ${npx(font.size)}px ${font.name}`,
      fillStyle: color,
      strokeStyle: color,
    });
    const txtWidth = ctx.measureText(txt).width;
    let hOffset = 0;
    if (textWrap) {
      const n = Math.ceil(txtWidth / boxRange.innerWidth());
      hOffset = ((n - 1) * font.size) / 2;
    }
    let ty = this.textVerticalAlign(boxRange, verticalAlign, font.size, hOffset);
    if (textWrap && txtWidth > boxRange.innerWidth()) {
      const textLine = {
        len: 0,
        start: 0,
      };
      for (let i = 0, len = txt.length; i < len; i += 1) {
        if (textLine.len >= boxRange.innerWidth()) {
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
    return this;
  }
}

export { Box };
