/* global window */
const ROUND_TYPE = {
  CEIL: Symbol(),
  FLOOR: Symbol(),
  NONE: Symbol()
}
class Base {
  static roundType = ROUND_TYPE.CEIL
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
  static radian(angle) {
    return -angle * (Math.PI / 180);
  }
  static dpr() {
    return window.devicePixelRatio || 1;
  }
  static opx(px) {
    return px * this.dpr();
  }
  static rpx(px) {
    return this.round(this.opx(px));
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
    width = Base.rpx(width);
    height = Base.rpx(height);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width / Base.dpr() + "px";
    canvas.style.height = height / Base.dpr() + "px";
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
}
class XDraw extends Offset {
  fillText(text, x, y) {
    const { offsetX, offsetY } = this;
    x += offsetX;
    y += offsetY;
    this.ctx.fillText(text, Base.rpx(x), Base.rpx(y));
    return this;
  }
  rect(x, y, w, h) {
    const { offsetX, offsetY } = this;
    x += offsetX;
    y += offsetY;
    this.ctx.rect(Base.rpx(x), Base.rpx(y), Base.rpx(w), Base.rpx(h));
    return this;
  }
  fillRect(x, y, w, h) {
    const { offsetX, offsetY } = this;
    x += offsetX;
    y += offsetY;
    this.ctx.fillRect(Base.rpx(x), Base.rpx(y), Base.rpx(w), Base.rpx(h));
    return this;
  }
  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      const { offsetX, offsetY } = this;
      let [x, y] = xys[0];
      x += offsetX;
      y += offsetY;
      ctx.moveTo(Base.lpx(x), Base.lpx(y));
      for (let i = 1, len = xys.length; i < len; i += 1) {
        let [x, y] = xys[i];
        x += offsetX;
        y += offsetY;
        ctx.lineTo(Base.lpx(x), Base.lpx(y));
      }
      ctx.stroke();
    }
    return this;
  }
  drawImage(el, sx, sy, sw, sh, tx, ty, tw, th) {
    const { ctx } = this;
    const { offsetX, offsetY } = this;
    sx += offsetX;
    sy += offsetY;
    tx += offsetX;
    ty += offsetY;
    ctx.drawImage(el,
        XDraw.rpx(sx), XDraw.rpx(sy),
        XDraw.rpx(sw), XDraw.rpx(sh),
        XDraw.rpx(tx), XDraw.rpx(ty),
        XDraw.rpx(tw), XDraw.rpx(th));
    return this;
  }
}
export {
  XDraw, ROUND_TYPE
};
