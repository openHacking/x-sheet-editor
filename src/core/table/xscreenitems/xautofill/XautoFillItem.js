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
import { XDraw } from '../../../../canvas/XDraw';

class XautoFillItem extends XScreenCssBorderItem {

  constructor(table, options = {}) {
    super({ table });
    this.options = Utils.mergeDeep({
      mergeForceSplit: false,
      onBeforeAutoFill: () => {},
      onAfterAutoFill: () => {},
    }, options);
    this.targetOffset = { top: 0, left: 0, width: 0, height: 0 };
    this.selectRange = RectRange.EMPTY;
    this.overGo = null;
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
    const xSelect = xScreen.findType(XSelectItem);
    EventBind.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      this.show();
      mousePointer.set('crosshair');
      EventBind.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.selectRangeHandle(x, y);
        this.selectOffsetHandle();
        this.selectBorderHandle();
      }, () => {
        this.autoFillTo();
        this.hide();
      });
      e.stopPropagation();
    });
    EventBind.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      mousePointer.set('crosshair');
      e.stopPropagation();
    });
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
          selectRange = new RectRange(ri, selectorSci, selectorSri - 1, selectorEci);
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
          selectRange = new RectRange(selectorEri + 1, selectorSci, ri, selectorEci);
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
            selectRange = new RectRange(selectorSri, minCi, selectorEri, selectorSci - 1);
          }
        } else {
          selectRange = new RectRange(selectorSri, ci, selectorEri, selectorSci - 1);
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
          selectRange = new RectRange(selectorSri, selectorEci + 1, selectorEri, ci);
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

  selectOffsetHandle() {
    const { selectRange } = this;
    if (selectRange.equals(RectRange.EMPTY)) {
      this.hide();
      return;
    }
    this.show();
    this.targetOffset.width = this.measureWidth(selectRange);
    this.targetOffset.height = this.measureHeight(selectRange);
    this.targetOffset.top = this.measureTop(selectRange);
    this.targetOffset.left = this.measureLeft(selectRange);
    this.setTop(this.targetOffset.top);
    this.setLeft(this.targetOffset.left);
    this.setHeight(XDraw.offsetToLineInside(this.targetOffset.height));
    this.setWidth(XDraw.offsetToLineInside(this.targetOffset.width));
  }

  selectBorderHandle() {
    const { selectRange } = this;
    if (selectRange.equals(RectRange.EMPTY)) {
      return;
    }
    const overGo = this.rangeOverGo(selectRange);
    const {
      top, bottom, left, right,
    } = this.borderDisplay(selectRange, overGo);
    this.hideAllBorder();
    this.overGo = overGo;
    if (top) {
      this.showTBorder(overGo);
    }
    if (bottom) {
      this.showBBorder(overGo);
    }
    if (left) {
      this.showLBorder(overGo);
    }
    if (right) {
      this.showRBorder(overGo);
    }
  }

  autoFillTo() {
    const { selectRange } = this;
    if (selectRange.equals(RectRange.EMPTY)) {
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
    const { selectRange: xSelectRange } = xSelect;
    const { selectRange } = this;
    let sIndexRi = xSelectRange.sri;
    let tIndexRi = selectRange.sri;
    while (tIndexRi <= selectRange.eri) {
      let sIndexCi = xSelectRange.sci;
      let tIndexCi = selectRange.sci;
      while (tIndexCi <= selectRange.eci) {
        const src = cells.getCell(sIndexRi, sIndexCi);
        if (src) {
          const target = src.clone();
          cellDataProxy.setCell(tIndexRi, tIndexCi, target);
        }
        sIndexCi += 1;
        tIndexCi += 1;
        if (sIndexCi > xSelectRange.eci) {
          sIndexCi = xSelectRange.sci;
        }
      }
      sIndexRi += 1;
      tIndexRi += 1;
      if (sIndexRi > xSelectRange.eri) {
        sIndexRi = xSelectRange.sri;
      }
    }
  }

  splitMerge() {
    const { table } = this;
    const merges = table.getTableMerges();
    const tableDataSnapshot = table.getTableDataSnapshot();
    const { mergeDataProxy } = tableDataSnapshot;
    const { selectRange } = this;
    selectRange.each((ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        mergeDataProxy.deleteMerge(merge);
      }
    });
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
      selectRange: xSelectRange, selectLocal,
    } = xSelect;
    const {
      selectRange, moveDir,
    } = this;
    let sIndexRi = xSelectRange.sri;
    let tIndexRi = selectRange.sri;
    if (selectLocal !== SELECT_LOCAL.BR
      && (moveDir === 'top' || moveDir === 'left')) {
      return;
    }
    while (tIndexRi <= selectRange.eri) {
      let sIndexCi = xSelectRange.sci;
      let tIndexCi = selectRange.sci;
      while (tIndexCi <= selectRange.eci) {
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
        if (sIndexCi > xSelectRange.eci) {
          sIndexCi = xSelectRange.sci;
        }
      }
      sIndexRi += 1;
      tIndexRi += 1;
      if (sIndexRi > xSelectRange.eri) {
        sIndexRi = xSelectRange.sri;
      }
    }
  }

}

export {
  XautoFillItem,
};
