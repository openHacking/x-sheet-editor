import { Cell } from './Cell';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XIteratorBuilder } from '../iterator/XIteratorBuilder';
import { XTableDataItems } from '../XTableDataItems';
import { Snapshot } from '../snapshot/Snapshot';
import { Listen } from '../../../lib/Listen';
import { Merges } from '../merges/Merges';

class Cells {

  constructor({
    xTableData = new XTableDataItems(),
    xIteratorBuilder = new XIteratorBuilder(),
    merges = new Merges(),
    snapshot = new Snapshot(),
  } = {}) {
    this.xTableData = xTableData;
    this.listen = new Listen();
    this.merges = merges;
    this.snapshot = snapshot;
    this.xIteratorBuilder = xIteratorBuilder;
  }

  getCellOrNew(ri, ci) {
    if (ri < 0) {
      throw new TypeError(`错误的行号${ri}`);
    }
    if (ci < 0) {
      throw new TypeError(`错误的列号${ci}`);
    }
    const item = this.xTableData.getOrNew(ri, ci);
    const find = item.getCell();
    if (find) {
      return find;
    }
    const cell = new Cell({ text: SheetUtils.EMPTY });
    item.setCell(cell);
    return cell;
  }

  getCellOrMergeCell(ri, ci) {
    const { merges } = this;
    const merge = merges.getFirstInclude(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
    }
    return this.getCell(ri, ci);
  }

  getCell(ri, ci) {
    const item = this.xTableData.get(ri, ci);
    if (item) {
      return item.getCell();
    }
    return null;
  }

  setCell(ri, ci, cell) {
    if (ri < 0) {
      throw new TypeError(`错误的行号${ri}`);
    }
    if (ci < 0) {
      throw new TypeError(`错误的列号${ci}`);
    }
    let { listen, snapshot, xTableData } = this;
    let item = xTableData.get(ri, ci);
    if (item) {
      let oldValue = item.getCell();
      let action = {
        undo: () => {
          item.setCell(oldValue);
          listen.execute('change', {
            ri, ci, oldValue,
          });
        },
        redo: () => {
          item.setCell(cell);
          listen.execute('change', {
            ri, ci, oldValue,
          });
        },
      };
      snapshot.addAction(action);
      action.redo();
    }
  }

  setCellOrNew(ri, ci, cell) {
    if (ri < 0) {
      throw new TypeError(`错误的行号${ri}`);
    }
    if (ci < 0) {
      throw new TypeError(`错误的列号${ci}`);
    }
    let { listen, snapshot, xTableData } = this;
    const item = xTableData.getOrNew(ri, ci);
    let oldValue = item.getCell();
    let action = {
      undo: () => {
        item.setCell(oldValue);
        listen.execute('change', {
          ri, ci, oldValue,
        });
      },
      redo: () => {
        item.setCell(cell);
        listen.execute('change', {
          ri, ci, oldValue,
        });
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  getData() {
    return this.xTableData.getItems();
  }

}

export {
  Cells,
};
