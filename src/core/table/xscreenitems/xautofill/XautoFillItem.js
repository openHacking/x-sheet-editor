/* global document */
import { SELECT_LOCAL, XSelectItem } from '../xselect/XSelectItem';
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { PlainUtils as Utils, PlainUtils } from '../../../../utils/PlainUtils';
import { Event } from '../../../../lib/Event';
import { XTableMousePointer } from '../../XTableMousePointer';
import { RowsIterator } from '../../iterator/RowsIterator';
import { ColsIterator } from '../../iterator/ColsIterator';

class CopyMerge {

  constructor({
    targetViewRange,
    originViewRange,
    merge = () => {},
    master = () => {},
    onCopy = () => {},
  }) {
    this.targetViewRange = targetViewRange;
    this.originViewRange = originViewRange;
    this.master = master;
    this.merge = merge;
    this.onCopy = onCopy;
  }

  copyStartRow() {
    const { originViewRange } = this;
    return originViewRange.sri;
  }

  copyEndRow() {
    const { originViewRange } = this;
    return originViewRange.eri;
  }

  nextCopyRow(row) {
    const endRow = this.copyEndRow();
    if (row >= endRow) {
      return this.copyStartRow();
    }
    return row + 1;
  }

  copyStartCol() {
    const { originViewRange } = this;
    return originViewRange.sci;
  }

  copyEndCol() {
    const { originViewRange } = this;
    return originViewRange.eci;
  }

  nextCopyCol(col) {
    const endCol = this.copyEndCol();
    if (col >= endCol) {
      return this.copyStartCol();
    }
    return col + 1;
  }

  pasteStartRow() {
    const { targetViewRange } = this;
    return targetViewRange.sri;
  }

  pasteEndRow() {
    const { targetViewRange } = this;
    return targetViewRange.eri;
  }

  pasteStartCol() {
    const { targetViewRange } = this;
    return targetViewRange.sci;
  }

  pasteEndCol() {
    const { targetViewRange } = this;
    return targetViewRange.eci;
  }

  executeCopy() {
    let ori = this.copyStartRow();
    RowsIterator.getInstance()
      .setBegin(this.pasteStartRow())
      .setEnd(this.pasteEndRow())
      .setLoop((tri) => {
        let oci = this.copyStartCol();
        ColsIterator.getInstance()
          .setBegin(this.pasteStartCol())
          .setEnd(this.pasteEndCol())
          .setLoop((tci) => {
            const merge = this.merge(ori, oci);
            if (merge && this.master(ori, oci, merge)) {
              this.onCopy(tri, tci, merge);
            }
          })
          .setNext(() => {
            oci = this.nextCopyCol(oci);
          })
          .execute();
      })
      .setNext(() => {
        ori = this.nextCopyRow(ori);
      })
      .foldOnOff(false)
      .execute();
  }

}

class CopyCellIN {

  constructor({
    targetViewRange,
    originViewRange,
    onCopy = () => {},
  }) {
    this.targetViewRange = targetViewRange;
    this.originViewRange = originViewRange;
    this.onCopy = onCopy;
  }

  copyStartRow() {
    const { originViewRange } = this;
    const { sri, eri } = originViewRange;
    return RowsIterator.getInstance()
      .setBegin(sri - 1)
      .setEnd(eri)
      .nextRow();
  }

  copyEndRow() {
    const { originViewRange } = this;
    const { sri, eri } = originViewRange;
    return RowsIterator.getInstance()
      .setBegin(eri + 1)
      .setEnd(sri)
      .nextRow();
  }

  nextCopyRow(row) {
    const endRow = this.copyEndRow();
    if (row >= endRow) {
      return this.copyStartRow();
    }
    return RowsIterator.getInstance()
      .setBegin(row)
      .setEnd(endRow)
      .nextRow();
  }

  copyStartCol() {
    const { originViewRange } = this;
    return originViewRange.sci;
  }

  copyEndCol() {
    const { originViewRange } = this;
    return originViewRange.eci;
  }

  nextCopyCol(col) {
    const endCol = this.copyEndCol();
    if (col >= endCol) {
      return this.copyStartCol();
    }
    return col + 1;
  }

  pasteStartRow() {
    const { targetViewRange } = this;
    return targetViewRange.sri;
  }

  pasteEndRow() {
    const { targetViewRange } = this;
    return targetViewRange.eri;
  }

  pasteStartCol() {
    const { targetViewRange } = this;
    return targetViewRange.sci;
  }

  pasteEndCol() {
    const { targetViewRange } = this;
    return targetViewRange.eci;
  }

