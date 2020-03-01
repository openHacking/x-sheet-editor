import { Crop } from './Crop';
import { npx } from './Draw';
import { Utils } from '../utils/Utils';

const PADDING = 8;

const ALIGN = {
  left: 'left',
  center: 'center',
  right: 'right',
};

const VERTICAL_ALIGN = {
  top: 'top',
  center: 'middle',
  bottom: 'bottom',
};

class Font {
  constructor({
    text, rect, dw, overflow, attr,
  }) {
    this.text = text;
    this.dw = dw;
    this.rect = rect;
    this.overflow = overflow;
    this.attr = Utils.mergeDeep({}, {
      name: 'Arial',
      size: npx(13),
      color: '#000000',
      bold: false,
      italic: false,
      textWrap: false,
      underline: false,
      strikethrough: false,
      align: ALIGN.left,
      verticalAlign: VERTICAL_ALIGN.center,
    }, attr);
  }

  textWidth(text) {
    const { dw } = this;
    return dw.measureText(text).width;
  }

  drawLine(type, tx, ty, textWidth) {
    const { dw, size } = this;
    const s = [0, 0];
    const e = [0, 0];
    switch (type) {
      case 'strike':
        s[0] = tx;
        s[1] = ty - size / 2;
        e[0] = tx + textWidth;
        e[1] = ty - size / 2;
        break;
      case 'underline':
        s[0] = tx;
        s[1] = ty + 2;
        e[0] = tx + textWidth;
        e[1] = ty + 2;
        break;
      default:
        break;
    }
    dw.line(s, e);
  }

  drawText() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, overflow,
    } = attr;
    const { width, height } = rect;
    const textWidth = this.textWidth(text);
    let tx = rect.x;
    let ty = rect.y;
    switch (align) {
      case ALIGN.left:
        tx += PADDING;
        break;
      case ALIGN.center:
        tx += width / 2;
        break;
      case ALIGN.right:
        tx += width - PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        ty += PADDING;
        break;
      case VERTICAL_ALIGN.center:
        ty += height / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        ty += height - PADDING;
        break;
      default: break;
    }
    if (overflow && textWidth > overflow.width) {
      const crop = new Crop({ draw: dw, overflow });
      crop.open();
      dw.fillText(text, tx, ty);
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      crop.close();
    } else {
      dw.fillText(text, tx, ty);
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
    }
  }

  drawTextWarp() {
    const { text, dw, attr, rect } = this;
    const { size, underline, strikethrough, align, verticalAlign } = attr;
    const { width, height } = rect;
    const maxTextWidth = npx(width) - PADDING * 2;
    const textArray = [];
    const textLine = {
      len: 0,
      start: 0,
    };
    const len = text.length;
    let hOffset = 0;
    let i = 0;
    while (i < len) {
      const charWidth = this.textWidth(text.charAt(i));
      const textWidth = textLine.len + charWidth;
      if (textWidth > maxTextWidth) {
        textArray.push({
          text: text.substring(textLine.start, i),
          len: textLine.len,
          tx: 0,
          ty: hOffset,
        });
        hOffset += size;
        textLine.len = 0;
        textLine.start = i;
      } else {
        textLine.len = textWidth;
        i += 1;
      }
    }
    if (textLine.len > 0) {
      textArray.push({
        text: text.substring(textLine.start),
        len: textLine.len,
        tx: 0,
        ty: hOffset,
      });
    }
    let bx = rect.x;
    let by = rect.y;
    switch (align) {
      case ALIGN.left:
        bx += PADDING;
        break;
      case ALIGN.center:
        bx += width / 2;
        break;
      case ALIGN.right:
        bx += width - PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        by += PADDING;
        break;
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset - PADDING;
        break;
      default: break;
    }
    const crop = new Crop({ draw: dw, rect });
    crop.open();
    for (let i = 0, len = textArray.length; i < len; i += 1) {
      const item = textArray[i];
      item.tx += bx;
      item.ty += by;
      dw.fillText(item.text, item.tx, item.ty);
      if (underline) {
        this.drawLine('underline', item.tx, item.ty, item.len);
      }
      if (strikethrough) {
        this.drawLine('strike', item.tx, item.ty, size, item.len);
      }
    }
    crop.close();
  }

  draw() {
    const { dw, attr } = this;
    const { textWrap } = attr;
    dw.attr({
      textAlign: attr.align,
      textBaseline: attr.verticalAlign,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${npx(attr.size)}px ${attr.name}`,
      fillStyle: attr.color,
    });
    if (textWrap) {
      this.drawTextWarp();
    } else {
      this.drawText();
    }
  }

  setTextWrap(textWrap) {
    this.attr.textWrap = textWrap;
  }
}

export { Font, VERTICAL_ALIGN, ALIGN };
