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

class XAutoFillItem extends XScreenCssBorderItem {

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
    const merges = table.getTableMerges();
    const {
      selectRange: xSelectRange, selectLocal,
    } = xSelect;
    const {
      cols, rows,
    } = table;
    const {
      sri: selectorSri, sci: selectorSci,
    } = xSelectRange;
    // 原始区域中是否包含合并单元格
    const checkMerge = merges.getFirstIncludes(selectorSri, selectorSci) != null;
    const checkLoc = SELECT_LOCAL.BR !== selectLocal;
    const hasEdgeCheck = checkLoc || checkMerge;
    const [rSize, cSize] = xSelectRange.size();
    let {
      eri: selectorEri, eci: selectorEci,
    } = xSelectRange;
    // 检测边界
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
    if (selectLocal === SELECT_LOCAL.L) {
      selectorEci = cols.len - 1;
    }
    if (selectLocal === SELECT_LOCAL.T) {
      selectorEri = rows.len - 1;
    }
    // 选择区域
    let selectRange = RectRange.EMPTY;
    let moveDir = null;
    if (ri < selectorSri || ri > selectorEri) {
      // 上下
      if (ri < selectorSri) {
        moveDir = 'top';
        if (hasEdgeCheck) {
          let minRi = selectorSri;
          let number = 1;
          RowsIterator.getInstance()
            .setBegin(selectorSri - 1)
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
          if (minRi !== selectorSri) {
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
          let maxRi = selectorEri;
          let number = 1;
          RowsIterator.getInstance()
            .setBegin(selectorEri + 1)
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
          if (maxRi !== selectorEri) {
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
          let minCi = selectorSci;
          let number = 1;
          ColsIterator.getInstance()
            .setBegin(selectorSci - 1)
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
          if (minCi !== selectorSci) {
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
          let maxCi = selectorEci;
          let number = 1;
          ColsIterator.getInstance()
            .setBegin(selectorEci + 1)
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
          if (maxCi !== selectorEci) {
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

  selectRangeStartRow() {
    const { selectRange } = this;
    let originRi = selectRange.sri;
    let last = originRi;
    RowsIterator.getInstance()
      .setBegin(selectRange.sri)
      .setEnd(selectRange.eri)
      .setLoop((i) => {
        if (i - last > 1) {
          originRi = i;
        }
        last = i;
      })
      .execute();
    return originRi;
  }

  selectOffsetHandle() {
    const { selectRange, status } = this;
    if (status === false) {
      return;
    }
    if (selectRange.equals(RectRange.EMPTY)) {
      this.hide();
      return;
    }
    this.show();
    this.setDisplay(selectRange);
    this.setSizer(selectRange);
    this.setLocal(selectRange);
  }

  selectBorderHandle() {
    const { selectRange, status } = this;
    if (status === false) {
      return;
    }
    if (selectRange.equals(RectRange.EMPTY)) {
      return;
    }
    this.hideBorder();
    this.showBorder(selectRange);
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
      this.status = true;
      mousePointer.lock(XAutoFillItem);
      mousePointer.set(XTableMousePointer.KEYS.crosshair, XAutoFillItem);
      Event.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.selectRangeHandle(x, y);
        this.selectOffsetHandle();
        this.selectBorderHandle();
      }, () => {
        this.status = false;
        mousePointer.free(XAutoFillItem);
        this.autoFillTo();
        this.hide();
      });
    });
  }

  copyMerge() {
    const {
      table, xScreen,
    } = this;
    const tableDataSnapshot = table.getTableDataSnapshot();
    const merges = table.getTableMerges();
    const { mergeDataProxy } = tableDataSnapshot;
    const xSelect = xScreen.findType(XSelectItem);
    const { selectLocal } = xSelect;
    const {
      selectRange, moveDir,
    } = this;
    // 是否允许复制
    const checkLoc = selectLocal !== SELECT_LOCAL.BR;
    const checkDir = moveDir === 'top' || moveDir === 'left';
    if (checkLoc && checkDir) {
      return;
    }
    // 复制合并单元格
    let tri = this.selectRangeStartRow();
    RowsIterator.getInstance()
      .setBegin(xSelect.selectRange.sri)
      .setEnd(xSelect.selectRange.eri)
      .setLoop((ori) => {
        let tci = selectRange.sci;
        ColsIterator.getInstance()
          .setBegin(xSelect.selectRange.sci)
          .setEnd(xSelect.selectRange.eci)
          .setLoop((oci) => {
            // 合并单元格
            const merge = merges.getFirstIncludes(ori, oci);
            if (!merge) {
              return;
            }
            // 主单元格
            const { sri, sci } = merge;
            const origin = sri === ori && sci === oci;
            if (!origin) {
              return;
            }
            // 复制
            let [rSize, cSize] = merge.size();
            cSize -= 1;
            rSize -= 1;
            const newMerge = new RectRange(tri, tci, tri + rSize, tci + cSize);
            mergeDataProxy.addMerge(newMerge);
          })
          .setNext(() => {
            tci += 1;
          })
          .execute();
      })
      .setNext(() => {
        tri += 1;
      })
      .execute();
  }

  splitMerge() {
    const { table } = this;
    const tableDataSnapshot = table.getTableDataSnapshot();
    const merges = table.getTableMerges();
    const { mergeDataProxy } = tableDataSnapshot;
    const { selectRange } = this;
    // 删除合并单元格
    RowsIterator.getInstance()
      .setBegin(this.selectRangeStartRow())
      .setEnd(selectRange.eri)
      .setLoop((ri) => {
        ColsIterator.getInstance()
          .setBegin(selectRange.sci)
          .setEnd(selectRange.eci)
          .setLoop((ci) => {
            const merge = merges.getFirstIncludes(ri, ci);
            if (merge) {
              mergeDataProxy.deleteMerge(merge);
            }
          })
          .execute();
      })
      .execute();
  }

  copyContent() {
    const { table, xScreen } = this;
    const tableDataSnapshot = table.getTableDataSnapshot();
    const cells = table.getTableCells();
    const xSelect = xScreen.findType(XSelectItem);
    const { cellDataProxy } = tableDataSnapshot;
    const { selectRange } = this;
    let tri = this.selectRangeStartRow();
    RowsIterator.getInstance()
      .setBegin(xSelect.selectRange.sri)
      .setEnd(xSelect.selectRange.eri)
      .setLoop((ori) => {
        let tci = selectRange.sci;
        ColsIterator.getInstance()
          .setBegin(xSelect.selectRange.sci)
          .setEnd(xSelect.selectRange.eci)
          .setLoop((oci) => {
            const src = cells.getCell(ori, oci);
            if (src) {
              const target = src.clone();
              cellDataProxy.setCell(tri, tci, target);
            }
          })
          .setNext(() => {
            tci += 1;
          })
          .execute();
      })
      .setNext(() => {
        tri += 1;
      })
      .execute();
  }

  autoFillTo() {
    const { selectRange } = this;
    if (selectRange.equals(RectRange.EMPTY)) {
      return;
    }
    const { table, options } = this;
    const tableDataSnapshot = table.getTableDataSnapshot();
    options.onBeforeAutoFill();
    tableDataSnapshot.begin();
    this.splitMerge();
    this.copyContent();
    this.copyMerge();
    tableDataSnapshot.end();
    options.onAfterAutoFill();
    table.render();
  }

}

export {
  XAutoFillItem,
};