  executeCopy() {
    let ori = this.copyStartRow();
    RowsIterator.getInstance()
      .setBegin(this.pasteStartRow())
      .setEnd(this.pasteEndRow())
      .setLoop((tri) => {
        let oci = this.copyStartCol();
        ColsIterator.getInstance()
          .setBegin(this.pasteStartCol())
          .setEnd(this.pasteEndCol())
          .setLoop((tci) => {
            this.onCopy(tri, tci, ori, oci);
          })
          .setNext(() => {
            oci = this.nextCopyCol(oci);
          })
          .execute();
      })
      .setNext(() => {
        ori = this.nextCopyRow(ori);
      })
      .execute();
  }

}

class XAutoFillItem extends XScreenCssBorderItem {

  constructor(table, options = {}) {
    super({ table });
    this.options = PlainUtils.mergeDeep({
      mergeForceSplit: false,
      onBeforeAutoFill: () => {},
      onAfterAutoFill: () => {},
    }, options);
    this.autoFillRange = RectRange.EMPTY;
    this.moveDirection = null;
    this.display = false;
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
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.free(XAutoFillItem);
    });
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.lock(XAutoFillItem);
      mousePointer.set(XTableMousePointer.KEYS.crosshair, XAutoFillItem);
    });
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.display = true;
      mousePointer.lock(XAutoFillItem);
      mousePointer.set(XTableMousePointer.KEYS.crosshair, XAutoFillItem);
      Event.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.rangeHandle(x, y);
        this.offsetHandle();
        this.borderHandle();
      }, () => {
        this.display = false;
        mousePointer.free(XAutoFillItem);
        this.autoFill();
        this.hide();
      });
    });
  }

  borderHandle() {
    const { autoFillRange, display } = this;
    if (display === false || autoFillRange.equals(RectRange.EMPTY)) {
      this.hideBorder();
    } else {
      this.showBorder(autoFillRange);
    }
  }

  offsetHandle() {
    const { autoFillRange, display } = this;
    if (display === false || autoFillRange.equals(RectRange.EMPTY)) {
      this.hide();
    } else {
      this.show();
      this.setDisplay(autoFillRange);
      this.setSizer(autoFillRange);
      this.setLocal(autoFillRange);
    }
  }

  rangeHandle(x, y) {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const merges = table.getTableMerges();
    const { selectRange, selectLocal } = xSelect;
    const { cols, rows } = table;
    const { sri, sci, eri, eci } = selectRange;
    const { ri, ci } = table.getRiCiByXy(x, y);

    const merge = merges.getFirstIncludes(sri, sci);
    const zone = SELECT_LOCAL.BR !== selectLocal;
    const hasFull = zone || Utils.isNotUnDef(merge);
    const [rSize, cSize] = selectRange.size();

    let originSRi = ri;
    let originSCi = ci;

    // 检测边界
    if (originSRi < 0) {
      originSRi = 0;
    } else if (originSRi > rows.len) {
      originSRi = rows.len - 1;
    }
    if (originSCi < 0) {
      originSCi = 0;
    } else if (originSCi > cols.len) {
      originSCi = cols.len - 1;
    }

    let autoFillRange = RectRange.EMPTY;
    let moveDirection = Utils.Undef;

    // 选择区域
    if (originSRi < sri || ri > eri) {
      // 上下
      if (originSRi < sri) {
        moveDirection = 'top';
        if (hasFull) {
          let minRi = ri;
          let number = 0;
          RowsIterator.getInstance()
            .setBegin(sri - 1)
            .setEnd(0)
            .setLoop((i) => {
              if (i < ri) {
                return false;
              }
              if (number % rSize === 0) {
                const value = minRi - rSize;
                if (value >= 0) {
                  minRi = value;
                }
              }
              number += 1;
              return true;
            })
            .foldOnOff(false)
            .execute();
          if (minRi !== sri) {
            autoFillRange = new RectRange(minRi, sci, sri - 1, eci);
          }
        } else {
          const nextRow = RowsIterator.getInstance()
            .setBegin(sri)
            .setEnd(0)
            .nextRow();
          autoFillRange = new RectRange(ri, sci, nextRow, eci);
        }
      }
      if (originSRi > eri) {
        moveDirection = 'bottom';
        if (hasFull) {
          let maxRi = eri;
          let number = 0;
          RowsIterator.getInstance()
            .setBegin(eri + 1)
            .setEnd(rows.len - 1)
            .setLoop((i) => {
              if (i > ri) {
                return false;
              }
              if (number % rSize === 0) {
                const value = maxRi + rSize;
                if (value >= 0) {
                  maxRi = value;
                }
              }
              number += 1;
              return true;
            })
            .foldOnOff(false)
            .execute();
          if (maxRi !== eri) {
            autoFillRange = new RectRange(eri + 1, sci, maxRi, eci);
          }
        } else {
          const nextRow = RowsIterator.getInstance()
            .setBegin(eri)
            .setEnd(rows.len - 1)
            .nextRow();
          autoFillRange = new RectRange(nextRow, sci, ri, eci);
        }
      }
    } else if (ci < sci || ci > eci) {
      // 左右
      if (ci < sci) {
        moveDirection = 'left';
        if (hasFull) {
          let minCi = sci;
          let number = 0;
          ColsIterator.getInstance()
            .setBegin(sci - 1)
            .setEnd(0)
            .setLoop((i) => {
              if (i < ci) {
                return false;
              }
              if (number % cSize === 0) {
                const value = minCi - cSize;
                if (value >= 0) {
                  minCi = value;
                }
              }
              number += 1;
              return true;
            })
            .execute();
          if (minCi !== sci) {
            autoFillRange = new RectRange(sri, minCi, eri, sci - 1);
          }
        } else {
          const nextCol = ColsIterator.getInstance()
            .setBegin(sci)
            .setEnd(0)
            .nextRow();
          autoFillRange = new RectRange(sri, ci, eri, nextCol);
        }
      }
      if (ci > eci) {
        moveDirection = 'right';
        if (hasFull) {
          let maxCi = eci;
          let number = 0;
          ColsIterator.getInstance()
            .setBegin(eci + 1)
            .setEnd(cols.len - 1)
            .setLoop((i) => {
              if (i > ci) {
                return false;
              }
              if (number % cSize === 0) {
                const value = maxCi + cSize;
                if (value >= 0) {
                  maxCi = value;
                }
              }
              number += 1;
              return true;
            })
            .execute();
          if (maxCi !== eci) {
            autoFillRange = new RectRange(sri, eci + 1, eri, maxCi);
          }
        } else {
          const nextCol = ColsIterator.getInstance()
            .setBegin(eci)
            .setEnd(cols.len - 1)
            .nextRow();
          autoFillRange = new RectRange(sri, nextCol, eri, ci);
        }
      }
    }

    if (autoFillRange) {
      const width = cols.sectionSumWidth(autoFillRange.sci, autoFillRange.eci);
      const height = rows.sectionSumHeight(autoFillRange.sri, autoFillRange.eri);
      autoFillRange.w = width;
      autoFillRange.h = height;
    }
    this.autoFillRange = autoFillRange;
    this.moveDirection = moveDirection;
  }

  autoFill() {
    const { autoFillRange } = this;
    if (autoFillRange.equals(RectRange.EMPTY)) {
      return;
    }
    const { table, options } = this;
    const tableDataSnapshot = table.getTableDataSnapshot();
    options.onBeforeAutoFill();
    tableDataSnapshot.begin();
    this.fillMerge();
    this.fillCellIN();
    tableDataSnapshot.end();
    options.onAfterAutoFill();
    table.render();
  }

  fillMerge() {
    const { table, xScreen } = this;
    const tableDataSnapshot = table.getTableDataSnapshot();
    const merges = table.getTableMerges();
    const { mergeDataProxy } = tableDataSnapshot;
    const xSelect = xScreen.findType(XSelectItem);
    const copy = new CopyMerge({
      originViewRange: xSelect.selectRange,
      targetViewRange: this.autoFillRange,
      merge: (ri, ci) => merges.getFirstIncludes(ri, ci),
      master: (ri, ci, m) => m.sri === ri && m.sci === ci,
      onCopy: (ri, ci, m) => {
        let [rSize, cSize] = m.size();
        cSize -= 1;
        rSize -= 1;
        const newMerge = new RectRange(ri, ci, ri + rSize, ci + cSize);
        const hasFold = RowsIterator.getInstance()
          .setBegin(newMerge.sri)
          .setEnd(newMerge.eri)
          .hasFold();
        if (hasFold) {
          return;
        }
        newMerge.each((ri, ci) => {
          const merge = merges.getFirstIncludes(ri, ci);
          if (merge) {
            mergeDataProxy.deleteMerge(merge);
          }
        });
        mergeDataProxy.addMerge(hasFold);
      },
    });
    copy.executeCopy();
  }

  fillCellIN() {
    const { table, xScreen } = this;
    const tableDataSnapshot = table.getTableDataSnapshot();
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { cellDataProxy } = tableDataSnapshot;
    const copy = new CopyCellIN({
      originViewRange: xSelect.selectRange,
      targetViewRange: this.autoFillRange,
      onCopy: (tri, tci, ori, oci) => {
        const src = cells.getCell(ori, oci);
        if (src) {
          const target = src.clone();
          cellDataProxy.setCell(tri, tci, target);
        }
      },
    });
    copy.executeCopy();
  }

}

export {
  XAutoFillItem,
};
