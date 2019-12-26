import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { Table } from './Table';
import { Utils } from '../utils/Utils';

class Sheet extends Widget {
  constructor(options) {
    super(`${cssPrefix}-sheet`);
    this.options = Utils.mergeDeep({
      tableConfig: {},
      data: [],
    }, options);
    const newTableConfig = Utils.cloneDeep(this.options.tableConfig);
    newTableConfig.data = this.options.data;
    this.table = new Table(newTableConfig);
    this.children(this.table);
  }

  init() {
    this.table.init();
  }

  show() {
    super.show();
    this.table.render();
    return this;
  }
}

export { Sheet };
