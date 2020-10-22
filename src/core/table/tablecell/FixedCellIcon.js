import { PlainUtils } from '../../../utils/PlainUtils';
import { XIcon } from '../xicon/XIcon';

class FixedCellIcon {

  constructor({
    rows,
    cols,
  } = {}) {
    this.cols = cols;
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

  xIconsEvent({
    type, x, y, native, ri, ci,
  }) {
    const icons = this.getIcon(ri, ci);
    if (icons) {
      XIcon.xIconsEvent({
        icons, type, x, y, native,
      });
    }
  }

  add(ri, ci, xIcon) {
    const { data } = this;
    const xIcons = this.getIcon(ri, ci);
    if (xIcons) {
      xIcons.push(xIcon);
    } else {
      const offset = this.getOffset(ri, ci);
      data[offset] = [xIcon];
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
