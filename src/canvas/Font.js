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
    this.rect = rect;
    this.dw = dw;
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

  /**
   * 测量文字长度
   * @param text
   * @returns {number}
   */
  textWidth(text) {
    const { dw } = this;
    return dw.measureText(text).width;
  }

  /**
   * 绘制文字位图
   */
  drawBitMap() {
    // TODO ...
    // ....
  }

  /**
   * 绘制文字删除线和下划线
   * @param type
   * @param tx
   * @param ty
   * @param textWidth
   */
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

  /**
   * 绘制普通文本
   */
  drawText() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      underline, strikethrough, align, verticalAlign, overflow,
    } = attr;
    const textWidth = this.textWidth(text);
    let tx = rect.x;
    let ty = rect.y;
    switch (align) {
      case ALIGN.left:
        tx += PADDING;
        break;
      case ALIGN.center:
        tx += rect.width / 2;
        break;
      case ALIGN.right:
        tx += rect.width - PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        ty += PADDING;
        break;
      case VERTICAL_ALIGN.center:
        ty += rect.height / 2;
        break;
      case VERTICAL_ALIGN.bottom:
        ty += rect.height - PADDING;
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

  /**
   * 绘制自动换行文本
   */
  drawTextWarp() {
    const {
      text, dw, attr, rect,
    } = this;
    const {
      size, width, underline, strikethrough, align, verticalAlign,
    } = attr;
    const textWidth = this.textWidth(text);
    const n = Math.ceil(textWidth / rect.width);
    const hOffset = ((n - 1) * size) / 2;
    const textArray = [];
    const textLine = {
      len: 0,
      start: 0,
    };
    const len = text.length;
    let tx = rect.x;
    let ty = rect.y;
    switch (align) {
      case ALIGN.left:
        tx += PADDING;
        break;
      case ALIGN.center:
        tx += rect.width / 2;
        break;
      case ALIGN.right:
        tx += rect.width - PADDING;
        break;
      default: break;
    }
    switch (verticalAlign) {
      case VERTICAL_ALIGN.top:
        ty += PADDING;
        break;
      case VERTICAL_ALIGN.center:
        ty += rect.height / 2 - hOffset;
        break;
      case VERTICAL_ALIGN.bottom:
        ty += rect.height - hOffset * 2 - PADDING;
        break;
      default: break;
    }
    let i = 0;
    while (i < len) {
      const textWidth = this.textWidth(text.charAt(i));
      const currentWidth = textLine.len + textWidth;
      if (currentWidth >= width) {
        textArray.push({
          text: text.substring(textLine.start, i),
          len: textLine.len,
          tx,
          ty,
        });
        ty += size + 8;
        textLine.len = 0;
        textLine.start = i;
      } else {
        textLine.len += textWidth;
        i += 1;
      }
    }
    if (textLine.len > 0) {
      textArray.push({
        text: text.substring(textLine.start),
        len: textLine.len,
        tx,
        ty,
      });
    }
    const crop = new Crop({ draw: dw, rect });
    crop.open();
    for (let i = 0, len = textArray.length; i < len; i += 1) {
      const item = textArray[i];
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

  /**
   * 绘制文本
   */
  draw() {
    const { dw, attr } = this;
    const { textWrap } = attr;
    dw.attr({
      textAlign: attr.align,
      textBaseline: attr.verticalAlign,
      font: `${attr.italic ? 'italic' : ''} ${attr.bold ? 'bold' : ''} ${attr.size}px ${attr.name}`,
      fillStyle: attr.color,
    });
    if (textWrap) {
      this.drawTextWarp();
    } else {
      this.drawText();
    }
  }

  /**
   * 设置文字自动换行
   * @param textWrap
   */
  setTextWrap(textWrap) {
    this.attr.textWrap = textWrap;
  }
}

export { Font, VERTICAL_ALIGN, ALIGN };
