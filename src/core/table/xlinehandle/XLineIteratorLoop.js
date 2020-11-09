import { RowsIterator } from '../iterator/RowsIterator';
import { ColsIterator } from '../iterator/ColsIterator';
import { XLineIteratorFilter } from './XLineIteratorFilter';
import { XLineIteratorItem } from './XLineIteratorItem';
import { RectRange } from '../tablebase/RectRange';

class XLineIteratorLoop {

  constructor({
    l = XLineIteratorItem.EMPTY,
    t = XLineIteratorItem.EMPTY,
    r = XLineIteratorItem.EMPTY,
    b = XLineIteratorItem.EMPTY,
    view = RectRange.EMPTY,
    bx = 0,
    by = 0,
  }) {
    this.view = view;
    this.bx = bx;
    this.by = by;
    this.l = l;
    this.t = t;
    this.r = r;
    this.b = b;
  }

  run() {
    const { view, rows, cols } = this;
    const { l, t, r, b } = this;
    const { bx, by } = this;
    const { sri, eri, sci, eci } = view;
    let y = by;
    RowsIterator.getInstance()
      .setBegin(sri)
      .setEnd(eri)
      .setLoop((row) => {
        const height = rows.getHeight(row);
        let x = bx;
        l.newRow(row, y);
        t.newRow(row, y);
        r.newRow(row, y);
        b.newRow(row, y);
        ColsIterator.getInstance()
          .setBegin(sci)
          .setEnd(eci)
          .setLoop((col) => {
            if (row === sri) {
              l.newCol(col, x);
              t.newCol(col, x);
              r.newCol(col, x);
              b.newCol(col, x);
            }
            const width = cols.getWidth(col);
            const lFilter = l.filter.run({ row, col });
            const tFilter = t.filter.run({ row, col });
            const rFilter = r.filter.run({ row, col });
            const bFilter = b.filter.run({ row, col });
            switch (lFilter) {
              case XLineIteratorFilter.RETURN_TYPE.HANDLE:
                l.handle(row, col, x, y);
                break;
              case XLineIteratorFilter.RETURN_TYPE.JUMP:
                l.jump(row, col, x, y);
                break;
            }
            switch (tFilter) {
              case XLineIteratorFilter.RETURN_TYPE.HANDLE:
                t.handle(row, col, x, y);
                break;
              case XLineIteratorFilter.RETURN_TYPE.JUMP:
                t.jump(row, col, x, y);
                break;
            }
            switch (rFilter) {
              case XLineIteratorFilter.RETURN_TYPE.HANDLE:
                r.handle(row, col, x, y);
                break;
              case XLineIteratorFilter.RETURN_TYPE.JUMP:
                r.jump(row, col, x, y);
                break;
            }
            switch (bFilter) {
              case XLineIteratorFilter.RETURN_TYPE.HANDLE:
                b.handle(row, col, x, y);
                break;
              case XLineIteratorFilter.RETURN_TYPE.JUMP:
                b.jump(row, col, x, y);
                break;
            }
            if (row === eri) {
              l.endCol(col);
              t.endCol(col);
              r.endCol(col);
              b.endCol(col);
            }
            x += width;
          })
          .execute();
        l.endRow(row);
        t.endRow(row);
        r.endRow(row);
        b.endRow(row);
        y += height;
      })
      .execute();
  }

}

export {
  XLineIteratorLoop,
};
