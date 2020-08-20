import { XScreenLTPart } from './part/XScreenLTPart';
import { XScreenTPart } from './part/XScreenTPart';
import { XScreenBRPart } from './part/XScreenBRPart';
import { XScreenLPart } from './part/XScreenLPart';

class XScreenItem {

  constructor({
    lt = new XScreenLTPart(),
    t = new XScreenTPart(),
    br = new XScreenBRPart(),
    l = new XScreenLPart(),
  } = {}) {
    this.lt = lt;
    this.t = t;
    this.br = br;
    this.l = l;
  }

}

export {
  XScreenItem,
};
