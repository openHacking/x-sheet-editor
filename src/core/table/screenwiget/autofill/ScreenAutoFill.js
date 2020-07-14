/* global document */
import { ScreenWidget } from '../../screen/ScreenWidget';
import { AutoFill } from './AutoFill';
import { EventBind } from '../../../../utils/EventBind';
import { Constant } from '../../../../const/Constant';
import { RectRange } from '../../base/RectRange';
import { Utils } from '../../../../utils/Utils';

class ScreenAutoFill extends ScreenWidget {

  constructor(screen, options = {}) {
    super(screen);
    this.options = Utils.mergeDeep({
      mergeForceSplit: false,
      onBeforeAutoFill: () => {},
      onAfterAutoFill: () => {},
    }, options);
    this.lt = new AutoFill();
    this.t = new AutoFill();
    this.l = new AutoFill();
    this.br = new AutoFill();
    this.autoFillAttr = null;
    this.bind();
  }

  bind() {
    const { screen } = this;
    const { table } = screen;
    const { mousePointer, screenSelector } = table;
    const { key, type } = Constant.MOUSE_POINTER_TYPE.AUTO_FILL;
    EventBind.bind([
      screenSelector.lt.cornerEl,
      screenSelector.t.cornerEl,
      screenSelector.l.cornerEl,
      screenSelector.br.cornerEl,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      mousePointer.on(key);
      mousePointer.set(type, key);
      EventBind.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        const moveAutoFill = this.getMoveAutoFillAttr(x, y);
        if (moveAutoFill) {
          // console.log('moveAutoFill>>>', moveAutoFill);
          this.setOffset(moveAutoFill);
        } else {
          this.lt.hide();
          this.t.hide();
          this.l.hide();
          this.br.hide();
        }
        this.autoFillAttr = moveAutoFill;
      }, () => {
        mousePointer.off(key);
        this.lt.hide();
        this.t.hide();
        this.l.hide();
        this.br.hide();
        if (this.autoFillAttr) {
          this.autoFillTo();
          table.render();
        }
      });
      e.stopPropagation();
    });
    EventBind.bind([
      screenSelector.lt.cornerEl,
      screenSelector.t.cornerEl,
      screenSelector.l.cornerEl,
      screenSelector.br.cornerEl,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.on(key);
      mousePointer.set(type, key);
    });
    EventBind.bind([
      screenSelector.lt.cornerEl,
      screenSelector.t.cornerEl,
      screenSelector.l.cornerEl,
      screenSelector.br.cornerEl,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.off(key);
    });
  }

  setLTOffset(autoFillAttr) {
    const { screen } = this;
    const { table } = screen;
    const { xTableFrozenContent, cols, rows } = table;
    const viewRange = xTableFrozenContent.getScrollView();
    const { rect } = autoFillAttr;
    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      this.lt.hide();
      return;
    }
    const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
    if (rect.eci > viewRange.eci) {
      this.lt.areaEl.css('border-right', 'none');
    } else {
      this.lt.areaEl.cssRemoveKeys('border-right');
    }
    if (rect.eri > viewRange.eri) {
      this.lt.areaEl.css('border-bottom', 'none');
    } else {
      this.lt.areaEl.cssRemoveKeys('border-bottom');
    }
    this.lt.offset({
      width, height, left, top,
    }).show();
  }

  setTOffset(autoFillAttr) {
    const { screen } = this;
    const { table } = screen;
    const { xTop, cols, rows } = table;
    const viewRange = xTop.getScrollView();
    const { rect } = autoFillAttr;
    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      this.t.hide();
      return;
    }
    const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
    if (rect.sci < viewRange.sci) {
      this.t.areaEl.css('border-left', 'none');
    } else {
      this.t.areaEl.cssRemoveKeys('border-left');
    }
    if (rect.eri > viewRange.eri) {
      this.t.areaEl.css('border-bottom', 'none');
    } else {
      this.t.areaEl.cssRemoveKeys('border-bottom');
    }
    if (rect.eci > viewRange.eci) {
      this.t.areaEl.css('border-right', 'none');
    } else {
      this.t.areaEl.cssRemoveKeys('border-right');
    }
    this.t.offset({
      width, height, left, top,
    }).show();
  }

  setLOffset(autoFillAttr) {
    const { screen } = this;
    const { table } = screen;
    const { xLeft, cols, rows } = table;
    const viewRange = xLeft.getScrollView();
    const { rect } = autoFillAttr;
    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      this.l.hide();
      return;
    }
    const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
    if (rect.sri < viewRange.sri) {
      this.l.areaEl.css('border-top', 'none');
    } else {
      this.l.areaEl.cssRemoveKeys('border-top');
    }
    if (rect.eci > viewRange.eci) {
      this.l.areaEl.css('border-right', 'none');
    } else {
      this.l.areaEl.cssRemoveKeys('border-right');
    }
    if (rect.eri > viewRange.eri) {
      this.l.areaEl.css('border-bottom', 'none');
    } else {
      this.l.areaEl.cssRemoveKeys('border-bottom');
    }
    this.l.offset({
      width, height, left, top,
    }).show();
  }

  setBROffset(autoFillAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      cols, rows,
    } = table;
    const viewRange = table.getScrollView();
    const { rect } = autoFillAttr;
    const empty = new RectRange(-1, -1, -1, -1);
    const coincideRange = rect.coincide(viewRange);
    if (empty.equals(coincideRange)) {
      this.br.hide();
      return;
    }
    const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci);
    const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri);
    const top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
    const left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
    if (rect.sci < viewRange.sci) {
      this.br.areaEl.css('border-left', 'none');
    } else {
      this.br.areaEl.cssRemoveKeys('border-left');
    }
    if (rect.sri < viewRange.sri) {
      this.br.areaEl.css('border-top', 'none');
    } else {
      this.br.areaEl.cssRemoveKeys('border-top');
    }
    if (rect.eri > viewRange.eri) {
      this.br.areaEl.css('border-bottom', 'none');
    } else {
      this.br.areaEl.cssRemoveKeys('border-bottom');
    }
    if (rect.eci > viewRange.eci) {
      this.br.areaEl.css('border-right', 'none');
    } else {
      this.br.areaEl.cssRemoveKeys('border-right');
    }
    this.br.offset({ width, height, left, top,
    }).show();
  }

  setOffset(autoFillAttr) {
    this.setLTOffset(autoFillAttr);
    this.setTOffset(autoFillAttr);
    this.setLOffset(autoFillAttr);
    this.setBROffset(autoFillAttr);
  }

  getMoveAutoFillAttr(x, y) {
    const { screen } = this;
    const { table } = screen;
    const { screenSelector } = table;
    const { selectorAttr } = screenSelector;
    const {
      cols, rows, merges,
    } = table;
    const {
      rect: selectorRect, edge, edgeType,
    } = selectorAttr;
    const autoFillSelectorRect = edge
      || merges.getFirstIncludes(selectorRect.sri, selectorRect.sci) != null;
    const [rSize, cSize] = selectorRect.size();
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
    } = selectorRect;
    let {
      eri: selectorEri, eci: selectorEci,
    } = selectorRect;
    if (edgeType === 'left') {
      selectorEci = cols.len - 1;
    }
    if (edgeType === 'top') {
      selectorEri = rows.len - 1;
    }
    let direction;
    let rect;
    if (ri < selectorSri || ri > selectorEri) {
      if (ri < selectorSri) {
        direction = 'top';
        if (autoFillSelectorRect) {
          let minRi = selectorSri - rSize;
          if (minRi >= 0) {
            const diff = (selectorSri - 1) - ri;
            for (let i = 1; i <= diff; i += 1) {
              if (i % rSize === 0 && minRi - rSize >= 0) minRi -= rSize;
            }
            rect = new RectRange(minRi, selectorSci, selectorSri - 1, selectorEci);
          }
        } else {
          rect = new RectRange(ri, selectorSci, selectorSri - 1, selectorEci);
        }
      }
      if (ri > selectorEri) {
        direction = 'bottom';
        if (autoFillSelectorRect) {
          let maxRi = selectorEri + rSize;
          if (maxRi <= rows.len - 1) {
            const diff = ri - (selectorEri + 1);
            for (let i = 1; i <= diff; i += 1) {
              if (i % rSize === 0 && maxRi + rSize <= rows.len - 1) maxRi += rSize;
            }
            rect = new RectRange(selectorEri + 1, selectorSci, maxRi, selectorEci);
          }
        } else {
          rect = new RectRange(selectorEri + 1, selectorSci, ri, selectorEci);
        }
      }
    } else if (ci < selectorSci || ci > selectorEci) {
      if (ci < selectorSci) {
        direction = 'left';
        if (autoFillSelectorRect) {
          let minCi = selectorSci - cSize;
          if (minCi >= 0) {
            const diff = (selectorSci - 1) - ci;
            for (let i = 1; i <= diff; i += 1) {
              if (i % cSize === 0 && minCi - cSize >= 0) minCi -= cSize;
            }
            rect = new RectRange(selectorSri, minCi, selectorEri, selectorSci - 1);
          }
        } else {
          rect = new RectRange(selectorSri, ci, selectorEri, selectorSci - 1);
        }
      }
      if (ci > selectorEci) {
        direction = 'right';
        if (autoFillSelectorRect) {
          let maxCi = selectorEci + cSize;
          if (maxCi <= cols.len - 1) {
            const diff = ci - (selectorEci + 1);
            for (let i = 1; i <= diff; i += 1) {
              if (i % cSize === 0 && maxCi + cSize <= cols.len - 1) maxCi += cSize;
            }
            rect = new RectRange(selectorSri, selectorEci + 1, selectorEri, maxCi);
          }
        } else {
          rect = new RectRange(selectorSri, selectorEci + 1, selectorEri, ci);
        }
      }
    }
    if (rect) {
      const width = cols.sectionSumWidth(rect.sci, rect.eci);
      const height = rows.sectionSumHeight(rect.sri, rect.eri);
      rect.w = width;
      rect.h = height;
      return {
        rect, direction,
      };
    }
    return null;
  }

  copyContent() {
    const { screen } = this;
    const { table } = screen;
    const { screenSelector } = table;
    const {
      cells, tableDataSnapshot,
    } = table;
    const { cellDataProxy } = tableDataSnapshot;
    const { autoFillAttr } = this;
    const { selectorAttr } = screenSelector;
    const { rect: autoFillRect } = autoFillAttr;
    const { rect: selectorRect } = selectorAttr;
    let sIndexRi = selectorRect.sri;
    let tIndexRi = autoFillRect.sri;
    while (tIndexRi <= autoFillRect.eri) {
      let sIndexCi = selectorRect.sci;
      let tIndexCi = autoFillRect.sci;
      while (tIndexCi <= autoFillRect.eci) {
        const src = cells.getCell(sIndexRi, sIndexCi);
        if (src) {
          const target = src.clone({
            ignoreMerge: true,
          });
          cellDataProxy.setCell(tIndexRi, tIndexCi, target);
        }
        sIndexCi += 1;
        tIndexCi += 1;
        if (sIndexCi > selectorRect.eci) {
          sIndexCi = selectorRect.sci;
        }
      }
      sIndexRi += 1;
      tIndexRi += 1;
      if (sIndexRi > selectorRect.eri) {
        sIndexRi = selectorRect.sri;
      }
    }
  }

  splitMerge() {
    const { screen } = this;
    const { table } = screen;
    const {
      merges, cells, tableDataSnapshot,
    } = table;
    const { mergeDataProxy } = tableDataSnapshot;
    const { autoFillAttr } = this;
    const { rect } = autoFillAttr;
    rect.each((ri, ci) => {
      const merge = merges.getFirstIncludes(ri, ci);
      if (merge) {
        const cell = cells.getCell(ri, ci);
        if (cell && cell.merge !== -1) {
          mergeDataProxy.deleteMerge(cell.merge);
        }
      }
    });
  }

  copyMerge() {
    const { screen } = this;
    const { table } = screen;
    const { screenSelector } = table;
    const {
      merges, tableDataSnapshot,
    } = table;
    const { mergeDataProxy } = tableDataSnapshot;
    const { autoFillAttr } = this;
    const { selectorAttr } = screenSelector;
    const {
      rect: autoFillRect, direction,
    } = autoFillAttr;
    const {
      rect: selectorRect, edge,
    } = selectorAttr;
    let sIndexRi = selectorRect.sri;
    let tIndexRi = autoFillRect.sri;
    if (edge && (direction === 'top' || direction === 'left')) {
      return;
    }
    while (tIndexRi <= autoFillRect.eri) {
      let sIndexCi = selectorRect.sci;
      let tIndexCi = autoFillRect.sci;
      while (tIndexCi <= autoFillRect.eci) {
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
        if (sIndexCi > selectorRect.eci) {
          sIndexCi = selectorRect.sci;
        }
      }
      sIndexRi += 1;
      tIndexRi += 1;
      if (sIndexRi > selectorRect.eri) {
        sIndexRi = selectorRect.sri;
      }
    }
  }

  autoFillTo() {
    this.options.onBeforeAutoFill();
    this.splitMerge();
    this.copyContent();
    this.copyMerge();
    this.options.onAfterAutoFill();
  }
}

export { ScreenAutoFill };
