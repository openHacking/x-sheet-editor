
import { Utils } from '../../../utils/Utils';
import { CopyStyle } from './CopyStyle';
import { ScreenWidget } from '../screen/ScreenWidget';
import { RectRange } from '../RectRange';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
import { ScreenSelector } from '../selector/ScreenSelector';

class ScreenCopyStyle extends ScreenWidget {
  constructor(screen, options = {}) {
    super(screen);
    this.options = Utils.mergeDeep({}, options);
    this.lt = new CopyStyle();
    this.t = new CopyStyle();
    this.l = new CopyStyle();
    this.br = new CopyStyle();
    this.onOrOff = false;
    this.selectorAttr = null;
    this.screenSelector = screen.findByClass(ScreenSelector);
    this.bind();
  }

  setLTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { frozenLeftTop, cols, rows } = table;
    const viewRange = frozenLeftTop.getViewRange();
    const { rect } = selectorAttr;

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
      this.lt.right.hide();
    } else {
      this.lt.right.show();
    }
    if (rect.eri > viewRange.eri) {
      this.lt.bottom.hide();
    } else {
      this.lt.bottom.show();
    }

    this.lt.offset({
      width,
      height,
      left,
      top,
    });
    if (this.onOrOff) {
      this.lt.show();
    }
  }

  setTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { fixedTop, cols, rows } = table;
    const viewRange = fixedTop.getViewRange();
    const { rect } = selectorAttr;

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
      this.t.left.hide();
    } else {
      this.t.left.show();
    }
    if (rect.eri > viewRange.eri) {
      this.t.bottom.hide();
    } else {
      this.t.bottom.show();
    }
    if (rect.eci > viewRange.eci) {
      this.t.right.hide();
    } else {
      this.t.right.show();
    }

    this.t.offset({
      width,
      height,
      left,
      top,
    });
    if (this.onOrOff) {
      this.t.show();
    }
  }

  setLOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const { fixedLeft, cols, rows } = table;
    const viewRange = fixedLeft.getViewRange();
    const { rect } = selectorAttr;

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
      this.l.top.hide();
    } else {
      this.l.top.show();
    }
    if (rect.eci > viewRange.eci) {
      this.l.right.hide();
    } else {
      this.l.right.show();
    }
    if (rect.eri > viewRange.eri) {
      this.l.bottom.hide();
    } else {
      this.l.bottom.show();
    }

    this.l.offset({
      width,
      height,
      left,
      top,
    });
    if (this.onOrOff) {
      this.l.show();
    }
  }

  setBROffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      content, cols, rows,
    } = table;
    const viewRange = content.getViewRange();
    const { rect } = selectorAttr;

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
      this.br.left.hide();
    } else {
      this.br.left.show();
    }
    if (rect.sri < viewRange.sri) {
      this.br.top.hide();
    } else {
      this.br.top.show();
    }
    if (rect.eri > viewRange.eri) {
      this.br.bottom.hide();
    } else {
      this.br.bottom.show();
    }
    if (rect.eci > viewRange.eci) {
      this.br.right.hide();
    } else {
      this.br.right.show();
    }

    this.br.offset({
      width,
      height,
      left,
      top,
    });
    if (this.onOrOff) {
      this.br.show();
    }
  }

  setOffset(selectorAttr) {
    this.setLTOffset(selectorAttr);
    this.setTOffset(selectorAttr);
    this.setLOffset(selectorAttr);
    this.setBROffset(selectorAttr);
  }

  bind() {
    const { screen, screenSelector } = this;
    const { table } = screen;
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, (e) => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
      e.stopPropagation();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, (e) => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
      e.stopPropagation();
    });
    screenSelector.addChangeCb(() => {
      if (screenSelector.selectorAttr) {
        this.selectorAttr = screenSelector.selectorAttr;
        this.setOffset(this.selectorAttr);
      }
    });
  }

  setOnOrOff(off) {
    this.onOrOff = off;
  }
}

export { ScreenCopyStyle };
