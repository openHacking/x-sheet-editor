/* global document */
import { XDraw } from '../../canvas/XDraw';

class FragmentCanvas {

  constructor() {
    this.canvas = document.createElement('canvas');
    this.draw = new XDraw(this.canvas);
  }

  resize(width, height) {
    this.draw.resize(width, height);
  }

}

class XTableStyleFragment {

  constructor({
    cols,
    rows,
    height,
    width,
  }) {
    this.rows = rows;
    this.cols = cols;
    this.data = [];
    this.height = height;
    this.width = width;
    this.index = new Array(rows.len * cols.len);
  }

  getOffset(ri, ci) {
    const { cols } = this;
    const { len } = cols;
    return (ri * len) + ci;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
  }

  save({
    canvas, range,
  }) {
    const { sri, sci } = range;
    const { index, data } = this;
    const offset = this.getOffset(sri, sci);
    const no = index[offset];
    const item = data[no];
    if (item) {

    } else {
      const fragment = new FragmentCanvas();
      fragment.resize(this.width, this.height);
    }
  }

  read({
    range,
  }) {}

}

export {
  XTableStyleFragment,
};
