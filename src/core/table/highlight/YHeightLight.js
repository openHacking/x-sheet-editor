import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { RectRange } from '../RectRange';
import { Utils } from '../../../utils/Utils';
import { ScreenSelector } from '../selector/ScreenSelector';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';

class YHeightLight extends Widget {
  constructor(table) {
    super(`${cssPrefix}-table-y-height-light`);
    this.table = table;
    this.hide();
  }

  init() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    this.css('width', `${index.width}px`);
    this.bind();
  }

  disjoint(sRect, tRect) {
    return sRect.sri > tRect.eri || tRect.sri > sRect.eri;
  }

  coincide(sRect, tRect) {
    if (this.disjoint(sRect, tRect)) {
      return new RectRange(-1, 0, -1, 0);
    }
    return new RectRange(
      tRect.sri > sRect.sri ? tRect.sri : sRect.sri,
      0,
      tRect.eri < sRect.eri ? tRect.eri : sRect.eri,
      0,
    );
  }

  offsetHeightLight(selectorAttr, intersectsArea) {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const empty = new RectRange(-1, 0, -1, 0);
    this.hide();
    if (Utils.arrayEqual(intersectsArea, ['lt'])) {
      const { rect } = selectorAttr;
      const { frozenLeftTop, rows } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = this.coincide(rect, ltViewRange);
      if (!empty.equals(ltCoincideRange)) {
        const height = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
        const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1) + index.height;
        this.offset({
          height,
          top,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['t'])) {
      const { rect } = selectorAttr;
      const { fixedTop, rows } = table;
      const tViewRange = fixedTop.getViewRange();
      const tCoincideRange = this.coincide(rect, tViewRange);
      // console.log('tCoincideRange>>>', tCoincideRange);
      if (!empty.equals(tCoincideRange)) {
        const height = rows.sectionSumHeight(tCoincideRange.sri, tCoincideRange.eri);
        const top = rows.sectionSumHeight(tViewRange.sri, tCoincideRange.sri - 1) + index.height;
        // console.log('height>>>', height);
        // console.log('top>>>', top);
        this.offset({
          height,
          top,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['l'])) {
      const { rect } = selectorAttr;
      const { fixedLeft, rows } = table;
      const lViewRange = fixedLeft.getViewRange();
      const lCoincideRange = this.coincide(rect, lViewRange);
      if (!empty.equals(lCoincideRange)) {
        const height = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
        const top = rows.sectionSumHeight(lViewRange.sri, lCoincideRange.sri - 1)
          + table.getFixedHeight() + index.height;
        this.offset({
          height,
          top,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['br'])) {
      const { rect } = selectorAttr;
      const { content, rows } = table;
      const cViewRange = content.getViewRange();
      const cCoincideRange = this.coincide(rect, cViewRange);
      // console.log('cCoincideRange>>>', cCoincideRange);
      if (!empty.equals(cCoincideRange)) {
        const height = rows.sectionSumHeight(cCoincideRange.sri, cCoincideRange.eri);
        const top = rows.sectionSumHeight(cViewRange.sri, cCoincideRange.sri - 1)
          + table.getFixedHeight() + index.height;
        // console.log('height>>>', height);
        // console.log('top>>>', top);
        this.offset({
          height,
          top,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 't'])) {
      const { rect } = selectorAttr;
      const { frozenLeftTop, rows } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = this.coincide(rect, ltViewRange);
      if (!empty.equals(ltCoincideRange)) {
        const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1) + index.height;
        const height = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
        this.offset({
          height,
          top,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 'l'])) {
      const { rect } = selectorAttr;
      const { frozenLeftTop, fixedLeft, rows } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const lViewRange = fixedLeft.getViewRange();
      const ltCoincideRange = this.coincide(rect, ltViewRange);
      const lCoincideRange = this.coincide(rect, lViewRange);
      const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1) + index.height;
      let height = 0;
      if (!empty.equals(ltCoincideRange)) {
        height += rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
      }
      if (!empty.equals(lCoincideRange)) {
        height += rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
      }
      this.offset({
        height,
        top,
      }).show();
    } else if (Utils.arrayEqual(intersectsArea, ['t', 'br'])) {
      const { rect } = selectorAttr;
      const { fixedTop, content, rows } = table;
      const tViewRange = fixedTop.getViewRange();
      const cViewRange = content.getViewRange();
      const tCoincideRange = this.coincide(rect, tViewRange);
      const cCoincideRange = this.coincide(rect, cViewRange);
      const top = rows.sectionSumHeight(tViewRange.sri, tCoincideRange.sri - 1) + index.height;
      let height = 0;
      if (!empty.equals(tCoincideRange)) {
        height += rows.sectionSumHeight(tCoincideRange.sri, tCoincideRange.eri);
      }
      if (!empty.equals(cCoincideRange)) {
        height += rows.sectionSumHeight(cCoincideRange.sri, cCoincideRange.eri);
      }
      // console.log('tCoincideRange>>>', tCoincideRange);
      // console.log('cCoincideRange>>>', cCoincideRange);
      // console.log('top>>>', top);
      // console.log('height>>>', height);
      this.offset({
        height,
        top,
      }).show();
    } else if (Utils.arrayEqual(intersectsArea, ['l', 'br'])) {
      const { rect } = selectorAttr;
      const { fixedLeft, rows } = table;
      const lViewRange = fixedLeft.getViewRange();
      const lCoincideRange = this.coincide(rect, lViewRange);
      if (!empty.equals(lCoincideRange)) {
        const height = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
        const top = rows.sectionSumHeight(lViewRange.sri, lCoincideRange.sri - 1)
          + table.getFixedHeight() + index.height;
        this.offset({
          height,
          top,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 't', 'l', 'br'])) {
      const { rect } = selectorAttr;
      const { frozenLeftTop, fixedLeft, rows } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const lViewRange = fixedLeft.getViewRange();
      const ltCoincideRange = this.coincide(rect, ltViewRange);
      const lCoincideRange = this.coincide(rect, lViewRange);
      let height = 0;
      const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1) + index.height;
      if (!empty.equals(ltCoincideRange)) {
        height += rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
      }
      if (!empty.equals(lCoincideRange)) {
        height += rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
      }
      this.offset({
        height,
        top,
      }).show();
    }
  }

  bind() {
    const { table } = this;
    const { screen } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    screenSelector.addChangeCb(() => {
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        const intersectsArea = screenSelector.getIntersectsArea(selectorAttr);
        this.offsetHeightLight(selectorAttr, intersectsArea);
      }
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        const intersectsArea = screenSelector.getIntersectsArea(selectorAttr);
        this.offsetHeightLight(selectorAttr, intersectsArea);
      }
    });
  }
}

export { YHeightLight };
