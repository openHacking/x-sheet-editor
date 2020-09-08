import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { EventBind } from '../../utils/EventBind';
import { XTableDimensions } from '../table/XTableDimensions,';

class Sheet extends Widget {

  constructor(options = {
    tableConfig: {
      data: [],
    },
  }) {
    super(`${cssPrefix}-sheet`);
    this.options = options;
    this.table = new XTableDimensions({
      settings: this.options.tableConfig,
    });
  }

  bind() {
    const { table } = this;
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, this);
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, this);
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, this);
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN, this);
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
      e.stopPropagation();
    });
  }

  onAttach() {
    const { table } = this;
    this.attach(table);
    this.bind();
  }

}

export { Sheet };
