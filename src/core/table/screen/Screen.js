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
    this.widgets = [];
  }

  init() {
    this.setDivideLayer();
  }

  bind() {
    const { table } = this;
    table.on(Constant.EVENT_TYPE.CHANGE_HEIGHT, (e) => {
      // console.log('change height');
      this.setDivideLayer();
      e.stopPropagation();
    });
    table.on(Constant.EVENT_TYPE.CHANGE_WIDTH, (e) => {
      // console.log('change width');
      this.setDivideLayer();
      e.stopPropagation();
    });
  }

  addWidget(widget) {
    this.widgets.push(widget);
    this.lt.addWidget(widget.getLT(this));
    this.t.addWidget(widget.getT(this));
    this.l.addWidget(widget.getL(this));
    this.br.addWidget(widget.getBR(this));
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
    } else {
      this.lt.hide();
    }
    if (fixedWidth > 0) {
      this.l.offset({ left: index.width, top: brTop, width: fixedWidth }).show();
    } else {
      this.l.hide();
    }
    if (fixedHeight > 0) {
      this.t.offset({ left: brLeft, top: index.height, height: fixedHeight }).show();
    } else {
      this.t.hide();
    }
  }

  findByClass(clazz) {
    let find = null;
    this.widgets.forEach((item) => {
      if (item instanceof clazz) {
        find = item;
        return false;
      }
      return true;
    });
    return find;
  }
}

export { Screen };
