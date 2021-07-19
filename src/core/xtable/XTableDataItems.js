import { XTableDataItem } from './XTableDataItem';

class XTableDataItems {

  constructor(items = []) {
    this.items = items;
  }

  getItems() {
    return this.items;
  }

  get(ri, ci) {
    const line = this.items[ri];
    return line && line[ci]
      ? this.wrap(line, ci)
      : undefined;
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

  removeRow(ri) {
    this.items.splice(ri, 1);
  }

  removeCol(ci) {
    for (let i = 0, len = this.items.length; i < len; i++) {
      const subItems = this.items[i];
      if (subItems) {
        subItems.splice(ci, 1);
      }
    }
  }

  insertRowAfter(ri) {
    const subItems = this.items[ri];
    if (subItems) {
      const newSubItems = [];
      for (let i = 0, len = subItems.length; i < len; i++) {
        const item = subItems[i];
        if (item) {
          const { mergeId } = item;
          newSubItems[i] = { mergeId };
        }
      }
      this.items.splice(ri + 1, 0, newSubItems);
    } else {
      this.items.splice(ri + 1, 0, []);
    }
  }

  insertColAfter(ci) {
    for (let i = 0, len = this.items.length; i < len; i++) {
      const subItems = this.items[i];
      if (subItems) {
        const item = subItems[ci];
        if (item) {
          const { mergeId } = item;
          subItems.splice(ci + 1, 0, { mergeId });
        } else {
          subItems.splice(ci + 1, 0, {});
        }
      }
    }
  }

  insertRowBefore(ri) {
    const subItems = this.items[ri];
    if (subItems) {
      const newSubItems = [];
      for (let i = 0, len = subItems.length; i < len; i++) {
        const item = subItems[i];
        if (item) {
          const { mergeId } = item;
          newSubItems[i] = { mergeId };
        }
      }
      this.items.splice(ri, 0, newSubItems);
    } else {
      this.items.splice(ri, 0, []);
    }
  }

  insertColBefore(ci) {
    for (let i = 0, len = this.items.length; i < len; i++) {
      const subItems = this.items[i];
      if (subItems) {
        const item = subItems[ci];
        if (item) {
          const { mergeId } = item;
          subItems.splice(ci, 0, { mergeId });
        } else {
          subItems.splice(ci, 0, {});
        }
      }
    }
  }

}

export {
  XTableDataItems,
};
