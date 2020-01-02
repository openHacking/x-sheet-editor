import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Table } from '../table/Table';

class Sheet extends Widget {
  constructor(options = {
    tableConfig: {
      data: [],
      merges: [],
    },
  }) {
    super(`${cssPrefix}-sheet`);
    this.options = options;
    // console.log('this.options.tableConfig >>>', this.options.tableConfig);
    this.table = new Table(this.options.tableConfig);
    this.children(this.table);
  }

  init() {
    this.table.init();
  }
}

export { Sheet };
