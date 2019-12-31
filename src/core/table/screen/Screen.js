import { ScreenElement } from './ScreenElement';
import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';

class Screen extends Widget {
  constructor(table) {
    super(`${cssPrefix}-screen`);
    this.table = table;
    this.lt = new ScreenElement();
    this.t = new ScreenElement();
    this.l = new ScreenElement();
    this.br = new ScreenElement();
    this.focusWidget = null;
    this.children(this.lt, this.t, this.l, this.br);
  }

  init() {
    this.setDivideLayer();
  }

  addWidgets(widget) {
    this.lt.addWidgets(widget.getLT(this));
    this.t.addWidgets(widget.getT(this));
    this.l.addWidgets(widget.getL(this));
    this.br.addWidgets(widget.getBR(this));
  }

  setDivideLayer() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const fixedWidth = table.getFixedWidth();
    const fixedHeight = table.getFixedHeight();
    const brLeft = index.width + fixedWidth;
    const brTop = index.height + fixedHeight;
    this.br.offset({ left: brLeft, top: brTop });
    if (brLeft > 0 || brTop > 0) {
      this.lt.offset({
        left: index.width, top: index.height, width: fixedWidth, height: fixedHeight,
      }).show();
      this.t.offset({ left: brLeft, top: index.height, height: fixedHeight }).show();
      this.l.offset({ left: index.width, top: brTop, width: fixedWidth }).show();
    } else {
      this.lt.hide();
      this.t.hide();
      this.l.hide();
    }
  }
}

export { Screen };
