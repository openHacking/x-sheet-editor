/* global window */

// chrome83.0.4103.116
// 读取devicePixelRatio慢
// 暂存
const DPR = window.devicePixelRatio || 1;

class Base {

  static upRounding(val) {
    return Math.ceil(val);
  }

  static radian(angle) {
    return -angle * (Math.PI / 180);
  }

  static dpr() {
    return DPR;
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
    canvas.width = Base.upRounding(Base.rpx(width));
    canvas.height = Base.upRounding(Base.rpx(height));
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
    this.ctx.fillText(text, XDraw.upRounding(x), XDraw.upRounding(y));
    return this;
  }

  rect(x, y, w, h) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.rect(XDraw.upRounding(x), XDraw.upRounding(y),
      XDraw.upRounding(w), XDraw.upRounding(h));
    return this;
  }

  fillRect(x, y, w, h) {
    x += this.getOffsetX();
    y += this.getOffsetY();
    this.ctx.fillRect(XDraw.upRounding(x), XDraw.upRounding(y),
      XDraw.upRounding(w), XDraw.upRounding(h));
    return this;
  }

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      this.beginPath();
      let [x, y] = xys[0];
      x += this.getOffsetX();
      y += this.getOffsetY();
      ctx.moveTo(this.lpx(XDraw.upRounding(x)),
        this.lpx(XDraw.upRounding(y)));
      for (let i = 1, len = xys.length; i < len; i += 1) {
        let [x, y] = xys[i];
        x += this.getOffsetX();
        y += this.getOffsetY();
        ctx.lineTo(this.lpx(XDraw.upRounding(x)),
          this.lpx(XDraw.upRounding(y)));
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
      XDraw.upRounding(sx), XDraw.upRounding(sy),
      XDraw.upRounding(sw), XDraw.upRounding(sh),
      XDraw.upRounding(tx), XDraw.upRounding(ty),
      XDraw.upRounding(tw), XDraw.upRounding(th));
    return this;
  }

}

export {
  XDraw,
};
