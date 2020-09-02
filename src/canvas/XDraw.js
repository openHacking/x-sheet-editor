/* global window */

const DPR = window.devicePixelRatio || 1;
const LINE_WIDTH_LOW = Math.round(DPR);
const LINE_WIDTH_MEDIUM = Math.round(DPR * 2);
const LINE_WIDTH_HIGH = Math.round(DPR * 3);

class Base {

  static rounding(val) {
    return Math.round(val);
  }

  static dpr() {
    return DPR;
  }

  static cvCssPx(px) {
    return this.rpx(px) / this.dpr();
  }

  static radian(angle) {
    return -angle * (Math.PI / 180);
  }

  static rpx(px) {
    return this.rounding(this.dpx(px));
  }

  static dpx(px) {
    return px * this.dpr();
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  attr(options) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in options) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.hasOwnProperty(key)) {
        let value = options[key];
        if (typeof value === 'string' || value instanceof String) {
          value = value.trim();
        }
        if (this.ctx[key] !== value) {
          this.ctx[key] = value;
        }
      }
    }
    return this;
  }

  resize(width, height) {
    const { canvas } = this;
    canvas.width = Base.rpx(width);
    canvas.height = Base.rpx(height);
    canvas.style.width = `${canvas.width / Base.dpr()}px`;
    canvas.style.height = `${canvas.height / Base.dpr()}px`;
    return this;
  }

}

class Wrapping extends Base {

  beginPath() {
    const { ctx } = this;
    ctx.beginPath();
    return this;
  }

  measureText(text) {
    const { ctx } = this;
    return ctx.measureText(text);
  }

  save() {
    const { ctx } = this;
    ctx.save();
    return this;
  }

  restore() {
    const { ctx } = this;
    ctx.restore();
    return this;
  }

  fill() {
    const { ctx } = this;
    ctx.fill();
    return this;
  }

  clip() {
    const { ctx } = this;
    ctx.clip();
    return this;
  }

  setLineDash(dash) {
    const { ctx } = this;
    ctx.setLineDash(dash);
    return this;
  }

  scale(x, y) {
    const { ctx } = this;
    ctx.scale(x, y);
    return this;
  }

  translate(x, y) {
    const { ctx } = this;
    ctx.translate(x, y);
    return this;
  }

  rotate(deg) {
    const { ctx } = this;
    ctx.rotate(deg);
    return this;
  }

}

class Extends extends Wrapping {

  fullRect() {
    const { canvas } = this;
    const { width, height } = canvas;
    this.ctx.fillRect(0, 0, width, height);
    return this;
  }

  rotate(angle) {
    super.rotate(Base.radian(angle));
    return this;
  }

  polyline(interpolation = xys => xys, ...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      this.beginPath();
      const [x, y] = interpolation(xys[0]);
      ctx.moveTo(x, y);
      for (let i = 1, len = xys.length; i < len; i += 1) {
        const [x, y] = interpolation(xys[i]);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }

}

class Position extends Extends {

  constructor(canvas) {
    super(canvas);
    this.offsetX = 0;
    this.offsetY = 0;
  }

  offset(x, y) {
    this.offsetX = x;
    this.offsetY = y;
  }

  getOffsetX() {
    return this.offsetX;
  }

  getOffsetY() {
    return this.offsetY;
  }

}

class BaseLine extends Position {

  line(...xys) {
    super.polyline((xys) => {
      const [x, y] = xys;
      return [this.lpx(Base.rounding(x + this.getOffsetX())),
        this.lpx(Base.rounding(y + this.getOffsetY()))];
    }, ...xys);
    return this;
  }

  lpx(pixel) {
    const { ctx } = this;
    const { lineWidth } = ctx;
    return lineWidth % 2 === 0 ? pixel : pixel - 0.5;
  }

}

class CorsLine extends BaseLine {

  constructor(canvas) {
    super(canvas);
    this.lineWidthType = CorsLine.LINE_WIDTH_TYPE.low;
    this.lineColor = '#000000';
  }

