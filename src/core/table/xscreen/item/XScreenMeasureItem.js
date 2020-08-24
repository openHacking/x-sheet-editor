import { RectRange } from '../../tablebase/RectRange';
import { XScreenPositionItem } from './XScreenPositionItem';

class MeasureFixed extends XScreenPositionItem {

  measureFixedHeight(range) {
    const { table } = this;
    const {
      fixed, rows,
    } = table;
    const { fxTop } = fixed;
    if (range.sri >= fxTop) {
      return 0;
    }
    return rows.sectionSumHeight(range.sri, fxTop);
  }

  measureFixedWidth(range) {
    const { table } = this;
    const {
      fixed, cols,
    } = table;
    const { fxLeft } = fixed;
    if (range.sci >= fxLeft) {
      return 0;
    }
    return cols.sectionSumWidth(range.sci, fxLeft);
  }

  measureFixedLeft(range) {
    const { table } = this;
    const {
      fixed, cols,
    } = table;
    const { fxLeft } = fixed;
    if (range.sci >= fxLeft) {
      return 0;
    }
    return cols.sectionSumWidth(0, range.sci - 1);
  }

  measureFixedTop(range) {
    const { table } = this;
    const {
      fixed, rows,
    } = table;
    const { fxTop } = fixed;
    if (range.sri >= fxTop) {
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
    const { fixed } = table;
    const {
      fxLeft, fxTop,
    } = fixed;
    const scrollView = table.getScrollView();
    if (fxLeft > -1 && fxTop > -1) {
      const lt = new RectRange(0, 0, fxTop, fxLeft);
      const l = new RectRange(scrollView.sri, 0, scrollView.eri, fxLeft);
      const t = new RectRange(0, scrollView.sci, fxTop, scrollView.eci);
      if (!lt.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
      if (!l.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
      if (!t.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    } if (fxLeft > -1) {
      const l = new RectRange(scrollView.sri, 0, scrollView.eri, fxLeft);
      if (!l.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    } else if (fxTop > -1) {
      const t = new RectRange(0, scrollView.sci, fxTop, scrollView.eci);
      if (!t.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    }
    return scrollView.coincide(range)
      .equals(RectRange.EMPTY);
  }

}

export {
  XScreenMeasureItem,
};
