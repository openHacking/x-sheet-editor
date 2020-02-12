import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { h } from '../../lib/Element';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';
import { ScreenSelector } from './selector/ScreenSelector';
import { Utils } from '../../utils/Utils';

class Edit extends Widget {
  constructor(table) {
    super(`${cssPrefix}-table-edit`);
    this.input = h('div', `${cssPrefix}-table-edit-input`);
    this.input.attr('contenteditable', true);
    this.input.html('<p>&nbsp;</p>');
    this.table = table;
    this.children(this.input);
    this.hide();
  }

  init() {
    this.bind();
  }

  bind() {
    const { table } = this;
    const { screen, cells } = table;
    const selector = screen.findByClass(ScreenSelector);
    let text = '';
    let selectRect = null;
    let editModel = false;
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      e.stopPropagation();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      e.stopPropagation();
    });
    EventBind.bind(this.input, Constant.SYSTEM_EVENT_TYPE.INPUT, () => {
      if (Utils.isBlank(this.input.text())) {
        this.input.html('<p>&nbsp;</p>');
      }
      text = this.input.text();
    });
    EventBind.bind([
      selector.lt.cornerEl,
      selector.t.cornerEl,
      selector.l.cornerEl,
      selector.br.cornerEl,
      table,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const { selectorAttr } = selector;
      if (editModel) {
        text = Utils.trim(text);
        const cell = cells.getCellOrNew(selectRect.sri, selectRect.sci);
        if (cell.text !== text) {
          table.setCell(selectRect.sri, selectRect.sci, {
            text,
          });
        }
      }
      if (selectorAttr) {
        const { rect } = selectorAttr;
        selectRect = rect;
      }
      this.hide();
      editModel = false;
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.hide();
    });
    EventBind.dbClick(table, () => {
      const { screen } = table;
      const selector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = selector;
      if (selectorAttr && selectRect) {
        const { rect } = selectorAttr;
        const cell = table.getCell(rect.sri, rect.sci);
        if (rect.equals(selectRect)) {
          editModel = true;
          this.editOffset(rect);
          if (cell) {
            ({ text } = cell);
            if (Utils.isBlank(text)) {
              this.input.html('<p>&nbsp;</p>');
            } else {
              this.input.text(text);
            }
            Utils.keepLastIndex(this.input.el);
          }
        }
      }
    });
  }

  editOffset() {
    const { table } = this;
    const { screen } = table;
    const selector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = selector;
    const { rect } = selectorAttr;
    const { cols, rows } = table;
    const offset = 4;
    const intersectsArea = selector.getIntersectsArea(selectorAttr);
    if (Utils.arrayIncludeArray(intersectsArea, ['lt'])) {
      // console.log('lt');
      const { frozenLeftTop } = table;
      const viewRange = frozenLeftTop.getViewRange();
      const coincideRange = rect.coincide(viewRange);

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
    } else if (Utils.arrayIncludeArray(intersectsArea, ['t'])) {
      // console.log('t');
      const { fixedTop } = table;
      const viewRange = fixedTop.getViewRange();
      const coincideRange = rect.coincide(viewRange);

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
    } else if (Utils.arrayIncludeArray(intersectsArea, ['br'])) {
      // console.log('br');
      const { content } = table;
      const viewRange = content.getViewRange();
      const coincideRange = rect.coincide(viewRange);

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
    } else if (Utils.arrayIncludeArray(intersectsArea, ['l'])) {
      // console.log('l');
      const { fixedLeft } = table;
      const viewRange = fixedLeft.getViewRange();
      const coincideRange = rect.coincide(viewRange);

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
    } else if (Utils.arrayIncludeArray(intersectsArea, ['lt', 't'])) {
      // console.log('lt t');
      const { frozenLeftTop, fixedTop } = table;

      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);

      const tViewRange = fixedTop.getViewRange();
      const tCoincideRange = rect.coincide(tViewRange);

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
    } else if (Utils.arrayIncludeArray(intersectsArea, ['t', 'br'])) {
      // console.log('t, br');
      const { content, fixedTop } = table;

      const cViewRange = content.getViewRange();
      const cCoincideRange = rect.coincide(cViewRange);

      const tViewRange = fixedTop.getViewRange();
      const tCoincideRange = rect.coincide(tViewRange);

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
    } else if (Utils.arrayIncludeArray(intersectsArea, ['br', 'l'])) {
      // console.log('br, l');
      const { content, fixedLeft } = table;

      const cViewRange = content.getViewRange();
      const cCoincideRange = rect.coincide(cViewRange);

      const lViewRange = fixedLeft.getViewRange();
      const lCoincideRange = rect.coincide(lViewRange);

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
    } else if (Utils.arrayIncludeArray(intersectsArea, ['l', 'lt'])) {
      // console.log('l, lt');
      const { frozenLeftTop, fixedLeft } = table;

      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);

      const lViewRange = fixedLeft.getViewRange();
      const lCoincideRange = rect.coincide(lViewRange);

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
    } else if (Utils.arrayIncludeArray(intersectsArea, ['lt', 't', 'br', 'l'])) {
      // console.log('lt t br l');
      const { frozenLeftTop } = table;
      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);

      const { fixedTop } = table;
      const tViewRange = fixedTop.getViewRange();
      const tCoincideRange = rect.coincide(tViewRange);

      const { fixedLeft } = table;
      const lViewRange = fixedLeft.getViewRange();
      const lCoincideRange = rect.coincide(lViewRange);

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
    }
  }
}

export { Edit };
