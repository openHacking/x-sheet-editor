import { BaseFont } from './BaseFont';
import { Utils } from '../../utils/Utils';
import { ALIGN, TEXT_WRAP, VERTICAL_ALIGN } from '../Font';
import { Crop } from '../Crop';

class HorizontalFont extends BaseFont {

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
    }, this.attr);
  }

  drawLine(type, tx, ty, textWidth) {
    const { dw, attr } = this;
    const { size, verticalAlign, align } = attr;
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

  draw() {
    const { text } = this;
    if (this.isBlank(text)) {
      return 0;
    }
    const { dw, attr } = this;
    const { textWrap } = attr;
    dw.attr({
      textAlign: attr.align,
      textBaseline: attr.verticalAlign,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${attr.size}px ${attr.name}`,
      fillStyle: attr.color,
      strokeStyle: attr.color,
    });
    switch (textWrap) {
      case TEXT_WRAP.OVER_FLOW:
        return this.overflowFont();
      case TEXT_WRAP.TRUNCATE:
        return this.truncateFont();
      case TEXT_WRAP.WORD_WRAP:
        return this.wrapTextFont();
    }
    return 0;
  }

  truncateFont() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, padding, size, lineHeight,
    } = attr;
    // 计算文本折行
    const breakArray = this.textBreak(text);
    const textArray = [];
    const { width, height } = rect;
    const breakLen = breakArray.length;
    let bi = 0;
    let hOffset = 0;
    let maxLen = 0;
    while (bi < breakLen) {
      const text = breakArray[bi];
      const item = {
        tx: 0,
        ty: hOffset,
        text,
        len: this.textWidth(text),
      };
      textArray.push(item);
      if (item.len > maxLen) {
        maxLen = item.len;
      }
      bi += 1;
      hOffset += size + lineHeight;
    }
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    let pw = 0;
    let ph = 0;
    switch (align) {
      case ALIGN.center:
        bx += width / 2;
        pw = 0;
        break;
      case ALIGN.left:
        bx += padding;
        pw = padding;
        break;
      case ALIGN.right:
        bx += width - padding;
        pw = padding;
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2;
        ph = 0;
        break;
      case VERTICAL_ALIGN.top:
        by += padding;
        ph = padding;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset - padding;
        ph = padding;
        break;
    }
    // 边界检查
    const outbounds = maxLen + pw > width || hOffset + ph > height;
    if (outbounds) {
      // 裁剪宽度
      const crop = new Crop({
        draw: dw,
        rect,
      });
      crop.open();
      // 文本绘制
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
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
      // 文本绘制
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len);
        }
        ti += 1;
      }
    }
    return 0;
  }

  overflowFont() {
    const {
      text, dw, attr, rect, overflow,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, padding, size, lineHeight,
    } = attr;
    // 计算文本折行
    const breakArray = this.textBreak(text);
    const textArray = [];
    const { width, height } = rect;
    const breakLen = breakArray.length;
    let bi = 0;
    let hOffset = 0;
    let maxLen = 0;
    while (bi < breakLen) {
      const text = breakArray[bi];
      const item = {
        tx: 0,
        ty: hOffset,
        text,
        len: this.textWidth(text),
      };
      textArray.push(item);
      if (item.len > maxLen) {
        maxLen = item.len;
      }
      bi += 1;
      hOffset += size + lineHeight;
    }
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    let pw = 0;
    let ph = 0;
    switch (align) {
      case ALIGN.center:
        bx += width / 2;
        pw = 0;
        break;
      case ALIGN.left:
        bx += padding;
        pw = padding;
        break;
      case ALIGN.right:
        bx += width - padding;
        pw = padding;
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2;
        ph = 0;
        break;
      case VERTICAL_ALIGN.top:
        by += padding;
        ph = padding;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset - padding;
        ph = padding;
        break;
    }
    // 边界检查
    const outbounds = maxLen + pw > overflow.width || hOffset + ph > overflow.height;
    let pointOffset = false;
    if (align === ALIGN.center) {
      const diff = maxLen / 2 - width / 2;
      if (diff > 0) {
        if (overflow.x > rect.x - diff) {
          pointOffset = true;
        }
      }
    }
    if (outbounds || pointOffset) {
      // 裁剪宽度
      const crop = new Crop({
        draw: dw,
        rect: overflow,
      });
      crop.open();
      // 文本绘制
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
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
      // 文本绘制
      const textLen = textArray.length;
      let ti = 0;
      while (ti < textLen) {
        const item = textArray[ti];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len);
        }
        ti += 1;
      }
    }
    // 计算文本占据的宽度(padding)
    let haveWidth = 0;
    switch (align) {
      case ALIGN.right:
      case ALIGN.left:
        haveWidth = padding + maxLen;
        break;
      case ALIGN.center:
        haveWidth = maxLen;
        break;
    }
    return haveWidth;
  }

  wrapTextFont() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, padding, size, lineHeight,
    } = attr;
    // 计算文本折行
    const breakArray = this.textBreak(text);
    const textArray = [];
    const { width, height } = rect;
    const maxWidth = width - (padding * 2);
    const breakLen = breakArray.length;
    let bi = 0;
    let hOffset = 0;
    while (bi < breakLen) {
      const text = breakArray[bi];
      const textLen = text.length;
      let ii = 0;
      const line = {
        len: 0,
        start: 0,
      };
      while (ii < textLen) {
        const textWidth = line.len + this.textWidth(text.charAt(ii));
        if (textWidth > maxWidth) {
          if (line.len === 0) {
            textArray.push({
              text: text.substring(ii, ii + 1),
              len: textWidth,
              tx: 0,
              ty: hOffset,
            });
            ii += 1;
          } else {
            textArray.push({
              text: text.substring(line.start, ii),
              len: line.len,
              tx: 0,
              ty: hOffset,
            });
          }
          hOffset += size + lineHeight;
          line.len = 0;
          line.start = ii;
        } else {
          line.len = textWidth;
          ii += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: text.substring(line.start),
          len: line.len,
          tx: 0,
          ty: hOffset,
        });
      }
      bi += 1;
    }
    // 计算文本坐标
    let bx = rect.x;
    let by = rect.y;
    let ph = 0;
    switch (align) {
      case ALIGN.left:
        bx += padding;
        break;
      case ALIGN.center:
        bx += width / 2;
        break;
      case ALIGN.right:
        bx += width - padding;
        break;
      default:
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2;
        ph = 0;
        break;
      case VERTICAL_ALIGN.top:
        by += padding;
        ph = padding;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset - padding;
        ph = padding;
        break;
    }
    // 边界检查
    const outbounds = hOffset + ph > height;
    if (outbounds) {
      // 裁剪宽度
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
        dw.fillText(item.text, item.tx, item.ty);
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len);
        }
      }
    }
    return 0;
  }

}

export {
  HorizontalFont,
};
