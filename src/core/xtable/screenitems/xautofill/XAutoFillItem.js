/* global document */
import { SELECT_LOCAL, XSelectItem } from '../xselect/XSelectItem';
import { XScreenCssBorderItem } from '../../screen/item/viewborder/XScreenCssBorderItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { XEvent } from '../../../../lib/XEvent';
import { XTableMousePoint } from '../../XTableMousePoint';
import { AutoFillType } from '../../../../module/autofilltype/AutoFillType';
import { Serialize } from '../../helper/CellMergeCopyHelper';
import { AutoFillTypeMenu } from '../../../../module/autofilltype/AutoFillTypeMenu';

class XAutoFillItem extends XScreenCssBorderItem {

  constructor(table, options = {}) {
    super({ table });
    this.options = SheetUtils.copy({
      mergeForceSplit: false,
      onBeforeAutoFill: () => {},
      onAfterAutoFill: () => {},
    }, options);
    this.moveDirection = null;
    this.autoFillRange = RectRange.EMPTY;
    this.display = false;
    // 区域背景
    this.ltElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.brElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.lElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.tElem = new Widget(`${cssPrefix}-x-autofill-area`);
    // 区域位置
    this.blt.children(this.ltElem);
    this.bl.children(this.lElem);
    this.bt.children(this.tElem);
    this.bbr.children(this.brElem);
    // 边框类型
    this.setBorderType('dashed');
    // 事件处理
    this.eventMouseDown = (e1) => {
      const { table, xScreen } = this;
      const { mousePointer } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const autoFillType = new AutoFillType({
        onUpdate: (menu) => {
          const { value } = menu;
          switch (value) {
            case AutoFillTypeMenu.FILL_TYPE.SERIALIZE:
              this.serialize();
              break;
            case AutoFillTypeMenu.FILL_TYPE.FILLING:
              break;
          }
        },
      }).parentWidget(table);
      mousePointer.lock(XAutoFillItem);
      mousePointer.set(XTableMousePoint.KEYS.crosshair, XAutoFillItem);
      const { x, y } = table.eventXy(e1);
      this.display = true;
      this.rangeHandle(x, y);
      this.offsetHandle();
      this.borderHandle();
      this.applyAnimate();
      XEvent.mouseMoveUp(document, (e2) => {
        const { x, y } = table.eventXy(e2);
        this.rangeHandle(x, y);
        this.offsetHandle();
        this.borderHandle();
      }, () => {
        this.closeAnimate();
        this.display = false;
        mousePointer.free(XAutoFillItem);
        const { autoFillRange } = this;
        if (!table.isProtection({
          view: autoFillRange,
        })) {
          this.autoFill();
          this.hide();
          if (!autoFillRange.equals(RectRange.EMPTY)) {
            const { selectRange } = xSelect;
            xSelect.setRange(selectRange.union(autoFillRange));
            const { activeCorner } = xSelect;
            autoFillType.setEL(activeCorner);
            autoFillType.open();
          }
        } else {
          this.hide();
        }
      });
    };
    this.eventMouseMove = () => {
      const { table } = this;
      const { mousePointer } = table;
      mousePointer.lock(XAutoFillItem);
      mousePointer.set(XTableMousePoint.KEYS.crosshair, XAutoFillItem);
    };
    this.eventMouseLeave = () => {
      const { table } = this;
      const { mousePointer } = table;
      mousePointer.free(XAutoFillItem);
    };
  }

  borderHandle() {
    const { xScreen, autoFillRange, display } = this;
    if (display === false || autoFillRange.equals(RectRange.EMPTY)) {
      this.hideBorder();
    } else {
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      const unionRange = selectRange.union(autoFillRange);
      this.showBorder(unionRange);
    }
  }

  offsetHandle() {
    const { xScreen, autoFillRange, display } = this;
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    if (display === false || autoFillRange.equals(RectRange.EMPTY)) {
      this.hide();
      this.setDisplay(selectRange);
      this.setSizer(selectRange);
      this.setLocal(selectRange);
    } else {
      const unionRange = selectRange.union(autoFillRange);
      this.show();
      this.setDisplay(unionRange);
      this.setSizer(unionRange);
      this.setLocal(unionRange);
    }
  }

