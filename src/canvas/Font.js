import { Crop } from './Crop';
import { dpr, npx } from './Draw';
import { Utils } from '../utils/Utils';

const PADDING = 8;

const LIEN_HEIGHT = 4;

const VERTICAL_SPACING = 2;

const VERTICAL_LIEN_HEIGHT = 0;

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

const TEXT_WRAP = {
  OVER_FLOW: 1,
  WORD_WRAP: 2,
  TRUNCATE: 3,
};

const TEXT_DIRECTION = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
};

class HorizontalFontDraw {
  constructor({
    text, rect, dw, overflow, attr,
  }) {
    this.text = text;
    this.dw = dw;
    this.rect = rect;
    this.overflow = overflow;
    this.attr = attr;
  }

  textWidth(text) {
    const { dw } = this;
    return dw.measureText(text).width;
  }

  drawLine(type, tx, ty, width) {
    const { dw, attr } = this;
    const { size, verticalAlign, align } = attr;
    const s = [0, 0];
    const e = [0, 0];
    const textWidth = width / dpr();
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
        default: break;
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
        default: break;
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
        default: break;
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
        default: break;
      }
    }
    dw.line(s, e);
  }

  drawTextTruncate() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign,
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
    const crop = new Crop({ draw: dw, rect });
    crop.open();
    dw.fillText(text, tx, ty);
    if (underline || strikethrough) {
      dw.beginPath();
    }
    if (underline) {
      this.drawLine('underline', tx, ty, textWidth);
    }
    if (strikethrough) {
      this.drawLine('strike', tx, ty, textWidth);
    }
    crop.close();
  }

  drawTextOverFlow() {
    const {
      text, dw, attr, rect, overflow,
    } = this;
    const {
      size, underline, strikethrough, align, verticalAlign,
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
    if (overflow && (textWidth > overflow.width || size > overflow.height)) {
      const crop = new Crop({ draw: dw, rect: overflow });
      crop.open();
      dw.fillText(text, tx, ty);
      if (underline || strikethrough) {
        dw.beginPath();
      }
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      crop.close();
    } else {
      dw.fillText(text, tx, ty);
      if (underline || strikethrough) {
        dw.beginPath();
      }
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
        hOffset += size + LIEN_HEIGHT;
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
      if (underline || strikethrough) {
        dw.beginPath();
      }
      if (underline) {
        this.drawLine('underline', item.tx, item.ty, item.len);
      }
      if (strikethrough) {
        this.drawLine('strike', item.tx, item.ty, item.len);
      }
    }
    crop.close();
    return hOffset;
  }

  draw() {
    const { dw, attr } = this;
    const { textWrap } = attr;
    dw.attr({
      textAlign: attr.align,
      textBaseline: attr.verticalAlign,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${npx(attr.size)}px ${attr.name}`,
      fillStyle: attr.color,
      strokeStyle: attr.color,
    });
    switch (textWrap) {
      case TEXT_WRAP.TRUNCATE:
        return this.drawTextTruncate();
      case TEXT_WRAP.WORD_WRAP:
        return this.drawTextWarp();
      case TEXT_WRAP.OVER_FLOW:
      default:
        return this.drawTextOverFlow();
    }
  }

  setTextWrap(textWrap) {
    this.attr.textWrap = textWrap;
  }
}

class VerticalFontDraw {
  constructor({
    text, rect, dw, overflow, attr,
  }) {
    this.text = text;
    this.dw = dw;
    this.rect = rect;
    this.overflow = overflow;
    this.attr = attr;
  }

  textWidth(text) {
    const { dw } = this;
    return dw.measureText(text).width;
  }

  drawLine(type, tx, ty, width, align, verticalAlign) {
    const { dw, attr } = this;
    const { size } = attr;
    const s = [0, 0];
    const e = [0, 0];
    const textWidth = width / dpr();
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
        default: break;
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
        default: break;
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
        default: break;
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
        default: break;
      }
    }
    dw.line(s, e);
  }

  drawTextTruncate() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size,
    } = attr;
    const { width, height } = rect;
    const textArray = [];
    let hOffset = 0;
    for (let i = 0; i < text.length; i += 1) {
      const char = text.charAt(i);
      textArray.push({
        len: this.textWidth(char),
        text: char,
        tx: 0,
        ty: hOffset,
      });
      if (i < text.length - 1) {
        hOffset += size + VERTICAL_SPACING;
      }
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
      if (underline || strikethrough) {
        dw.beginPath();
      }
      if (underline) {
        this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
      }
      if (strikethrough) {
        this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
      }
    }
    crop.close();
  }

  drawTextOverFlow() {
    const {
      text, dw, attr, rect, overflow,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size,
    } = attr;
    const { width, height } = rect;
    const textArray = [];
    let hOffset = 0;
    for (let i = 0; i < text.length; i += 1) {
      const char = text.charAt(i);
      textArray.push({
        len: this.textWidth(char),
        text: char,
        tx: 0,
        ty: hOffset,
      });
      if (i < text.length - 1) {
        hOffset += size + VERTICAL_SPACING;
      }
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
    if (overflow && (hOffset > overflow.height || size > overflow.width)) {
      const crop = new Crop({ draw: dw, rect: overflow });
      crop.open();
      for (let i = 0, len = textArray.length; i < len; i += 1) {
        const item = textArray[i];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline || strikethrough) {
          dw.beginPath();
        }
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
      }
      crop.close();
    } else {
      for (let i = 0, len = textArray.length; i < len; i += 1) {
        const item = textArray[i];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline || strikethrough) {
          dw.beginPath();
        }
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlign);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlign);
        }
      }
    }
  }

  drawTextWarp() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size,
    } = attr;
    const { width, height } = rect;
    const maxTextHeight = npx(height) - PADDING * 2;
    const textSize = npx(size);
    const textArray = [];
    const len = text.length;
    let textItem = [];
    let textLen = 0;
    let hOffset = 0;
    let wOffset = 0;
    let columnNum = 0;
    let i = 0;
    while (i < len) {
      const textHeight = textLen + textSize + VERTICAL_SPACING;
      if (textHeight > maxTextHeight) {
        textArray.push(textItem);
        textLen = 0;
        hOffset = 0;
        textItem = [];
        if (i > 0) wOffset += size + VERTICAL_LIEN_HEIGHT;
        columnNum += 1;
        const char = text.charAt(i);
        textItem.push({
          len: this.textWidth(char),
          text: char,
          tx: wOffset,
          ty: hOffset,
        });
      } else {
        const char = text.charAt(i);
        textItem.push({
          len: this.textWidth(char),
          text: char,
          tx: wOffset,
          ty: hOffset,
        });
      }
      textLen = textHeight;
      if (i < text.length - 1) {
        hOffset += size + VERTICAL_SPACING;
      }
      i += 1;
    }
    if (textItem.length > 0) {
      textArray.push(textItem);
    }
    let bx = rect.x;
    let by = rect.y;
    let verticalAlignValue = verticalAlign;
    switch (align) {
      case ALIGN.left:
        bx += PADDING;
        break;
      case ALIGN.center:
        bx += width / 2 - wOffset / 2;
        break;
      case ALIGN.right:
        bx += width - wOffset - PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        dw.attr({
          textBaseline: attr.verticalAlign,
        });
        by += PADDING;
        verticalAlignValue = VERTICAL_ALIGN.top;
        break;
      case VERTICAL_ALIGN.center:
        if (columnNum === 0) {
          dw.attr({
            textBaseline: attr.verticalAlign,
          });
          by += height / 2 - hOffset / 2;
          verticalAlignValue = VERTICAL_ALIGN.center;
        } else {
          dw.attr({
            textBaseline: VERTICAL_ALIGN.top,
          });
          by += PADDING;
          verticalAlignValue = VERTICAL_ALIGN.top;
        }
        break;
      case VERTICAL_ALIGN.bottom:
        if (columnNum === 0) {
          dw.attr({
            textBaseline: VERTICAL_ALIGN.bottom,
          });
          by += height - hOffset - PADDING;
          verticalAlignValue = VERTICAL_ALIGN.bottom;
        } else {
          dw.attr({
            textBaseline: VERTICAL_ALIGN.top,
          });
          by += PADDING;
          verticalAlignValue = VERTICAL_ALIGN.top;
        }
        break;
      default: break;
    }
    const crop = new Crop({ draw: dw, rect });
    crop.open();
    for (let i = 0, len = textArray.length; i < len; i += 1) {
      const textItem = textArray[i];
      for (let j = 0; j < textItem.length; j += 1) {
        const item = textItem[j];
        item.tx += bx;
        item.ty += by;
        dw.fillText(item.text, item.tx, item.ty);
        if (underline || strikethrough) {
          dw.beginPath();
        }
        if (underline) {
          this.drawLine('underline', item.tx, item.ty, item.len, align, verticalAlignValue);
        }
        if (strikethrough) {
          this.drawLine('strike', item.tx, item.ty, item.len, align, verticalAlignValue);
        }
      }
    }
    crop.close();
  }

  draw() {
    const { dw, attr } = this;
    const { textWrap } = attr;
    switch (textWrap) {
      case TEXT_WRAP.TRUNCATE:
        dw.attr({
          textAlign: attr.align,
          textBaseline: attr.verticalAlign,
          font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${npx(attr.size)}px ${attr.name}`,
          fillStyle: attr.color,
          strokeStyle: attr.color,
        });
        return this.drawTextTruncate();
      case TEXT_WRAP.WORD_WRAP:
        dw.attr({
          textAlign: attr.align,
          font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${npx(attr.size)}px ${attr.name}`,
          fillStyle: attr.color,
          strokeStyle: attr.color,
        });
        return this.drawTextWarp();
      case TEXT_WRAP.OVER_FLOW:
      default:
        dw.attr({
          textAlign: attr.align,
          textBaseline: attr.verticalAlign,
          font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${npx(attr.size)}px ${attr.name}`,
          fillStyle: attr.color,
          strokeStyle: attr.color,
        });
        return this.drawTextOverFlow();
    }
  }

  setTextWrap(textWrap) {
    this.attr.textWrap = textWrap;
  }
}

class Font {
  constructor({
    text, rect, dw, overflow, attr,
  }) {
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
      direction: TEXT_DIRECTION.HORIZONTAL,
      angle: 0,
    }, attr);
    this.horizontalFontDraw = new HorizontalFontDraw({
      text, rect, dw, overflow, attr: this.attr,
    });
    this.verticalFontDraw = new VerticalFontDraw({
      text, rect, dw, overflow, attr: this.attr,
    });
  }

  draw() {
    const { attr } = this;
    switch (attr.direction) {
      case TEXT_DIRECTION.VERTICAL:
        this.verticalFontDraw.draw();
        break;
      case TEXT_DIRECTION.HORIZONTAL:
      default:
        this.horizontalFontDraw.draw();
    }
  }

  setTextWrap(textWrap) {
    const { attr } = this;
    switch (attr.direction) {
      case TEXT_DIRECTION.VERTICAL:
        this.verticalFontDraw.setTextWrap(textWrap);
        break;
      case TEXT_DIRECTION.HORIZONTAL:
      default:
        this.horizontalFontDraw.setTextWrap(textWrap);
    }
  }
}

export { VERTICAL_ALIGN, ALIGN, TEXT_WRAP, TEXT_DIRECTION };

export { Font };
