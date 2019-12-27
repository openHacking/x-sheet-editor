import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { SelectorElement } from './SelectorElement';

class Selector extends Widget {
  constructor() {
    super(`${cssPrefix}-selector`);
    this.zIndex = 10;
    this.br = new SelectorElement({ startZIndex: this.getElementZIndex() });
    this.t = new SelectorElement({ startZIndex: this.getElementZIndex() });
    this.l = new SelectorElement({ startZIndex: this.getElementZIndex() });
    this.tl = new SelectorElement({ startZIndex: this.getElementZIndex() });
    this.br.show();
    this.children(this.tl, this.t, this.l, this.br).show();
  }

  getElementZIndex() {
    this.zIndex += 1;
    return this.zIndex;
  }
}

export { Selector };
