import { BaseFont } from './BaseFont';
import { PlainUtils } from '../../utils/PlainUtils';
import { RTCosKit, RTSinKit } from '../RTFunction';

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

  }

  truncateFont() {
    return this.overflowFont();
  }

  overflowFont() {
    const { text, dw, attr, rect, overflow } = this;
    const { x, y, width, height } = rect;
    const { underline, strikethrough, align, verticalAlign, size } = attr;
    // 填充宽度
    const verticalAlignPadding = this.getVerticalAlignPadding();
    const alignPadding = this.getAlignPadding();
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
    const trigonometricTiltHeight = RTSinKit.inverse({
      tilt: trigonometricTilt,
      angle,
    });
    // 斜边一半的大小
    const trigonometricHalfTiltWidth = RTCosKit.nearby({
      tilt: trigonometricTilt / 2,
      angle,
    });
    const trigonometricHalfTiltHeight = RTSinKit.inverse({
      tilt: trigonometricTilt / 2,
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
    // 计算文本绘制位置旋转中心
    let rtx = x;
    let rty = y;
    switch (align) {
      case BaseFont.ALIGN.left:
        rtx += (trigonometricTiltWidth - trigonometricWidth) + alignPadding;
        break;
      case BaseFont.ALIGN.center:
        rtx += trigonometricHalfTiltWidth - (trigonometricHeight / 2);
        break;
      case BaseFont.ALIGN.right:
        break;
    }
    switch (verticalAlign) {
      case BaseFont.VERTICAL_ALIGN.top:
        rty += verticalAlignPadding;
        break;
      case BaseFont.VERTICAL_ALIGN.center:
        break;
      case BaseFont.VERTICAL_ALIGN.bottom:
        break;
    }
  }

  wrapTextFont() {}

}

export {
  AngleBarFont,
};
