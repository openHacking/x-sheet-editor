import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { XScreenBRZone } from './zone/XScreenBRZone';
import { XScreenLTZone } from './zone/XScreenLTZone';
import { XScreenLZone } from './zone/XScreenLZone';
import { XScreenTZone } from './zone/XScreenTZone';

class XScreen extends Widget {

  constructor(table) {
    super(`${cssPrefix}-xScreen`);
    this.pool = [];
    this.table = table;
    this.ltZone = new XScreenLTZone();
    this.tZone = new XScreenTZone();
    this.brZone = new XScreenBRZone();
    this.lZone = new XScreenLZone();
  }

  addItem(item) {
    this.pool.push(item);
    this.ltZone.attach(item.lt);
    this.tZone.attach(item.t);
    this.brZone.attach(item.br);
    this.lZone.attach(item.l);
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
  XScreen,
};
