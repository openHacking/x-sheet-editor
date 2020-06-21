import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../constant/Constant';
import { Table } from '../table/Table';
import { EventBind } from '../../utils/EventBind';


class Sheet extends Widget {

  constructor(options = {
    tableConfig: {
      data: [],
    },
  }) {
    super(`${cssPrefix}-sheet`);
    this.options = options;
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
    EventBind.bind(this.table, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, this);
      e.stopPropagation();
    });
    EventBind.bind(this.table, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN, this);
      e.stopPropagation();
    });
  }

  onAttach() {
    this.table = new Table(this, this.options.tableConfig);
    this.attach(this.table);
    this.bind();
  }
}

export { Sheet };
