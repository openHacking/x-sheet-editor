/* global window */

const DPR = window.devicePixelRatio || 1;

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

  constructor(canvas) {
    super(canvas);
    this.dash = [];
  }

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
    this.dash = dash;
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

class Line extends Position {

  lpx(px) {
    return px - 0.5;
  }

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      this.beginPath();
      let [x, y] = xys[0];
      x += this.getOffsetX();
      y += this.getOffsetY();
      ctx.moveTo(this.lpx(Base.rounding(x)), this.lpx(Base.rounding(y)));
      for (let i = 1, len = xys.length; i < len; i += 1) {
        let [x, y] = xys[i];
        x += this.getOffsetX();
        y += this.getOffsetY();
        ctx.lineTo(this.lpx(Base.rounding(x)), this.lpx(Base.rounding(y)));
      }
      ctx.stroke();
    }
    return this;
  }

}

const LINE_WIDTH_LEVEL1 = Math.round(DPR);
const LINE_WIDTH_LEVEL2 = Math.round(DPR * 2);
const LINE_WIDTH_LEVEL3 = Math.round(DPR * 3);
class XLine extends Line {

  constructor(canvas) {
    super(canvas);
    this.lineType = XLine.LINE_WIDTH_TYPE.level1;
    this.lineColor = '#000000';
  }

  setLineColor(color) {
    this.lineColor = color;
  }

  setLineType(type) {
    this.lineType = type;
  }

  horizonLine([sx, sy], [ex, ey]) {
    if (sy !== ey) {
      throw new TypeError('error horizon line');
    }
    const {
      dash, lineType, lineColor, ctx,
    } = this;
    let lineWidth = LINE_WIDTH_LEVEL1;
    switch (lineType) {
      case XLine.LINE_WIDTH_TYPE.level1:
        lineWidth = LINE_WIDTH_LEVEL1;
        break;
      case XLine.LINE_WIDTH_TYPE.level2:
        lineWidth = LINE_WIDTH_LEVEL2;
        break;
      case XLine.LINE_WIDTH_TYPE.level3:
        lineWidth = LINE_WIDTH_LEVEL3;
        break;
    }
    sx -= lineWidth;
    sy -= lineWidth;
    ex -= lineWidth;
    ey -= lineWidth;
    if (lineWidth < 2 || dash.length > 0) {
      this.attr({
        strokeStyle: lineColor,
        lineWidth,
      });
      super.line([sx, sy], [ex, ey]);
    } else {
      const width = Math.abs(ex - sx);
      this.attr({ fillStyle: lineColor });
      sx += this.getOffsetX();
      sy += this.getOffsetY();
      ctx.fillRect(Base.rounding(sx), Base.rounding(sy), width, lineWidth);
    }
  }

  verticalLine([sx, sy], [ex, ey]) {
    if (sx !== ex) {
      throw new TypeError('error horizon line');
    }
    const {
      dash, lineType, lineColor, ctx,
    } = this;
    let lineWidth = LINE_WIDTH_LEVEL1;
    switch (lineType) {
      case XLine.LINE_WIDTH_TYPE.level1:
        lineWidth = LINE_WIDTH_LEVEL1;
        break;
      case XLine.LINE_WIDTH_TYPE.level2:
        lineWidth = LINE_WIDTH_LEVEL2;
        break;
      case XLine.LINE_WIDTH_TYPE.level3:
        lineWidth = LINE_WIDTH_LEVEL3;
        break;
    }
    sx -= lineWidth;
    sy -= lineWidth;
    ex -= lineWidth;
    ey -= lineWidth;
    if (lineWidth < 2 || dash.length > 0) {
      this.attr({
        strokeStyle: lineColor,
        lineWidth,
      });
      super.line([sx, sy], [ex, ey]);
    } else {
      const height = Math.abs(ey - sy);
      this.attr({ fillStyle: lineColor });
      sx += this.getOffsetX();
      sy += this.getOffsetY();
      ctx.fillRect(Base.rounding(sx), Base.rounding(sy), lineWidth, height);
    }
  }

}
XLine.LINE_WIDTH_TYPE = {
  level1: 'level1',
  level2: 'level2',
  level3: 'level3',
};

class XDraw extends XLine {

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
