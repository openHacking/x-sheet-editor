import { BaseFont } from '../BaseFont';
import { Crop } from '../../Crop';
import { DrawResult } from '../DrawResult';

class HorizonDraw extends BaseFont {

  constructor({
    draw, ruler, rect, overflow, attr,
  }) {
    super({ draw, ruler, attr });
    this.rect = rect;
    this.overflow = overflow;
  }

  truncateDraw() {
    const { draw, ruler, attr } = this;
    const { rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 文字宽度
    ruler.truncateRuler();
    const {
      truncateText: text,
      truncateTextWidth: textWidth,
    } = ruler;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
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
    const outboundsWidth = textWidth + alignPadding > width;
    if (outboundsHeight || outboundsWidth) {
      const crop = new Crop({
        draw,
        rect,
      });
      crop.open();
      draw.fillText(text, bx, by);
      if (underline) {
        this.drawLine('underline', bx, by, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', bx, by, textWidth);
      }
      crop.close();
    } else {
      draw.fillText(text, bx, by);
      if (underline) {
        this.drawLine('underline', bx, by, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', bx, by, textWidth);
      }
    }
    return new DrawResult();
  }

  overflowDraw() {
    const { draw, ruler, attr } = this;
    const { rect, overflow } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 文字宽度
    ruler.overflowRuler();
    const {
      truncateText: text,
      truncateTextWidth: textWidth,
    } = ruler;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
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
    const outboundsWidth = textWidth + alignPadding > overflow.width;
    let pointOffset = false;
    if (align === BaseFont.ALIGN.center) {
      const diff = textWidth / 2 - width / 2;
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
        draw,
        rect: overflow,
      });
      crop.open();
      draw.fillText(text, bx, by);
      if (underline) {
        this.drawLine('underline', bx, by, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', bx, by, textWidth);
      }
      crop.close();
    } else {
      draw.fillText(text, bx, by);
      if (underline) {
        this.drawLine('underline', bx, by, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', bx, by, textWidth);
      }
    }
    return new DrawResult({
      width: textWidth + alignPadding,
    });
  }

  textWrapDraw() {
    const { draw, ruler, attr } = this;
    const { rect } = this;
    const { width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size, lineHeight } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本折行
    ruler.textWrapRuler();
    const {
      textWrapTextArray: textArray,
      textWrapHOffset: hOffset,
    } = ruler;
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
      default:
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - hOffset - verticalAlignPadding;
        break;
    }
    // 边界检查
    const totalHeight = (textArray.length * (size + lineHeight)) - lineHeight;
    const outboundsHeight = totalHeight + verticalAlignPadding > height;
    if (outboundsHeight) {
      const crop = new Crop({
        draw,
        rect,
      });
      crop.open();
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        draw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len);
        }
        ti += 1;
      }
      crop.close();
    } else {
      for (let i = 0, len = textArray.length; i < len; i += 1) {
        const item = textArray[i];
        item.tx += bx;
        item.ty += by;
        draw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len);
        }
      }
    }
    return new DrawResult();
  }

}

export {
  HorizonDraw,
};
