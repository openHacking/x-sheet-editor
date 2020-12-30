class RowHeightIndex {

  constructor({
    group = 1000,
    rows,
    xFixedView,
  }) {
    this.rows = rows;
    this.index = [];
    this.group = group;
    this.xFixedView = xFixedView;
  }

  compute() {
    const { rows, group, xFixedView } = this;
    const { len } = rows;
    const fixedView = xFixedView.getFixedView();
    const min = fixedView.eri + 1;
    const index = [];
    index.push({
      ri: min, top: 0,
    });
    for (let ri = min + 1, top = 0; ri < len; ri++) {
      if (ri % group === 0) {
        index.push({
          ri, top,
        });
      }
      top += rows.getHeight(ri);
    }
    this.index = index;
  }

  getTop(height) {
    const { index } = this;
    const { length } = index;
    for (let i = 0; i < length; i++) {
      const { top } = index[i];
      if (height <= top) {
        return i === 0 ? index[i] : index[i - 1];
      }
    }
    return index[length - 1];
  }

}

export {
  RowHeightIndex,
};
