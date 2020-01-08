/* global document */

import { ScreenWidget } from '../screen/ScreenWidget';
import { AutoFill } from './AutoFill';
import { ScreenSelector } from './ScreenSelector';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
import { RectRange } from '../RectRange';

class ScreenAutoFill extends ScreenWidget {
  constructor(screen, options = {}) {
    super(screen);
    this.lt = new AutoFill(options);
    this.t = new AutoFill(options);
    this.l = new AutoFill(options);
    this.br = new AutoFill(options);
    this.autoFillAttr = null;
    this.screenSelector = screen.findByClass(ScreenSelector);
    this.bind();
  }

  bind() {
    const { screen, screenSelector } = this;
    const { table } = screen;
    const { mousePointType } = table;
    EventBind.bind([
      screenSelector.lt.cornerEl,
      screenSelector.t.cornerEl,
      screenSelector.l.cornerEl,
      screenSelector.br.cornerEl,
    ], Constant.EVENT_TYPE.MOUSE_DOWN, (e1) => {
      mousePointType.on(['autoFill']);
      mousePointType.set('crosshair', 'autoFill');
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
        e2.stopPropagation();
        e2.preventDefault();
      }, () => {
        mousePointType.off();
        this.lt.hide();
        this.t.hide();
        this.l.hide();
        this.br.hide();
      });
      e1.stopPropagation();
      e1.preventDefault();
    });
    EventBind.bind([
      screenSelector.lt.cornerEl,
      screenSelector.t.cornerEl,
      screenSelector.l.cornerEl,
      screenSelector.br.cornerEl,
    ], Constant.EVENT_TYPE.MOUSE_MOVE, (e) => {
      mousePointType.set('crosshair', 'autoFill');
      e.stopPropagation();
      e.preventDefault();
    });
  }

  setLTOffset(autoFillAttr) {
    const { screen } = this;
    const { table } = screen;
    const { frozenLeftTop, cols, rows } = table;
    const viewRange = frozenLeftTop.getViewRange();
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
      width,
      height,
      left,
      top,
    }).show();
  }

  setTOffset(autoFillAttr) {
    const { screen } = this;
    const { table } = screen;
    const { fixedTop, cols, rows } = table;
    const viewRange = fixedTop.getViewRange();
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
      width,
      height,
      left,
      top,
    }).show();
  }

  setLOffset(autoFillAttr) {
    const { screen } = this;
    const { table } = screen;
    const { fixedLeft, cols, rows } = table;
    const viewRange = fixedLeft.getViewRange();
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
      width,
      height,
      left,
      top,
    }).show();
  }

  setBROffset(autoFillAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      content, cols, rows,
    } = table;
    const viewRange = content.getViewRange();
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
    this.br.offset({
      width,
      height,
      left,
      top,
    }).show();
  }

  setOffset(autoFillAttr) {
    this.setLTOffset(autoFillAttr);
    this.setTOffset(autoFillAttr);
    this.setLOffset(autoFillAttr);
    this.setBROffset(autoFillAttr);
  }

  getMoveAutoFillAttr(x, y) {
    const { screen, screenSelector } = this;
    const { table } = screen;
    const { selectorAttr } = screenSelector;
    const { cols, rows } = table;
    const { rect: selectorRect, edgeType } = selectorAttr;
    let { ri, ci } = table.getRiCiByXy(x, y);
    if (ri < 0) ri = 0; else if (ri > rows.len) ri = rows.len - 1;
    if (ci < 0) ci = 0; else if (ci > cols.len) ci = cols.len - 1;
    const { sri: selectorSri, sci: selectorSci } = selectorRect;
    let { eri: selectorEri, eci: selectorEci } = selectorRect;
    if (edgeType === 'left') selectorEci = cols.len - 1;
    if (edgeType === 'top') selectorEri = rows.len - 1;
    let rect = null;
    let direction = 'un';
    if (ri < selectorSri || ri > selectorEri) {
      if (ri < selectorSri) {
        direction = 'top';
        rect = new RectRange(ri, selectorSci, selectorSri - 1, selectorEci);
      }
      if (ri > selectorEri) {
        direction = 'bottom';
        rect = new RectRange(selectorEri + 1, selectorSci, ri, selectorEci);
      }
    } else if (ci < selectorSci || ci > selectorEci) {
      if (ci < selectorSci) {
        direction = 'left';
        rect = new RectRange(selectorSri, ci, selectorEri, selectorSci - 1);
      }
      if (ci > selectorEci) {
        direction = 'right';
        rect = new RectRange(selectorSri, selectorEci + 1, selectorEri, ci);
      }
    }
    if (rect !== null) {
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
}

export { ScreenAutoFill };
