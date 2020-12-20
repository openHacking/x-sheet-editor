import { DrawFont } from '../DrawFont';
import { BaseFont } from '../../font/BaseFont';
import { Crop } from '../../Crop';
import { FontDrawResult } from '../../font/FontDrawResult';

class XHDrawFont extends DrawFont {

  constructor({
    overflow, rect, attr, xDraw,
  }) {
    super({
      xDraw,
    });
    this.overflow = overflow;
    this.rect = rect;
    this.attr = attr;
  }

  drawFontLine(type, tx, ty, textWidth) {
    const { dw, attr } = this;
    const { size, verticalAlign, align } = attr;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      switch (align) {
        case BaseFont.ALIGN.right:
          s[0] = tx - textWidth;
          e[0] = tx;
          break;
        case BaseFont.ALIGN.center:
          s[0] = tx - textWidth / 2;
          e[0] = tx + textWidth / 2;
          break;
        case BaseFont.ALIGN.left:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
          s[1] = ty + size / 2;
          e[1] = ty + size / 2;
          break;
        case BaseFont.VERTICAL_ALIGN.center:
          s[1] = ty;
          e[1] = ty;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty - size / 2;
          e[1] = ty - size / 2;
          break;
        default:
          break;
      }
    }
    if (type === 'underline') {
      switch (align) {
        case BaseFont.ALIGN.right:
          s[0] = tx - textWidth;
          e[0] = tx;
          break;
        case BaseFont.ALIGN.center:
          s[0] = tx - textWidth / 2;
          e[0] = tx + textWidth / 2;
          break;
        case BaseFont.ALIGN.left:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case BaseFont.VERTICAL_ALIGN.top:
          s[1] = ty + size;
          e[1] = ty + size;
          break;
        case BaseFont.VERTICAL_ALIGN.center:
          s[1] = ty + size / 2;
          e[1] = ty + size / 2;
          break;
        case BaseFont.VERTICAL_ALIGN.bottom:
          s[1] = ty;
          e[1] = ty;
          break;
        default:
          break;
      }
    }
    dw.line(s, e);
  }

  drawXHTFont(xhtMeasure) {
    const { xDraw, attr, rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 填充宽度
    const verticalAlignPadding = this.verticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.center:
        bx += width / 2;
        break;
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.right:
        bx += width - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = size + verticalAlignPadding > height;
    const outboundsWidth = xhtMeasure.measure + alignPadding > width;
    if (outboundsHeight || outboundsWidth) {
      const crop = new Crop({
        draw: xDraw,
        rect,
      });
      crop.open();
      xDraw.fillText(xhtMeasure.text, bx, by);
      if (underline) {
        this.drawFontLine('underline', bx, by, xhtMeasure.measure);
      }
      if (strikethrough) {
        this.drawFontLine('strike', bx, by, xhtMeasure.measure);
      }
      crop.close();
    } else {
      xDraw.fillText(xhtMeasure.text, bx, by);
      if (underline) {
        this.drawFontLine('underline', bx, by, xhtMeasure.measure);
      }
      if (strikethrough) {
        this.drawFontLine('strike', bx, by, xhtMeasure.measure);
      }
    }
    return new FontDrawResult();
  }

  drawXHOFont(xhoMeasure) {
    const { xDraw, attr, rect, overflow } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 填充宽度
    const verticalAlignPadding = this.verticalAlignPadding();
    const alignPadding = this.alignPadding();
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = size + verticalAlignPadding > overflow.height;
    const outboundsWidth = xhoMeasure.measure + alignPadding > overflow.width;
    let pointOffset = false;
    if (align === BaseFont.ALIGN.center) {
      const diff = xhoMeasure.measure / 2 - width / 2;
      if (diff > 0) {
        if (overflow.x > rect.x - diff) {
          pointOffset = true;
        } else if (overflow.x + overflow.width < rect.x + rect.width + diff) {
          pointOffset = true;
        }
      }
    }
    if (outboundsHeight || outboundsWidth || pointOffset) {
      const crop = new Crop({
        draw: xDraw,
        rect: overflow,
      });
      crop.open();
      xDraw.fillText(xhoMeasure.text, bx, by);
      if (underline) {
        this.drawFontLine('underline', bx, by, xhoMeasure.measure);
      }
      if (strikethrough) {
        this.drawFontLine('strike', bx, by, xhoMeasure.measure);
      }
      crop.close();
    } else {
      xhoMeasure.fillText(xhoMeasure.text, bx, by);
      if (underline) {
        this.drawFontLine('underline', bx, by, xhoMeasure.textWidth);
      }
      if (strikethrough) {
        this.drawFontLine('strike', bx, by, xhoMeasure.textWidth);
      }
    }
    return new FontDrawResult(xhoMeasure.measure + alignPadding);
  }

  drawXHWFont(xhwMeasure) {
    const { xDraw, attr, rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign } = attr;
    // 填充宽度
    const verticalAlignPadding = this.verticalAlignPadding();
    const alignPadding = this.alignPadding();
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - xhwMeasure.measure / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - xhwMeasure.measure - verticalAlignPadding;
        break;
    }
    // 边界检查
    const totalHeight = xhwMeasure.measure + verticalAlignPadding;
    const outboundsHeight = totalHeight > height;
    if (outboundsHeight) {
      const crop = new Crop({
        draw: xDraw,
        rect,
      });
      crop.open();
      const textLen = xhwMeasure.group.length;
      let ti = 0;
      while (ti < textLen) {
        const item = xhwMeasure.group[ti];
        item.tx += bx;
        item.ty += by;
        xDraw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawFontLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawFontLine('strike', item.tx, item.ty, item.len);
        }
        ti += 1;
      }
      crop.close();
    } else {
      for (let i = 0, len = xhwMeasure.group; i < len; i += 1) {
        const item = xhwMeasure.group[i];
        item.tx += bx;
        item.ty += by;
        xDraw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawFontLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawFontLine('strike', item.tx, item.ty, item.len);
        }
      }
    }
    return new FontDrawResult();
  }

}

export {
  XHDrawFont,
};