  setLineWidthType(type) {
    this.lineWidthType = type;
  }

  setLineColor(color) {
    this.lineColor = color;
  }

  horizonLine([sx, sy], [ex, ey]) {
    if (sy !== ey) {
      throw new TypeError('Error Horizon Line');
    }
    const {
      lineWidthType, lineColor,
    } = this;
    let lineWidth = LINE_WIDTH_LOW;
    switch (lineWidthType) {
      case CorsLine.LINE_WIDTH_TYPE.low:
        lineWidth = LINE_WIDTH_LOW;
        break;
      case CorsLine.LINE_WIDTH_TYPE.medium:
        lineWidth = LINE_WIDTH_MEDIUM;
        break;
      case CorsLine.LINE_WIDTH_TYPE.high:
        lineWidth = LINE_WIDTH_HIGH;
        break;
    }
    if (LINE_WIDTH_LOW > 1) {
      sx -= LINE_WIDTH_LOW;
      sy -= LINE_WIDTH_LOW;
      ex -= LINE_WIDTH_LOW;
      ey -= LINE_WIDTH_LOW;
    }
    this.attr({
      strokeStyle: lineColor,
      lineWidth,
    });
    super.polyline((xys) => {
      const [x, y] = xys;
      return [Base.rounding(x + this.getOffsetX()), this.lpx(Base.rounding(y + this.getOffsetY()))];
    }, [sx, sy], [ex, ey]);
  }

  verticalLine([sx, sy], [ex, ey]) {
    if (sx !== ex) {
      throw new TypeError('Error Vertical Line');
    }
    const {
      lineWidthType, lineColor,
    } = this;
    let lineWidth = LINE_WIDTH_LOW;
    switch (lineWidthType) {
      case CorsLine.LINE_WIDTH_TYPE.low:
        lineWidth = LINE_WIDTH_LOW;
        break;
      case CorsLine.LINE_WIDTH_TYPE.medium:
        lineWidth = LINE_WIDTH_MEDIUM;
        break;
      case CorsLine.LINE_WIDTH_TYPE.high:
        lineWidth = LINE_WIDTH_HIGH;
        break;
    }
    if (LINE_WIDTH_LOW > 1) {
      sx -= LINE_WIDTH_LOW;
      sy -= LINE_WIDTH_LOW;
      ex -= LINE_WIDTH_LOW;
      ey -= LINE_WIDTH_LOW;
    }
    this.attr({
      strokeStyle: lineColor,
      lineWidth,
    });
    super.polyline((xys) => {
      const [x, y] = xys;
      return [this.lpx(Base.rounding(x + this.getOffsetX())), Base.rounding(y + this.getOffsetY())];
    }, [sx, sy], [ex, ey]);
  }

}
CorsLine.LINE_WIDTH_TYPE = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

class XDraw extends CorsLine {

  fillText(text, x, y) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.fillText(text, XDraw.rounding(x), XDraw.rounding(y));
    return this;
  }

  rect(x, y, w, h) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.rect(XDraw.rounding(x), XDraw.rounding(y),
      XDraw.rounding(w), XDraw.rounding(h));
    return this;
  }

  fillRect(x, y, w, h) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.fillRect(XDraw.rounding(x), XDraw.rounding(y),
      XDraw.rounding(w), XDraw.rounding(h));
    return this;
  }

  drawImage(el, sx, sy, sw, sh, tx, ty, tw, th) {
    const { ctx } = this;
    sx += this.getOffsetX();
    sy += this.getOffsetY();
    tx += this.getOffsetX();
    ty += this.getOffsetY();
    ctx.drawImage(el,
      XDraw.rounding(sx), XDraw.rounding(sy),
      XDraw.rounding(sw), XDraw.rounding(sh),
      XDraw.rounding(tx), XDraw.rounding(ty),
      XDraw.rounding(tw), XDraw.rounding(th));
    return this;
  }

}

export {
  XDraw,
};
