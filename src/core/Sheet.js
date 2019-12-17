import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { Table } from './Table';

class Sheet extends Widget {
  constructor() {
    super(`${cssPrefix}-sheet`);
    this.table = new Table();
    this.children(this.table);
  }

  init() {
    this.table.init();
  }
}

export { Sheet };
