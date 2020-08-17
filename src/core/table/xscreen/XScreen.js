import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';

class XScreen extends Widget {

  constructor(table) {
    super(`${cssPrefix}-screen`);
    this.table = table;
    this.pool = [];
  }

  add(widget) {
    this.pool.push(widget);
  }

}

export {
  XScreen,
};
