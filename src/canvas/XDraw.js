/* global window */

const ROUND_TYPE = {
  CEIL: Symbol(''),
  FLOOR: Symbol(''),
  NONE: Symbol(''),
};

class Base {

  static setRoundType(type) {
    Base.roundType = type;
  }

  static round(val) {
    switch (Base.roundType) {
      case ROUND_TYPE.CEIL:
        return Math.ceil(val);
      case ROUND_TYPE.FLOOR:
        return Math.floor(val);
    }
    return val;
  }

  static fixed(val) {
    return parseFloat(val.toFixed(1));
  }

  static radian(angle) {
    return -angle * (Math.PI / 180);
  }

  static dpr() {
    return window.devicePixelRatio || 1;
  }

  static rpr() {
    return this.fixed(this.dpr());
  }

  static npx(px) {
    return this.round(px * this.dpr());
  }

  static rpx(px) {
    return this.round(px * this.rpr());
  }

  static lpx(px) {
    return this.rpx(px) - 0.5;
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.displayWidth = 0;
    this.displayHeight = 0;
  }

  resize(width, height) {
    const { canvas } = this;
    const resultWidth = Base.npx(width);
    const resultHeight = Base.npx(height);
    const styleWidth = resultWidth / Base.dpr();
    const styleHeight = resultHeight / Base.dpr();
    const displayWidth = styleWidth * (1 + Base.dpr() - Base.rpr());
    const displayHeight = styleHeight * (1 + Base.dpr() - Base.rpr());
    canvas.width = resultWidth;
    canvas.height = resultHeight;
    canvas.style.width = `${styleWidth}px`;
    canvas.style.height = `${styleHeight}px`;
    this.displayWidth = displayWidth;
    this.displayHeight = displayHeight;
    return this;
  }

  getDisplayWidth() {
    return this.displayWidth;
  }

  getDisplayHeight() {
    return this.displayHeight;
  }

}

Base.roundType = ROUND_TYPE.CEIL;

class Draw extends Base {

  measureText(text) {
    return this.ctx.measureText(text);
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

  beginPath() {
    this.ctx.beginPath();
    return this;
  }

  save() {
    const { ctx } = this;
    ctx.save();
    this.beginPath();
    return this;
  }

  restore() {
    const { ctx } = this;
    ctx.restore();
    return this;
  }

  clip() {
    const { ctx } = this;
    ctx.clip();
    return this;
  }

  fill() {
    this.ctx.fill();
    return this;
  }

  setLineDash(dash) {
    this.ctx.setLineDash(dash);
    return this;
  }

  rotate(angle) {
    const { ctx } = this;
    ctx.rotate(Draw.radian(angle));
    return this;
  }

  scale(x, y) {
    this.ctx.scale(x, y);
    return this;
  }

  translate(x, y) {
    this.ctx.translate(x, y);
    return this;
  }

  fullRect() {
    const { canvas } = this;
    const { width, height } = canvas;
    this.ctx.fillRect(0, 0, width, height);
    return this;
  }

}

class Offset extends Draw {

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

class XDraw extends Offset {

  fillText(text, x, y) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.fillText(text, XDraw.rpx(x), XDraw.rpx(y));
    return this;
  }

  rect(x, y, w, h) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.rect(XDraw.rpx(x), XDraw.rpx(y), XDraw.rpx(w), XDraw.rpx(h));
    return this;
  }

  fillRect(x, y, w, h) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.fillRect(XDraw.rpx(x), XDraw.rpx(y), XDraw.rpx(w), XDraw.rpx(h));
    return this;
  }

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      this.beginPath();
      let [x, y] = xys[0];
      x += this.getOffsetX();
      y += this.getOffsetY();
      ctx.moveTo(XDraw.lpx(x), XDraw.lpx(y));
      for (let i = 1, len = xys.length; i < len; i += 1) {
        let [x, y] = xys[i];
        x += this.getOffsetX();
        y += this.getOffsetY();
        ctx.lineTo(XDraw.lpx(x), XDraw.lpx(y));
      }
      ctx.stroke();
    }
    return this;
  }

  drawImage(el, sx, sy, sw, sh, tx, ty, tw, th) {
    const { ctx } = this;
    sx += this.getOffsetX();
    sy += this.getOffsetY();
    tx += this.getOffsetX();
    ty += this.getOffsetY();
    XDraw.setRoundType(ROUND_TYPE.FLOOR);
    ctx.drawImage(el,
      XDraw.rpx(sx), XDraw.rpx(sy),
      XDraw.rpx(sw), XDraw.rpx(sh),
      XDraw.rpx(tx), XDraw.rpx(ty),
      XDraw.rpx(tw), XDraw.rpx(th));
    XDraw.setRoundType(ROUND_TYPE.CEIL);
    return this;
  }

}

export {
  XDraw, ROUND_TYPE,
};
