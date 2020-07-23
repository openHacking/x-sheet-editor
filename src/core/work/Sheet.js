import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { EventBind } from '../../utils/EventBind';
import { OTable } from '../table/OTable';

class Sheet extends Widget {

  constructor(options = {
    tableConfig: {
      data: [],
    },
  }) {
    super(`${cssPrefix}-sheet`);
    this.options = options;
    this.oTable = new OTable(this.options.tableConfig);
  }

  onAttach() {
    const { oTable } = this;
    const { xTable } = oTable;
    this.attach(xTable);
    this.bind();
  }

  bind() {
    const { oTable } = this;
    const { xTable } = oTable;
    EventBind.bind(xTable, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, this);
      e.stopPropagation();
    });
    EventBind.bind(xTable, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, this);
      e.stopPropagation();
    });
    EventBind.bind(xTable, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, this);
      e.stopPropagation();
    });
    EventBind.bind(xTable, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN, this);
      e.stopPropagation();
    });
  }

  scrollY(v) {
    const { oTable } = this;
    const { xTable } = oTable;
    xTable.scrollY(v);
  }

  scrollX(v) {
    const { oTable } = this;
    const { xTable } = oTable;
    xTable.scrollX(v);
  }

  getTableScroll() {
    const { oTable } = this;
    const { xTable } = oTable;
    return xTable.scroll;
  }

  getTableTop() {
    const { oTable } = this;
    return oTable.getTop();
  }

  getTableLeft() {
    const { oTable } = this;
    return oTable.getLeft();
  }

  getTableRows() {

  }

  getTableCols() {

  }

  getScrollTotalHeight() {}

  getScrollTotalWidth() {}

  resize() {}

  setScale() {}
}

export { Sheet };
