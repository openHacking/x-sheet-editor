import { Crop } from './Crop';
import { Utils } from '../utils/Utils';
import { Angle, TrigonometricFunction } from './Angle';
import { Rect } from './Rect';
import { dpr, opx } from './Draw';

// 垂直文字间距
const VERTICAL_SPACING = 2;
// 垂直文本行间距
const VERTICAL_LIEN_HEIGHT = 0;
// 水平文本间距
const HORIZONTAL_LIEN_HEIGHT = 4;
// 旋转文本间距
const ANGLE_LINE_HEIGHT = 4;

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

class DrawFont {

  constructor({
    text, rect, dw, overflow, overflowCrop, attr,
  }) {
    this.text = text;
    this.dw = dw;
    this.rect = rect;
    this.overflow = overflow;
    this.overflowCrop = overflowCrop;
    this.attr = attr;
  }

  measureWidth(text) {
    const { dw } = this;
    return dw.measureText(text).width / dpr();
  }

  isBlank(text) {
    return text === null || text === undefined || text.toString().trim() === '';
  }
}

/**
 * 水平方向字体绘制
 */
class HorizontalFontDraw extends DrawFont {

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

  /**
   * 越界的文字截斷
   * @returns {number}
   */
  drawTextTruncate() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, padding,
    } = attr;
    const { width, height } = rect;
    const textWidth = this.measureWidth(text);
    let tx = rect.x;
    let ty = rect.y;
    switch (align) {
      case ALIGN.left:
        tx += padding;
        break;
      case ALIGN.center:
        tx += width / 2;
        break;
      case ALIGN.right:
        tx += width - padding;
        break;
      default:
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        ty += padding;
        break;
      case VERTICAL_ALIGN.center:
        ty += height / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        ty += height - padding;
        break;
      default:
        break;
    }
    let contentWidth;
    switch (align) {
      case ALIGN.right:
      case ALIGN.left:
        contentWidth = textWidth + padding * 2;
        break;
      case ALIGN.center:
      default:
        contentWidth = textWidth;
    }
    const crop = new Crop({
      draw: dw,
      rect,
    });
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
    return contentWidth;
  }

  /**
   * 文字超過最大可繪製區域后自動
   * 截斷
   * @returns {number}
   */
  drawTextOverFlow() {
    const {
      text, dw, attr, rect, overflow, overflowCrop,
    } = this;
    const {
      size, underline, strikethrough, align, verticalAlign, padding,
    } = attr;
    const { width, height } = rect;
    const textWidth = this.measureWidth(text);
    let tx = rect.x;
    let ty = rect.y;
    let paddingH = 0;
    let paddingV = 0;
    switch (align) {
      case ALIGN.left:
        tx += padding;
        paddingH = padding;
        break;
      case ALIGN.center:
        tx += width / 2;
        break;
      case ALIGN.right:
        tx += width - padding;
        paddingH = padding;
        break;
      default:
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        ty += padding;
        paddingV = padding;
        break;
      case VERTICAL_ALIGN.center:
        ty += height / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        ty += height - padding;
        paddingV = padding;
        break;
      default:
        break;
    }
    let contentWidth;
    switch (align) {
      case ALIGN.right:
      case ALIGN.left:
        contentWidth = textWidth + padding * 2;
        break;
      case ALIGN.center:
      default:
        contentWidth = textWidth;
    }
    if (overflowCrop || (overflow && (textWidth + paddingH > overflow.width
      || size + paddingV > overflow.height))) {
      const crop = new Crop({
        draw: dw,
        rect: overflow,
      });
      crop.open();
      // console.log('text >>>', text, tx, ty);
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
    return contentWidth;
  }

  /**
   * 文字自動換行
   * @returns {number}
   */
  drawTextWarp() {
    // console.log('drawTextWarp');
    const { text, dw, attr, rect } = this;
    const {
      size, underline, strikethrough, align, verticalAlign, padding,
    } = attr;
    const { width, height } = rect;
    const maxTextWidth = width - padding * 2;
    const textArray = [];
    const line = {
      len: 0,
      start: 0,
    };
    const len = text.length;
    let hOffset = 0;
    let i = 0;
    let maxLen = 0;
    while (i < len) {
      const charWidth = this.measureWidth(text.charAt(i));
      const textWidth = line.len + charWidth;
      if (textWidth > maxTextWidth) {
        if (line.len === 0) {
          textArray.push({
            text: text.substring(i, i + 1),
            len: textWidth,
            tx: 0,
            ty: hOffset,
          });
          i += 1;
          if (textWidth > maxLen) {
            maxLen = textWidth;
          }
        } else {
          textArray.push({
            text: text.substring(line.start, i),
            len: line.len,
            tx: 0,
            ty: hOffset,
          });
          if (line.len > maxLen) {
            maxLen = line.len;
          }
        }
        hOffset += size + HORIZONTAL_LIEN_HEIGHT;
        line.len = 0;
        line.start = i;
      } else {
        line.len = textWidth;
        i += 1;
      }
    }
    if (line.len > 0) {
      textArray.push({
        text: text.substring(line.start),
        len: line.len,
        tx: 0,
        ty: hOffset,
      });
      if (line.len > maxLen) {
        maxLen = line.len;
      }
    }
    let bx = rect.x;
    let by = rect.y;
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
      case VERTICAL_ALIGN.top:
        by += padding;
        break;
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset - padding;
        break;
      default:
        break;
    }
    let contentWidth;
    switch (align) {
      case ALIGN.right:
      case ALIGN.left:
        contentWidth = maxLen + padding * 2;
        break;
      case ALIGN.center:
      default:
        contentWidth = maxLen;
    }
    const crop = new Crop({
      draw: dw,
      rect,
    });
    crop.open();
    for (let i = 0, len = textArray.length; i < len; i += 1) {
      const item = textArray[i];
      item.tx += bx;
      item.ty += by;
      // console.log('text >>>', item.text, item.tx, item.ty);
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
    return contentWidth;
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
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${opx(attr.size)}px ${attr.name}`,
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

  setOverflowCrop(overflowCrop) {
    this.overflowCrop = overflowCrop;
  }

  setSize(size) {
    this.attr.size = size;
  }

  setTextWrap(textWrap) {
    this.attr.textWrap = textWrap;
  }

  setPadding(padding) {
    this.attr.padding = padding;
  }

}

/**
 * 垂直方向字体绘制
 */
class VerticalFontDraw extends DrawFont {

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

  drawTextTruncate() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size, padding,
    } = attr;
    const { width, height } = rect;
    const textArray = [];
    let hOffset = 0;
    for (let i = 0; i < text.length; i += 1) {
      const char = text.charAt(i);
      textArray.push({
        len: this.measureWidth(char),
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
      case VERTICAL_ALIGN.top:
        by += padding;
        break;
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2 + padding;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset + padding;
        break;
      default:
        break;
    }
    let contentWidth;
    switch (align) {
      case ALIGN.left:
      case ALIGN.right:
        contentWidth = size + padding * 2;
        break;
      case ALIGN.center:
      default:
        contentWidth = size;
    }
    const crop = new Crop({
      draw: dw,
      rect,
    });
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
    return contentWidth;
  }

  drawTextOverFlow() {
    const {
      text, dw, attr, rect, overflow, overflowCrop,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size, padding,
    } = attr;
    const { width, height } = rect;
    const textArray = [];
    let hOffset = 0;
    for (let i = 0; i < text.length; i += 1) {
      const char = text.charAt(i);
      textArray.push({
        len: this.measureWidth(char),
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
        bx += padding;
        paddingH = padding;
        break;
      case ALIGN.center:
        bx += width / 2;
        break;
      case ALIGN.right:
        bx += width - padding;
        paddingH = padding;
        break;
      default:
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        by += padding;
        paddingV = padding;
        break;
      case VERTICAL_ALIGN.center:
        by += height / 2 - hOffset / 2 + padding;
        break;
      case VERTICAL_ALIGN.bottom:
        by += height - hOffset + padding;
        paddingV = padding;
        break;
      default:
        break;
    }
    let contentWidth;
    switch (align) {
      case ALIGN.left:
      case ALIGN.right:
        contentWidth = size + padding * 2;
        break;
      case ALIGN.center:
      default:
        contentWidth = size;
    }
    if (overflowCrop || (overflow && (hOffset + paddingV > overflow.height
      || size + paddingH > overflow.width))) {
      const crop = new Crop({
        draw: dw,
        rect: overflow,
      });
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
    return contentWidth;
  }

  drawTextWarp() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size, padding,
    } = attr;
    const { width, height } = rect;
    const textArray = [];
    const len = text.length;
    const boxHeight = height - padding * 2;
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
      const charWidth = this.measureWidth(char);
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
        bx += padding;
        break;
      case ALIGN.center:
        bx += width / 2 - wOffset / 2;
        break;
      case ALIGN.right:
        bx += width - wOffset - padding;
        break;
      default:
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        dw.attr({
          textBaseline: attr.verticalAlign,
        });
        by += padding;
        verticalAlignValue = VERTICAL_ALIGN.top;
        break;
      case VERTICAL_ALIGN.center:
        if (column === 0) {
          dw.attr({
            textBaseline: attr.verticalAlign,
          });
          by += height / 2 - hOffset / 2 + padding;
          verticalAlignValue = VERTICAL_ALIGN.center;
        } else {
          dw.attr({
            textBaseline: VERTICAL_ALIGN.top,
          });
          by += padding;
          verticalAlignValue = VERTICAL_ALIGN.top;
        }
        break;
      case VERTICAL_ALIGN.bottom:
        if (column === 0) {
          dw.attr({
            textBaseline: VERTICAL_ALIGN.bottom,
          });
          by += height - hOffset + padding;
          verticalAlignValue = VERTICAL_ALIGN.bottom;
        } else {
          dw.attr({
            textBaseline: VERTICAL_ALIGN.top,
          });
          by += padding;
          verticalAlignValue = VERTICAL_ALIGN.top;
        }
        break;
      default:
        break;
    }
    let contentWidth;
    switch (align) {
      case ALIGN.left:
      case ALIGN.right:
        contentWidth = wOffset + size + padding * 2;
        break;
      case ALIGN.center:
      default:
        contentWidth = wOffset + size;
    }
    const crop = new Crop({
      draw: dw,
      rect,
    });
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
    return contentWidth;
  }

  draw() {
    const { text } = this;
    if (this.isBlank(text)) {
      return 0;
    }
    const { dw, attr } = this;
    const { textWrap } = attr;
    switch (textWrap) {
      case TEXT_WRAP.TRUNCATE:
        dw.attr({
          textAlign: attr.align,
          textBaseline: attr.verticalAlign,
          font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${opx(attr.size)}px ${attr.name}`,
          fillStyle: attr.color,
          strokeStyle: attr.color,
        });
        return this.drawTextTruncate();
      case TEXT_WRAP.WORD_WRAP:
        dw.attr({
          textAlign: attr.align,
          font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${opx(attr.size)}px ${attr.name}`,
          fillStyle: attr.color,
          strokeStyle: attr.color,
        });
        return this.drawTextWarp();
      case TEXT_WRAP.OVER_FLOW:
      default:
        dw.attr({
          textAlign: attr.align,
          textBaseline: attr.verticalAlign,
          font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${opx(attr.size)}px ${attr.name}`,
          fillStyle: attr.color,
          strokeStyle: attr.color,
        });
        return this.drawTextOverFlow();
    }
  }

  setOverflowCrop(overflowCrop) {
    this.overflowCrop = overflowCrop;
  }

  setSize(size) {
    this.attr.size = size;
  }

  setTextWrap(textWrap) {
    this.attr.textWrap = textWrap;
  }

  setPadding(padding) {
    this.attr.padding = padding;
  }

}

