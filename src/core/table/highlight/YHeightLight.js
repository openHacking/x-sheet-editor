import { Widget } from '../../../lib/Widget';
import { cssPrefix, Constant } from '../../../constant/Constant';
import { RectRange } from '../base/RectRange';
import { SCREEN_SELECT_EVENT } from '../screenwiget/selector/ScreenSelector';
import { EventBind } from '../../../utils/EventBind';

class YHeightLight extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-y-height-light`);
    this.table = table;
    this.setSize();
  }

  onAttach() {
    this.bind();
    this.hide();
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

  setChangeSize() {
    const { table } = this;
    const { screenSelector } = table;
    if (!screenSelector) {
      return;
    }
    const { selectorAttr } = screenSelector;
    if (!selectorAttr) {
      return;
    }
    const intersectsArea = screenSelector.getIntersectsArea(selectorAttr);
    this.offsetHeightLight(selectorAttr, intersectsArea);
  }

  setSize() {
    const { table } = this;
    const { index } = table;
    this.css('width', `${index.getWidth()}px`);
  }

  offsetHeightLight(selectorAttr, intersectsArea) {
    const { table } = this;
    const { index } = table;
    const empty = new RectRange(-1, 0, -1, 0);
    this.hide();
    switch (intersectsArea) {
      case 'lt': {
        const { rect } = selectorAttr;
        const { xTableFrozenContent, rows } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const ltCoincideRange = this.coincide(rect, ltViewRange);
        if (!empty.equals(ltCoincideRange)) {
          const height = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
          // eslint-disable-next-line max-len
          const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1)
            + index.getHeight();
          if (`${height}px` !== this.css('height')) {
            this.css('height', `${height}px`);
          }
          if (`${top}px` !== this.css('top')) {
            this.css('top', `${top}px`);
          }
          this.show();
        }
        break;
      }
      case 't': {
        const { rect } = selectorAttr;
        const { xTop, rows } = table;
        const tViewRange = xTop.getScrollView();
        const tCoincideRange = this.coincide(rect, tViewRange);
        // console.log('tCoincideRange>>>', tCoincideRange);
        if (!empty.equals(tCoincideRange)) {
          const height = rows.sectionSumHeight(tCoincideRange.sri, tCoincideRange.eri);
          const top = rows.sectionSumHeight(tViewRange.sri, tCoincideRange.sri - 1)
            + index.getHeight();
          // console.log('height>>>', height);
          // console.log('top>>>', top);
          if (`${height}px` !== this.css('height')) {
            this.css('height', `${height}px`);
          }
          if (`${top}px` !== this.css('top')) {
            this.css('top', `${top}px`);
          }
          this.show();
        }
        break;
      }
      case 'l': {
        const { rect } = selectorAttr;
        const { xLeft, rows } = table;
        const lViewRange = xLeft.getScrollView();
        const lCoincideRange = this.coincide(rect, lViewRange);
        if (!empty.equals(lCoincideRange)) {
          const height = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
          const top = rows.sectionSumHeight(lViewRange.sri, lCoincideRange.sri - 1)
            + table.getFixedHeight() + index.getHeight();
          if (`${height}px` !== this.css('height')) {
            this.css('height', `${height}px`);
          }
          if (`${top}px` !== this.css('top')) {
            this.css('top', `${top}px`);
          }
          this.show();
        }
        break;
      }
      case 'br': {
        const { rect } = selectorAttr;
        const { rows } = table;
        const cViewRange = table.getScrollView();
        const cCoincideRange = this.coincide(rect, cViewRange);
        // console.log('cCoincideRange>>>', cCoincideRange);
        if (!empty.equals(cCoincideRange)) {
          const height = rows.sectionSumHeight(cCoincideRange.sri, cCoincideRange.eri);
          const top = rows.sectionSumHeight(cViewRange.sri, cCoincideRange.sri - 1)
            + table.getFixedHeight() + index.getHeight();
          // console.log('height>>>', height);
          // console.log('top>>>', top);
          if (`${height}px` !== this.css('height')) {
            this.css('height', `${height}px`);
          }
          if (`${top}px` !== this.css('top')) {
            this.css('top', `${top}px`);
          }
          this.show();
        }
        break;
      }
      case 'ltt': {
        const { rect } = selectorAttr;
        const { xTableFrozenContent, rows } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const ltCoincideRange = this.coincide(rect, ltViewRange);
        if (!empty.equals(ltCoincideRange)) {
          // eslint-disable-next-line max-len
          const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1)
            + index.getHeight();
          const height = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
          if (`${height}px` !== this.css('height')) {
            this.css('height', `${height}px`);
          }
          if (`${top}px` !== this.css('top')) {
            this.css('top', `${top}px`);
          }
          this.show();
        }
        break;
      }
      case 'ltl': {
        const { rect } = selectorAttr;
        const { xTableFrozenContent, xLeft, rows } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const lViewRange = xLeft.getScrollView();
        const ltCoincideRange = this.coincide(rect, ltViewRange);
        const lCoincideRange = this.coincide(rect, lViewRange);
        const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1)
          + index.getHeight();
        let height = 0;
        if (!empty.equals(ltCoincideRange)) {
          height += rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
        }
        if (!empty.equals(lCoincideRange)) {
          height += rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
        }
        if (`${height}px` !== this.css('height')) {
          this.css('height', `${height}px`);
        }
        if (`${top}px` !== this.css('top')) {
          this.css('top', `${top}px`);
        }
        this.show();
        break;
      }
      case 'tbr': {
        const { rect } = selectorAttr;
        const { xTop, rows } = table;
        const tViewRange = xTop.getScrollView();
        const cViewRange = table.getScrollView();
        const tCoincideRange = this.coincide(rect, tViewRange);
        const cCoincideRange = this.coincide(rect, cViewRange);
        const top = rows.sectionSumHeight(tViewRange.sri, tCoincideRange.sri - 1)
          + index.getHeight();
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
        if (`${height}px` !== this.css('height')) {
          this.css('height', `${height}px`);
        }
        if (`${top}px` !== this.css('top')) {
          this.css('top', `${top}px`);
        }
        this.show();
        break;
      }
      case 'lbr': {
        const { rect } = selectorAttr;
        const { xLeft, rows } = table;
        const lViewRange = xLeft.getScrollView();
        const lCoincideRange = this.coincide(rect, lViewRange);
        if (!empty.equals(lCoincideRange)) {
          const height = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
          const top = rows.sectionSumHeight(lViewRange.sri, lCoincideRange.sri - 1)
            + table.getFixedHeight() + index.getHeight();
          if (`${height}px` !== this.css('height')) {
            this.css('height', `${height}px`);
          }
          if (`${top}px` !== this.css('top')) {
            this.css('top', `${top}px`);
          }
          this.show();
        }
        break;
      }
      case 'lttlbr': {
        const { rect } = selectorAttr;
        const { xTableFrozenContent, xLeft, rows } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const lViewRange = xLeft.getScrollView();
        const ltCoincideRange = this.coincide(rect, ltViewRange);
        const lCoincideRange = this.coincide(rect, lViewRange);
        let height = 0;
        const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1)
          + index.getHeight();
        if (!empty.equals(ltCoincideRange)) {
          height += rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
        }
        if (!empty.equals(lCoincideRange)) {
          height += rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
        }
        if (`${height}px` !== this.css('height')) {
          this.css('height', `${height}px`);
        }
        if (`${top}px` !== this.css('top')) {
          this.css('top', `${top}px`);
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
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.setChangeSize();
    });
    screenSelector.on(SCREEN_SELECT_EVENT.CHANGE, () => {
      this.setChangeSize();
    });
  }
}

export { YHeightLight };
