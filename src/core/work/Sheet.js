import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Table } from '../table/Table';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';

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
    this.bind();
  }

  init() {
    this.table.init();
  }

  bind() {
    EventBind.bind(this.table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, (e) => {
      // console.log('change width');
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, this);
      e.stopPropagation();
    });
    EventBind.bind(this.table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, this);
      e.stopPropagation();
    });
  }
}

export { Sheet };
