import { XTableDataItem } from './XTableDataItem';
import { Snapshot } from './snapshot/Snapshot';

class XTableDataItems {

  constructor({
    snapshot = new Snapshot(),
    items = [],
  } = {}) {
    this.items = items;
    this.snapshot = snapshot;
  }

  slice(sri, sci, eri, eci) {
    const rows = this.items.slice(sri, eri + 1);
    return rows.map((row) => {
      if (row) {
        return row.slice(sci, eci + 1);
      }
      return row;
    });
  }

  get(ri, ci) {
    const line = this.items[ri];
    return line && line[ci]
      ? this.wrap(line, ci)
      : undefined;
  }

  set(ri, ci, item) {
    const line = this.items[ri] || [];
    line[ci] = item;
    this.items[ri] = line;
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

  each(callback) {
    const { items } = this;
    const { length } = items;
    for (let i = 0; i < length; i++) {
      let item = items[i];
      if (item) {
        const { length } = item;
        for (let j = 0; j < length; j++) {
          let cell = this.get(i, j);
          callback(cell);
        }
      }
    }
  }

  clear(rectRange) {
    let { sri, eri } = rectRange;
    let { sci, eci } = rectRange;
    let { snapshot, items } = this;
    let { length } = items;
    let ri = sri;
    let ci = sci;
    let action = {
      undo: () => {},
      redo: () => {},
    };
    snapshot.addAction(action);
    action.redo();
  }

  setOrNew(ri, ci, item) {
    const line = this.items[ri];
    if (line) {
      line[ci] = item;
    }
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

  getItems() {
    return this.items;
  }

  removeRow(ri) {
    let { snapshot } = this;
    let orderValue;
    let action = {
      undo: () => {
        if (orderValue) {
          this.items.splice(ri, 0, orderValue);
        }
      },
      redo: () => {
        orderValue = this.items.splice(ri, 1)[0];
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  removeCol(ci) {
    let { snapshot } = this;
    let orderValue = [];
    let action = {
      undo: () => {
        let { length } = orderValue;
        for (let i = 0; i < length; i++) {
          const value = orderValue[i];
          const { ri, item } = value;
          const subItems = this.items[ri];
          subItems.splice(ci, 0, item);
        }
      },
      redo: () => {
        let { length } = this.items;
        orderValue = [];
        for (let ri = 0; ri < length; ri++) {
          const subItems = this.items[ri];
          if (subItems) {
            const item = subItems.splice(ci, 1)[0];
            orderValue.push({
              ri, item,
            });
          }
        }
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertRowAfter(ri) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        this.items.splice(ri + 1, 1);
      },
      redo: () => {
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
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColAfter(ci) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const subItems = this.items[i];
          if (subItems) {
            subItems.splice(ci + 1, 1);
          }
        }
      },
      redo: () => {
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
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertRowBefore(ri) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        this.items.splice(ri, 1);
      },
      redo: () => {
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
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  insertColBefore(ci) {
    let { snapshot } = this;
    let action = {
      undo: () => {
        for (let i = 0, len = this.items.length; i < len; i++) {
          const subItems = this.items[i];
          if (subItems) {
            subItems.splice(ci, 1);
          }
        }
      },
      redo: () => {
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
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

}

export {
  XTableDataItems,
};
