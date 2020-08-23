import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { EventBind } from '../../../utils/EventBind';
import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';

class YHeightLight extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-y-height-light`);
    this.table = table;
    this.setSize();
  }

  onAttach() {
    this.bind();
    this.hide();
  }

  checkOut() {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    if (!selectRange) {
      return true;
    }
    const scrollView = table.getScrollView();
    return selectRange.eri < scrollView.sri || selectRange.sri > scrollView.eri;
  }

  bind() {
    const { table } = this;
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, () => {
      this.offsetHandle();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.offsetHandle();
    });
  }

  offsetHandle() {
    if (this.checkOut()) {
      this.hide();
      return;
    }
    this.show();
    const { table } = this;
    this.offset({
      left: 0,
      top: this.getTop() + table.getIndexHeight(),
      width: table.getIndexWidth(),
      height: this.getHeight(),
    });
  }

  setSize() {
    const { table } = this;
    this.css('width', `${table.getIndexWidth()}px`);
  }

  getTop() {
    const { table } = this;
    const {
      xScreen, rows,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const scrollView = table.getScrollView();
    const {
      selectRange,
    } = xSelect;
    if (!selectRange) {
      return 0;
    }
    return rows.sectionSumHeight(scrollView.sri, selectRange.sri - 1);
  }

  getHeight() {
    const { table } = this;
    const {
      xScreen, rows,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const scrollView = table.getScrollView();
    const {
      selectRange,
    } = xSelect;
    const range = selectRange.clone();
    range.sci = scrollView.sci;
    range.eci = scrollView.sci;
    return rows.rectRangeSumHeight(scrollView.coincide(range));
  }
}

export { YHeightLight };
