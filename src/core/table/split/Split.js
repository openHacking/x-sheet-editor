import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';

class Split extends Widget {
  constructor(table) {
    super(`${cssPrefix}-table-split`);
    this.widgetList = [];
    this.table = table;
  }
}

export { Split };
