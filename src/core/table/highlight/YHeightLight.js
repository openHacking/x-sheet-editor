import { Widget } from '../../../lib/Widget';
import { RANGE_OVER_GO } from '../xscreen/item/border/XScreenBorderItem';
import {
  cssPrefix,
  Constant,
} from '../../../const/Constant';
import { EventBind } from '../../../utils/EventBind';
import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';
import { XDraw } from '../../../canvas/XDraw';

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
      xScreen, rows, xFixedView,
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
      case RANGE_OVER_GO.T:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.ALL:
        return XDraw.offsetToLineInside(rows.sectionSumHeight(selectRange.sri, fixedView.eri));
    }
    // 滚动位置
    return XDraw.offsetToLineInside(rows.sectionSumHeight(scrollView.sri, selectRange.sri - 1));
  }

  getHeight() {
    const { table } = this;
    const {
      xScreen, rows, xFixedView,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const scrollView = table.getScrollView();
    const {
      selectRange, overGo,
    } = xSelect;
    // 固定宽度
    const fixedView = xFixedView.getFixedView();
    let fixHeight = 0;
    switch (overGo) {
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.T:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.ALL:
        fixHeight = rows.sectionSumHeight(selectRange.sri, fixedView.eri);
        break;
    }
    // 滚动宽度
    const range = selectRange.clone();
    range.sci = scrollView.sci;
    range.eci = scrollView.sci;
    return fixHeight + rows.rectRangeSumHeight(scrollView.coincide(range));
  }
}

export { YHeightLight };
