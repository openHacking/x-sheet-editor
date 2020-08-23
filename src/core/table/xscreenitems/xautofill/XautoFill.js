import {
  SELECT_LOCAL,
  XSelectItem,
} from '../xselect/XSelectItem';
import { XScreenItem } from '../../xscreen/item/XScreenItem';
import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { Utils } from '../../../../utils/Utils';
import { DISPLAY_AREA } from '../../xscreen/XScreen';

class XautoFill extends XScreenItem {

  constructor(table) {
    super({ table });
    this.targetOffset = { top: 0, left: 0, width: 0, height: 0 };
    this.moveRange = null;
    this.targetRange = null;
    this.moveDir = null;
    this.ltElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.brElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.lElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.tElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.lt.child(this.ltElem);
    this.l.child(this.lElem);
    this.t.child(this.tElem);
    this.br.child(this.brElem);
    this.hide();
    this.bind();
  }

  bind() {

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
    let moveRange;
    let moveDir;
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
      this.moveRange = moveRange;
      this.moveDir = moveDir;
    }
  }

  targetRangeHandle() {
    const { moveRange } = this;
    if (Utils.isUnDef(moveRange)) {
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
    const { selectRange } = this;
    const { table } = this;
    const { xScreen } = this;
    const scrollView = table.getScrollView();
    // out checked
    const topOut = selectRange.sri < scrollView.sri || selectRange.sri > scrollView.eri;
    const bottomOut = selectRange.eri < scrollView.sri || selectRange.eri > scrollView.eri;
    const leftOut = selectRange.sci < scrollView.sci || selectRange.sci > scrollView.eci;
    const rightOut = selectRange.eci < scrollView.sci || selectRange.eci > scrollView.eci;
    // border display
    const update = [];
    switch (xScreen.displayArea) {
      case DISPLAY_AREA.ALL:
        update.push(this.brElem);
        update.push(this.tElem);
        update.push(this.lElem);
        update.push(this.ltElem);
        break;
      case DISPLAY_AREA.BR:
        update.push(this.brElem);
        break;
      case DISPLAY_AREA.BRL:
        update.push(this.brElem);
        update.push(this.lElem);
        break;
      case DISPLAY_AREA.BRT:
        update.push(this.brElem);
        update.push(this.tElem);
        break;
    }
    update.forEach((item) => {
      if (bottomOut) { item.removeClass('show-bottom-border'); } else { item.addClass('show-bottom-border'); }
      if (topOut) { item.removeClass('show-top-border'); } else { item.addClass('show-top-border'); }
      if (rightOut) { item.removeClass('show-right-border'); } else { item.addClass('show-right-border'); }
      if (leftOut) { item.removeClass('show-left-border'); } else { item.addClass('show-left-border'); }
    });
  }

}
