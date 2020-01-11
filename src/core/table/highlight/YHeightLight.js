import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';

class YHeightLight extends Widget {
  constructor(table) {
    super(`${cssPrefix}-table-y-height-light`);
    this.table = table;
  }

  init() {

  }

  bind() {}
}

export { YHeightLight };
