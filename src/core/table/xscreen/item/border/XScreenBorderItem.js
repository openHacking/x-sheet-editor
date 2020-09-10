import { RectRange } from '../../../tablebase/RectRange';
import { DISPLAY_AREA } from '../../XScreen';
import { XScreenLTPart } from '../../part/XScreenLTPart';
import { XScreenTPart } from '../../part/XScreenTPart';
import { XScreenLPart } from '../../part/XScreenLPart';
import { XScreenBRPart } from '../../part/XScreenBRPart';
import { XScreenMeasureItem } from '../XScreenMeasureItem';

const RANGE_OVER_GO = {
  LT: Symbol('lt'),
  T: Symbol('t'),
  BR: Symbol('br'),
  L: Symbol('l'),
  LTT: Symbol('ltt'),
  LTL: Symbol('ltl'),
  BRT: Symbol('brt'),
  BRL: Symbol('brl'),
  ALL: Symbol('all'),
};

class XScreenBorderItem extends XScreenMeasureItem {

  constructor({ table }, className = '') {
    super({ table });
    this.blt = new XScreenLTPart(className);
    this.bt = new XScreenTPart(className);
    this.bl = new XScreenLPart(className);
    this.bbr = new XScreenBRPart(className);
    this.lt.child(this.blt);
    this.t.child(this.bt);
    this.l.child(this.bl);
    this.br.child(this.bbr);
  }

