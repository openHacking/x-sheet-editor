import { XScreenItem } from './XScreenItem';

class XScreenPositionItem extends XScreenItem {

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

  setLeft(left) {
    const { table } = this;
    const { xFixedMeasure } = table;
    const offsetLeft = xFixedMeasure.getWidth();
    this.lt.offset({ left });
    this.l.offset({ left });
    this.t.offset({ left: left - offsetLeft });
    this.br.offset({ left: left - offsetLeft });
  }

  setTop(top) {
    const { table } = this;
    const { xFixedMeasure } = table;
    const offsetTop = xFixedMeasure.getHeight();
    this.lt.offset({ top });
    this.l.offset({ top });
    this.t.offset({ top: top - offsetTop });
    this.br.offset({ top: top - offsetTop });
  }

}

export {
  XScreenPositionItem,
};
