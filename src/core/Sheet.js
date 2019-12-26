import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { Table } from './Table';
import { Utils } from '../utils/Utils';

class Sheet extends Widget {
  constructor(options) {
    super(`${cssPrefix}-sheet`);
    this.options = Utils.mergeDeep({
      data: [],
    }, options);
    this.table = new Table();
    this.children(this.table);
  }

  init() {
    this.table.init();
  }
}

export { Sheet };
