import { RectRange } from '../../tablebase/RectRange';
import { XScreenPositionItem } from './XScreenPositionItem';

class MeasureFixed extends XScreenPositionItem {

  measureFixedHeight(range) {
    const { table } = this;
    const {
      xFixedView, rows,
    } = table;
    const fixedView = xFixedView.getFixedView();
    if (range.sri >= fixedView.eri) {
      return 0;
    }
    return rows.sectionSumHeight(range.sri, fixedView.eri);
  }

  measureFixedWidth(range) {
    const { table } = this;
    const {
      xFixedView, cols,
    } = table;
    const fixedView = xFixedView.getFixedView();
    if (range.sci >= fixedView.eci) {
      return 0;
    }
    return cols.sectionSumWidth(range.sci, fixedView.eci);
  }

  measureFixedLeft(range) {
    const { table } = this;
    const {
      xFixedView, cols,
    } = table;
    const fixedView = xFixedView.getFixedView();
    if (range.sci >= fixedView.eci) {
      return 0;
    }
    return cols.sectionSumWidth(0, range.sci - 1);
  }

  measureFixedTop(range) {
    const { table } = this;
    const {
      xFixedView, rows,
    } = table;
    const fixedView = xFixedView.getFixedView();
    if (range.sri >= fixedView.eri) {
      return 0;
    }
    return rows.sectionSumHeight(0, range.sri - 1);
  }

}

class MeasureScrollView extends MeasureFixed {

  measureScrollViewHeight(range) {
    const { table } = this;
    const { rows } = table;
    const scrollView = table.getScrollView();
    const targetView = scrollView.coincide(range);
    if (targetView.equals(RectRange.EMPTY)) {
      return 0;
    }
    return rows.rectRangeSumHeight(targetView);
  }

  measureScrollViewWidth(range) {
    const { table } = this;
    const { cols } = table;
    const scrollView = table.getScrollView();
    const targetView = scrollView.coincide(range);
    if (targetView.equals(RectRange.EMPTY)) {
      return 0;
    }
    return cols.rectRangeSumWidth(targetView);
  }

  measureScrollViewLeft(range) {
    const { table } = this;
    const { cols } = table;
    const scrollView = table.getScrollView();
    const targetView = scrollView.coincide(range);
    if (targetView.equals(RectRange.EMPTY)) {
      return 0;
    }
    return cols.sectionSumWidth(scrollView.sci, targetView.sci - 1);
  }

  measureScrollViewTop(range) {
    const { table } = this;
    const { rows } = table;
    const scrollView = table.getScrollView();
    const targetView = scrollView.coincide(range);
    if (targetView.equals(RectRange.EMPTY)) {
      return 0;
    }
    return rows.sectionSumHeight(scrollView.sri, targetView.sri - 1);
  }

}

class XScreenMeasureItem extends MeasureScrollView {

  measureHeight(range) {
    return this.measureFixedHeight(range) + this.measureScrollViewHeight(range);
  }

  measureWidth(range) {
    return this.measureFixedWidth(range) + this.measureScrollViewWidth(range);
  }

  measureLeft(range) {
    return this.measureFixedLeft(range) + this.measureScrollViewLeft(range);
  }

  measureTop(range) {
    return this.measureFixedTop(range) + this.measureScrollViewTop(range);
  }

  measureBoundOut(range) {
    if (!range) {
      return true;
    }
    const { table } = this;
    const { xFixedView } = table;
    const fixedView = xFixedView.getFixedView();
    const scrollView = table.getScrollView();
    if (fixedView.hasFixedLeft() && fixedView.hasFixedTop()) {
      const lt = fixedView.clone();
      const l = new RectRange(scrollView.sri, fixedView.sci, scrollView.eri, fixedView.eci);
      const t = new RectRange(fixedView.sri, scrollView.sci, fixedView.eri, scrollView.eci);
      if (!lt.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
      if (!l.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
      if (!t.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    } if (fixedView.hasFixedLeft()) {
      const l = new RectRange(scrollView.sri, fixedView.sci, scrollView.eri, fixedView.eci);
      if (!l.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    } else if (fixedView.hasFixedTop()) {
      const t = new RectRange(fixedView.sri, scrollView.sci, fixedView.eri, scrollView.eci);
      if (!t.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    }
    return scrollView.coincide(range).equals(RectRange.EMPTY);
  }

}

export {
  XScreenMeasureItem,
};
