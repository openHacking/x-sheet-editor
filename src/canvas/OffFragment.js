/* global document */
import { XDraw } from './XDraw';

class OffFragment {

  constructor() {
    this.canvas = document.createElement('canvas');
    this.xDraw = new XDraw(this.canvas);
  }

  resize(width, height) {
    this.xDraw.resize(width, height);
  }

  read() {
    
  }

  save() {

  }

}

export {
  OffFragment,
};
