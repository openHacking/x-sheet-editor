import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';

class XHeightLight extends Widget {
  constructor(table) {
    super(`${cssPrefix}-table-x-height-light`);
    this.table = table;
  }
}

export { XHeightLight };
