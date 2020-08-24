import { RectRange } from '../../../tablebase/RectRange';
import { DISPLAY_AREA } from '../../XScreen';
import { XScreenLTPart } from '../../part/XScreenLTPart';
import { XScreenTPart } from '../../part/XScreenTPart';
import { XScreenLPart } from '../../part/XScreenLPart';
import { XScreenBRPart } from '../../part/XScreenBRPart';
import { MeasureItem } from '../MeasureItem';

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

class BorderItem extends MeasureItem {

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

  borderBoundOut(range) {
    const { table } = this;
    const { fixed } = table;
    const {
      fixLeft, fixTop,
    } = fixed;
    const scrollView = table.getScrollView();
    const edge = {
      bottom: false,
      left: false,
      top: false,
      right: false,
    };
    if (fixLeft > -1 && fixTop > -1) {

    } else if (fixLeft > -1) {

    } else if (fixTop > -1) {

    }
  }

  rangeOverGo(range) {
    const { table } = this;
    const { cols, rows } = table;
    const { fixed } = table;
    const { fixTop, fixLeft } = fixed;
    const rowsLen = rows.len - 1;
    const colsLen = cols.len - 1;
    if (fixTop > -1 && fixLeft > -1) {
      const lt = new RectRange(0, 0, fixTop, fixLeft);
      const t = new RectRange(0, fixLeft, fixTop, colsLen);
      const br = new RectRange(fixTop, fixLeft, rowsLen, colsLen);
      const l = new RectRange(fixTop, 0, rowsLen, fixLeft);
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
      const ltt = new RectRange(0, 0, fixTop, colsLen);
      const ltl = new RectRange(0, 0, rowsLen, fixLeft);
      const brt = new RectRange(0, fixLeft, rowsLen, colsLen);
      const brl = new RectRange(fixTop, 0, rowsLen, colsLen);
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
    } if (fixTop > -1) {
      const t = new RectRange(0, 0, fixTop, colsLen);
      const br = new RectRange(fixTop, 0, rowsLen, colsLen);
      if (t.contains(range)) {
        return RANGE_OVER_GO.T;
      }
      if (br.contains(range)) {
        return RANGE_OVER_GO.BR;
      }
      return RANGE_OVER_GO.ALL;
    } if (fixLeft > -1) {
      const br = new RectRange(0, fixLeft, rowsLen, colsLen);
      const l = new RectRange(0, 0, rowsLen, fixLeft);
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
  BorderItem, RANGE_OVER_GO,
};
