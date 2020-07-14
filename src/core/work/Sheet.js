import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../constant/Constant';
import { EventBind } from '../../utils/EventBind';
import { XTable } from '../table/XTable';

class Sheet extends Widget {

  constructor(options = {
    tableConfig: {
      data: [],
    },
  }) {
    super(`${cssPrefix}-sheet`);
    this.options = options;
    this.table = new XTable(this.options.tableConfig);
  }

  bind() {
    EventBind.bind(this.table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, (e) => {
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
    this.attach(this.table);
    this.bind();
  }
}

export { Sheet };
