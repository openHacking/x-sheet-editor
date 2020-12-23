import { BaseFont } from '../BaseFont';
import { Crop } from '../../Crop';
import { DrawResult } from '../DrawResult';

class VerticalDraw extends BaseFont {

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
    const { underline, strikethrough, align, verticalAlign } = attr;
    const { size } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 文本位置计算
    ruler.truncateRuler();
    const {
      truncateTextArray: textArray,
      truncateMaxLen: maxLen,
    } = ruler;
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2 - size / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - size - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - maxLen / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - maxLen - verticalAlignPadding;
        break;
    }
    // 边界检查
    const outboundsHeight = maxLen + verticalAlignPadding > height;
    const outboundsWidth = size + alignPadding > width;
    if (outboundsHeight || outboundsWidth) {
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
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
      crop.close();
    } else {
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        draw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
    }
    return new DrawResult();
  }

  overflowDraw() {
    return this.truncateDraw();
  }

  textWrapDraw() {
    const { draw, ruler, attr } = this;
    const { rect } = this;
    const { width, height } = rect;
    const { size, verticalAlign, underline } = attr;
    const { strikethrough, align } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
    // 计算文本折行
    ruler.overflowRuler();
    const {
      textWrapTextArray: textArray,
      textWrapMaxLen: maxLen,
      textWrapWOffset: wOffset,
    } = ruler;
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case BaseFont.ALIGN.left:
        bx += alignPadding;
        break;
      case BaseFont.ALIGN.center:
        bx += width / 2 - wOffset / 2;
        break;
      case BaseFont.ALIGN.right:
        bx += width - wOffset - alignPadding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        by += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - maxLen / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - maxLen - verticalAlignPadding;
        break;
    }
    // 边界检查
    const totalWidth = textArray.length * size;
    const outboundsWidth = totalWidth + alignPadding > width;
    if (outboundsWidth) {
      const textLen = textArray.length;
      const crop = new Crop({
        draw,
        rect,
      });
      crop.open();
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        draw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
      crop.close();
    } else {
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        draw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
    }
    return new DrawResult();
  }

}

export {
  VerticalDraw,
};
