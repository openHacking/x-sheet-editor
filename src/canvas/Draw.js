/* global window */

function dpr() {
  return window.devicePixelRatio || 1;
}

function angleToRadian(angle) {
  return -angle * (Math.PI / 180);
}

function rounded(val) {
  // eslint-disable-next-line no-bitwise
  return ~~(0.5 + val);
}

function npx(px = 0) {
  return rounded(px * dpr());
}

class CanvasDraw {

  constructor(el) {
    this.el = el;
    this.ctx = el.getContext('2d', { alpha: false });
    this.height = el.height;
    this.width = el.width;
  }

  resize(width, height) {
    const { el } = this;
    this.height = height;
    this.width = width;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.width = npx(width);
    el.height = npx(height);
    return this;
  }

}

class DrawBase extends CanvasDraw {

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
    return this;
  }

  measureText(text) {
    return this.ctx.measureText(text);
  }

  rotate(angle) {
    const { ctx } = this;
    ctx.rotate(angleToRadian(angle));
    return this;
  }

  scale(x = 1, y = 1) {
    x *= dpr();
    y *= dpr();
    this.ctx.scale(x, y);
  }

}

class CanvasOffsetDraw extends DrawBase {

  constructor(el) {
    super(el);
    this.offsetX = 0;
    this.offsetY = 0;
    this.skipOffset = false;
    this.useOffset = true;
  }

  offset(x = 0, y = 0) {
    this.offsetX = x;
    this.offsetY = y;
    return this;
  }

  closeSkipOffset() {
    this.skipOffset = false;
    return this;
  }

  openSkipOffset() {
    this.skipOffset = true;
    return this;
  }

  getOffsetX() {
    return this.offsetX;
  }

  getOffsetY() {
    return this.offsetY;
  }

  closeOffset() {
    this.useOffset = false;
    return this;
  }

  openOffset() {
    this.useOffset = true;
    return this;
  }

}

class Draw2 extends CanvasOffsetDraw {

  fillText(text, x, y) {
    const {
      useOffset, skipOffset,
    } = this;
    if (useOffset && skipOffset === false) {
      const {
        offsetX, offsetY,
      } = this;
      x += offsetX;
      y += offsetY;
    }
    this.ctx.fillText(text, npx(x), npx(y));
    return this;
  }

  translate(x, y) {
    const {
      useOffset, skipOffset,
    } = this;
    if (useOffset && skipOffset === false) {
      const {
        offsetX, offsetY,
      } = this;
      x += offsetX;
      y += offsetY;
    }
    this.ctx.translate(npx(x), npx(y));
    return this;
  }

  rect(x, y, w, h) {
    const {
      useOffset, skipOffset,
    } = this;
    if (useOffset && skipOffset === false) {
      const {
        offsetX, offsetY,
      } = this;
      x += offsetX;
      y += offsetY;
    }
    this.ctx.rect(npx(x), npx(y), npx(w), npx(h));
    return this;
  }

  fillRect(x, y, w, h) {
    const {
      useOffset, skipOffset,
    } = this;
    if (useOffset && skipOffset === false) {
      const {
        offsetX, offsetY,
      } = this;
      x += offsetX;
      y += offsetY;
    }
    this.ctx.fillRect(npx(x), npx(y), npx(w), npx(h));
    return this;
  }

  moveTo(x, y) {
    const {
      useOffset, skipOffset,
    } = this;
    if (useOffset && skipOffset === false) {
      const {
        offsetX, offsetY,
      } = this;
      x += offsetX;
      y += offsetY;
    }
    const even = this.ctx.lineWidth % 2 === 0;
    this.ctx.moveTo(even ? npx(x) : npx(x) - 0.5, even ? npx(y) : npx(y) - 0.5);
  }

  lineTo(x, y) {
    const {
      useOffset, skipOffset,
    } = this;
    if (useOffset && skipOffset === false) {
      const {
        offsetX, offsetY,
      } = this;
      x += offsetX;
      y += offsetY;
    }
    const even = this.ctx.lineWidth % 2 === 0;
    this.ctx.lineTo(even ? npx(x) : npx(x) - 0.5, even ? npx(y) : npx(y) - 0.5);
  }

  drawImage(origin, sx, sy, sWidth, sHeight, x, y, width, height) {
    const {
      useOffset, skipOffset,
    } = this;
    if (useOffset && skipOffset === false) {
      const { offsetX, offsetY } = this;
      sx += offsetX;
      sy += offsetY;
      x += offsetX;
      y += offsetY;
    }
    this.ctx.drawImage(origin,
      npx(sx),
      npx(sy),
      npx(sWidth),
      npx(sHeight),
      npx(x),
      npx(y),
      npx(width),
      npx(height));
  }
}

class Draw extends Draw2 {

  fullFillRect() {
    const { width, height } = this;
    this.fillRect(0, 0, width, height);
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

}

export {
  Draw, npx, dpr, rounded, angleToRadian,
};
