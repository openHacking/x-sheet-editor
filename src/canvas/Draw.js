/* global window */

function dpr() {
  return window.devicePixelRatio || 1;
}

function lineWidth() {
  return 1;
}

function npx(px) {
  return px * dpr();
}

function npxLine(px) {
  // eslint-disable-next-line no-use-before-define
  const n = Draw.floor(npx(px));
  return lineWidth() < 2 ? n - 0.5 : 0.5;
}

class Draw {
  static floor(v) {
    // eslint-disable-next-line no-bitwise
    return (0.5 + v) << 0;
  }

  constructor(el) {
    this.el = el;
    this.ctx = el.getContext('2d', { alpha: false });
  }

  resize(width, height) {
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.width = npx(width);
    this.el.height = npx(height);
  }

  clear() {
    const { width, height } = this.el;
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

  translate(x, y) {
    this.ctx.translate(npx(x), npx(y));
    return this;
  }

  clearRect(x, y, w, h) {
    this.ctx.clearRect(x, y, w, h);
    return this;
  }

  rect(x, y, w, h) {
    this.ctx.rect(npx(x), npx(y), npx(w), npx(h));
    return this;
  }

  fillRect(x, y, w, h) {
    this.ctx.fillRect(npx(x), npx(y), npx(w), npx(h));
    return this;
  }

  fill() {
    this.ctx.fill();
  }

  fillText(text, x, y) {
    this.ctx.fillText(text, npx(x), npx(y));
    return this;
  }

  moveTo(x, y) {
    const { ctx } = this;
    ctx.moveTo(npxLine(x), npxLine(y));
  }

  lineTo(x, y) {
    const { ctx } = this;
    ctx.lineTo(npxLine(x), npxLine(y));
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

  clip() {
    const { ctx } = this;
    ctx.clip();
  }

  measureText(text) {
    return this.ctx.measureText(text);
  }
}

export {
  Draw, npx, dpr, lineWidth,
};