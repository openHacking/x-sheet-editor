import { ScreenElement } from './ScreenElement';
import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { Constant } from '../../../utils/Constant';

class Screen extends Widget {
  constructor(table) {
    super(`${cssPrefix}-screen`);
    this.table = table;
    this.lt = new ScreenElement(`${cssPrefix}-screen-element-lt`);
    this.t = new ScreenElement(`${cssPrefix}-screen-element-t`);
    this.l = new ScreenElement(`${cssPrefix}-screen-element-l`);
    this.br = new ScreenElement(`${cssPrefix}-screen-element-br`);
    this.focusWidget = null;
    this.children(this.lt, this.t, this.l, this.br);
    this.bind();
  }

  init() {
    this.setDivideLayer();
  }

  bind() {
    const { table } = this;
    table.on(Constant.EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.setDivideLayer();
    });
    table.on(Constant.EVENT_TYPE.CHANGE_WIDTH, () => {
      this.setDivideLayer();
    });
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
    if (fixedWidth > 0 && fixedHeight > 0) {
      this.lt.offset({
        left: index.width, top: index.height, width: fixedWidth, height: fixedHeight,
      }).show();
    }
    if (fixedWidth) {
      this.l.offset({ left: index.width, top: brTop, width: fixedWidth }).show();
    }
    if (fixedHeight) {
      this.t.offset({ left: brLeft, top: index.height, height: fixedHeight }).show();
    }
    if (fixedWidth === 0 && fixedHeight === 0) {
      this.lt.hide();
      this.t.hide();
      this.l.hide();
    }
  }
}

export { Screen };
