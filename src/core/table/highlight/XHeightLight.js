import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../const/Constant';
import { EventBind } from '../../../utils/EventBind';
import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';
import { XDraw } from '../../../canvas/XDraw';
import { RANGE_OVER_GO } from '../xscreen/item/viewborder/XScreenStyleBorderItem';

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
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.offsetHandle();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
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
      xScreen, cols, xFixedView,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const scrollView = table.getScrollView();
    const {
      selectRange, overGo,
    } = xSelect;
    if (!selectRange) {
      return 0;
    }
    // 固定位置
    const fixedView = xFixedView.getFixedView();
    switch (overGo) {
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.L:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.ALL:
        return XDraw.offsetToLineInside(cols.sectionSumWidth(selectRange.sci, fixedView.eci));
    }
    // 滚动位置
    return XDraw.offsetToLineInside(cols.sectionSumWidth(scrollView.sci, selectRange.sci - 1));
  }

  getWidth() {
    const { table } = this;
    const {
      xScreen, cols, xFixedView,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const scrollView = table.getScrollView();
    const {
      selectRange, overGo,
    } = xSelect;
    // 固定宽度
    const fixedView = xFixedView.getFixedView();
    let fixWidth = 0;
    switch (overGo) {
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.L:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.ALL:
        fixWidth = cols.sectionSumWidth(selectRange.sci, fixedView.eci);
        break;
    }
    // 滚动宽度
    const range = selectRange.clone();
    range.sri = scrollView.sri;
    range.eri = scrollView.sri;
    return fixWidth + cols.rectRangeSumWidth(scrollView.coincide(range));
  }
}

export { XHeightLight };
