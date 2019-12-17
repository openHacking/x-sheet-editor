/* global window */

function dpr() {
  return window.devicePixelRatio || 1;
}

function npx(px) {
  return parseInt(px * dpr(), 10);
}

function thinLineWidth() {
  return dpr() - 0.5;
}

function npxLine(px) {
  const n = npx(px);
  return n > 0 ? n - 0.5 : 0.5;
}

class Draw {
  constructor(el, width, height) {
    this.el = el;
    this.ctx = el.getContext('2d');
    this.resize(width, height);
    this.ctx.scale(dpr(), dpr());
  }

  resize(width, height) {
    this.el.style.width = `${width}px`;
    this.el.style.height = `${height}px`;
    this.el.width = npx(width);
    this.el.height = npx(height);
  }

  clear() {
    const { width, height } = this.el;
    this.ctx.clearRect(0, 0, width, height);
    return this;
  }

  attr(options) {
    Object.assign(this.ctx, options);
    return this;
  }

  beginPath() {
    this.ctx.beginPath();
  }

  save() {
    this.ctx.save();
    this.ctx.beginPath();
    return this;
  }

  restore() {
    this.ctx.restore();
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

  fillRect(x, y, w, h) {
    this.ctx.fillRect(npx(x) - 0.5, npx(y) - 0.5, npx(w), npx(h));
    return this;
  }

  fillText(text, x, y) {
    this.ctx.fillText(text, npx(x), npx(y));
    return this;
  }

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      const [x, y] = xys[0];
      ctx.moveTo(npxLine(x), npxLine(y));
      for (let i = 1, len = xys.length; i < len; i += 1) {
        const [x1, y1] = xys[i];
        ctx.lineTo(npxLine(x1), npxLine(y1));
      }
      ctx.stroke();
    }
    return this;
  }
}

export {
  Draw,
  npxLine,
  thinLineWidth,
  npx,
};
