import { Utils } from '../../../../utils/Utils';
import { CopyStyle } from './CopyStyle';
import { ScreenWidget } from '../../screen/ScreenWidget';
import { RectRange } from '../../RectRange';
import { EventBind } from '../../../../utils/EventBind';
import { Constant } from '../../../../constant/Constant';
import { Rect } from '../../../../canvas/Rect';

class ScreenCopyStyle extends ScreenWidget {
  constructor(screen, options = {}) {
    super(screen);
    this.options = Utils.mergeDeep({}, options);
    this.lt = new CopyStyle();
    this.t = new CopyStyle();
    this.l = new CopyStyle();
    this.br = new CopyStyle();
    this.selectorAttr = null;
    this.bind();
  }

  setLTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      xTableFrozenContent, cols, rows, grid,
    } = table;
    const viewRange = xTableFrozenContent.getScrollView();
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
      this.lt.mask.css('border-right', 'none');
    } else {
      this.lt.right.show();
      this.lt.mask.cssRemoveKeys('border-right');
    }
    if (rect.eri > viewRange.eri) {
      this.lt.bottom.hide();
      this.lt.mask.css('border-bottom', 'none');
    } else {
      this.lt.bottom.show();
      this.lt.mask.cssRemoveKeys('border-bottom');
    }

    const size = new Rect({
      x: left, y: top, width, height,
    });
    size.expandSize(grid.lineWidth());
    this.lt.offset({
      width: size.width,
      height: size.height,
      left: size.x,
      top: size.y,
    }).show();
  }

  setTOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      xTop, cols, rows, grid,
    } = table;
    const viewRange = xTop.getScrollView();
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
      this.t.mask.css('border-left', 'none');
    } else {
      this.t.left.show();
      this.t.mask.cssRemoveKeys('border-left');
    }
    if (rect.eri > viewRange.eri) {
      this.t.bottom.hide();
      this.t.mask.css('border-bottom', 'none');
    } else {
      this.t.bottom.show();
      this.t.mask.cssRemoveKeys('border-bottom');
    }
    if (rect.eci > viewRange.eci) {
      this.t.right.hide();
      this.t.mask.css('border-right', 'none');
    } else {
      this.t.right.show();
      this.t.mask.cssRemoveKeys('border-right');
    }

    const size = new Rect({
      x: left, y: top, width, height,
    });
    size.expandSize(grid.lineWidth());
    this.t.offset({
      width: size.width,
      height: size.height,
      left: size.x,
      top: size.y,
    }).show();
  }

  setLOffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      xLeft, cols, rows, grid,
    } = table;
    const viewRange = xLeft.getScrollView();
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
      this.l.mask.css('border-top', 'none');
    } else {
      this.l.top.show();
      this.l.mask.cssRemoveKeys('border-top');
    }
    if (rect.eci > viewRange.eci) {
      this.l.right.hide();
      this.l.mask.css('border-right', 'none');
    } else {
      this.l.right.show();
      this.l.mask.cssRemoveKeys('border-right');
    }
    if (rect.eri > viewRange.eri) {
      this.l.bottom.hide();
      this.l.mask.css('border-bottom', 'none');
    } else {
      this.l.bottom.show();
      this.l.mask.cssRemoveKeys('border-bottom');
    }

    const size = new Rect({
      x: left, y: top, width, height,
    });
    size.expandSize(grid.lineWidth());
    this.l.offset({
      width: size.width,
      height: size.height,
      left: size.x,
      top: size.y,
    }).show();
  }

  setBROffset(selectorAttr) {
    const { screen } = this;
    const { table } = screen;
    const {
      cols, rows, grid,
    } = table;
    const viewRange = table.getScrollView();
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
      this.br.mask.css('border-left', 'none');
    } else {
      this.br.left.show();
      this.br.mask.cssRemoveKeys('border-left');
    }
    if (rect.sri < viewRange.sri) {
      this.br.top.hide();
      this.br.mask.css('border-top', 'none');
    } else {
      this.br.top.show();
      this.br.mask.cssRemoveKeys('border-top');
    }
    if (rect.eri > viewRange.eri) {
      this.br.bottom.hide();
      this.br.mask.css('border-bottom', 'none');
    } else {
      this.br.bottom.show();
      this.br.mask.cssRemoveKeys('border-bottom');
    }
    if (rect.eci > viewRange.eci) {
      this.br.right.hide();
      this.br.mask.css('border-right', 'none');
    } else {
      this.br.right.show();
      this.br.mask.cssRemoveKeys('border-right');
    }

    const size = new Rect({
      x: left, y: top, width, height,
    });
    size.expandSize(grid.lineWidth());
    this.br.offset({
      width: size.width,
      height: size.height,
      left: size.x,
      top: size.y,
    }).show();
  }

  setOffset(selectorAttr) {
    this.setLTOffset(selectorAttr);
    this.setTOffset(selectorAttr);
    this.setLOffset(selectorAttr);
    this.setBROffset(selectorAttr);
  }

  bind() {
    const { screen } = this;
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
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, (e) => {
      if (this.selectorAttr) {
        this.setOffset(this.selectorAttr);
      }
    });
  }

  setShow(selectorAttr) {
    this.selectorAttr = selectorAttr;
    this.setOffset(selectorAttr);
  }

  setHide() {
    this.selectorAttr = null;
    this.lt.hide();
    this.t.hide();
    this.l.hide();
    this.br.hide();
  }
}

export { ScreenCopyStyle };
