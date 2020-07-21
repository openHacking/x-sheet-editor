/* global window */
class Base {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }
  static radian(angle) {
    return -angle * (Math.PI / 180);
  }
  static dpr() {
    return window.devicePixelRatio || 1;
  }
  static round(val) {
    return Math.ceil(val);
  }
  static rpx(px) {
    return this.round(px * this.dpr());
  }
  static lpx(px) {
    return this.rpx(px) - 0.5;
  }
  resize(width, height) {
    const { canvas } = this;
    width = Base.rpx(width);
    height = Base.rpx(height);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width / Base.dpr() + "px";
    canvas.style.height = height / Base.dpr() + "px";
    return this;
  }
}
class Offset extends Base {
  constructor(canvas) {
    super(canvas);
    this.offsetX = 0;
    this.offsetY = 0;
    this.use = true;
    this.skip = false;
  }
  offset(x, y) {
    this.offsetX = x;
    this.offsetY = y;
  }
  openSkip() {
    this.skip = true;
    return this;
  }
  closeSkip() {
    this.skip = false;
    return this;
  }
  enable() {
    this.use = true;
    return this;
  }
  disable() {
    this.use = false;
    return this;
  }
  convert(x, y) {
    const { use, skip } = this;
    if (use && !skip) {
      const { offsetX, offsetY } = this;
      x += offsetX;
      y += offsetY;
    }
    return { x, y }
  }
}
class Draw extends Offset {
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
}
class XDraw extends Draw {
  drawImage(origin, sx, sy, sw, sh, tx, ty, tw, th) {
    ({x:sx, y:sy} = this.convert(sx, sy));
    ({x:tx, y:ty} = this.convert(tx, ty));
    this.ctx.drawImage(origin,
        Base.rpx(sx), Base.rpx(sy),
        Base.rpx(sw), Base.rpx(sh),
        Base.rpx(tx), Base.rpx(ty),
        Base.rpx(tw), Base.rpx(th));
  }
  fillText(text, x, y) {
    ({x, y} = this.convert(x, y));
    this.ctx.fillText(text, Base.rpx(x), Base.rpx(y));
    return this;
  }
  translate(x, y) {
    ({x, y} = this.convert(x, y));
    this.ctx.translate(Base.rpx(x), Base.rpx(y));
    return this;
  }
  rect(x, y, w, h) {
    ({x, y} = this.convert(x, y));
    this.ctx.rect(Base.rpx(x), Base.rpx(y), Base.rpx(w), Base.rpx(h));
    return this;
  }
  fillRect(x, y, w, h) {
    ({x, y} = this.convert(x, y));
    this.ctx.fillRect(Base.rpx(x), Base.rpx(y), Base.rpx(w), Base.rpx(h));
    return this;
  }
  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      let [x, y] = xys[0];
      ({x, y} = this.convert(x, y));
      ctx.moveTo(Base.lpx(x), Base.lpx(y));
      for (let i = 1, len = xys.length; i < len; i += 1) {
        let [x, y] = xys[i];
        ({x, y} = this.convert(x, y));
        ctx.lineTo(Base.lpx(x), Base.lpx(y));
      }
      ctx.stroke();
    }
    return this;
  }
  fullFillRect() {
    const { width, height } = this;
    const {x, y} = this.convert(0, 0);
    this.ctx.fillRect(Base.rpx(x), Base.rpx(y), Base.rpx(width), Base.rpx(height));
    return this;
  }
}
export {
  XDraw,
};
