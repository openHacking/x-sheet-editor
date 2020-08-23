/* global document */
import { XScreenCssBorderItem } from '../../xscreen/item/border/XScreenCssBorderItem';
import {
  SELECT_LOCAL,
  XSelectItem,
} from '../xselect/XSelectItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { Utils } from '../../../../utils/Utils';
import { EventBind } from '../../../../utils/EventBind';

class XautoFillItem extends XScreenCssBorderItem {

  constructor(table, options = {}) {
    super({ table });
    this.options = Utils.mergeDeep({
      mergeForceSplit: false,
      onBeforeAutoFill: () => {},
      onAfterAutoFill: () => {},
    }, options);
    this.targetOffset = { top: 0, left: 0, width: 0, height: 0 };
    this.moveRange = null;
    this.targetRange = null;
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

  onAdd() {
    this.bind();
    this.hide();
  }

  bind() {
    const { table, xScreen } = this;
    const { mousePointer } = table;
    const { key, type } = Constant.MOUSE_POINTER_TYPE.AUTO_FILL;
    const xSelect = xScreen.findType(XSelectItem);
    EventBind.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      mousePointer.on(key);
      mousePointer.set(type, key);
      EventBind.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.moveRangeHandle(x, y);
        this.targetRangeHandle();
        this.targetOffsetHandle();
        this.targetBorderHandle();
      }, () => {
        mousePointer.off(key);
        this.hide();
        this.autoFillTo();
      });
      e.stopPropagation();
    });
    EventBind.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.on(key);
      mousePointer.set(type, key);
    });
    EventBind.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.off(key);
    });
  }

  moveRangeHandle(x, y) {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange, selectLocal,
    } = xSelect;
    const {
      cols, rows,
    } = table;
    const merges = table.getTableMerges();
    const hasEdgeCheck = SELECT_LOCAL.BR !== selectLocal
      || merges.getFirstIncludes(selectRange.sri, selectRange.sci) != null;
    const [rSize, cSize] = selectRange.size();
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
    } = selectRange;
    let {
      eri: selectorEri, eci: selectorEci,
    } = selectRange;
    if (selectLocal === SELECT_LOCAL.L) {
      selectorEci = cols.len - 1;
    }
    if (selectLocal === SELECT_LOCAL.T) {
      selectorEri = rows.len - 1;
    }
    let moveRange = null;
    let moveDir = null;
    if (ri < selectorSri || ri > selectorEri) {
      if (ri < selectorSri) {
        moveDir = 'top';
        if (hasEdgeCheck) {
          let minRi = selectorSri - rSize;
          if (minRi >= 0) {
            const diff = (selectorSri - 1) - ri;
            for (let i = 1; i <= diff; i += 1) {
              if (i % rSize === 0 && minRi - rSize >= 0) minRi -= rSize;
            }
            moveRange = new RectRange(minRi, selectorSci, selectorSri - 1, selectorEci);
          }
        } else {
          moveRange = new RectRange(ri, selectorSci, selectorSri - 1, selectorEci);
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
            moveRange = new RectRange(selectorEri + 1, selectorSci, maxRi, selectorEci);
          }
        } else {
          moveRange = new RectRange(selectorEri + 1, selectorSci, ri, selectorEci);
        }
      }
    } else if (ci < selectorSci || ci > selectorEci) {
      if (ci < selectorSci) {
        moveDir = 'left';
        if (hasEdgeCheck) {
          let minCi = selectorSci - cSize;
          if (minCi >= 0) {
            const diff = (selectorSci - 1) - ci;
            for (let i = 1; i <= diff; i += 1) {
              if (i % cSize === 0 && minCi - cSize >= 0) minCi -= cSize;
            }
            moveRange = new RectRange(selectorSri, minCi, selectorEri, selectorSci - 1);
          }
        } else {
          moveRange = new RectRange(selectorSri, ci, selectorEri, selectorSci - 1);
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
            moveRange = new RectRange(selectorSri, selectorEci + 1, selectorEri, maxCi);
          }
        } else {
          moveRange = new RectRange(selectorSri, selectorEci + 1, selectorEri, ci);
        }
      }
    }
    if (moveRange) {
      const width = cols.sectionSumWidth(moveRange.sci, moveRange.eci);
      const height = rows.sectionSumHeight(moveRange.sri, moveRange.eri);
      moveRange.w = width;
      moveRange.h = height;
    }
    this.moveRange = moveRange;
    this.moveDir = moveDir;
  }

  targetRangeHandle() {
    const { moveRange } = this;
    if (Utils.isUnDef(moveRange)) {
      this.hide();
      this.targetRange = RectRange.EMPTY;
      return;
    }
    const { table } = this;
    const { cols, rows } = table;
    const scrollView = table.getScrollView();
    const targetRange = scrollView.coincide(moveRange);
    targetRange.w = cols.rectRangeSumWidth(targetRange);
    targetRange.h = rows.rectRangeSumHeight(targetRange);
    this.targetRange = targetRange;
    if (targetRange.equals(RectRange.EMPTY)) {
      this.hide();
    } else {
      this.show();
    }
  }

  targetOffsetHandle() {
    const { targetRange } = this;
    if (targetRange.equals(RectRange.EMPTY)) {
      return;
    }
    const { table } = this;
    const { cols, rows } = table;
    const scrollView = table.getScrollView();
    this.targetOffset.left = cols.sectionSumWidth(scrollView.sci, this.targetRange.sci - 1);
    this.targetOffset.top = rows.sectionSumHeight(scrollView.sri, this.targetRange.sri - 1);
    this.targetOffset.width = targetRange.w;
    this.targetOffset.height = targetRange.h;
    this.setWidth(this.targetOffset.width);
    this.setHeight(this.targetOffset.height);
    this.setTop(this.targetOffset.top);
    this.setLeft(this.targetOffset.left);
  }

  targetBorderHandle() {
    const { targetRange } = this;
    if (targetRange.equals(RectRange.EMPTY)) {
      return;
    }
    const { moveRange } = this;
    const {
      top, bottom, left, right,
    } = this.rectRangeBoundOut(moveRange);
    this.hideAllBorder();
    const overGo = this.rectRangeOverGo(moveRange);
    if (!top) {
      this.showTBorder(overGo);
    }
    if (!bottom) {
      this.showBBorder(overGo);
    }
    if (!left) {
      this.showLBorder(overGo);
    }
    if (!right) {
      this.showRBorder(overGo);
    }
  }

  autoFillTo() {
    const { targetRange } = this;
    if (targetRange.equals(RectRange.EMPTY)) {
      return;
    }
    const { table, options } = this;
    options.onBeforeAutoFill();
    this.splitMerge();
    this.copyContent();
    this.copyMerge();
    options.onAfterAutoFill();
    table.render();
  }

  copyContent() {
    const {
      table, xScreen,
    } = this;
    const cells = table.getTableCells();
    const tableDataSnapshot = table.getTableDataSnapshot();
    const { cellDataProxy } = tableDataSnapshot;
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    const { moveRange } = this;
    let sIndexRi = selectRange.sri;
    let tIndexRi = moveRange.sri;
    while (tIndexRi <= moveRange.eri) {
      let sIndexCi = selectRange.sci;
      let tIndexCi = moveRange.sci;
      while (tIndexCi <= moveRange.eci) {
        const src = cells.getCell(sIndexRi, sIndexCi);
        if (src) {
          const target = src.clone();
          cellDataProxy.setCell(tIndexRi, tIndexCi, target);
        }
        sIndexCi += 1;
        tIndexCi += 1;
        if (sIndexCi > selectRange.eci) {
          sIndexCi = selectRange.sci;
        }
      }
      sIndexRi += 1;
      tIndexRi += 1;
      if (sIndexRi > selectRange.eri) {
        sIndexRi = selectRange.sri;
      }
    }
  }

  copyMerge() {
    const {
      table, xScreen,
    } = this;
    const merges = table.getTableMerges();
    const tableDataSnapshot = table.getTableDataSnapshot();
    const { mergeDataProxy } = tableDataSnapshot;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange, selectLocal,
    } = xSelect;
    const {
      moveRange, moveDir,
    } = this;
    let sIndexRi = selectRange.sri;
    let tIndexRi = moveRange.sri;
    if (selectLocal !== SELECT_LOCAL.BR
      && (moveDir === 'top' || moveDir === 'left')) {
      return;
    }
    while (tIndexRi <= moveRange.eri) {
      let sIndexCi = selectRange.sci;
      let tIndexCi = moveRange.sci;
      while (tIndexCi <= moveRange.eci) {
        const mergeRect = merges.getFirstIncludes(sIndexRi, sIndexCi);
        if (mergeRect) {
          const isOrigin = mergeRect.sri === sIndexRi && mergeRect.sci === sIndexCi;
          if (isOrigin) {
            let [rSize, cSize] = mergeRect.size();
            rSize -= 1;
            cSize -= 1;
            const newMerge = new RectRange(tIndexRi, tIndexCi, tIndexRi + rSize, tIndexCi + cSize);
            mergeDataProxy.addMerge(newMerge);
          }
        }
        sIndexCi += 1;
        tIndexCi += 1;
        if (sIndexCi > selectRange.eci) {
          sIndexCi = selectRange.sci;
        }
      }
      sIndexRi += 1;
      tIndexRi += 1;
      if (sIndexRi > selectRange.eri) {
        sIndexRi = selectRange.sri;
      }
    }
  }

  splitMerge() {
    const { table } = this;
    const merges = table.getTableMerges();
    const tableDataSnapshot = table.getTableDataSnapshot();
    const { mergeDataProxy } = tableDataSnapshot;
    const { moveRange } = this;
    moveRange.each((ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        mergeDataProxy.deleteMerge(merge);
      }
    });
  }

}

export {
  XautoFillItem,
};
