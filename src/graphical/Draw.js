/* global window */

function dpr() {
  return window.devicePixelRatio || 1;
}

function npx(px) {
  return px * dpr();
}

function linePx(px) {
  return npx(px) + 0.5;
}

class Draw {
  constructor(el) {
    this.el = el;
    this.ctx = el.getContext('2d');
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
    this.clearRect(0, 0, width, height);
    return this;
  }

  attr(options) {
    Object.assign(this.ctx, options);
    return this;
  }

  beginPath() {
    this.ctx.beginPath();
  }

  closePath() {
    this.ctx.closePath();
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
    ctx.moveTo(linePx(x), linePx(y));
  }

  lineTo(x, y) {
    const { ctx } = this;
    ctx.lineTo(linePx(x), linePx(y));
  }

  line(...xys) {
    const { ctx } = this;
    if (xys.length > 1) {
      this.beginPath();
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
    ctx.fill();
  }
}

export { Draw, npx, linePx };
