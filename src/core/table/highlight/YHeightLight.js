import { Widget } from '../../../lib/Widget';
import { RANGE_OVER_GO } from '../xscreen/item/viewborder/XScreenStyleBorderItem';
import { Constant, cssPrefix } from '../../../const/Constant';
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
        left: 0,
        top: this.getTop() + table.getIndexHeight(),
        width: table.getIndexWidth(),
        height: this.getHeight(),
      });
    }
  }

  setSize() {
    const { table } = this;
    this.css('width', `${table.getIndexWidth()}px`);
  }

  getTop() {
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
    scrollView.sci = 0;
    scrollView.eci = cols.length - 1;
    fixedView.sci = 0;
    fixedView.eci = cols.length - 1;
    switch (overGo) {
      case RANGE_OVER_GO.BRT:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.ALL:
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.LTT:
      case RANGE_OVER_GO.T: {
        return rows.sectionSumHeight(fixedView.sri, selectRange.sri - 1);
      }
      case RANGE_OVER_GO.BR:
      case RANGE_OVER_GO.L:
      case RANGE_OVER_GO.BRL: {
        const coincide = scrollView.coincide(selectRange);
        const scroll = rows.sectionSumHeight(scrollView.sri, coincide.sri - 1);
        const fixed = rows.sectionSumHeight(fixedView.sri, fixedView.eri);
        return fixed + scroll;
      }
    }
    return 0;
  }

  getHeight() {
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
    scrollView.sci = 0;
    scrollView.eci = cols.length - 1;
    fixedView.sci = 0;
    fixedView.eci = cols.length - 1;
    switch (overGo) {
      case RANGE_OVER_GO.LT:
      case RANGE_OVER_GO.T:
      case RANGE_OVER_GO.LTT: {
        return rows.rectRangeSumHeight(selectRange);
      }
      case RANGE_OVER_GO.BR:
      case RANGE_OVER_GO.L:
      case RANGE_OVER_GO.BRL: {
        return rows.rectRangeSumHeight(scrollView.coincide(selectRange));
      }
      case RANGE_OVER_GO.BRT:
      case RANGE_OVER_GO.LTL:
      case RANGE_OVER_GO.ALL: {
        const scroll = rows.rectRangeSumHeight(scrollView.coincide(selectRange));
        const fixed = rows.rectRangeSumHeight(fixedView.coincide(selectRange));
        return scroll + fixed;
      }
    }
    return 0;
  }

}

export { YHeightLight };
