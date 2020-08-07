import { BaseFont } from './BaseFont';
import { Utils } from '../../utils/Utils';
import { Crop } from '../Crop';

class VerticalFont extends BaseFont {

  constructor({
    text,
    overflow,
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

  draw() {
    const { text } = this;
    if (this.isBlank(text)) {
      return 0;
    }
    const { dw, attr } = this;
    const { textWrap } = attr;
    dw.attr({
      textAlign: BaseFont.ALIGN.left,
      textBaseline: BaseFont.VERTICAL_ALIGN.top,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${attr.size}px ${attr.name}`,
      fillStyle: attr.color,
      strokeStyle: attr.color,
    });
    switch (textWrap) {
      case BaseFont.TEXT_WRAP.OVER_FLOW:
        return this.overflowFont();
      case BaseFont.TEXT_WRAP.TRUNCATE:
        return this.truncateFont();
      case BaseFont.TEXT_WRAP.WORD_WRAP:
        return this.wrapTextFont();
    }
    return 0;
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
      if (hOffset > 0) {
        hOffset -= spacing;
      }
      if (hOffset > maxLen) {
        maxLen = hOffset;
      }
      wOffset += size + lineHeight;
      bi += 1;
    }
    if (wOffset > 0) {
      wOffset -= lineHeight;
    }
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    let pw = 0;
    let ph = 0;
    switch (align) {
      case BaseFont.ALIGN.center:
        bx += width / 2 - wOffset / 2;
        pw = 0;
        break;
      case BaseFont.ALIGN.right:
        bx += width - wOffset - padding;
        pw = padding;
        break;
      case BaseFont.ALIGN.left:
        bx += padding;
        pw = padding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - maxLen / 2;
        ph = 0;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - maxLen - padding;
        ph = padding;
        break;
      case BaseFont.VERTICAL_ALIGN.top:
        by += padding;
        ph = padding;
        break;
    }
    // 边界检查
    const totalWidth = (textArray.length * (size + lineHeight)) - lineHeight;
    const outbounds = maxLen + ph > height || totalWidth + pw > width;
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
        const item = {
          len: this.textWidth(char),
          text: char,
          tx: wOffset,
          ty: hOffset,
        };
        if (ii === 0) {
          textArray.push(item);
        } else {
          textArray.push(item);
          if (item.ty + size > maxHeight) {
            if (hOffset > 0) {
              hOffset -= spacing;
            }
            if (hOffset > maxLen) {
              maxLen = hOffset;
            }
            hOffset = 0;
            wOffset += size + lineHeight;
            item.tx = wOffset;
            item.ty = hOffset;
          }
        }
        hOffset += size + spacing;
        ii += 1;
      }
      if (hOffset > 0) {
        hOffset -= spacing;
      }
      if (hOffset > maxLen) {
        maxLen = hOffset;
      }
      wOffset += size + lineHeight;
      bi += 1;
    }
    if (wOffset > 0) {
      wOffset -= lineHeight;
    }
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    let pw = 0;
    switch (align) {
      case BaseFont.ALIGN.center:
        bx += width / 2 - wOffset / 2;
        pw = 0;
        break;
      case BaseFont.ALIGN.right:
        bx += width - wOffset - padding;
        pw = padding;
        break;
      case BaseFont.ALIGN.left:
        bx += padding;
        pw = padding;
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.center:
        by += height / 2 - maxLen / 2;
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        by += height - maxLen - padding;
        break;
      case BaseFont.VERTICAL_ALIGN.top:
        by += padding;
        break;
    }
    // 边界检查
    const totalWidth = (textArray.length * (size + lineHeight)) - lineHeight;
    const outbounds = totalWidth + pw > width;
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
