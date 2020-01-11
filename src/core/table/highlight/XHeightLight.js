import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../config';
import { ScreenSelector } from '../selector/ScreenSelector';
import { Utils } from '../../../utils/Utils';
import { EventBind } from '../../../utils/EventBind';
import { Constant } from '../../../utils/Constant';
import { RectRange } from '../RectRange';

class XHeightLight extends Widget {
  constructor(table) {
    super(`${cssPrefix}-table-x-height-light`);
    this.table = table;
  }

  init() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    this.css('height', `${index.height}px`);
    this.bind();
  }

  offsetHeightLight(selectorAttr, intersectsArea) {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const empty = new RectRange(-1, -1, -1, -1);
    this.hide();
    if (Utils.arrayEqual(intersectsArea, ['lt'])) {
      const { rect } = selectorAttr;
      const { frozenLeftTop, cols } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);
      if (!empty.equals(ltCoincideRange)) {
        const width = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
        const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1) + index.width;
        this.offset({
          width,
          left,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['t'])) {
      const { rect } = selectorAttr;
      const { fixedTop, cols } = table;
      const tViewRange = fixedTop.getViewRange();
      const tCoincideRange = rect.coincide(tViewRange);
      if (!empty.equals(tCoincideRange)) {
        const width = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
        const left = cols.sectionSumWidth(tViewRange.sci, tCoincideRange.sci - 1)
          + table.getFixedWidth() + index.width;
        this.offset({
          width,
          left,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['l'])) {
      const { rect } = selectorAttr;
      const { fixedLeft, cols } = table;
      const lViewRange = fixedLeft.getViewRange();
      const lCoincideRange = rect.coincide(lViewRange);
      if (!empty.equals(lCoincideRange)) {
        const width = cols.sectionSumWidth(lCoincideRange.sci, lCoincideRange.eci);
        const left = cols.sectionSumWidth(lViewRange.sci, lCoincideRange.sci - 1) + index.width;
        this.offset({
          width,
          left,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['br'])) {
      const { rect } = selectorAttr;
      const { content, cols } = table;
      const cViewRange = content.getViewRange();
      const cCoincideRange = rect.coincide(cViewRange);
      if (!empty.equals(cCoincideRange)) {
        const width = cols.sectionSumWidth(cCoincideRange.sci, cCoincideRange.eci);
        const left = cols.sectionSumWidth(cViewRange.sci, cCoincideRange.sci - 1)
          + table.getFixedWidth() + index.width;
        this.offset({
          width,
          left,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 't'])) {
      const { rect } = selectorAttr;
      const { frozenLeftTop, fixedTop, cols } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const tViewRange = fixedTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);
      const tCoincideRange = rect.coincide(tViewRange);
      let width = 0;
      const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1) + index.width;
      if (!empty.equals(ltCoincideRange)) {
        width += cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
      }
      if (!empty.equals(tCoincideRange)) {
        width += cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
      }
      this.offset({
        width,
        left,
      }).show();
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 'l'])) {
      const { rect } = selectorAttr;
      const { frozenLeftTop, cols } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);
      if (!empty.equals(ltCoincideRange)) {
        const width = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
        const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1) + index.width;
        this.offset({
          width,
          left,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['t', 'br'])) {
      const { rect } = selectorAttr;
      const { fixedTop, cols } = table;
      const tViewRange = fixedTop.getViewRange();
      const tCoincideRange = rect.coincide(tViewRange);
      if (!empty.equals(tCoincideRange)) {
        const width = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
        const left = cols.sectionSumWidth(tViewRange.sci, tCoincideRange.sci - 1)
          + table.getFixedWidth() + index.width;
        this.offset({
          width,
          left,
        }).show();
      }
    } else if (Utils.arrayEqual(intersectsArea, ['l', 'br'])) {
      const { rect } = selectorAttr;
      const { fixedLeft, content, cols } = table;
      const lViewRange = fixedLeft.getViewRange();
      const cViewRange = content.getViewRange();
      const lCoincideRange = rect.coincide(lViewRange);
      const cCoincideRange = rect.coincide(cViewRange);
      let width = 0;
      const left = cols.sectionSumWidth(lViewRange.sci, lCoincideRange.sci - 1) + index.width;
      if (!empty.equals(lCoincideRange)) {
        width += cols.sectionSumWidth(lCoincideRange.sci, lCoincideRange.eci);
      }
      if (!empty.equals(cCoincideRange)) {
        width += cols.sectionSumWidth(cCoincideRange.sci, cCoincideRange.eci);
      }
      this.offset({
        width,
        left,
      }).show();
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 't', 'l', 'br'])) {
      const { rect } = selectorAttr;
      const { frozenLeftTop, fixedTop, cols } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const tViewRange = fixedTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);
      const tCoincideRange = rect.coincide(tViewRange);
      let width = 0;
      const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1) + index.width;
      if (!empty.equals(ltCoincideRange)) {
        width += cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
      }
      if (!empty.equals(tCoincideRange)) {
        width += cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
      }
      this.offset({
        width,
        left,
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
    EventBind.bind(table, Constant.EVENT_TYPE.SCROLL, () => {
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        const intersectsArea = screenSelector.getIntersectsArea(selectorAttr);
        this.offsetHeightLight(selectorAttr, intersectsArea);
      }
    });
  }
}

export { XHeightLight };