/**
 * 旋转字体绘制
 */
class AngleFontDraw extends DrawFont {

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
      underline, strikethrough, align, verticalAlign, size, padding,
    } = attr;
    let { angle } = attr;
    const { width, height } = rect;
    if (angle > 90) {
      angle = 90;
    }
    if (angle < -90) {
      angle = -90;
    }
    // 计算文字斜边
    // 的宽度
    const textWidth = this.measureWidth(text);
    const trigonometric = new TrigonometricFunction({
      angle,
      width: textWidth,
      height: size,
    });
    const trigonometricWidth = trigonometric.cosWidthAngle();
    const trigonometricHeight = trigonometric.sinWidthAngle();
    // 计算文字的位置
    let rtx = rect.x;
    let rty = rect.y;
    switch (align) {
      case ALIGN.left:
        rtx += padding;
        break;
      case ALIGN.center:
        rtx += width / 2 - trigonometricWidth / 2;
        break;
      case ALIGN.right:
        rtx += width - trigonometricWidth - padding;
        break;
      default:
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        rty += padding;
        break;
      case VERTICAL_ALIGN.center:
        rty += height / 2 - trigonometricHeight / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        rty += height - trigonometricHeight - padding;
        break;
      default:
        break;
    }
    // 计算内容宽度
    let contentWidth;
    switch (align) {
      case ALIGN.right:
      case ALIGN.left:
        contentWidth = trigonometricWidth + padding * 2;
        break;
      case ALIGN.center:
      default:
        contentWidth = trigonometricWidth;
    }
    const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
    const ty = rty + (trigonometricHeight / 2 - size / 2);
    // 旋转剪切
    // 绘制文字
    const dwAngle = new Angle({
      dw,
      angle,
      rect: new Rect({
        x: rtx,
        y: rty,
        width: trigonometricWidth,
        height: trigonometricHeight,
      }),
    });
    // 角度不同, 裁剪的
    // 大小不同
    let crop;
    if (angle === 0) {
      crop = new Crop({
        draw: dw,
        rect,
      });
    } else {
      crop = new Crop({
        draw: dw,
        rect: new Rect({
          x: 0,
          y: rect.y,
          width: contentWidth,
          height: rect.height,
        }),
      });
    }
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
    return contentWidth;
  }

  drawTextOverFlow() {
    const {
      text, dw, attr, rect, overflow,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size, overflowCrop, padding,
    } = attr;
    let { angle } = attr;
    const { width, height } = rect;
    if (angle > 90) {
      angle = 90;
    }
    if (angle < -90) {
      angle = -90;
    }
    // 计算文字斜边
    // 的宽度
    const textWidth = this.measureWidth(text);
    const trigonometric = new TrigonometricFunction({
      angle,
      width: textWidth,
      height: size,
    });
    const trigonometricWidth = trigonometric.cosWidthAngle();
    const trigonometricHeight = trigonometric.sinWidthAngle();
    // 计算文字的位置
    let rtx = rect.x;
    let rty = rect.y;
    switch (align) {
      case ALIGN.left:
        rtx += padding;
        break;
      case ALIGN.center:
        rtx += width / 2 - trigonometricWidth / 2;
        break;
      case ALIGN.right:
        rtx += width - trigonometricWidth - padding;
        break;
      default:
        break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        rty += padding;
        break;
      case VERTICAL_ALIGN.center:
        rty += height / 2 - trigonometricHeight / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        rty += height - trigonometricHeight - padding;
        break;
      default:
        break;
    }
    // 计算内容宽度
    let contentWidth;
    switch (align) {
      case ALIGN.right:
      case ALIGN.left:
        contentWidth = trigonometricWidth + padding * 2;
        break;
      case ALIGN.center:
      default:
        contentWidth = trigonometricWidth;
    }
    const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
    const ty = rty + (trigonometricHeight / 2 - size / 2);
    // 旋转剪切
    // 绘制文字
    const dwAngle = new Angle({
      dw,
      angle,
      rect: new Rect({
        x: rtx,
        y: rty,
        width: trigonometricWidth,
        height: trigonometricHeight,
      }),
    });
    // 角度不同, 裁剪的
    // 大小不同
    let crop;
    if (angle === 0) {
      crop = new Crop({
        draw: dw,
        rect: overflow,
      });
    } else {
      crop = new Crop({
        draw: dw,
        rect: new Rect({
          x: 0,
          y: rect.y,
          width: contentWidth,
          height: rect.height,
        }),
      });
    }
    // 文本是否越界
    if (overflowCrop || (overflow && (trigonometricWidth > overflow.width
      || trigonometricHeight > overflow.height))) {
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
    return contentWidth;
  }

  drawTextWarp() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, size, padding,
    } = attr;
    let { angle } = attr;
    if (angle > 90) {
      angle = 90;
    }
    if (angle < -90) {
      angle = -90;
    }
    const { width, height } = rect;
    if (angle > 0) {
      const trigonometric = new TrigonometricFunction({
        angle,
      });

      // 计算斜角文本的最大绘制宽度
      // 超过绘制宽度自动换行
      trigonometric.setHeight(height - padding * 2);
      const textHypotenuseWidth = trigonometric.sinHeightAngle();

      // 计算文本块之间的间隙
      trigonometric.setHeight(size + ANGLE_LINE_HEIGHT);
      const lineHeight = trigonometric.sinHeightAngle();

      // 折行文本计算
      const textArray = [];
      const line = {
        len: 0,
        start: 0,
      };
      const len = text.length;
      let i = 0;
      while (i < len) {
        const charWidth = this.measureWidth(text.charAt(i));
        const textWidth = line.len + charWidth;
        if (textWidth > textHypotenuseWidth) {
          if (line.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
          } else {
            textArray.push({
              text: text.substring(line.start, i),
              len: line.len,
              tx: 0,
              ty: 0,
            });
          }
          line.len = 0;
          line.start = i;
        } else {
          line.len = textWidth;
          i += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: text.substring(line.start),
          len: line.len,
          tx: 0,
          ty: 0,
        });
      }
      const textArrayLen = textArray.length;

      // 每个文本块的x坐标
      // 加上指定的间隙
      let wOffset = 0;
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        item.tx = wOffset;
        wOffset += lineHeight;
      }

      // 多行文本和单行文本
      // 采用不同的绘制
      // 逻辑
      if (textArrayLen > 1) {
        // 计算每个文本块的
        // 宽度和高度
        trigonometric.setWidth(textHypotenuseWidth);
        const textWidth = Math.max(trigonometric.cosWidthAngle(), size);
        const textHeight = trigonometric.sinWidthAngle();
        // console.log('textHeight>>>', textHeight);

        // 计算总宽度
        const totalWidth = textWidth + ((textArray.length - 1) * lineHeight);
        // console.log(totalWidth);
        let bx = rect.x;
        let by = rect.y;
        switch (align) {
          case ALIGN.left:
            bx += padding;
            break;
          case ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            break;
          case ALIGN.right:
            bx += width - totalWidth - padding;
            break;
          default:
            break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            by += padding;
            break;
          case VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            break;
          case VERTICAL_ALIGN.bottom:
            by += height - textHeight - padding;
            break;
          default:
            break;
        }
        let contentWidth;
        switch (align) {
          case ALIGN.right:
          case ALIGN.left:
            contentWidth = totalWidth + padding * 2;
            break;
          case ALIGN.center:
          default:
            contentWidth = totalWidth;
        }

        // 渲染文本
        for (let i = 0; i < textArray.length; i += 1) {
          // 计算文本的
          // 绘制位置
          // 旋转中心
          const item = textArray[i];
          const rx = item.tx + bx;
          const ry = item.ty + by;
          let ax = 0;
          let ay = 0;
          switch (align) {
            case ALIGN.left: {
              trigonometric.setWidth(item.len / 2);
              const tw = Math.max(trigonometric.cosWidthAngle(), size);
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
              const tw = Math.max(trigonometric.cosWidthAngle(), size);
              const th = trigonometric.sinWidthAngle();
              ax += rx + textWidth - tw;
              ay += ry + th;
              break;
            }
            default:
              break;
          }
          const tx = ax - item.len / 2;
          const ty = ay - size / 2;

          // 旋转并且
          // 绘制文本
          if (i === -1) {
            dw.attr({ fillStyle: '#000000' });
            dw.fillRect(rx, ry, textWidth, textHeight);
            dw.attr({ fillStyle: 'red' });
          }
          const dwAngle = new Angle({
            dw,
            angle,
            rect: new Rect({
              x: tx,
              y: ty,
              width: item.len,
              height: size,
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
        return contentWidth;
      }

      // 计算文本块的
      // 大小
      const textWidth = this.measureWidth(text);
      trigonometric.setWidth(textWidth);
      const trigonometricWidth = Math.max(trigonometric.cosWidthAngle(), size);
      const trigonometricHeight = trigonometric.sinWidthAngle();

      // 计算文本
      // 绘制位置
      // 旋转中心
      let rtx = rect.x;
      let rty = rect.y;
      switch (align) {
        case ALIGN.left:
          rtx += padding;
          break;
        case ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          break;
        case ALIGN.right:
          rtx += width - trigonometricWidth - padding;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case VERTICAL_ALIGN.top:
          rty += padding;
          break;
        case VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          break;
        case VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - padding;
          break;
        default:
          break;
      }
      let contentWidth;
      switch (align) {
        case ALIGN.right:
        case ALIGN.left:
          contentWidth = trigonometricWidth + padding * 2;
          break;
        case ALIGN.center:
        default:
          contentWidth = trigonometricWidth;
      }

      // 旋转并且
      // 绘制文本
      const dwAngle = new Angle({
        dw,
        angle,
        rect: new Rect({
          x: rtx,
          y: rty,
          width: trigonometricWidth,
          height: trigonometricHeight,
        }),
      });
      dwAngle.rotate();
      const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
      const ty = rty + (trigonometricHeight / 2 - size / 2);
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
      return contentWidth;
    }
    if (angle < 0) {
      const trigonometric = new TrigonometricFunction({
        angle,
      });

      // 计算斜角文本的最大绘制宽度
      // 超过绘制宽度自动换行
      trigonometric.setHeight(height - padding * 2);
      const textHypotenuseWidth = trigonometric.sinHeightAngle();

      // 计算文本块之间的间隙
      trigonometric.setHeight(size + ANGLE_LINE_HEIGHT);
      const lineHeight = trigonometric.sinHeightAngle();

      // 折行文本计算
      const textArray = [];
      const line = {
        len: 0,
        start: 0,
      };
      const len = text.length;
      let i = 0;
      while (i < len) {
        const charWidth = this.measureWidth(text.charAt(i));
        const textWidth = line.len + charWidth;
        if (textWidth > textHypotenuseWidth) {
          if (line.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
          } else {
            textArray.push({
              text: text.substring(line.start, i),
              len: line.len,
              tx: 0,
              ty: 0,
            });
          }
          line.len = 0;
          line.start = i;
        } else {
          line.len = textWidth;
          i += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: text.substring(line.start),
          len: line.len,
          tx: 0,
          ty: 0,
        });
      }
      const textArrayLen = textArray.length;

      // 每个文本块的x坐标
      // 加上指定的间隙
      let wOffset = 0;
      for (let i = textArrayLen - 1; i >= 0; i -= 1) {
        const item = textArray[i];
        item.tx = wOffset;
        wOffset += lineHeight;
      }

      // 多行文本和单行文本
      // 采用不同的绘制
      // 逻辑
      if (textArrayLen > 1) {

        // 计算每个文本块的
        // 宽度和高度
        trigonometric.setWidth(textHypotenuseWidth);
        const textWidth = Math.max(trigonometric.cosWidthAngle(), size);
        const textHeight = trigonometric.sinWidthAngle();

        // 文本总宽度
        const totalWidth = textWidth + ((textArray.length - 1) * lineHeight);
        let bx = rect.x;
        let by = rect.y;
        switch (align) {
          case ALIGN.left:
            bx += padding;
            break;
          case ALIGN.center:
            bx += width / 2 - totalWidth / 2;
            break;
          case ALIGN.right:
            bx += width - totalWidth - padding;
            break;
          default:
            break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            by += padding;
            break;
          case VERTICAL_ALIGN.center:
            by += height / 2 - textHeight / 2;
            break;
          case VERTICAL_ALIGN.bottom:
            by += height - textHeight - padding;
            break;
          default:
            break;
        }
        let contentWidth;
        switch (align) {
          case ALIGN.right:
          case ALIGN.left:
            contentWidth = totalWidth + padding * 2;
            break;
          case ALIGN.center:
          default:
            contentWidth = totalWidth;
        }

        // 渲染文本
        for (let i = 0; i < textArray.length; i += 1) {
          // 计算文本的
          // 绘制位置
          // 旋转中心
          const item = textArray[i];
          const rx = item.tx + bx;
          const ry = item.ty + by;
          let ax = 0;
          let ay = 0;
          switch (align) {
            case ALIGN.left: {
              trigonometric.setWidth(item.len / 2);
              const tw = Math.max(trigonometric.cosWidthAngle(), size);
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
              const tw = Math.max(trigonometric.cosWidthAngle(), size);
              const th = trigonometric.sinWidthAngle();
              ax += rx + textWidth - tw;
              ay += ry + textHeight - th;
              break;
            }
            default:
              break;
          }
          const tx = ax - item.len / 2;
          const ty = ay - size / 2;
          if (i === -1) {
            dw.attr({ fillStyle: '#000000' });
            dw.fillRect(rx, ry, textWidth, textHeight);
            dw.attr({ fillStyle: 'red' });
          }

          // 旋转并且
          // 绘制文本
          const dwAngle = new Angle({
            dw,
            angle,
            rect: new Rect({
              x: tx,
              y: ty,
              width: item.len,
              height: size,
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
        return contentWidth;
      }

      // 计算文本块的
      // 大小
      const textWidth = this.measureWidth(text);
      trigonometric.setWidth(textWidth);
      const trigonometricWidth = Math.max(trigonometric.cosWidthAngle(), size);
      const trigonometricHeight = trigonometric.sinWidthAngle();

      // 计算文本
      // 绘制位置
      // 旋转中心
      let rtx = rect.x;
      let rty = rect.y;
      switch (align) {
        case ALIGN.left:
          rtx += padding;
          break;
        case ALIGN.center:
          rtx += width / 2 - trigonometricWidth / 2;
          break;
        case ALIGN.right:
          rtx += width - trigonometricWidth - padding;
          break;
        default:
          break;
      }
      switch (verticalAlign) {
        case VERTICAL_ALIGN.top:
          rty += padding;
          break;
        case VERTICAL_ALIGN.center:
          rty += height / 2 - trigonometricHeight / 2;
          break;
        case VERTICAL_ALIGN.bottom:
          rty += height - trigonometricHeight - padding;
          break;
        default:
          break;
      }
      let contentWidth;
      switch (align) {
        case ALIGN.right:
        case ALIGN.left:
          contentWidth = trigonometricWidth + padding * 2;
          break;
        case ALIGN.center:
        default:
          contentWidth = trigonometricWidth;
      }

      // 旋转并且
      // 绘制文本
      const dwAngle = new Angle({
        dw,
        angle,
        rect: new Rect({
          x: rtx,
          y: rty,
          width: trigonometricWidth,
          height: trigonometricHeight,
        }),
      });
      dwAngle.rotate();
      const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
      const ty = rty + (trigonometricHeight / 2 - size / 2);
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
      return contentWidth;
    }
    if (angle === 0) {
      const maxTextWidth = width - padding * 2;
      const textArray = [];
      const line = {
        len: 0,
        start: 0,
      };
      const len = text.length;

      // 折行
      let i = 0;
      let maxLen = 0;
      while (i < len) {
        const charWidth = this.measureWidth(text.charAt(i));
        const textWidth = line.len + charWidth;
        if (textWidth > maxTextWidth) {
          if (line.len === 0) {
            textArray.push({
              text: text.substring(i, i + 1),
              len: textWidth,
              tx: 0,
              ty: 0,
            });
            i += 1;
            if (textWidth > maxLen) {
              maxLen = textWidth;
            }
          } else {
            textArray.push({
              text: text.substring(line.start, i),
              len: line.len,
              tx: 0,
              ty: 0,
            });
            if (line.len > maxLen) {
              maxLen = line.len;
            }
          }
          line.len = 0;
          line.start = i;
        } else {
          line.len = textWidth;
          i += 1;
        }
      }
      if (line.len > 0) {
        textArray.push({
          text: text.substring(line.start),
          len: line.len,
          tx: 0,
          ty: 0,
        });
        if (line.len > maxLen) {
          maxLen = line.len;
        }
      }
      const textArrayLen = textArray.length;

      // 位置计算
      let hOffset = 0;
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        item.ty = hOffset;
        hOffset += size + HORIZONTAL_LIEN_HEIGHT;
      }
      const totalTextHeight = textArrayLen * (size + HORIZONTAL_LIEN_HEIGHT);

      let contentWidth;
      switch (align) {
        case ALIGN.right:
        case ALIGN.left:
          contentWidth = maxLen + padding * 2;
          break;
        case ALIGN.center:
        default:
          contentWidth = maxLen;
      }
      // 裁剪 绘制
      const crop = new Crop({
        draw: dw,
        rect,
      });
      crop.open();
      for (let i = 0; i < textArrayLen; i += 1) {
        const item = textArray[i];
        let tx = rect.x;
        let ty = rect.y;
        switch (align) {
          case ALIGN.left:
            tx += padding;
            break;
          case ALIGN.center:
            tx += width / 2 - item.len / 2;
            break;
          case ALIGN.right:
            tx += width - item.len - padding;
            break;
          default:
            break;
        }
        switch (verticalAlign) {
          case VERTICAL_ALIGN.top:
            ty += item.ty + padding;
            break;
          case VERTICAL_ALIGN.center:
            ty += item.ty + (height / 2 - totalTextHeight / 2);
            break;
          case VERTICAL_ALIGN.bottom:
            ty += item.ty + (height - totalTextHeight - padding);
            break;
          default:
            break;
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
      return contentWidth;
    }
    return 0;
  }

  setOverflowCrop(overflowCrop) {
    this.overflowCrop = overflowCrop;
  }

  setSize(size) {
    this.attr.size = size;
  }

  draw() {
    const { text } = this;
    if (this.isBlank(text)) {
      return 0;
    }
    const { dw, attr } = this;
    const { textWrap } = attr;
    dw.attr({
      textAlign: ALIGN.left,
      textBaseline: VERTICAL_ALIGN.top,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${opx(attr.size)}px ${attr.name}`,
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

  setPadding(padding) {
    this.attr.padding = padding;
  }

}

/**
 * Base font
 */
class Font {
  constructor({
    text, rect, dw, overflow, attr,
  }) {
    this.attr = Utils.mergeDeep({}, {
      name: 'Arial',
      size: 14,
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
      padding: 8,
    }, attr);
    this.verticalFontDraw = new VerticalFontDraw({
      text,
      rect,
      dw,
      overflow,
      attr: this.attr,
    });
    this.horizontalFontDraw = new HorizontalFontDraw({
      text,
      rect,
      dw,
      overflow,
      attr: this.attr,
    });
    this.angleFontDraw = new AngleFontDraw({
      text,
      rect,
      dw,
      overflow,
      attr: this.attr,
    });
  }

  draw() {
    const { attr } = this;
    switch (attr.direction) {
      case TEXT_DIRECTION.VERTICAL:
        return this.verticalFontDraw.draw();
      case TEXT_DIRECTION.ANGLE:
        return this.angleFontDraw.draw();
      case TEXT_DIRECTION.HORIZONTAL:
      default:
        return this.horizontalFontDraw.draw();
    }
  }

  setOverflowCrop(overflowCrop) {
    this.verticalFontDraw.setOverflowCrop(overflowCrop);
    this.horizontalFontDraw.setOverflowCrop(overflowCrop);
    this.angleFontDraw.setOverflowCrop(overflowCrop);
  }

  setSize(size) {
    this.verticalFontDraw.setSize(size);
    this.horizontalFontDraw.setSize(size);
    this.angleFontDraw.setSize(size);
  }

  setTextWrap(textWrap) {
    this.verticalFontDraw.setTextWrap(textWrap);
    this.horizontalFontDraw.setTextWrap(textWrap);
  }

  setPadding(padding) {
    this.verticalFontDraw.setPadding(padding);
    this.horizontalFontDraw.setPadding(padding);
    this.angleFontDraw.setPadding(padding);
  }
}

export {
  VERTICAL_ALIGN,
  ALIGN, TEXT_WRAP,
  TEXT_DIRECTION,
};

export { Font };
