import { Rect } from './Rect';
import { angleToRadian } from './Draw';

const ANGLE_ORIGIN = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  MIDDLE_LEFT: 'middle-left',
  MIDDLE_CENTER: 'middle-center',
  MIDDLE_RIGHT: 'middle-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
};

class TrigonometricFunction {

  constructor({ angle, width, height }) {
    this.angle = angle;
    this.width = width;
    this.height = height;
  }

  // 斜边 + sin 角度
  sinWidthAngle() {
    const { angle, width } = this;
    return Math.abs(Math.sin(angleToRadian(angle)) * width);
  }

  // 斜边 + cos 角度
  cosWidthAngle() {
    const { angle, width } = this;
    return Math.abs(Math.cos(angleToRadian(angle)) * width);
  }

  // 对边 + sin角度
  sinHeightAngle() {
    const { angle, height } = this;
    return Math.abs(height / Math.sin(angleToRadian(angle)));
  }

  setWidth(width) {
    this.width = width;
  }

  setHeight(height) {
    this.height = height;
  }

  setAngle(angle) {
    this.angle = angle;
  }

}

class Angle {

  constructor({
    angle,
    dw,
    origin = ANGLE_ORIGIN.MIDDLE_CENTER,
    rect = new Rect({ x: 0, y: 0, width: 0, height: 0 }),
  }) {
    this.dw = dw;
    this.origin = origin;
    this.rect = rect;
    this.angle = angle;
  }

  rotate() {
    const { origin, dw, rect, angle } = this;
    const { x, y, width, height } = rect;
    dw.save();
    let tx = 0;
    let ty = 0;
    switch (origin) {
      case ANGLE_ORIGIN.TOP_LEFT:
        tx = x;
        ty = y;
        break;
      case ANGLE_ORIGIN.TOP_CENTER:
        tx = x + width / 2;
        ty = y;
        break;
      case ANGLE_ORIGIN.TOP_RIGHT:
        tx = x + width;
        ty = y;
        break;
      case ANGLE_ORIGIN.MIDDLE_LEFT:
        tx = x;
        ty = y + height / 2;
        break;
      case ANGLE_ORIGIN.MIDDLE_CENTER:
        tx = x + width / 2;
        ty = y + height / 2;
        break;
      case ANGLE_ORIGIN.MIDDLE_RIGHT:
        tx = x + width;
        ty = y + height / 2;
        break;
      case ANGLE_ORIGIN.BOTTOM_LEFT:
        tx = x;
        ty = y + height;
        break;
      case ANGLE_ORIGIN.BOTTOM_CENTER:
        tx = x + width / 2;
        ty = y + height;
        break;
      case ANGLE_ORIGIN.BOTTOM_RIGHT:
        tx = x + width;
        ty = y + height;
        break;
      default: break;
    }
    const offsetX = dw.getOffsetX();
    const offsetY = dw.getOffsetY();
    dw.openSkipOffset()
      .translate(tx + offsetX, ty + offsetY)
      .rotate(angle)
      .translate(-(tx + offsetX), -(ty + offsetY))
      .closeSkipOffset();
    return this;
  }

  revert() {
    const { dw } = this;
    dw.restore();
    return this;
  }

  static triangleHypotenuse(angle, width) {
    const cos = Math.cos(angleToRadian(angle));
    const sin = Math.sin(angleToRadian(angle));
    return {
      width: Math.abs(cos * width), height: Math.abs(sin * width),
    };
  }

  setOrigin(origin) {
    this.origin = origin;
    return this;
  }

  setRect(rect) {
    this.rect = rect;
    return this;
  }

}

export {
  Angle,
  TrigonometricFunction,
  ANGLE_ORIGIN,
};