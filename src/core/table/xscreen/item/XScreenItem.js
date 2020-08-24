import { XScreenLTPart } from '../part/XScreenLTPart';
import { XScreenTPart } from '../part/XScreenTPart';
import { XScreenBRPart } from '../part/XScreenBRPart';
import { XScreenLPart } from '../part/XScreenLPart';

class XScreenItem {

  constructor({
    table,
  } = {}) {
    this.table = table;
    this.lt = new XScreenLTPart();
    this.t = new XScreenTPart();
    this.br = new XScreenBRPart();
    this.l = new XScreenLPart();
    this.xScreen = null;
  }

  setXScreen(xScreen) {
    this.xScreen = xScreen;
  }

  onAdd() {}

  hide() {
    this.lt.hide();
    this.t.hide();
    this.br.hide();
    this.l.hide();
  }

  show() {
    this.lt.show();
    this.t.show();
    this.br.show();
    this.l.show();
  }

  setHeight(height) {
    this.lt.offset({ height });
    this.t.offset({ height });
    this.br.offset({ height });
    this.l.offset({ height });
  }

  setWidth(width) {
    this.lt.offset({ width });
    this.t.offset({ width });
    this.br.offset({ width });
    this.l.offset({ width });
  }

}

export {
  XScreenItem,
};
