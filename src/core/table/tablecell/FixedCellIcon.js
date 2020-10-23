import { PlainUtils } from '../../../utils/PlainUtils';

class FixedCellIcon {

  constructor({
    rows,
    cols,
    cells,
  } = {}) {
    this.cols = cols;
    this.cells = cells;
    this.data = new Array(rows.len * cols.len);
  }

  getOffset(ri, ci) {
    const { cols } = this;
    const { len } = cols;
    return (ri * len) + ci;
  }

  getIcon(ri, ci) {
    const { data } = this;
    const offset = this.getOffset(ri, ci);
    return data[offset];
  }

  addOrNewCell(ri, ci, xIcon) {
    const { cells } = this;
    cells.getCellOrNew(ri, ci);
    this.add(ri, ci, xIcon);
  }

  add(ri, ci, xIcon) {
    const { data, cells } = this;
    const cell = cells.getCell(ri, ci);
    if (cell) {
      const xIcons = this.getIcon(ri, ci);
      if (xIcons) {
        xIcons.push(xIcon);
      } else {
        const offset = this.getOffset(ri, ci);
        data[offset] = [xIcon];
      }
    }
  }

  remove(ri, ci, xIcon = null) {
    const { data } = this;
    let xIcons = this.getIcon(ri, ci);
    if (xIcons) {
      const offset = this.getOffset(ri, ci);
      if (xIcon) {
        xIcons = xIcons.filter(item => item !== xIcon);
        data[offset] = xIcons;
      } else {
        data[offset] = PlainUtils.Undef;
      }
    }
  }

}

export {
  FixedCellIcon,
};
