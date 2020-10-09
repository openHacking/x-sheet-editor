/* global document */
import { SELECT_LOCAL, XSelectItem } from '../xselect/XSelectItem';
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { PlainUtils } from '../../../../utils/PlainUtils';
import { Event } from '../../../../lib/Event';
import { XTableMousePointer } from '../../XTableMousePointer';
import { RowsIterator } from '../../iterator/RowsIterator';
import { ColsIterator } from '../../iterator/ColsIterator';

class XautoFillItem extends XScreenCssBorderItem {

  constructor(table, options = {}) {
    super({ table });
    this.options = PlainUtils.mergeDeep({
      mergeForceSplit: false,
      onBeforeAutoFill: () => {},
      onAfterAutoFill: () => {},
    }, options);
    this.selectRange = RectRange.EMPTY;
    this.status = false;
    this.moveDir = null;
    this.ltElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.brElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.lElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.tElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.blt.child(this.ltElem);
    this.bl.child(this.lElem);
    this.bt.child(this.tElem);
    this.bbr.child(this.brElem);
    this.setBorderType('dashed');
  }

  selectRangeHandle(x, y) {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange: xSelectRange, selectLocal,
    } = xSelect;
    const {
      cols, rows,
    } = table;
    const merges = table.getTableMerges();
    // 原始区域中是否包含合并单元格
    const hasEdgeCheck = SELECT_LOCAL.BR !== selectLocal
      || merges.getFirstIncludes(xSelectRange.sri, xSelectRange.sci) != null;
    const [rSize, cSize] = xSelectRange.size();
    let { ri, ci } = table.getRiCiByXy(x, y);
    if (ri < 0) {
      ri = 0;
    } else if (ri > rows.len) {
      ri = rows.len - 1;
    }
    if (ci < 0) {
      ci = 0;
    } else if (ci > cols.len) {
      ci = cols.len - 1;
    }
    const {
      sri: selectorSri, sci: selectorSci,
    } = xSelectRange;
    let {
      eri: selectorEri, eci: selectorEci,
    } = xSelectRange;
    if (selectLocal === SELECT_LOCAL.L) {
      selectorEci = cols.len - 1;
    }
    if (selectLocal === SELECT_LOCAL.T) {
      selectorEri = rows.len - 1;
    }
    let selectRange = RectRange.EMPTY;
    let moveDir = null;
    if (ri < selectorSri || ri > selectorEri) {
      // 上下
      if (ri < selectorSri) {
        moveDir = 'top';
        if (hasEdgeCheck) {
          let minRi = selectorSri - rSize;
          if (minRi >= 0) {
            const diff = (selectorSri - 1) - ri;
            for (let i = 1; i <= diff; i += 1) {
              if (i % rSize === 0 && minRi - rSize >= 0) minRi -= rSize;
            }
            selectRange = new RectRange(minRi, selectorSci, selectorSri - 1, selectorEci);
          }
        } else {
          const nextRow = RowsIterator.getInstance()
            .setBegin(selectorSri)
            .setEnd(0)
            .nextRow();
          selectRange = new RectRange(ri, selectorSci, nextRow, selectorEci);
        }
      }
      if (ri > selectorEri) {
        moveDir = 'bottom';
        if (hasEdgeCheck) {
          let maxRi = selectorEri + rSize;
          if (maxRi <= rows.len - 1) {
            const diff = ri - (selectorEri + 1);
            for (let i = 1; i <= diff; i += 1) {
              if (i % rSize === 0 && maxRi + rSize <= rows.len - 1) maxRi += rSize;
            }
            selectRange = new RectRange(selectorEri + 1, selectorSci, maxRi, selectorEci);
          }
        } else {
          const nextRow = RowsIterator.getInstance()
            .setBegin(selectorEri)
            .setEnd(rows.len - 1)
            .nextRow();
          selectRange = new RectRange(nextRow, selectorSci, ri, selectorEci);
        }
      }
    } else if (ci < selectorSci || ci > selectorEci) {
      // 左右
      if (ci < selectorSci) {
        moveDir = 'left';
        if (hasEdgeCheck) {
          let minCi = selectorSci - cSize;
          if (minCi >= 0) {
            const diff = (selectorSci - 1) - ci;
            for (let i = 1; i <= diff; i += 1) {
              if (i % cSize === 0 && minCi - cSize >= 0) minCi -= cSize;
            }
            selectRange = new RectRange(selectorSri, minCi, selectorEri, selectorSci - 1);
          }
        } else {
          const nextCol = ColsIterator.getInstance()
            .setBegin(selectorSci)
            .setEnd(0)
            .nextRow();
          selectRange = new RectRange(selectorSri, ci, selectorEri, nextCol);
        }
      }
      if (ci > selectorEci) {
        moveDir = 'right';
        if (hasEdgeCheck) {
          let maxCi = selectorEci + cSize;
          if (maxCi <= cols.len - 1) {
            const diff = ci - (selectorEci + 1);
            for (let i = 1; i <= diff; i += 1) {
              if (i % cSize === 0 && maxCi + cSize <= cols.len - 1) maxCi += cSize;
            }
            selectRange = new RectRange(selectorSri, selectorEci + 1, selectorEri, maxCi);
          }
        } else {
          const nextCol = ColsIterator.getInstance()
            .setBegin(selectorEci)
            .setEnd(cols.len - 1)
            .nextRow();
          selectRange = new RectRange(selectorSri, nextCol, selectorEri, ci);
        }
      }
    }
    if (selectRange) {
      const width = cols.sectionSumWidth(selectRange.sci, selectRange.eci);
      const height = rows.sectionSumHeight(selectRange.sri, selectRange.eri);
      selectRange.w = width;
      selectRange.h = height;
    }
    this.selectRange = selectRange;
    this.moveDir = moveDir;
  }

  selectOffsetHandle() {}

  selectBorderHandle() {}

  onAdd() {
    this.bind();
    this.hide();
  }

  bind() {
    const { table, xScreen } = this;
    const { mousePointer } = table;
    const xSelect = xScreen.findType(XSelectItem);
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.free(XautoFillItem);
    });
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.lock(XautoFillItem);
      mousePointer.set(XTableMousePointer.KEYS.crosshair, XautoFillItem);
    });
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.status = true;
      mousePointer.lock(XautoFillItem);
      mousePointer.set(XTableMousePointer.KEYS.crosshair, XautoFillItem);
      Event.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.selectRangeHandle(x, y);
        this.selectOffsetHandle();
        this.selectBorderHandle();
      }, () => {
        this.status = false;
        mousePointer.free(XautoFillItem);
        this.autoFillTo();
        this.hide();
      });
    });
  }

  copyContent() {}

  copyMerge() {}

  autoFillTo() {}

  splitMerge() {}

}

export {
  XautoFillItem,
};