  rangeHandle(x, y) {
    const { table } = this;
    const { xIteratorBuilder, xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const merges = table.getTableMerges();
    const { selectRange, selectLocal } = xSelect;
    const { cols, rows } = table;
    const { sri, sci, eri, eci } = selectRange;
    const { ri, ci } = table.getRiCiByXy(x, y);

    const merge = merges.getFirstInclude(sri, sci);
    const zone = SELECT_LOCAL.BR !== selectLocal;
    const hasFull = zone || SheetUtils.isNotUnDef(merge);
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
    let moveDirection = SheetUtils.Undef;

    // 选择区域
    if (originSRi < sri || ri > eri) {
      // 上下
      if (originSRi < sri) {
        moveDirection = Serialize.SERIALIZE_DIRECTION.TOP;
        if (hasFull) {
          let minRi = sri;
          let number = 0;
          xIteratorBuilder.getRowIterator()
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
          const nextRow = xIteratorBuilder.getRowIterator()
            .setBegin(sri)
            .setEnd(0)
            .nextRow();
          autoFillRange = new RectRange(ri, sci, nextRow, eci);
        }
      }
      if (originSRi > eri) {
        moveDirection = Serialize.SERIALIZE_DIRECTION.BOTTOM;
        if (hasFull) {
          let maxRi = eri;
          let number = 0;
          xIteratorBuilder.getRowIterator()
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
          const nextRow = xIteratorBuilder.getRowIterator()
            .setBegin(eri)
            .setEnd(rows.len - 1)
            .nextRow();
          autoFillRange = new RectRange(nextRow, sci, ri, eci);
        }
      }
    } else if (originSCi < sci || ci > eci) {
      // 左右
      if (originSCi < sci) {
        moveDirection = Serialize.SERIALIZE_DIRECTION.LEFT;
        if (hasFull) {
          let minCi = sci;
          let number = 0;
          xIteratorBuilder.getColIterator()
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
          const nextCol = xIteratorBuilder.getColIterator()
            .setBegin(sci)
            .setEnd(0)
            .nextRow();
          autoFillRange = new RectRange(sri, ci, eri, nextCol);
        }
      }
      if (originSCi > eci) {
        moveDirection = Serialize.SERIALIZE_DIRECTION.RIGHT;
        if (hasFull) {
          let maxCi = eci;
          let number = 0;
          xIteratorBuilder.getColIterator()
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
          const nextCol = xIteratorBuilder.getColIterator()
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

  onAdd() {
    this.bind();
    this.hide();
  }

  unbind() {
    const { xScreen } = this;
    const { eventMouseDown } = this;
    const { eventMouseMove } = this;
    const { eventMouseLeave } = this;
    const xSelect = xScreen.findType(XSelectItem);
    XEvent.unbind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, eventMouseDown);
    XEvent.unbind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, eventMouseMove);
    XEvent.unbind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, eventMouseLeave);
  }

  bind() {
    const { xScreen } = this;
    const { eventMouseDown } = this;
    const { eventMouseMove } = this;
    const { eventMouseLeave } = this;
    const xSelect = xScreen.findType(XSelectItem);
    XEvent.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, eventMouseDown);
    XEvent.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, eventMouseMove);
    XEvent.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, eventMouseLeave);
  }

  serialize() {
    const { table, xScreen, autoFillRange, moveDirection } = this;
    const { snapshot, cellMergeCopyHelper } = table;
    const xSelect = xScreen.findType(XSelectItem);
    snapshot.open();
    cellMergeCopyHelper.serializeContent({
      originViewRange: autoFillRange.union(xSelect.selectRange),
      direction: moveDirection,
    });
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
    });
    table.render();
  }

  autoFill() {
    const { autoFillRange } = this;
    if (autoFillRange.equals(RectRange.EMPTY)) {
      return;
    }
    const { table, options } = this;
    const { snapshot } = table;
    options.onBeforeAutoFill();
    snapshot.open();
    this.splitMerge();
    this.fillMerge();
    this.fillCellIN();
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
    });
    options.onAfterAutoFill();
    table.render();
  }

  splitMerge() {
    const { table, autoFillRange } = this;
    const merges = table.getTableMerges();
    const ranges = merges.getIntersects(autoFillRange);
    if (ranges) {
      ranges.forEach((merge) => {
        merges.delete(merge);
      });
    }
  }

  fillMerge() {
    const { table, xScreen, autoFillRange } = this;
    const { cellMergeCopyHelper } = table;
    const xSelect = xScreen.findType(XSelectItem);
    cellMergeCopyHelper.copyMergeContent({
      targetViewRange: autoFillRange,
      originViewRange: xSelect.selectRange,
    });
  }

  fillCellIN() {
    const { table, xScreen, autoFillRange } = this;
    const { cellMergeCopyHelper } = table;
    const xSelect = xScreen.findType(XSelectItem);
    cellMergeCopyHelper.copyCellINContent({
      targetViewRange: autoFillRange,
      originViewRange: xSelect.selectRange,
    });
  }

  applyAnimate() {
    const apply = [];
    const t = '80ms';
    const s = 'linear';
    apply.push(`width ${t} ${s}`);
    apply.push(`height ${t} ${s}`);
    apply.push(`top ${t} ${s}`);
    apply.push(`left ${t} ${s}`);
    apply.push(`right ${t} ${s}`);
    apply.push(`bottom ${t} ${s}`);
    const transition = apply.join(',');
    this.t.css('transition', transition);
    this.l.css('transition', transition);
    this.lt.css('transition', transition);
    this.br.css('transition', transition);
  }

  closeAnimate() {
    this.t.css('transition', 'none');
    this.l.css('transition', 'none');
    this.lt.css('transition', 'none');
    this.br.css('transition', 'none');
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  XAutoFillItem,
};
