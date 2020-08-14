import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { h } from '../../lib/Element';
import { EventBind } from '../../utils/EventBind';
import { ScreenSelector } from './screenwiget/selector/ScreenSelector';
import { Utils } from '../../utils/Utils';
import { RectRange } from './tablebase/RectRange';

class XTableEdit extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-edit`);
    this.input = h('div', `${cssPrefix}-table-edit-input`);
    this.input.attr('contenteditable', true);
    this.input.html('<p>&nbsp;</p>');
    this.table = table;
    this.text = '';
    this.select = null;
    this.children(this.input);
  }

  onAttach() {
    this.bind();
    this.hide();
  }

  bind() {
    const { table } = this;
    const { screenSelector } = table;
    const selector = screenSelector;
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      e.stopPropagation();
    });
    EventBind.bind(this.input, Constant.SYSTEM_EVENT_TYPE.INPUT, () => {
      const { input } = this;
      if (Utils.isBlank(this.input.text())) {
        input.html('<p>&nbsp;</p>');
      }
      this.text = input.text();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.hideEdit();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.hideEdit();
    });
    EventBind.dbClick([
      selector.lt,
      selector.t,
      selector.l,
      selector.br,
    ], () => {
      this.showEdit();
    });
  }

  showEdit() {
    const { table, input } = this;
    const { screen } = table;
    const cells = table.getTableCells();
    const selector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = selector;
    if (selectorAttr) {
      const { rect } = selectorAttr;
      const cell = cells.getCellOrNew(rect.sri, rect.sci);
      this.select = rect;
      this.editOffset(rect);
      this.text = cell.text;
      this.input.attr('style', cell.toCssStyle());
      if (Utils.isBlank(this.text)) {
        input.html('<p>&nbsp;</p>');
      } else {
        input.text(this.text);
      }
      Utils.keepLastIndex(this.input.el);
    }
  }

  hideEdit() {
    const { select } = this;
    const { table } = this;
    const cells = table.getTableCells();
    const tableDataSnapshot = table.getTableDataSnapshot();
    const { cellDataProxy } = tableDataSnapshot;
    if (select) {
      const origin = cells.getCellOrNew(select.sri, select.sci);
      const cell = origin.clone();
      const text = Utils.trim(this.text);
      if (cell.text !== text) {
        tableDataSnapshot.begin();
        cell.text = text;
        cellDataProxy.setCell(select.sri, select.sci, cell);
        tableDataSnapshot.end();
        table.render();
      }
      this.select = null;
    }
    this.hide();
  }

  editOffset() {
    const { table } = this;
    const { screen } = table;
    const selector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = selector;
    const { rect } = selectorAttr;
    const { cols, rows } = table;
    const offset = 3;
    const intersectsArea = selector.getIntersectsArea(selectorAttr);
    switch (intersectsArea) {
      case 'lt': {
        const { xTableFrozenContent } = table;
        const viewRange = xTableFrozenContent.getScrollView();
        const coincideRange = rect.coincide(viewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(coincideRange)) {
          this.hide();
          return;
        }
        const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci) - offset * 2;
        const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri) - offset * 2;
        let top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
        let left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
        top += table.getIndexHeight() + offset;
        left += table.getIndexWidth() + offset;
        this.offset({
          width,
          height,
          top,
          left,
        }).show();
        break;
      }
      case 't': {
        const { xTop } = table;
        const viewRange = xTop.getScrollView();
        const coincideRange = rect.coincide(viewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(coincideRange)) {
          this.hide();
          return;
        }
        const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci) - offset * 2;
        const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri) - offset * 2;
        let top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
        let left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
        top += table.getIndexHeight() + offset;
        left += table.getFixedWidth() + table.getIndexWidth() + offset;
        this.offset({
          width,
          height,
          top,
          left,
        }).show();
        break;
      }
      case 'br': {
        const viewRange = table.getScrollView();
        const coincideRange = rect.coincide(viewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(coincideRange)) {
          this.hide();
          return;
        }
        const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci) - offset * 2;
        const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri) - offset * 2;
        let top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
        let left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
        top += table.getFixedHeight() + table.getIndexHeight() + offset;
        left += table.getFixedWidth() + table.getIndexWidth() + offset;
        this.offset({
          width,
          height,
          top,
          left,
        }).show();
        break;
      }
      case 'l': {
        const { xLeft } = table;
        const viewRange = xLeft.getScrollView();
        const coincideRange = rect.coincide(viewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(coincideRange)) {
          this.hide();
          return;
        }
        const width = cols.sectionSumWidth(coincideRange.sci, coincideRange.eci) - offset * 2;
        const height = rows.sectionSumHeight(coincideRange.sri, coincideRange.eri) - offset * 2;
        let top = rows.sectionSumHeight(viewRange.sri, coincideRange.sri - 1);
        let left = cols.sectionSumWidth(viewRange.sci, coincideRange.sci - 1);
        top += table.getFixedHeight() + table.getIndexHeight() + offset;
        left += table.getIndexWidth() + offset;
        this.offset({
          width,
          height,
          top,
          left,
        }).show();
        break;
      }
      case 'ltt': {
        const { xTableFrozenContent, xTop } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const ltCoincideRange = rect.coincide(ltViewRange);
        const tViewRange = xTop.getScrollView();
        const tCoincideRange = rect.coincide(tViewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(tCoincideRange) && empty.equals(ltCoincideRange)) {
          this.hide();
          return;
        }
        const ltWidth = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
        const ltHeight = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
        const ltTop = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1);
        const ltLeft = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1);
        const tWidth = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
        this.offset({
          width: (ltWidth + tWidth) - offset * 2,
          height: ltHeight - offset * 2,
          top: ltTop + table.getIndexHeight() + offset,
          left: ltLeft + table.getIndexWidth() + offset,
        }).show();
        break;
      }
      case 'ltl': {
        const { xTableFrozenContent, xLeft } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const ltCoincideRange = rect.coincide(ltViewRange);
        const lViewRange = xLeft.getScrollView();
        const lCoincideRange = rect.coincide(lViewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(ltCoincideRange) && empty.equals(lCoincideRange)) {
          this.hide();
          return;
        }
        const ltWidth = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
        const ltHeight = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
        const lHeight = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
        let ltTop = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1);
        let ltLeft = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1);
        ltTop += table.getIndexHeight() + offset;
        ltLeft += table.getIndexWidth() + offset;
        this.offset({
          width: ltWidth - offset * 2,
          height: (ltHeight + lHeight) - offset * 2,
          top: ltTop,
          left: ltLeft,
        }).show();
        break;
      }
      case 'tbr': {
        const { xTop } = table;
        const cViewRange = table.getScrollView();
        const cCoincideRange = rect.coincide(cViewRange);
        const tViewRange = xTop.getScrollView();
        const tCoincideRange = rect.coincide(tViewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(cCoincideRange) && empty.equals(tCoincideRange)) {
          this.hide();
          return;
        }
        const tWidth = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
        const tHeight = rows.sectionSumHeight(tCoincideRange.sri, tCoincideRange.eri);
        const tTop = rows.sectionSumHeight(tViewRange.sri, tCoincideRange.sri - 1);
        const tLeft = cols.sectionSumWidth(tViewRange.sci, tCoincideRange.sci - 1);
        const cHeight = rows.sectionSumHeight(cCoincideRange.sri, cCoincideRange.eri);
        this.offset({
          width: tWidth - offset * 2,
          height: (cHeight + tHeight) - offset * 2,
          top: tTop + table.getIndexHeight() + offset,
          left: tLeft + table.getFixedWidth() + table.getIndexWidth() + offset,
        }).show();
        break;
      }
      case 'lbr': {
        const { xLeft } = table;
        const cViewRange = table.getScrollView();
        const cCoincideRange = rect.coincide(cViewRange);
        const lViewRange = xLeft.getScrollView();
        const lCoincideRange = rect.coincide(lViewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(cCoincideRange) && empty.equals(lCoincideRange)) {
          this.hide();
          return;
        }
        const lWidth = cols.sectionSumWidth(lCoincideRange.sci, lCoincideRange.eci);
        const lHeight = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
        const lTop = rows.sectionSumHeight(lViewRange.sri, lCoincideRange.sri - 1);
        const lLeft = cols.sectionSumWidth(lViewRange.sci, lCoincideRange.sci - 1);
        const cWidth = cols.sectionSumWidth(cCoincideRange.sci, cCoincideRange.eci);
        this.offset({
          width: (lWidth + cWidth) - offset * 2,
          height: lHeight - offset * 2,
          top: lTop + table.getFixedHeight() + table.getIndexHeight() + offset,
          left: lLeft + table.getIndexWidth() + offset,
        }).show();
        break;
      }
      case 'lttlbr': {
        const { xTableFrozenContent } = table;
        const ltViewRange = xTableFrozenContent.getScrollView();
        const ltCoincideRange = rect.coincide(ltViewRange);
        const { xTop } = table;
        const tViewRange = xTop.getScrollView();
        const tCoincideRange = rect.coincide(tViewRange);
        const { xLeft } = table;
        const lViewRange = xLeft.getScrollView();
        const lCoincideRange = rect.coincide(lViewRange);
        const empty = new RectRange(-1, -1, -1, -1);
        if (empty.equals(ltCoincideRange)
          && empty.equals(tCoincideRange)
          && empty.equals(lCoincideRange)) {
          this.hide();
          return;
        }
        const ltWidth = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
        const ltHeight = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
        const tWidth = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
        const lHeight = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
        const top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1);
        const left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1);
        this.offset({
          width: (ltWidth + tWidth) - offset * 2,
          height: (ltHeight + lHeight) - offset * 2,
          top: top + table.getIndexHeight() + offset,
          left: left + table.getIndexWidth() + offset,
        }).show();
        break;
      }
      default: break;
    }
  }
}

export {
  XTableEdit,
};