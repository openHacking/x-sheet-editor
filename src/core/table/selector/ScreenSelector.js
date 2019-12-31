import { Selector } from './Selector';
import { Constant } from '../../../utils/Constant';
import { ScreenWidget } from '../screen/ScreenWidget';
import { EventBind } from '../../../utils/EventBind';
import { RectRange } from '../RectRange';

class ScreenSelector extends ScreenWidget {
  constructor(screen, options = {}) {
    super(screen);
    this.lt = new Selector(options);
    this.t = new Selector(options);
    this.l = new Selector(options);
    this.br = new Selector(options);
    this.bind();
  }

  bind() {
    const { screen } = this;
    const { table } = screen;
    table.on(Constant.EVENT_TYPE.SCROLL, () => {
      this.setOffset();
    });
    table.on(Constant.EVENT_TYPE.MOUSE_DOWN, (e1) => {
      const { x, y } = table.computeEventXy(e1);
      const downSelectorAttr = this.getXYSelectorAttr(x, y);
      EventBind.mouseMoveUp(table, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        const moveSelectorAttr = this.getXYSelectorAttr(x, y);
        const { ri: dri, ci: dci } = downSelectorAttr;
        const { ri: mri, ci: mci } = moveSelectorAttr;
        const downRectRange = new RectRange(dri, dci, dri, dci);
        const moveRectRange = new RectRange(mri, mci, mri, mci);
        const newRectRange = downRectRange.union(moveRectRange);
      });
      this.selectorAttr = downSelectorAttr;
      this.setOffset();
    });
  }

  setLtOffset() {
    const { selectorAttr } = this;
    if (selectorAttr) {
      const { screen } = this;
      const { table } = screen;
      const { width, height } = selectorAttr;
      const indexWidth = table.getIndexWidth();
      const indexHeight = table.getIndexHeight();
      let { left, top } = selectorAttr;
      left -= indexWidth;
      top -= indexHeight;
      this.lt.offset({
        width,
        height,
        left,
        top,
      }).show();
    }
  }

  setTOffset() {
    const { selectorAttr } = this;
    if (selectorAttr) {
      const { screen } = this;
      const { table } = screen;
      const { width, height } = selectorAttr;
      const scroll = table.getScroll();
      const indexWidth = table.getIndexWidth();
      const indexHeight = table.getIndexHeight();
      const fixedWidth = table.getFixedWidth();
      let { left, top } = selectorAttr;
      left -= indexWidth;
      left -= fixedWidth;
      left -= scroll.x;
      top -= indexHeight;
      this.t.offset({
        width,
        height,
        left,
        top,
      }).show();
    }
  }

  setLOffset() {
    const { selectorAttr } = this;
    if (selectorAttr) {
      const { screen } = this;
      const { table } = screen;
      const { width, height } = selectorAttr;
      let { left, top } = selectorAttr;
      const scroll = table.getScroll();
      const indexWidth = table.getIndexWidth();
      const indexHeight = table.getIndexHeight();
      const fixedHeight = table.getFixedHeight();
      left -= indexWidth;
      top -= indexHeight;
      top -= fixedHeight;
      top -= scroll.y;
      this.l.offset({
        width,
        height,
        left,
        top,
      }).show();
    }
  }

  setBROffset() {
    const { selectorAttr } = this;
    if (selectorAttr) {
      const { screen } = this;
      const { table } = screen;
      const { width, height } = selectorAttr;
      const scroll = table.getScroll();
      const indexWidth = table.getIndexWidth();
      const indexHeight = table.getIndexHeight();
      const fixedHeight = table.getFixedHeight();
      const fixedWidth = table.getFixedWidth();
      let { left, top } = selectorAttr;
      left -= indexWidth;
      left -= fixedWidth;
      left -= scroll.x;
      top -= indexHeight;
      top -= fixedHeight;
      top -= scroll.y;
      this.br.offset({
        width,
        height,
        left,
        top,
      }).show();
    }
  }

  setOffset() {
    this.setLtOffset();
    this.setTOffset();
    this.setLOffset();
    this.setBROffset();
  }

  getXYSelectorAttr(x, y) {
    const { screen } = this;
    const { table } = screen;
    const { merges, cols, rows } = table;
    let { ri, ci } = table.getRiCiByXy(x, y);
    let [top, left, width, height] = [
      table.getRowTop(ri),
      table.getColLeft(ci),
      cols.getWidth(ci),
      rows.getHeight(ri),
    ];
    const rectRange = merges.getFirstIncludes(ri, ci);
    if (rectRange) {
      [ri, ci, top, left, width, height] = [
        rectRange.sri,
        rectRange.sci,
        table.getRowTop(ri),
        table.getColLeft(ci),
        cols.sectionSumWidth(rectRange.sci, rectRange.eci),
        rows.sectionSumHeight(rectRange.sri, rectRange.eri),
      ];
    }
    return {
      ri, ci, left, top, width, height,
    };
  }
}

export { ScreenSelector };
