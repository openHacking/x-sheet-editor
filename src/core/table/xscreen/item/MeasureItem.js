import { OffsetItem } from './OffsetItem';
import { RectRange } from '../../tablebase/RectRange';

class MeasureFixed extends OffsetItem {

  measureFixedHeight(range) {
    const { table } = this;
    const {
      fixed, rows,
    } = table;
    const { fixTop } = fixed;
    if (range.sri >= fixTop) {
      return 0;
    }
    return rows.sectionSumHeight(range.sri, fixTop);
  }

  measureFixedWidth(range) {
    const { table } = this;
    const {
      fixed, cols,
    } = table;
    const { fixLeft } = fixed;
    if (range.sci >= fixLeft) {
      return 0;
    }
    return cols.sectionSumWidth(range.sci, fixLeft);
  }

  measureFixedLeft(range) {
    const { table } = this;
    const {
      fixed, cols,
    } = table;
    const { fixLeft } = fixed;
    if (range.sci >= fixLeft) {
      return 0;
    }
    return cols.sectionSumWidth(0, range.sci - 1);
  }

  measureFixedTop(range) {
    const { table } = this;
    const {
      fixed, rows,
    } = table;
    const { fixTop } = fixed;
    if (range.sri >= fixTop) {
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
    const targetView = scrollView.contains(range);
    if (targetView.equals(RectRange.EMPTY)) {
      return 0;
    }
    return rows.rectRangeSumHeight(targetView);
  }

  measureScrollViewWidth(range) {
    const { table } = this;
    const { cols } = table;
    const scrollView = table.getScrollView();
    const targetView = scrollView.contains(range);
    if (targetView.equals(RectRange.EMPTY)) {
      return 0;
    }
    return cols.rectRangeSumWidth(targetView);
  }

  measureScrollViewLeft(range) {
    const { table } = this;
    const { cols } = table;
    const scrollView = table.getScrollView();
    const targetView = scrollView.contains(range);
    if (targetView.equals(RectRange.EMPTY)) {
      return 0;
    }
    return cols.sectionSumWidth(scrollView.sci, targetView.sci - 1);
  }

  measureScrollViewTop(range) {
    const { table } = this;
    const { rows } = table;
    const scrollView = table.getScrollView();
    const targetView = scrollView.contains(range);
    if (targetView.equals(RectRange.EMPTY)) {
      return 0;
    }
    return rows.sectionSumHeight(scrollView.sri, targetView.sri - 1);
  }

}

class MeasureItem extends MeasureScrollView {

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
      fixLeft, fixTop,
    } = fixed;
    const scrollView = table.getScrollView();
    if (fixLeft > -1 && fixTop > -1) {
      const lt = new RectRange(0, 0, fixTop, fixLeft);
      const l = new RectRange(scrollView.sri, 0, scrollView.eri, fixLeft);
      const t = new RectRange(0, scrollView.sci, fixTop, scrollView.eci);
      if (!lt.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
      if (!l.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
      if (!t.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    } if (fixLeft > -1) {
      const l = new RectRange(scrollView.sri, 0, scrollView.eri, fixLeft);
      if (!l.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    } else if (fixTop > -1) {
      const t = new RectRange(0, scrollView.sci, fixTop, scrollView.eci);
      if (!t.coincide(range).equals(RectRange.EMPTY)) {
        return false;
      }
    }
    return scrollView.coincide(range)
      .equals(RectRange.EMPTY);
  }

}

export {
  MeasureItem,
};
