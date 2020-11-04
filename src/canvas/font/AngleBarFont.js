import { RTCosKit, RTSinKit } from '../RTFunction';
import { BaseFont } from './BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';
import { Rect } from '../Rect';
import { Crop } from '../Crop';
import { Angle } from '../Angle';

class AngleBarFont extends BaseFont {

  constructor({
    text, rect, dw, attr, overflow,
  }) {
    super({
      text, rect, dw, attr,
    });
    this.attr = PlainUtils.mergeDeep({
      lineHeight: 4,
    }, this.attr);
    this.overflow = overflow;
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
    if (this.hasBreak(text)) {
      return this.wrapTextFont();
    }
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
    return this.overflowFont();
  }

  overflowFont() {
    const { text, dw, attr, rect } = this;
    const { x, y, width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 角度边界
    let { angle } = attr;
    if (angle < -90) {
      angle = -90;
    }
    if (angle > 90) {
      angle = 90;
    }
    if (angle === 0) {
      throw new TypeError('文字的角度必须是在90<0或者0>90之间!');
    }
    // 斜边的大小
    const trigonometricTilt = RTSinKit.tilt({
      inverse: height,
      angle,
    });
    const trigonometricTiltWidth = RTCosKit.nearby({
      tilt: trigonometricTilt,
      angle,
    });
    // 文本长度
    const textWidth = this.textWidth(text);
    // 文本块大小
    const trigonometricWidth = Math.max(RTCosKit.nearby({
      tilt: textWidth,
      angle,
    }), size);
    const trigonometricHeight = RTSinKit.inverse({
      tilt: textWidth,
      angle,
    });
    // 可溢出区域
    const overflow = new Rect({
      x, y, width: trigonometricTiltWidth + width, height,
    });
    // 计算文本绘制位置
    let rtx = 0;
    let rty = 0;
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rtx = x + (trigonometricTiltWidth - trigonometricWidth);
        rty = y;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        rtx = x + (trigonometricTiltWidth / 2 - trigonometricWidth / 2);
        rty = y + (height / 2 - trigonometricHeight / 2);
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        rtx = x;
        rty = y + (height - trigonometricHeight);
        break;
    }
    switch (align) {
      case BaseFont.ALIGN.left:
        rtx += size / 2;
        break;
      case BaseFont.ALIGN.center:
        rtx += width / 2;
        break;
      case BaseFont.ALIGN.right:
        rtx += width - size / 2;
        break;
    }
    // 边界检查
    const outboundsHeight = trigonometricHeight > overflow.height;
    const outboundsWidth = trigonometricWidth > overflow.width;
    if (outboundsHeight || outboundsWidth) {
      const crop = new Crop({
        draw: dw,
        rect: overflow,
      });
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
      crop.open();
      dwAngle.rotate();
      const tx = rtx + (trigonometricWidth / 2 - textWidth / 2);
      const ty = rty + (trigonometricHeight / 2 - size / 2);
      dw.fillText(text, tx, ty);
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
      crop.close();
    } else {
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
      if (underline) {
        this.drawLine('underline', tx, ty, textWidth);
      }
      if (strikethrough) {
        this.drawLine('strike', tx, ty, textWidth);
      }
      dwAngle.revert();
    }
    // 文本宽度
    return trigonometricTiltWidth;
  }

  wrapTextFont() {

  }

}

export {
  AngleBarFont,
};