  borderDisplay(range, overGo) {
    const { table } = this;
    const scrollView = table.getScrollView();
    const display = {
      bottom: false, left: false, top: false, right: false,
    };
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        display.bottom = true;
        display.top = true;
        display.left = true;
        display.right = true;
        break;
      case RANGE_OVER_GO.T:
        display.bottom = true;
        display.top = true;
        display.left = range.sci >= scrollView.sci && range.sci <= scrollView.eci;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.BR:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = range.sri >= scrollView.sri && range.sri <= scrollView.eri;
        display.left = range.sci >= scrollView.sci && range.sci <= scrollView.eci;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.L:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = range.sri >= scrollView.sri && range.sri <= scrollView.eri;
        display.left = true;
        display.right = true;
        break;
      case RANGE_OVER_GO.LTT:
        display.bottom = true;
        display.top = true;
        display.left = true;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.LTL:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = true;
        display.left = true;
        display.right = true;
        break;
      case RANGE_OVER_GO.BRT:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = true;
        display.left = range.sci >= scrollView.sci && range.sci <= scrollView.eci;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.BRL:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = range.sri >= scrollView.sri && range.sri <= scrollView.eri;
        display.left = true;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
      case RANGE_OVER_GO.ALL:
        display.bottom = range.eri <= scrollView.eri && range.eri >= scrollView.sri;
        display.top = true;
        display.left = true;
        display.right = range.eci <= scrollView.eci && range.eci >= scrollView.sci;
        break;
    }
    return display;
  }

  rangeOverGo(range) {
    const { table } = this;
    const { cols, rows } = table;
    const {
      xFixedView,
    } = table;
    const rowsLen = rows.len - 1;
    const colsLen = cols.len - 1;
    const fixedView = xFixedView.getFixedView();
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      const lt = fixedView;
      const t = new RectRange(fixedView.sri, fixedView.eci, fixedView.eri, colsLen);
      const br = new RectRange(fixedView.eri, fixedView.eci, rowsLen, colsLen);
      const l = new RectRange(fixedView.eri, fixedView.sci, rowsLen, fixedView.eci);
      if (lt.contains(range)) {
        return RANGE_OVER_GO.LT;
      }
      if (t.contains(range)) {
        return RANGE_OVER_GO.T;
      }
      if (br.contains(range)) {
        return RANGE_OVER_GO.BR;
      }
      if (l.contains(range)) {
        return RANGE_OVER_GO.L;
      }
      const ltt = new RectRange(0, 0, fixedView.eri, colsLen);
      const ltl = new RectRange(0, 0, rowsLen, fixedView.eci);
      const brt = new RectRange(0, fixedView.eci, rowsLen, colsLen);
      const brl = new RectRange(fixedView.eri, 0, rowsLen, colsLen);
      if (ltt.contains(range)) {
        return RANGE_OVER_GO.LTT;
      }
      if (ltl.contains(range)) {
        return RANGE_OVER_GO.LTL;
      }
      if (brt.contains(range)) {
        return RANGE_OVER_GO.BRT;
      }
      if (brl.contains(range)) {
        return RANGE_OVER_GO.BRL;
      }
      return RANGE_OVER_GO.ALL;
    } if (xFixedView.hasFixedTop()) {
      const t = new RectRange(0, 0, fixedView.eri, colsLen);
      const br = new RectRange(fixedView.eri, 0, rowsLen, colsLen);
      if (t.contains(range)) {
        return RANGE_OVER_GO.T;
      }
      if (br.contains(range)) {
        return RANGE_OVER_GO.BR;
      }
      return RANGE_OVER_GO.ALL;
    } if (xFixedView.hasFixedLeft()) {
      const br = new RectRange(0, fixedView.eci, rowsLen, colsLen);
      const l = new RectRange(0, 0, rowsLen, fixedView.eci);
      if (br.contains(range)) {
        return RANGE_OVER_GO.BR;
      }
      if (l.contains(range)) {
        return RANGE_OVER_GO.L;
      }
      return RANGE_OVER_GO.ALL;
    }
    return RANGE_OVER_GO.BR;
  }

  hideAllBorder() {
    const { xScreen } = this;
    const update = [];
    switch (xScreen.displayArea) {
      case DISPLAY_AREA.ALL:
        update.push(this.bbr);
        update.push(this.bt);
        update.push(this.bl);
        update.push(this.blt);
        break;
      case DISPLAY_AREA.BR:
        update.push(this.bbr);
        break;
      case DISPLAY_AREA.BRL:
        update.push(this.bbr);
        update.push(this.bl);
        break;
      case DISPLAY_AREA.BRT:
        update.push(this.bbr);
        update.push(this.bt);
        break;
    }
    update.forEach((item) => {
      item.removeClass('show-bottom-border');
      item.removeClass('show-top-border');
      item.removeClass('show-right-border');
      item.removeClass('show-left-border');
    });
  }

  showBBorder(overGo) {
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        this.blt.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.L:
        this.bl.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.T:
        this.bt.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.BR:
        this.bbr.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.LTT:
        this.blt.addClass('show-bottom-border');
        this.bt.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.LTL:
        this.bl.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.BRT:
        this.bbr.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.BRL:
        this.bl.addClass('show-bottom-border');
        this.bbr.addClass('show-bottom-border');
        break;
      case RANGE_OVER_GO.ALL:
        this.bl.addClass('show-bottom-border');
        this.bbr.addClass('show-bottom-border');
        break;
    }
  }

  showTBorder(overGo) {
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        this.blt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.L:
        this.bl.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.T:
        this.bt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.BR:
        this.bbr.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.LTT:
        this.blt.addClass('show-top-border');
        this.bt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.LTL:
        this.blt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.BRT:
        this.bt.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.BRL:
        this.bl.addClass('show-top-border');
        this.bbr.addClass('show-top-border');
        break;
      case RANGE_OVER_GO.ALL:
        this.blt.addClass('show-top-border');
        this.bt.addClass('show-top-border');
        break;
    }
  }

  showLBorder(overGo) {
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        this.blt.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.L:
        this.bl.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.T:
        this.bt.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.BR:
        this.bbr.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.LTT:
        this.blt.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.LTL:
        this.blt.addClass('show-left-border');
        this.bl.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.BRT:
        this.bt.addClass('show-left-border');
        this.bbr.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.BRL:
        this.bl.addClass('show-left-border');
        break;
      case RANGE_OVER_GO.ALL:
        this.blt.addClass('show-left-border');
        this.bl.addClass('show-left-border');
        break;
    }
  }

  showRBorder(overGo) {
    switch (overGo) {
      case RANGE_OVER_GO.LT:
        this.blt.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.L:
        this.bl.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.T:
        this.bt.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.BR:
        this.bbr.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.LTT:
        this.bt.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.LTL:
        this.blt.addClass('show-right-border');
        this.bl.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.BRT:
        this.bt.addClass('show-right-border');
        this.bbr.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.BRL:
        this.br.addClass('show-right-border');
        break;
      case RANGE_OVER_GO.ALL:
        this.bt.addClass('show-right-border');
        this.bbr.addClass('show-right-border');
        break;
    }
  }

}

export {
  XScreenBorderItem, RANGE_OVER_GO,
};
