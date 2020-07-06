import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../constant/Constant';
import { SCREEN_SELECT_EVENT } from '../screenwiget/selector/ScreenSelector';
import { EventBind } from '../../../utils/EventBind';

import { RectRange } from '../RectRange';

class XHeightLight extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-x-height-light`);

    this.table = table;
    const { settings } = table;
    const { index } = settings;
    this.css('height', `${index.height}px`);
  }

  onAttach() {
    this.bind();
    this.hide();
  }

  disjoint(sRect, tRect) {
    return sRect.sci > tRect.eci || tRect.sci > sRect.eci;
  }

  coincide(sRect, tRect) {
    if (this.disjoint(sRect, tRect)) {
      return new RectRange(0, -1, 0, -1);
    }
    return new RectRange(
      0,
      tRect.sci > sRect.sci ? tRect.sci : sRect.sci,
      0,
      tRect.eci < sRect.eci ? tRect.eci : sRect.eci,
    );
  }

  offsetHeightLight(selectorAttr, intersectsArea) {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    const empty = new RectRange(0, -1, 0, -1);
    this.hide();
    switch (intersectsArea) {
      case 'lt': {
        const { rect } = selectorAttr;
        const { xTableFrozenContent, cols } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const ltCoincideRange = this.coincide(rect, ltViewRange);
        if (!empty.equals(ltCoincideRange)) {
          const width = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
          const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1) + index.width;
          if (`${width}px` !== this.css('width')) {
            this.css('width', `${width}px`);
          }
          if (`${left}px` !== this.css('left')) {
            this.css('left', `${left}px`);
          }
          this.show();
        }
        break;
      }
      case 't': {
        const { rect } = selectorAttr;
        const { xTop, cols } = table;
        const tViewRange = xTop.getScrollView();
        const tCoincideRange = this.coincide(rect, tViewRange);
        if (!empty.equals(tCoincideRange)) {
          const width = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
          const left = cols.sectionSumWidth(tViewRange.sci, tCoincideRange.sci - 1)
            + table.getFixedWidth() + index.width;
          if (`${width}px` !== this.css('width')) {
            this.css('width', `${width}px`);
          }
          if (`${left}px` !== this.css('left')) {
            this.css('left', `${left}px`);
          }
          this.show();
        }
        break;
      }
      case 'br': {
        const { rect } = selectorAttr;
        const { cols } = table;
        const cViewRange = table.getScrollView();
        const cCoincideRange = this.coincide(rect, cViewRange);
        if (!empty.equals(cCoincideRange)) {
          const width = cols.sectionSumWidth(cCoincideRange.sci, cCoincideRange.eci);
          const left = cols.sectionSumWidth(cViewRange.sci, cCoincideRange.sci - 1)
            + table.getFixedWidth() + index.width;
          if (`${width}px` !== this.css('width')) {
            this.css('width', `${width}px`);
          }
          if (`${left}px` !== this.css('left')) {
            this.css('left', `${left}px`);
          }
          this.show();
        }
        break;
      }
      case 'l': {
        const { rect } = selectorAttr;
        const { xLeft, cols } = table;
        const lViewRange = xLeft.getScrollView();
        const lCoincideRange = this.coincide(rect, lViewRange);
        if (!empty.equals(lCoincideRange)) {
          const width = cols.sectionSumWidth(lCoincideRange.sci, lCoincideRange.eci);
          const left = cols.sectionSumWidth(lViewRange.sci, lCoincideRange.sci - 1) + index.width;
          if (`${width}px` !== this.css('width')) {
            this.css('width', `${width}px`);
          }
          if (`${left}px` !== this.css('left')) {
            this.css('left', `${left}px`);
          }
          this.show();
        }
        break;
      }
      case 'ltt': {
        const { rect } = selectorAttr;
        const { xTableFrozenContent, xTop, cols } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const tViewRange = xTop.getScrollView();
        const ltCoincideRange = this.coincide(rect, ltViewRange);
        const tCoincideRange = this.coincide(rect, tViewRange);
        let width = 0;
        const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1) + index.width;
        if (!empty.equals(ltCoincideRange)) {
          width += cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
        }
        if (!empty.equals(tCoincideRange)) {
          width += cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
        }
        if (`${width}px` !== this.css('width')) {
          this.css('width', `${width}px`);
        }
        if (`${left}px` !== this.css('left')) {
          this.css('left', `${left}px`);
        }
        this.show();
        break;
      }
      case 'ltl': {
        const { rect } = selectorAttr;
        const { xTableFrozenContent, cols } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const ltCoincideRange = this.coincide(rect, ltViewRange);
        if (!empty.equals(ltCoincideRange)) {
          const width = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
          const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1) + index.width;
          if (`${width}px` !== this.css('width')) {
            this.css('width', `${width}px`);
          }
          if (`${left}px` !== this.css('left')) {
            this.css('left', `${left}px`);
          }
          this.show();
        }
        break;
      }
      case 'tbr': {
        const { rect } = selectorAttr;
        const { xTop, cols } = table;
        const tViewRange = xTop.getScrollView();
        const tCoincideRange = this.coincide(rect, tViewRange);
        if (!empty.equals(tCoincideRange)) {
          const width = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
          const left = cols.sectionSumWidth(tViewRange.sci, tCoincideRange.sci - 1)
            + table.getFixedWidth() + index.width;
          if (`${width}px` !== this.css('width')) {
            this.css('width', `${width}px`);
          }
          if (`${left}px` !== this.css('left')) {
            this.css('left', `${left}px`);
          }
          this.show();
        }
        break;
      }
      case 'lbr': {
        const { rect } = selectorAttr;
        const { xLeft, cols } = table;
        const lViewRange = xLeft.getScrollView();
        const cViewRange = table.getScrollView();
        const lCoincideRange = this.coincide(rect, lViewRange);
        const cCoincideRange = this.coincide(rect, cViewRange);
        let width = 0;
        const left = cols.sectionSumWidth(lViewRange.sci, lCoincideRange.sci - 1) + index.width;
        if (!empty.equals(lCoincideRange)) {
          width += cols.sectionSumWidth(lCoincideRange.sci, lCoincideRange.eci);
        }
        if (!empty.equals(cCoincideRange)) {
          width += cols.sectionSumWidth(cCoincideRange.sci, cCoincideRange.eci);
        }
        if (`${width}px` !== this.css('width')) {
          this.css('width', `${width}px`);
        }
        if (`${left}px` !== this.css('left')) {
          this.css('left', `${left}px`);
        }
        this.show();
        break;
      }
      case 'lttlbr': {
        const { rect } = selectorAttr;
        const { xTableFrozenContent, xTop, cols } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const tViewRange = xTop.getScrollView();
        const ltCoincideRange = this.coincide(rect, ltViewRange);
        const tCoincideRange = this.coincide(rect, tViewRange);
        let width = 0;
        const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1) + index.width;
        if (!empty.equals(ltCoincideRange)) {
          width += cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
        }
        if (!empty.equals(tCoincideRange)) {
          width += cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
        }
        if (`${width}px` !== this.css('width')) {
          this.css('width', `${width}px`);
        }
        if (`${left}px` !== this.css('left')) {
          this.css('left', `${left}px`);
        }
        this.show();
        break;
      }
      default: break;
    }
  }

  bind() {
    const { table } = this;
    const { screenSelector } = table;
    screenSelector.on(SCREEN_SELECT_EVENT.CHANGE, () => {
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

export { XHeightLight };
