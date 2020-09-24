import { XScreenViewSizer } from '../../xscreen/item/viewdisplay/XScreenViewSizer';
import { XSelectItem } from '../xselect/XSelectItem';

class XFilter extends XScreenViewSizer {

  constructor({
    table,
  }) {
    super({ table });
  }

  getFilterView() {
    const { table } = this;
    const {
      xScreen, cols,
    } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    const { sri, sci } = selectRange;
    const colLen = cols.len - 1;
    // 向上搜索非空行
    for (let i = sri; i >= 0; i -= 1) {
      // TODO ....
    }
    // 向左搜索非空列
    for (let i = sci; i >= 0; i -= 1) {
      // TODO ....
    }
    // 向右搜索非空列
    for (let i = sci; i <= colLen; i += 1) {
      // TODO ....
    }
  }

}

export {
  XFilter,
};
