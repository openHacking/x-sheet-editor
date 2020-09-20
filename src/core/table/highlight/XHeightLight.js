import { Widget } from '../../../lib/Widget';
import { RANGE_OVER_GO } from '../xscreen/item/viewborder/XScreenStyleBorderItem';
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
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.offsetHandle();
    });
  }

  offsetHandle() {
    const { table } = this;
    const {
      xScreen,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    if (selectRange) {
      this.show();
      this.offset({
        left: this.getLeft() + table.getIndexWidth(),
        top: 0,
        width: this.getWidth(),
        height: table.getIndexHeight(),
      });
    }
  }

  setSize() {
    const { table } = this;
    this.css('height', `${table.getIndexHeight()}px`);
  }

  getLeft() {
    const { table } = this;
    const {
      xScreen, rows, xFixedView, cols,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    const overGo = xSelect.getOverGo(selectRange);
    const fixedView = xFixedView.getFixedView();
    const scrollView = table.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = rows.length - 1;
    fixedView.sri = 0;
    fixedView.eri = rows.length - 1;
    switch (overGo) {
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.ALL:
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.L: {
        return cols.sectionSumWidth(fixedView.sci, selectRange.sci - 1);
      }
      case RANGE_OVER_GO.BR:
      case RANGE_OVER_GO.T:
      case RANGE_OVER_GO.BRT: {
        const coincide = scrollView.coincide(selectRange);
        const scroll = cols.sectionSumWidth(scrollView.sci, coincide.sci - 1);
        const fixed = cols.sectionSumWidth(fixedView.sci, fixedView.eci);
        return fixed + scroll;
      }
    }
    return 0;
  }

  getWidth() {
    const { table } = this;
    const {
      xScreen, rows, xFixedView, cols,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    const fixedView = xFixedView.getFixedView();
    const scrollView = table.getScrollView();
    const overGo = xSelect.getOverGo(selectRange);
    scrollView.sri = 0;
    scrollView.eri = rows.length - 1;
    fixedView.sri = 0;
    fixedView.eri = rows.length - 1;
    switch (overGo) {
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.L:
      case RANGE_OVER_GO.LTL: {
        return cols.rectRangeSumWidth(selectRange);
      }
      case RANGE_OVER_GO.BR:
      case RANGE_OVER_GO.T:
      case RANGE_OVER_GO.BRT: {
        return cols.rectRangeSumWidth(scrollView.coincide(selectRange));
      }
      case RANGE_OVER_GO.BRL:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.ALL: {
        const scroll = cols.rectRangeSumWidth(scrollView.coincide(selectRange));
        const fixed = cols.rectRangeSumWidth(fixedView.coincide(selectRange));
        return scroll + fixed;
      }
    }
    return 0;
  }
}

export { XHeightLight };
