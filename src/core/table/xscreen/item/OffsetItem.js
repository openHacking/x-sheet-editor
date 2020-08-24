import { XScreenItem } from './XScreenItem';

class OffsetItem extends XScreenItem {

  offset(rectRange) {
    const { table } = this;
    const {
      cols, rows,
    } = table;
    const scrollView = table.getScrollView();
    const left = cols.sectionSumWidth(scrollView.sci, rectRange.sci - 1);
    const top = rows.sectionSumHeight(scrollView.sri, rectRange.sri - 1);
    this.setLeft(left);
    this.setTop(top);
    this.setWidth(rectRange.w);
    this.setHeight(rectRange.h);
  }

  setWidth(width) {
    this.lt.offset({ width });
    this.t.offset({ width });
    this.br.offset({ width });
    this.l.offset({ width });
  }

  setHeight(height) {
    this.lt.offset({ height });
    this.t.offset({ height });
    this.br.offset({ height });
    this.l.offset({ height });
  }

  setLeft(left) {
    const { table } = this;
    const { fixed } = table;
    const { cols } = table;
    const offsetLeft = cols.sectionSumWidth(0, fixed.fxLeft);
    this.lt.offset({ left });
    this.l.offset({ left });
    this.t.offset({ left: left - offsetLeft });
    this.br.offset({ left: left - offsetLeft });
  }

  setTop(top) {
    const { table } = this;
    const { fixed } = table;
    const { rows } = table;
    const offsetTop = rows.sectionSumHeight(0, fixed.fxTop);
    this.lt.offset({ top });
    this.l.offset({ top });
    this.t.offset({ top: top - offsetTop });
    this.br.offset({ top: top - offsetTop });
  }

}

export {
  OffsetItem,
};
