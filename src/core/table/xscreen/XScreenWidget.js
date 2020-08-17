import { cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../lib/Widget';

class XScreenWidget extends Widget {

  constructor({
    xScreen, ltEl, tEl, brEl, lEl
  }) {
    super(`${cssPrefix}-screen-widget`);
    this.xScreen = xScreen;
    this.ltEl = new Widget(`${cssPrefix}-screen-widget-lt`).child(ltEl);
    this.tEl = new Widget(`${cssPrefix}-screen-widget-t`).child(tEl);
    this.brEl = new Widget(`${cssPrefix}-screen-widget-br`).child(brEl);
    this.lEl = new Widget(`${cssPrefix}-screen-widget-l`).child(lEl);
  }

  setBottom() {}

  setLeft() {}

  setTop() {}

  setRight() {}

  setWidth() {}

  setHeight() {}

}

export {
  XScreenWidget,
};
