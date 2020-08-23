import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { XScreenBRZone } from './zone/XScreenBRZone';
import { XScreenLTZone } from './zone/XScreenLTZone';
import { XScreenLZone } from './zone/XScreenLZone';
import { XScreenTZone } from './zone/XScreenTZone';
import { EventBind } from '../../../utils/EventBind';

const DISPLAY_AREA = {
  BRT: Symbol('BRT'),
  BRL: Symbol('BRL'),
  BR: Symbol('br'),
  ALL: Symbol('ALL'),
};

class XScreen extends Widget {

  constructor(table) {
    super(`${cssPrefix}-x-screen`);
    this.pool = [];
    this.table = table;
    this.displayArea = DISPLAY_AREA.BR;
    this.ltZone = new XScreenLTZone();
    this.tZone = new XScreenTZone();
    this.brZone = new XScreenBRZone();
    this.lZone = new XScreenLZone();
    this.child(this.ltZone);
    this.child(this.tZone);
    this.child(this.brZone);
    this.child(this.lZone);
  }

  onAttach() {
    this.bind();
    this.sizeHandle();
  }

  bind() {
    const { table } = this;
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, () => {
      this.sizeHandle();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.sizeHandle();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.sizeHandle();
    });
  }

  addItem(item) {
    this.pool.push(item);
    this.ltZone.attach(item.lt);
    this.lZone.attach(item.l);
    this.brZone.attach(item.br);
    this.tZone.attach(item.t);
    item.setXScreen(this);
    item.onAdd(this);
  }

  sizeHandle() {
    const { table } = this;
    const { index } = table;
    const fixedWidth = table.getFixedWidth();
    const fixedHeight = table.getFixedHeight();
    const brLeft = index.getWidth() + fixedWidth;
    const brTop = index.getHeight() + fixedHeight;
    this.brZone.offset({ left: brLeft, top: brTop });
    const ltDisplay = fixedWidth > 0 && fixedHeight > 0;
    const tDisplay = fixedHeight > 0;
    const lDisplay = fixedHeight > 0;
    this.ltZone.hide();
    this.lZone.hide();
    this.tZone.hide();
    if (ltDisplay) {
      this.displayArea = DISPLAY_AREA.ALL;
      // lt
      this.ltZone.offset({
        left: index.getWidth(), top: index.getHeight(), width: fixedWidth, height: fixedHeight,
      }).show();
      this.ltZone.css('border-width', '1px');
      // l
      this.lZone.offset({
        left: index.getWidth(),
        top: brTop,
        width: fixedWidth,
      }).show();
      this.lZone.css('border-width', '1px');
      // t
      this.tZone.offset({
        left: brLeft,
        top: index.getHeight(),
        height: fixedHeight,
      }).show();
      this.tZone.css('border-width', '1px');
    } else if (lDisplay) {
      this.displayArea = DISPLAY_AREA.BRL;
      // l
      this.lZone.offset({
        left: index.getWidth(),
        top: brTop,
        width: fixedWidth,
      }).show();
      this.lZone.css('border-width', '1px');
    } else if (tDisplay) {
      this.displayArea = DISPLAY_AREA.BRL;
      // t
      this.tZone.offset({
        left: brLeft,
        top: index.getHeight(),
        height: fixedHeight,
      }).show();
      this.tZone.css('border-width', '1px');
    } else {
      this.displayArea = DISPLAY_AREA.BR;
    }
  }

  findType(type) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.pool) {
      if (item instanceof type) {
        return item;
      }
    }
    return null;
  }

}

export {
  XScreen, DISPLAY_AREA,
};
