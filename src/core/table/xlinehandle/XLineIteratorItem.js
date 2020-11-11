import { PlainUtils } from '../../../utils/PlainUtils';
import { XLineIteratorFilter } from './XLineIteratorFilter';
import { RowsIterator } from '../iterator/RowsIterator';

class XLineIteratorItem {

  static htJoin(line) {
    for (let i = 1; i < line.length;) {
      const item = line[i];
      const last = line[i - 1];
      const ck1 = item.borderAttr.top.equal(last.borderAttr.top);
      const ck2 = item.col - last.col === 1;
      const ck3 = item.row === last.row;
      if (ck1 && ck2 && ck3) {
        last.ex = item.ex;
        last.col = item.col;
        line.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return line;
  }

  static hbJoin(line) {
    for (let i = 1; i < line.length;) {
      const item = line[i];
      const last = line[i - 1];
      const ck1 = item.borderAttr.bottom.equal(last.borderAttr.bottom);
      const ck2 = item.col - last.col === 1;
      const ck3 = item.row === last.row;
      if (ck1 && ck2 && ck3) {
        last.ex = item.ex;
        last.col = item.col;
        line.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return line;
  }

  static vlJoin(line) {
    for (let i = 1; i < line.length;) {
      const item = line[i];
      const last = line[i - 1];
      const nextRow = RowsIterator.getInstance()
        .setBegin(last.row)
        .setEnd(item.row)
        .nextRow();
      const ck1 = item.borderAttr.left.equal(last.borderAttr.left);
      const ck2 = item.row === nextRow;
      const ck3 = item.col === last.col;
      if (ck1 && ck2 && ck3) {
        last.ey = item.ey;
        last.row = item.row;
        line.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return line;
  }

  static vrJoin(line) {
    for (let i = 1; i < line.length;) {
      const item = line[i];
      const last = line[i - 1];
      const nextRow = RowsIterator.getInstance()
        .setBegin(last.row)
        .setEnd(item.row)
        .nextRow();
      const ck1 = item.borderAttr.right.equal(last.borderAttr.right);
      const ck2 = item.row === nextRow;
      const ck3 = item.col === last.col;
      if (ck1 && ck2 && ck3) {
        last.ey = item.ey;
        last.row = item.row;
        line.splice(i, 1);
      } else {
        i += 1;
      }
    }
    return line;
  }

  constructor({
    newRow = PlainUtils.noop,
    endRow = PlainUtils.noop,
    filter = XLineIteratorFilter.EMPTY,
    newCol = PlainUtils.noop,
    endCol = PlainUtils.noop,
    jump = PlainUtils.noop,
    exec = PlainUtils.noop,
    complete = PlainUtils.noop,
  } = {}) {
    this.newRow = newRow;
    this.endRow = endRow;
    this.filter = filter;
    this.newCol = newCol;
    this.endCol = endCol;
    this.jump = jump;
    this.exec = exec;
    this.complete = complete;
  }

  getFilter() {
    return this.filter;
  }

}

XLineIteratorItem.EMPTY = new XLineIteratorItem();

export {
  XLineIteratorItem,
};
