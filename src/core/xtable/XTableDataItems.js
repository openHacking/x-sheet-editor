import { XTableDataItem } from './XTableDataItem';

class XTableDataItems {

  constructor(items = []) {
    this.items = items;
  }

  wrap(line, ci) {
    let item = line[ci];
    if (item) {
      item = item instanceof XTableDataItem
        ? item : new XTableDataItem(item);
      line[ci] = item;
      return item;
    }
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
