import { BaseFont } from './BaseFont';
import { Utils } from '../../utils/Utils';
import { ALIGN, VERTICAL_ALIGN } from '../Font';
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

  truncate() {
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
    switch (align) {
      case ALIGN.center:
        bx += width / 2;
        break;
      case ALIGN.left:
        bx += padding;
        break;
      case ALIGN.right:
        bx += width - padding;
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2;
        break;
      case VERTICAL_ALIGN.top:
        by += padding;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset - padding;
        break;
    }
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
    // 计算文本占据的宽度
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

  overFlow() {
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
      const outWidth = maxLen / 2 - width / 2;
      if (outWidth > 0) {
        if (overflow.x > rect.x - outWidth) {
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

  wrapText() {}

}

export {
  HorizontalFont,
};
