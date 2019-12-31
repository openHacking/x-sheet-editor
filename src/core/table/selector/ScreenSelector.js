import { Selector } from './Selector';
import { Constant } from '../../../utils/Constant';
import { ScreenWidget } from '../screen/ScreenWidget';

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
    table.on(Constant.EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { x, y } = table.computeEventXy(e);
      this.selectorAttr = this.getXYSelectorAttr(x, y);
      // console.log('selectorAttr >>>', this.selectorAttr);
      this.setOffset();
    });
    table.on(Constant.EVENT_TYPE.SCROLL, () => {
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
    const {
      merges, cols, rows,
    } = table;
    let { ri, ci } = table.getRiCiByXy(x, y);
    // console.log('ri ci >>>', ri, ci);
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
