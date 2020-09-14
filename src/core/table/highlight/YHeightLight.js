import { Widget } from '../../../lib/Widget';
import {
  Constant, cssPrefix,
} from '../../../const/Constant';
import { EventBind } from '../../../utils/EventBind';
import { RANGE_OVER_GO } from '../xscreen/item/viewborder/XScreenStyleBorderItem';
import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';
import { RectRange } from '../tablebase/RectRange';

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
    const {
      selectRange,
    } = xSelect;
    const overGo = xSelect.getOverGo(selectRange);
    const fixedView = xFixedView.getFixedView();
    const scrollView = table.getScrollView();
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      switch (overGo) {
        case RANGE_OVER_GO.LT:
        case RANGE_OVER_GO.T:
        case RANGE_OVER_GO.LTT: {
          return rows.sectionSumHeight(fixedView.sri, selectRange.sri - 1);
        }
        case RANGE_OVER_GO.BR:
        case RANGE_OVER_GO.L:
        case RANGE_OVER_GO.BRL: {
          scrollView.sci = fixedView.sci;
          const coincideView = scrollView.coincide(selectRange);
          const fixed = rows.sectionSumHeight(fixedView.sri, selectRange.sri - 1);
          const scroll = rows.sectionSumHeight(scrollView.sri, coincideView.sri - 1);
          return fixed + scroll;
        }
        case RANGE_OVER_GO.BRT:
        case RANGE_OVER_GO.LTL:
        case RANGE_OVER_GO.ALL: {
          return rows.sectionSumHeight(fixedView.sri, selectRange.sri - 1);
        }
      }
    } else if (xFixedView.hasFixedTop()) {

    } else if (xFixedView.hasFixedLeft()) {

    }
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
    const colLen = cols.length - 1;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      switch (overGo) {
        case RANGE_OVER_GO.LT:
        case RANGE_OVER_GO.T:
        case RANGE_OVER_GO.LTT: {
          return rows.rectRangeSumHeight(selectRange);
        }
        case RANGE_OVER_GO.BR:
        case RANGE_OVER_GO.L:
        case RANGE_OVER_GO.BRL: {
          scrollView.sci = fixedView.sci;
          return rows.rectRangeSumHeight(scrollView.coincide(selectRange));
        }
        case RANGE_OVER_GO.BRT:
        case RANGE_OVER_GO.LTL:
        case RANGE_OVER_GO.ALL: {
          scrollView.sci = fixedView.sci;
          const scroll = rows.rectRangeSumHeight(scrollView.coincide(selectRange));
          const range = new RectRange(fixedView.sri, 0, fixedView.eri, colLen);
          const fixed = rows.rectRangeSumHeight(range.coincide(selectRange));
          return scroll + fixed;
        }
      }
    } else if (xFixedView.hasFixedTop()) {
      switch (overGo) {
        case RANGE_OVER_GO.BRT:
        case RANGE_OVER_GO.T: {
          return rows.rectRangeSumHeight(selectRange);
        }
        case RANGE_OVER_GO.BR: {
          scrollView.sci = fixedView.sci;
          const range = new RectRange(fixedView.sri, 0, fixedView.eri, colLen);
          const scroll = rows.rectRangeSumHeight(scrollView.coincide(selectRange));
          const fixed = rows.rectRangeSumHeight(range.coincide(selectRange));
          return fixed + scroll;
        }
      }
    } else if (xFixedView.hasFixedLeft()) {
      switch (overGo) {
        case RANGE_OVER_GO.BR:
        case RANGE_OVER_GO.L:
        case RANGE_OVER_GO.BRL: {
          scrollView.sci = fixedView.sci;
          return rows.rectRangeSumHeight(scrollView.coincide(selectRange));
        }
      }
    }
    return 0;
  }

}

export { YHeightLight };
