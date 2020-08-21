import { XScreenLTPart } from './part/XScreenLTPart';
import { XScreenTPart } from './part/XScreenTPart';
import { XScreenBRPart } from './part/XScreenBRPart';
import { XScreenLPart } from './part/XScreenLPart';

class XScreenItem {

  constructor({
    table,
    lt = new XScreenLTPart(),
    t = new XScreenTPart(),
    br = new XScreenBRPart(),
    l = new XScreenLPart(),
  } = {}) {
    this.table = table;
    this.lt = lt;
    this.t = t;
    this.br = br;
    this.l = l;
  }

  setWidth(width) {
    this.lt.offset({ width });
    this.t.offset({ width });
    this.br.offset({ width });
    this.l.offset({ width });
  }

  setHeight(height) {
    this.lt.offset({ height });
    this.t.offset({ height });
    this.br.offset({ height });
    this.l.offset({ height });
  }

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

  setLeft(left) {
    const { table } = this;
    const { fixed } = table;
    const { cols } = table;
    const offsetLeft = cols.sectionSumWidth(0, fixed.fxLeft);
    this.lt.offset({ left });
    this.l.offset({ left });
    this.t.offset({ left: left + offsetLeft });
    this.br.offset({ left: left + offsetLeft });
  }

  setTop(top) {
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const offsetTop = rows.sectionSumHeight(0, fixed.fxTop);
    this.lt.offset({ top });
    this.l.offset({ top });
    this.t.offset({ top: top + offsetTop });
    this.br.offset({ top: top + offsetTop });
  }

}

export {
  XScreenItem,
};
