import { XTableDataItem } from './XTableDataItem';
import { Cell } from './tablecell/Cell';
import { PlainUtils } from '../../utils/PlainUtils';

class XTableDataItems {

  constructor(items = []) {
    this.items = items;
    this.canWrapAll = true;
  }

  wrap(line, ci) {
    const ele = line[ci];
    if (ele instanceof XTableDataItem) {
      return ele;
    }
    const item = new XTableDataItem();
    if (PlainUtils.isString(ele)) {
      item.setCell(new Cell({ text: ele }));
    } else {
      item.setCell(new Cell(ele));
    }
    line[ci] = item;
    return item;
  }

  split(sri, eri, sci, eci) {
    const rows = this.items.slice(sri, eri + 1);
    return rows.map((row) => {
      if (row) {
        return row.slice(sci, eci + 1);
      }
      return row;
    });
  }

  set(ri, ci, item) {
    const line = this.items[ri] || [];
    line[ci] = item;
    this.items[ri] = line;
  }

  setOrNew(ri, ci, item) {
    const line = this.items[ri];
    if (line) {
      line[ci] = item;
    }
  }

  wrapAll() {
    const { canWrapAll } = this;
    if (canWrapAll) {
      const { items } = this;
      this.canWrapAll = false;
      for (let ri = 0, riLen = items.length; ri < riLen; ri++) {
        const line = items[ri];
        if (line) {
          for (let ci = 0, ciLen = line.length; ci < ciLen; ci++) {
            const item = line[ci];
            if (item) {
              this.wrap(line, ci);
            }
          }
        }
      }
    }
  }

  get(ri, ci) {
    const line = this.items[ri];
    return line && line[ci]
      ? this.wrap(line, ci)
      : undefined;
  }

  getItems() {
    return this.items;
  }

  getOrNew(ri, ci) {
    const find = this.get(ri, ci);
    if (find) {
      return find;
    }
    const item = new XTableDataItem();
    this.set(ri, ci, item);
    return item;
  }

}

export {
  XTableDataItems,
};
