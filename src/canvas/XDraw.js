/* global window */

const DPR = window.devicePixelRatio || 1;

class Base {

  static rounding(val) {
    // eslint-disable-next-line no-bitwise
    return (0.5 + val) << 0;
  }

  static dpr() {
    return DPR;
  }

  static radian(angle) {
    return -angle * (Math.PI / 180);
  }

  static rpx(px) {
    return px * this.dpr();
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  resize(width, height) {
    const { canvas } = this;
    canvas.width = Base.rounding(Base.rpx(width));
    canvas.height = Base.rounding(Base.rpx(height));
    canvas.style.width = `${canvas.width / Base.dpr()}px`;
    canvas.style.height = `${canvas.height / Base.dpr()}px`;
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

  lpx(px) {
    const { ctx } = this;
    const lineWidth = ctx.lineWidth;
    const suffix = lineWidth % 2 === 0
      ? 0 : 0.5;
    return px - suffix;
  }

}

class Pos extends Draw {

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

  fillText() {
    throw new TypeError('child impl');
  }

  rect() {
    throw new TypeError('child impl');
  }

  fillRect() {
    throw new TypeError('child impl');
  }

  line() {
    throw new TypeError('child impl');
  }

  drawImage() {
    throw new TypeError('child impl');
  }

}

class XDraw extends Pos {

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

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      this.beginPath();
      let [x, y] = xys[0];
      x += this.getOffsetX();
      y += this.getOffsetY();
      ctx.moveTo(this.lpx(XDraw.rounding(x)),
        this.lpx(XDraw.rounding(y)));
      for (let i = 1, len = xys.length; i < len; i += 1) {
        let [x, y] = xys[i];
        x += this.getOffsetX();
        y += this.getOffsetY();
        ctx.lineTo(this.lpx(XDraw.rounding(x)),
          this.lpx(XDraw.rounding(y)));
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
