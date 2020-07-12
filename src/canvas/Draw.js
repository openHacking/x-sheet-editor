/* global window */

function angleToRadian(angle) {
  return -angle * (Math.PI / 180);
}

function dpr() {
  return window.devicePixelRatio || 1;
}

function opx(px) {
  return px * dpr();
}

function npx(px = 0) {
  return Math.ceil(opx(px));
}

class CanvasDraw {

  constructor(el) {
    this.el = el;
    this.ctx = el.getContext('2d', { alpha: false });
    this.width = el.width;
    this.height = el.height;
    this.offsetX = 0;
    this.offsetY = 0;
    this.skipOffset = false;
    this.useOffset = true;
    this.useNpx = true;
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

  offset(x = 0, y = 0) {
    this.offsetX = x;
    this.offsetY = y;
    return this;
  }

  getOffsetX() {
    return this.offsetX;
  }

  getOffsetY() {
    return this.offsetY;
  }

  openSkipOffset() {
    this.skipOffset = true;
    return this;
  }

  closeSkipOffset() {
    this.skipOffset = false;
    return this;
  }

  openNpx() {
    this.useNpx = true;
    return this;
  }

  closeNpx() {
    this.useNpx = false;
    return this;
  }

  openOffset() {
    this.useOffset = true;
    return this;
  }

  closeOffset() {
    this.useOffset = false;
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

}

class Draw2 extends DrawBase {

  fillText(text, x, y) {
    const { useNpx, useOffset, skipOffset } = this;
    if (useOffset && skipOffset === false) {
      const { offsetX, offsetY } = this;
      x += offsetX;
      y += offsetY;
    }
    if (useNpx) {
      x = npx(x);
      y = npx(y);
    }
    this.ctx.fillText(text, x, y);
    return this;
  }

  translate(x, y) {
    const { useNpx, useOffset, skipOffset } = this;
    if (useOffset && skipOffset === false) {
      const { offsetX, offsetY } = this;
      x += offsetX;
      y += offsetY;
    }
    if (useNpx) {
      x = npx(x);
      y = npx(y);
    }
    this.ctx.translate(x, y);
    return this;
  }

  rect(x, y, w, h) {
    const { useNpx, useOffset, skipOffset } = this;
    if (useOffset && skipOffset === false) {
      const { offsetX, offsetY } = this;
      x += offsetX;
      y += offsetY;
    }
    if (useNpx) {
      x = npx(x);
      y = npx(y);
      w = npx(w);
      h = npx(h);
    }
    this.ctx.rect(x, y, w, h);
    return this;
  }

  fillRect(x, y, w, h) {
    const { useNpx, useOffset, skipOffset } = this;
    if (useOffset && skipOffset === false) {
      const { offsetX, offsetY } = this;
      x += offsetX;
      y += offsetY;
    }
    if (useNpx) {
      x = npx(x);
      y = npx(y);
      w = npx(w);
      h = npx(h);
    }
    this.ctx.fillRect(x, y, w, h);
    return this;
  }

  moveTo(x, y) {
    const { useNpx, useOffset, skipOffset } = this;
    if (useOffset && skipOffset === false) {
      const { offsetX, offsetY } = this;
      x += offsetX;
      y += offsetY;
    }
    if (useNpx) {
      x = npx(x);
      y = npx(y);
    }
    const even = this.ctx.lineWidth % 2 === 0;
    const nx = even ? x : x - 0.5;
    const ny = even ? y : y - 0.5;
    this.ctx.moveTo(nx, ny);
  }

  lineTo(x, y) {
    const { useNpx, useOffset, skipOffset } = this;
    if (useOffset && skipOffset === false) {
      const { offsetX, offsetY } = this;
      x += offsetX;
      y += offsetY;
    }
    if (useNpx) {
      x = npx(x);
      y = npx(y);
    }
    const even = this.ctx.lineWidth % 2 === 0;
    const nx = even ? x : x - 0.5;
    const ny = even ? y : y - 0.5;
    this.ctx.lineTo(nx, ny);
  }

  scale(x = 1, y = 1) {
    const { useNpx } = this;
    if (useNpx) {
      x = npx(x);
      y = npx(y);
    }
    this.ctx.scale(x, y);
  }

  drawImage(origin, sx, sy, sWidth, sHeight, x, y, width, height) {
    const { useNpx, useOffset, skipOffset } = this;
    if (useOffset && skipOffset === false) {
      const { offsetX, offsetY } = this;
      sx += offsetX;
      sy += offsetY;
      x += offsetX;
      y += offsetY;
    }
    if (useNpx) {
      sx = npx(sx);
      sy = npx(sy);
      x = npx(x);
      y = npx(y);
      sWidth = npx(sWidth);
      sHeight = npx(sHeight);
      width = npx(width);
      height = npx(height);
    }
    this.ctx.drawImage(origin, sx, sy, sWidth, sHeight, x, y, width, height);
  }
}

class Draw extends Draw2 {

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

  fullFillRect() {
    const { width, height } = this;
    this.fillRect(0, 0, width, height);
  }

}

export {
  Draw,
  dpr,
  opx,
  angleToRadian,
};
