import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { EventBind } from '../../../utils/EventBind';
import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';

class XHeightLight extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-x-height-light`);
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
    return selectRange.eci < scrollView.sci || selectRange.sci > scrollView.eci;
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
      left: this.getLeft() + table.getIndexWidth(),
      top: 0,
      width: this.getWidth(),
      height: table.getIndexHeight(),
    });
  }

  setSize() {
    const { table } = this;
    this.css('height', `${table.getIndexHeight()}px`);
  }

  getLeft() {
    const { table } = this;
    const {
      xScreen, cols,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const scrollView = table.getScrollView();
    const {
      selectRange,
    } = xSelect;
    if (!selectRange) {
      return 0;
    }
    return cols.sectionSumWidth(scrollView.sci, selectRange.sci - 1);
  }

  getWidth() {
    const { table } = this;
    const {
      xScreen, cols,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const scrollView = table.getScrollView();
    const {
      selectRange,
    } = xSelect;
    const range = selectRange.clone();
    range.sri = scrollView.sri;
    range.eri = scrollView.sri;
    return cols.rectRangeSumWidth(scrollView.coincide(range));
  }
}

export { XHeightLight };
