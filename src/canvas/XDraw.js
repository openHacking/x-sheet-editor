/* global window */

class Base {

  static round(val) {
    return Math.ceil(val);
  }

  static radian(angle) {
    return -angle * (Math.PI / 180);
  }

  static dpr() {
    return window.devicePixelRatio || 1;
  }

  static rpx(px) {
    return this.round(px * this.dpr());
  }

  static lpx(px) {
    return this.rpx(px) - 0.5;
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  resize(width, height) {
    const { canvas } = this;
    const resultWidth = Base.rpx(width);
    const resultHeight = Base.rpx(height);
    const styleWidth = resultWidth / Base.dpr();
    const styleHeight = resultHeight / Base.dpr();
    canvas.width = resultWidth;
    canvas.height = resultHeight;
    canvas.style.width = `${styleWidth}px`;
    canvas.style.height = `${styleHeight}px`;
    return this;
  }

}

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
    ctx.drawImage(el,
      XDraw.rpx(sx), XDraw.rpx(sy),
      XDraw.rpx(sw), XDraw.rpx(sh),
      XDraw.rpx(tx), XDraw.rpx(ty),
      XDraw.rpx(tw), XDraw.rpx(th));
    return this;
  }

}

export {
  XDraw,
};
