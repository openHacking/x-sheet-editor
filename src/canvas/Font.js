import { Crop } from './Crop';
import { dpr, npx } from './Draw';
import { Utils } from '../utils/Utils';
import { DrawAngle, TrigonometricFunction } from './DrawAngle';
import { Rect } from './Rect';

const PADDING = 8;

const HORIZONTAL_LIEN_HEIGHT = 4;

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
  ANGLE: 'angle',
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
    const textWidth = this.textWidth(text) / dpr();
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
    const textWidth = this.textWidth(text) / dpr();
    let tx = rect.x;
    let ty = rect.y;
    let paddingH = 0;
    let paddingV = 0;
    switch (align) {
      case ALIGN.left:
        tx += PADDING;
        paddingH = PADDING;
        break;
      case ALIGN.center:
        tx += width / 2;
        break;
      case ALIGN.right:
        tx += width - PADDING;
        paddingH = PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        ty += PADDING;
        paddingV = PADDING;
        break;
      case VERTICAL_ALIGN.center:
        ty += height / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        ty += height - PADDING;
        paddingV = PADDING;
        break;
      default: break;
    }
    if (overflow && (textWidth + paddingH > overflow.width || size + paddingV > overflow.height)) {
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
    const maxTextWidth = width - PADDING * 2;
    const textArray = [];
    const textLine = {
      len: 0,
      start: 0,
    };
    const len = text.length;
    let hOffset = 0;
    let i = 0;
    while (i < len) {
      const charWidth = this.textWidth(text.charAt(i)) / dpr();
      const textWidth = textLine.len + charWidth;
      if (textWidth > maxTextWidth) {
        if (textLine.len === 0) {
          textArray.push({
            text: text.substring(i, i + 1),
            len: textWidth,
            tx: 0,
            ty: hOffset,
          });
          i += 1;
        } else {
          textArray.push({
            text: text.substring(textLine.start, i),
            len: textLine.len,
            tx: 0,
            ty: hOffset,
          });
        }
        hOffset += size + HORIZONTAL_LIEN_HEIGHT;
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
        len: this.textWidth(char) / dpr(),
        text: char,
        tx: 0,
        ty: hOffset,
      });
      if (i < text.length - 1) {
        hOffset += size + VERTICAL_SPACING;
      } else {
        hOffset += size;
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
        by += height / 2 - hOffset / 2 + PADDING;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset + PADDING;
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
        len: this.textWidth(char) / dpr(),
        text: char,
        tx: 0,
        ty: hOffset,
      });
      if (i < text.length - 1) {
        hOffset += size + VERTICAL_SPACING;
      } else {
        hOffset += size;
      }
    }
    let bx = rect.x;
    let by = rect.y;
    let paddingH = 0;
    let paddingV = 0;
    switch (align) {
      case ALIGN.left:
        bx += PADDING;
        paddingH = PADDING;
        break;
      case ALIGN.center:
        bx += width / 2;
        break;
      case ALIGN.right:
        bx += width - PADDING;
        paddingH = PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        by += PADDING;
        paddingV = PADDING;
        break;
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2 + PADDING;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset + PADDING;
        paddingV = PADDING;
        break;
      default: break;
    }
    if (overflow && (hOffset + paddingV > overflow.height || size + paddingH > overflow.width)) {
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
    const textArray = [];
    const len = text.length;
    const boxHeight = height - PADDING * 2;
    let textItem = [];
    let textLen = 0;
    let hOffset = 0;
    let wOffset = 0;
    let column = 0;
    let i = 0;
    while (i < len) {
      const last = i === len - 1;
      const first = i === 0;
      const char = text.charAt(i);
      const charWidth = this.textWidth(char) / dpr();
      let textHeight;
      if (last) {
        textHeight = textLen + size;
      } else {
        textHeight = textLen + size + VERTICAL_SPACING;
      }
      if (textHeight > boxHeight) {
        if (textItem.length > 0) {
          textArray.push(textItem);
        }
        textLen = 0;
        hOffset = 0;
        textItem = [];
        if (!first) wOffset += size + VERTICAL_LIEN_HEIGHT;
        column += 1;
        textItem.push({
          len: charWidth,
          text: char,
          tx: wOffset,
          ty: hOffset,
        });
        if (last) {
          textLen = size;
        } else {
          textLen = size + VERTICAL_SPACING;
        }
      } else {
        textItem.push({
          len: charWidth,
          text: char,
          tx: wOffset,
          ty: hOffset,
        });
        textLen = textHeight;
      }
      if (last) {
        hOffset += size;
      } else {
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
        if (column === 0) {
          dw.attr({
            textBaseline: attr.verticalAlign,
          });
          by += height / 2 - hOffset / 2 + PADDING;
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
        if (column === 0) {
          dw.attr({
            textBaseline: VERTICAL_ALIGN.bottom,
          });
          by += height - hOffset + PADDING;
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

class AngleFontDraw {
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

  drawLine(type, tx, ty, textWidth) {
    const { dw, attr } = this;
    const { size } = attr;
    const s = [0, 0];
    const e = [0, 0];
    if (type === 'strike') {
      s[0] = tx;
      e[0] = tx + textWidth;
      s[1] = ty + size / 2;
      e[1] = ty + size / 2;
    }
    if (type === 'underline') {
      s[0] = tx;
      e[0] = tx + textWidth;
      s[1] = ty + size;
      e[1] = ty + size;
    }
    dw.line(s, e);
  }

  drawTextTruncate() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, angle, size,
    } = attr;
    const { width, height } = rect;
    const textWidth = this.textWidth(text) / dpr();
    const trigonometric = new TrigonometricFunction({ angle, width: textWidth, height: size });
    const trigonometricWidth = trigonometric.cosWidthAngle();
    const trigonometricHeight = trigonometric.sinWidthAngle();
    let rtx = rect.x;
    let rty = rect.y;
    switch (align) {
      case ALIGN.left:
        rtx += PADDING;
        break;
      case ALIGN.center:
        rtx += width / 2 - trigonometricWidth / 2;
        break;
      case ALIGN.right:
        rtx += width - trigonometricWidth - PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        rty += PADDING;
        break;
      case VERTICAL_ALIGN.center:
        rty += height / 2 - trigonometricHeight / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        rty += height - trigonometricHeight - PADDING;
        break;
      default: break;
    }
    const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
    const ty = rty + (trigonometricHeight / 2 - size / 2);
    const dwAngle = new DrawAngle({
      dw,
      angle,
      rect: new Rect({
        x: rtx, y: rty, width: trigonometricWidth, height: trigonometricHeight,
      }),
    });
    const crop = new Crop({ draw: dw, rect });
    crop.open();
    dwAngle.rotate();
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
    dwAngle.revert();
    crop.close();
  }

  drawTextOverFlow() {
    const {
      text, dw, attr, rect, overflow,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, angle, size,
    } = attr;
    const { width, height } = rect;
    const textWidth = this.textWidth(text) / dpr();
    const trigonometric = new TrigonometricFunction({ angle, width: textWidth, height: size });
    const trigonometricWidth = trigonometric.cosWidthAngle();
    const trigonometricHeight = trigonometric.sinWidthAngle();
    let rtx = rect.x;
    let rty = rect.y;
    switch (align) {
      case ALIGN.left:
        rtx += PADDING;
        break;
      case ALIGN.center:
        rtx += width / 2 - trigonometricWidth / 2;
        break;
      case ALIGN.right:
        rtx += width - trigonometricWidth - PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        rty += PADDING;
        break;
      case VERTICAL_ALIGN.center:
        rty += height / 2 - trigonometricHeight / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        rty += height - trigonometricHeight - PADDING;
        break;
      default: break;
    }
    const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
    const ty = rty + (trigonometricHeight / 2 - size / 2);
    const crop = new Crop({ draw: dw, rect: overflow });
    const dwAngle = new DrawAngle({
      dw,
      angle,
      rect: new Rect({
        x: rtx, y: rty, width: trigonometricWidth, height: trigonometricHeight,
      }),
    });
    const isOverFlow = overflow
      && (trigonometricWidth > overflow.width || trigonometricHeight > overflow.height);
    if (isOverFlow) {
      crop.open();
      dwAngle.rotate();
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
      dwAngle.revert();
      crop.close();
    } else {
      const dwAngle = new DrawAngle({
        dw,
        angle,
        rect: new Rect({
          x: rtx, y: rty, width: trigonometricWidth, height: trigonometricHeight,
        }),
      });
      dwAngle.rotate();
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
      dwAngle.revert();
    }
  }

  drawTextWarp() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, angle, size,
    } = attr;
    const { width, height } = rect;
    if (angle === 0) {
      const maxTextWidth = width - PADDING * 2;
      const textArray = [];
      const textLine = {
        len: 0,
        start: 0,
      };
      const len = text.length;
      let i = 0;
      while (i < len) {
        const charWidth = this.textWidth(text.charAt(i)) / dpr();
        const textWidth = textLine.len + charWidth;
        if (textWidth > maxTextWidth) {
          if (textLine.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
          } else {
            textArray.push({
              text: text.substring(textLine.start, i),
              len: textLine.len,
              tx: 0,
              ty: 0,
            });
          }
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
          ty: 0,
        });
      }
      const textArrayLen = textArray.length;
      let hOffset = 0;
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        item.ty = hOffset;
        hOffset += size + HORIZONTAL_LIEN_HEIGHT;
      }
      const totalTextHeight = textArrayLen * (size + HORIZONTAL_LIEN_HEIGHT);
      const crop = new Crop({ draw: dw, rect });
      crop.open();
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        let tx = rect.x;
        let ty = rect.y;
        switch (align) {
          case ALIGN.left:
            tx += PADDING;
            break;
          case ALIGN.center:
            tx += width / 2 - item.len / 2;
            break;
          case ALIGN.right:
            tx += width - item.len - PADDING;
            break;
          default: break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            ty += item.ty + PADDING;
            break;
          case VERTICAL_ALIGN.center:
            ty += item.ty + (height / 2 - totalTextHeight / 2);
            break;
          case VERTICAL_ALIGN.bottom:
            ty += item.ty + (height - totalTextHeight - PADDING);
            break;
          default: break;
        }
        dw.fillText(item.text, tx, ty);
        if (underline || strikethrough) {
          dw.beginPath();
        }
        if (underline) {
          this.drawLine('underline', tx, ty, item.len);
        }
        if (strikethrough) {
          this.drawLine('strike', tx, ty, item.len);
        }
      }
      crop.close();
    } else if (angle > 0) {
      const trigonometric = new TrigonometricFunction({
        angle,
      });
      trigonometric.setWidth(width);
      trigonometric.setHeight(height - PADDING * 2);
      const textHypotenuseWidth = trigonometric.sinHeightAngle();
      trigonometric.setWidth(size + HORIZONTAL_LIEN_HEIGHT);
      trigonometric.setHeight(size + HORIZONTAL_LIEN_HEIGHT);
      const lineHeight = trigonometric.sinHeightAngle();
      trigonometric.setWidth(textHypotenuseWidth);
      trigonometric.setHeight(size);
      const textWidth = trigonometric.cosWidthAngle();
      const textHeight = trigonometric.sinWidthAngle();
      const textArray = [];
      const textLine = {
        len: 0,
        start: 0,
      };
      const len = text.length;
      let i = 0;
      while (i < len) {
        const charWidth = this.textWidth(text.charAt(i)) / dpr();
        const textWidth = textLine.len + charWidth;
        if (textWidth > textHypotenuseWidth) {
          if (textLine.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
          } else {
            textArray.push({
              text: text.substring(textLine.start, i),
              len: textLine.len,
              tx: 0,
              ty: 0,
            });
          }
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
          ty: 0,
        });
      }
      const textArrayLen = textArray.length;
      let wOffset = 0;
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        item.tx = wOffset;
        wOffset += lineHeight;
      }
      const crop = new Crop({ draw: dw, rect });
      crop.open();
      if (textArrayLen > 1) {
        const totalWidth = textWidth + ((textArray.length - 1) * lineHeight);
        let bx = rect.x;
        let by = rect.y;
        switch (align) {
          case ALIGN.left:
            bx += PADDING;
            break;
          case ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            break;
          case ALIGN.right:
            bx += width - totalWidth - PADDING;
            break;
          default: break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            by += PADDING;
            break;
          case VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            break;
          case VERTICAL_ALIGN.bottom:
            by += height - textHeight - PADDING;
            break;
          default: break;
        }
        for (let i = 0; i < textArray.length; i += 1) {
          const item = textArray[i];
          const rx = item.tx + bx;
          const ry = item.ty + by;
          let ax = 0;
          let ay = 0;
          switch (align) {
            case ALIGN.left: {
              trigonometric.setWidth(item.len / 2);
              trigonometric.setHeight(size);
              const tw = trigonometric.cosWidthAngle();
              const th = trigonometric.sinWidthAngle();
              ax += rx + tw;
              ay += ry + textHeight - th;
              break;
            }
            case ALIGN.center: {
              ax = rx + textWidth / 2;
              ay = ry + textHeight / 2;
              break;
            }
            case ALIGN.right: {
              trigonometric.setWidth(item.len / 2);
              trigonometric.setHeight(size);
              const tw = trigonometric.cosWidthAngle();
              const th = trigonometric.sinWidthAngle();
              ax += rx + textWidth - tw;
              ay += ry + th;
              break;
            }
            default: break;
          }
          const tx = ax - item.len / 2;
          const ty = ay - size / 2;
          if (i === -1) {
            dw.attr({ fillStyle: '#000000' });
            dw.fillRect(rx, ry, textWidth, textHeight);
            dw.attr({ fillStyle: 'red' });
          }
          const dwAngle = new DrawAngle({
            dw,
            angle,
            rect: new Rect({
              x: tx, y: ty, width: item.len, height: size,
            }),
          });
          dwAngle.rotate();
          dw.fillText(item.text, tx, ty);
          if (underline || strikethrough) {
            dw.beginPath();
          }
          if (underline) {
            this.drawLine('underline', tx, ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', tx, ty, item.len);
          }
          dwAngle.revert();
        }
      } else {
        const textWidth = this.textWidth(text) / dpr();
        trigonometric.setWidth(textWidth);
        trigonometric.setHeight(size);
        const trigonometricWidth = trigonometric.cosWidthAngle();
        const trigonometricHeight = trigonometric.sinWidthAngle();
        let rtx = rect.x;
        let rty = rect.y;
        switch (align) {
          case ALIGN.left:
            rtx += PADDING;
            break;
          case ALIGN.center:
            rtx += width / 2 - trigonometricWidth / 2;
            break;
          case ALIGN.right:
            rtx += width - trigonometricWidth - PADDING;
            break;
          default: break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            rty += PADDING;
            break;
          case VERTICAL_ALIGN.center:
            rty += height / 2 - trigonometricHeight / 2;
            break;
          case VERTICAL_ALIGN.bottom:
            rty += height - trigonometricHeight - PADDING;
            break;
          default: break;
        }
        const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
        const ty = rty + (trigonometricHeight / 2 - size / 2);
        const dwAngle = new DrawAngle({
          dw,
          angle,
          rect: new Rect({
            x: rtx, y: rty, width: trigonometricWidth, height: trigonometricHeight,
          }),
        });
        dwAngle.rotate();
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
        dwAngle.revert();
      }
      crop.close();
    } else if (angle < 0) {
      const trigonometric = new TrigonometricFunction({
        angle,
      });
      trigonometric.setWidth(width);
      trigonometric.setHeight(height - PADDING * 2);
      const textHypotenuseWidth = trigonometric.sinHeightAngle();
      trigonometric.setWidth(size + HORIZONTAL_LIEN_HEIGHT);
      trigonometric.setHeight(size + HORIZONTAL_LIEN_HEIGHT);
      const lineHeight = trigonometric.sinHeightAngle();
      trigonometric.setWidth(textHypotenuseWidth);
      trigonometric.setHeight(size);
      const textWidth = trigonometric.cosWidthAngle();
      const textHeight = trigonometric.sinWidthAngle();
      const textArray = [];
      const textLine = {
        len: 0,
        start: 0,
      };
      const len = text.length;
      let i = 0;
      while (i < len) {
        const charWidth = this.textWidth(text.charAt(i)) / dpr();
        const textWidth = textLine.len + charWidth;
        if (textWidth > textHypotenuseWidth) {
          if (textLine.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
          } else {
            textArray.push({
              text: text.substring(textLine.start, i),
              len: textLine.len,
              tx: 0,
              ty: 0,
            });
          }
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
          ty: 0,
        });
      }
      const textArrayLen = textArray.length;
      let wOffset = 0;
      for (let i = textArrayLen - 1; i >= 0; i -= 1) {
        const item = textArray[i];
        item.tx = wOffset;
        wOffset += lineHeight;
      }
      const crop = new Crop({ draw: dw, rect });
      crop.open();
      if (textArrayLen > 1) {
        const totalWidth = textWidth + ((textArray.length - 1) * lineHeight);
        let bx = rect.x;
        let by = rect.y;
        switch (align) {
          case ALIGN.left:
            bx += PADDING;
            break;
          case ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            break;
          case ALIGN.right:
            bx += width - totalWidth - PADDING;
            break;
          default: break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            by += PADDING;
            break;
          case VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            break;
          case VERTICAL_ALIGN.bottom:
            by += height - textHeight - PADDING;
            break;
          default: break;
        }
        for (let i = 0; i < textArray.length; i += 1) {
          const item = textArray[i];
          const rx = item.tx + bx;
          const ry = item.ty + by;
          let ax = 0;
          let ay = 0;
          switch (align) {
            case ALIGN.left: {
              trigonometric.setWidth(item.len / 2);
              trigonometric.setHeight(size);
              const tw = trigonometric.cosWidthAngle();
              const th = trigonometric.sinWidthAngle();
              ax += rx + tw;
              ay += ry + th;
              break;
            }
            case ALIGN.center: {
              ax = rx + textWidth / 2;
              ay = ry + textHeight / 2;
              break;
            }
            case ALIGN.right: {
              trigonometric.setWidth(item.len / 2);
              trigonometric.setHeight(size);
              const tw = trigonometric.cosWidthAngle();
              const th = trigonometric.sinWidthAngle();
              ax += rx + textWidth - tw;
              ay += ry + textHeight - th;
              break;
            }
            default: break;
          }
          const tx = ax - item.len / 2;
          const ty = ay - size / 2;
          if (i === -1) {
            dw.attr({ fillStyle: '#000000' });
            dw.fillRect(rx, ry, textWidth, textHeight);
            dw.attr({ fillStyle: 'red' });
          }
          const dwAngle = new DrawAngle({
            dw,
            angle,
            rect: new Rect({
              x: tx, y: ty, width: item.len, height: size,
            }),
          });
          dwAngle.rotate();
          dw.fillText(item.text, tx, ty);
          if (underline || strikethrough) {
            dw.beginPath();
          }
          if (underline) {
            this.drawLine('underline', tx, ty, item.len);
          }
          if (strikethrough) {
            this.drawLine('strike', tx, ty, item.len);
          }
          dwAngle.revert();
        }
      } else {
        const textWidth = this.textWidth(text) / dpr();
        trigonometric.setWidth(textWidth);
        trigonometric.setHeight(size);
        const trigonometricWidth = trigonometric.cosWidthAngle();
        const trigonometricHeight = trigonometric.sinWidthAngle();
        let rtx = rect.x;
        let rty = rect.y;
        switch (align) {
          case ALIGN.left:
            rtx += PADDING;
            break;
          case ALIGN.center:
            rtx += width / 2 - trigonometricWidth / 2;
            break;
          case ALIGN.right:
            rtx += width - trigonometricWidth - PADDING;
            break;
          default: break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            rty += PADDING;
            break;
          case VERTICAL_ALIGN.center:
            rty += height / 2 - trigonometricHeight / 2;
            break;
          case VERTICAL_ALIGN.bottom:
            rty += height - trigonometricHeight - PADDING;
            break;
          default: break;
        }
        const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
        const ty = rty + (trigonometricHeight / 2 - size / 2);
        const dwAngle = new DrawAngle({
          dw,
          angle,
          rect: new Rect({
            x: rtx, y: rty, width: trigonometricWidth, height: trigonometricHeight,
          }),
        });
        dwAngle.rotate();
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
        dwAngle.revert();
      }
      crop.close();
    }
  }

  draw() {
    const { dw, attr } = this;
    const { textWrap } = attr;
    dw.attr({
      textAlign: ALIGN.left,
      textBaseline: VERTICAL_ALIGN.top,
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
    this.verticalFontDraw = new VerticalFontDraw({
      text, rect, dw, overflow, attr: this.attr,
    });
    this.horizontalFontDraw = new HorizontalFontDraw({
      text, rect, dw, overflow, attr: this.attr,
    });
    this.angleFontDraw = new AngleFontDraw({
      text, rect, dw, overflow, attr: this.attr,
    });
  }

  draw() {
    const { attr } = this;
    switch (attr.direction) {
      case TEXT_DIRECTION.VERTICAL: {
        this.verticalFontDraw.draw();
        break;
      }
      case TEXT_DIRECTION.HORIZONTAL: {
        this.horizontalFontDraw.draw();
        break;
      }
      case TEXT_DIRECTION.ANGLE: {
        this.angleFontDraw.draw();
        break;
      }
      default: break;
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
