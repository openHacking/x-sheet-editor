class XFixedMeasure {

  constructor({
    rows,
    cols,
    fixedView,
  }) {
    this.fixedView = fixedView;
    this.cols = cols;
    this.rows = rows;
  }

  getHeight() {
    const { rows } = this;
    return rows.rectRangeSumHeight(this.fixedView.getFixedView());
  }

  getWidth() {
    const { cols } = this;
    return cols.rectRangeSumWidth(this.fixedView.getFixedView());
  }

}

export {
  XFixedMeasure,
};
