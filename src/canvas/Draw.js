/* global window */

function dpr() {
  return window.devicePixelRatio || 1;
}

function npx(px) {
  return Math.floor(px * dpr());
}

function angleToRadian(angle) {
  return -angle * (Math.PI / 180);
}

class Draw {

  constructor(el) {
    this.el = el;
    this.ctx = el.getContext('2d', { alpha: false });
    this.width = el.width;
    this.height = el.height;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  rotate(angle) {
    const { ctx } = this;
    ctx.rotate(angleToRadian(angle));
    return this;
  }

  offset(offsetX = 0, offsetY = 0) {
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  resize(width, height) {
    const { el } = this;
    this.width = width;
    this.height = height;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.width = npx(width);
    el.height = npx(height);
    return this;
  }

  clear() {
    const { width, height } = this;
    this.clearRect(0, 0, width, height);
    return this;
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
  }

  setLineDash(dash) {
    this.ctx.setLineDash(dash);
  }

  measureText(text) {
    return this.ctx.measureText(text);
  }

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      const [x, y] = xys[0];
      this.moveTo(x, y);
      for (let i = 1, len = xys.length; i < len; i += 1) {
        const [x1, y1] = xys[i];
        this.lineTo(x1, y1);
      }
      ctx.stroke();
    }
    return this;
  }

  clearRect(x, y, w, h) {
    const { offsetX, offsetY } = this;
    this.ctx.clearRect(npx(x + offsetX), npx(y + offsetY), npx(w), npx(h));
    return this;
  }

  rect(x, y, w, h) {
    const { offsetX, offsetY } = this;
    this.ctx.rect(npx(x + offsetX), npx(y + offsetY), npx(w), npx(h));
    return this;
  }

  fillRect(x, y, w, h) {
    const { offsetX, offsetY } = this;
    this.ctx.fillRect(npx(x + offsetX), npx(y + offsetY), npx(w), npx(h));
    return this;
  }

  fillText(text, x, y) {
    const { offsetX, offsetY } = this;
    this.ctx.fillText(text, npx(x + offsetX), npx(y + offsetY));
    return this;
  }

  moveTo(x, y) {
    const { ctx } = this;
    const { offsetX, offsetY } = this;
    const even = ctx.lineWidth % 2 === 0;
    const nx = even ? npx(x + offsetX) : npx(x + offsetX) - 0.5;
    const ny = even ? npx(y + offsetY) : npx(y + offsetY) - 0.5;
    ctx.moveTo(nx, ny);
  }

  lineTo(x, y) {
    const { ctx } = this;
    const { offsetX, offsetY } = this;
    const even = ctx.lineWidth % 2 === 0;
    const nx = even ? npx(x + offsetX) : npx(x + offsetX) - 0.5;
    const ny = even ? npx(y + offsetY) : npx(y + offsetY) - 0.5;
    ctx.lineTo(nx, ny);
  }

  drawImage(origin, sx, sy, sWidth, sHeight, x, y, width, height) {
    const { offsetX, offsetY } = this;
    this.ctx.drawImage(
      origin,
      npx(sx + offsetX),
      npx(sy + offsetY),
      npx(sWidth),
      npx(sHeight),
      npx(x + offsetX),
      npx(y + offsetY),
      npx(width),
      npx(height),
    );
  }
}

export {
  Draw,
  npx,
  dpr,
  angleToRadian,
};
