import { RowsIterator } from '../iterator/RowsIterator';
import { ColsIterator } from '../iterator/ColsIterator';
import { XLineIteratorFilter } from './XLineIteratorFilter';
import { XLineIteratorItem } from './XLineIteratorItem';
import { RectRange } from '../tablebase/RectRange';
import { PlainUtils } from '../../../utils/PlainUtils';

class XLineIteratorLoop {

  constructor({
    view = RectRange.EMPTY,
    bx = 0,
    by = 0,
    rows,
    cols,
    callback = PlainUtils.noop,
    foldOnOff = true,
    filter = XLineIteratorFilter.EMPTY,
    l = XLineIteratorItem.EMPTY,
    t = XLineIteratorItem.EMPTY,
    r = XLineIteratorItem.EMPTY,
    b = XLineIteratorItem.EMPTY,
  }) {
    this.view = view;
    this.rows = rows;
    this.cols = cols;
    this.callback = callback;
    this.foldOnOff = foldOnOff;
    this.bx = bx;
    this.by = by;
    this.filter = filter;
    this.l = l;
    this.t = t;
    this.r = r;
    this.b = b;
  }

  run() {
    const { view, rows, cols, filter, foldOnOff, callback } = this;
    const { l, t, r, b } = this;
    const { bx, by } = this;
    const { sri, eri, sci, eci } = view;
    let y = by;
    let firstRow = true;
    let lastRow = false;
    RowsIterator.getInstance()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((row) => {
        const height = rows.getHeight(row);
        const result = filter.run({ row });
        switch (result) {
          case XLineIteratorFilter.RETURN_TYPE.EXEC: {
            let x = bx;
            l.newRow({ row, y });
            t.newRow({ row, y });
            r.newRow({ row, y });
            b.newRow({ row, y });
            lastRow = row === eri;
            ColsIterator.getInstance()
              .setBegin(sci)
              .setEnd(eci)
              .setLoop((col) => {
                callback(row, col, x, y);
                if (firstRow) {
                  l.newCol({ col, x });
                  t.newCol({ col, x });
                  r.newCol({ col, x });
                  b.newCol({ col, x });
                }
                const width = cols.getWidth(col);
                const lFilter = l.filter.run({ row, col });
                const tFilter = t.filter.run({ row, col });
                const rFilter = r.filter.run({ row, col });
                const bFilter = b.filter.run({ row, col });
                switch (lFilter) {
                  case XLineIteratorFilter.RETURN_TYPE.EXEC:
                    l.exec({ row, col, x, y });
                    break;
                  case XLineIteratorFilter.RETURN_TYPE.JUMP:
                    l.jump({ row, col, x, y });
                    break;
                }
                switch (tFilter) {
                  case XLineIteratorFilter.RETURN_TYPE.EXEC:
                    t.exec({ row, col, x, y });
                    break;
                  case XLineIteratorFilter.RETURN_TYPE.JUMP:
                    t.jump({ row, col, x, y });
                    break;
                }
                switch (rFilter) {
                  case XLineIteratorFilter.RETURN_TYPE.EXEC:
                    r.exec({ row, col, x, y });
                    break;
                  case XLineIteratorFilter.RETURN_TYPE.JUMP:
                    r.jump({ row, col, x, y });
                    break;
                }
                switch (bFilter) {
                  case XLineIteratorFilter.RETURN_TYPE.EXEC:
                    b.exec({ row, col, x, y });
                    break;
                  case XLineIteratorFilter.RETURN_TYPE.JUMP:
                    b.jump({ row, col, x, y });
                    break;
                }
                if (lastRow) {
                  l.endCol({ col });
                  t.endCol({ col });
                  r.endCol({ col });
                  b.endCol({ col });
                }
                x += width;
              })
              .execute();
            firstRow = false;
            l.endRow({ row });
            t.endRow({ row });
            r.endRow({ row });
            b.endRow({ row });
            break;
          }
          case XLineIteratorFilter.RETURN_TYPE.JUMP: {
            break;
          }
        }
        y += height;
      })
      .foldOnOff(foldOnOff)
      .execute();
  }

}

export {
  XLineIteratorLoop,
};
