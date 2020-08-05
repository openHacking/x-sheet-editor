import { BaseFont } from './BaseFont';
import { ALIGN, VERTICAL_ALIGN } from '../Font';
import { Utils } from '../../utils/Utils';
import { Crop } from '../Crop';

class VerticalFont extends BaseFont {

  constructor({
    overflow,
    text,
    rect,
    dw,
    attr,
  }) {
    super({
      overflow,
      text,
      rect,
      dw,
      attr,
    });
    this.attr = Utils.mergeDeep({
      lineHeight: 4,
      spacing: 2,
    }, this.attr);
  }

  drawLine(type, tx, ty, textWidth, align, verticalAlign) {
    const { dw, attr } = this;
    const { size } = attr;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      switch (align) {
        case ALIGN.right:
          s[0] = tx - textWidth;
          e[0] = tx;
          break;
        case ALIGN.center:
          s[0] = tx - textWidth / 2;
          e[0] = tx + textWidth / 2;
          break;
        case ALIGN.left:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case VERTICAL_ALIGN.top:
          s[1] = ty + size / 2;
          e[1] = ty + size / 2;
          break;
        case VERTICAL_ALIGN.center:
          s[1] = ty;
          e[1] = ty;
          break;
        case VERTICAL_ALIGN.bottom:
          s[1] = ty - size / 2;
          e[1] = ty - size / 2;
          break;
        default:
          break;
      }
    }
    if (type === 'underline') {
      switch (align) {
        case ALIGN.right:
          s[0] = tx - textWidth;
          e[0] = tx;
          break;
        case ALIGN.center:
          s[0] = tx - textWidth / 2;
          e[0] = tx + textWidth / 2;
          break;
        case ALIGN.left:
          s[0] = tx;
          e[0] = tx + textWidth;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case VERTICAL_ALIGN.top:
          s[1] = ty + size;
          e[1] = ty + size;
          break;
        case VERTICAL_ALIGN.center:
          s[1] = ty + size / 2;
          e[1] = ty + size / 2;
          break;
        case VERTICAL_ALIGN.bottom:
          s[1] = ty;
          e[1] = ty;
          break;
        default:
          break;
      }
    }
    dw.line(s, e);
  }

  truncateFont() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, padding, size, lineHeight, spacing,
    } = attr;
    // 计算文本折行
    const breakArray = this.textBreak(text);
    const textArray = [];
    const { width, height } = rect;
    const breakLen = breakArray.length;
    let bi = 0;
    let wOffset = 0;
    let maxLen = 0;
    while (bi < breakLen) {
      const text = breakArray[bi];
      const textLen = text.length;
      let hOffset = 0;
      let ii = 0;
      while (ii < textLen) {
        const char = text.charAt(ii);
        textArray.push({
          len: this.textWidth(char),
          text: char,
          tx: wOffset,
          ty: hOffset,
        });
        hOffset += size + spacing;
        ii += 1;
      }
      wOffset += size + lineHeight;
      if (hOffset > maxLen) {
        maxLen = hOffset;
      }
      bi += 1;
    }
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    let pw = 0;
    let ph = 0;
    switch (align) {
      case ALIGN.center:
        bx += width / 2 - wOffset / 2;
        pw = 0;
        break;
      case ALIGN.right:
        bx += width - wOffset - padding;
        pw = padding;
        break;
      case ALIGN.left:
        bx += padding;
        pw = padding;
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.center:
        by += height / 2 - maxLen / 2;
        ph = 0;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - maxLen - padding;
        ph = padding;
        break;
      case VERTICAL_ALIGN.top:
        by += padding;
        ph = padding;
        break;
    }
    // 边界检查
    const outbounds = maxLen + ph > height || wOffset + pw > width;
    if (outbounds) {
      const crop = new Crop({
        draw: dw,
        rect,
      });
      crop.open();
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
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
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
    }
    return 0;
  }

  overflowFont() {
    return this.truncateFont();
  }

  wrapTextFont() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, padding, size, lineHeight, spacing,
    } = attr;
    // 计算文本折行
    const breakArray = this.textBreak(text);
    const textArray = [];
    const { width, height } = rect;
    const maxHeight = height - (padding * 2);
    const breakLen = breakArray.length;
    let bi = 0;
    let wOffset = 0;
    let maxLen = 0;
    while (bi < breakLen) {
      const text = breakArray[bi];
      const textLen = text.length;
      let hOffset = 0;
      let ii = 0;
      while (ii < textLen) {
        const char = text.charAt(ii);
        textArray.push({
          len: this.textWidth(char),
          text: char,
          tx: wOffset,
          ty: hOffset,
        });
        hOffset += size + spacing;
        if (hOffset > maxHeight) {
          if (hOffset > maxLen) {
            maxLen = hOffset;
          }
          hOffset = 0;
          wOffset += size + lineHeight;
        }
        ii += 1;
      }
      wOffset += size + lineHeight;
      if (hOffset > maxLen) {
        maxLen = hOffset;
      }
      bi += 1;
    }
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    let pw = 0;
    switch (align) {
      case ALIGN.center:
        bx += width / 2 - wOffset / 2;
        pw = 0;
        break;
      case ALIGN.right:
        bx += width - wOffset - padding;
        pw = padding;
        break;
      case ALIGN.left:
        bx += padding;
        pw = padding;
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.center:
        by += height / 2 - maxLen / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - maxLen - padding;
        break;
      case VERTICAL_ALIGN.top:
        by += padding;
        break;
    }
    // 边界检查
    const outbounds = wOffset + pw > width;
    if (outbounds) {
      const crop = new Crop({
        draw: dw,
        rect,
      });
      crop.open();
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
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
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
        ti += 1;
      }
    }
    return 0;
  }

}

export {
  VerticalFont,
};
