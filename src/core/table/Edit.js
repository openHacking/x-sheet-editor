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
    const { screen } = table;
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
        table.setCell(selectRect.sri, selectRect.sci, {
          text,
        });
      }
      if (selectorAttr) {
        const { rect } = selectorAttr;
        selectRect = rect;
      }
      this.hide();
      editModel = false;
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
            this.input.text(text);
          }
          this.input.focus();
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
    if (Utils.arrayEqual(intersectsArea, ['lt'])) {
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
    } else if (Utils.arrayEqual(intersectsArea, ['t'])) {
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
    } else if (Utils.arrayEqual(intersectsArea, ['br'])) {
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
    } else if (Utils.arrayEqual(intersectsArea, ['l'])) {
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
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 't'])) {
      // console.log('lt t');
      const { frozenLeftTop, fixedTop } = table;

      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);

      const tViewRange = fixedTop.getViewRange();
      const tCoincideRange = rect.coincide(tViewRange);

      const ltWidth = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci) - offset * 2;
      const ltHeight = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri) - offset * 2;
      let ltTop = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1);
      let ltLeft = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1);

      const tWidth = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci) - offset * 2;
      const tHeight = rows.sectionSumHeight(tCoincideRange.sri, tCoincideRange.eri) - offset * 2;


      ltTop += table.getIndexHeight() + offset;
      ltLeft += table.getIndexWidth() + offset;

      this.offset({
        width: ltWidth + tWidth,
        height: ltHeight + tHeight,
        top: ltTop,
        left: ltLeft,
      }).show();
    } else if (Utils.arrayEqual(intersectsArea, ['t', 'br'])) {
      // console.log('t, br');
      const { content, fixedTop } = table;

      const cViewRange = content.getViewRange();
      const cCoincideRange = rect.coincide(cViewRange);

      const tViewRange = fixedTop.getViewRange();
      const tCoincideRange = rect.coincide(tViewRange);

      const cWidth = cols.sectionSumWidth(cCoincideRange.sci, cCoincideRange.eci) - offset * 2;
      const cHeight = rows.sectionSumHeight(cCoincideRange.sri, cCoincideRange.eri) - offset * 2;

      const tWidth = cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci) - offset * 2;
      const tHeight = rows.sectionSumHeight(tCoincideRange.sri, tCoincideRange.eri) - offset * 2;
      let tTop = rows.sectionSumHeight(tViewRange.sri, tCoincideRange.sri - 1);
      let tLeft = cols.sectionSumWidth(tViewRange.sci, tCoincideRange.sci - 1);

      tTop += table.getIndexHeight() + offset;
      tLeft += table.getFixedWidth() + table.getIndexWidth() + offset;

      this.offset({
        width: cWidth + tWidth,
        height: cHeight + tHeight,
        top: tTop,
        left: tLeft,
      }).show();
    } else if (Utils.arrayEqual(intersectsArea, ['br', 'l'])) {
      // console.log('br, l');
      const { content, fixedLeft } = table;

      const cViewRange = content.getViewRange();
      const cCoincideRange = rect.coincide(cViewRange);

      const lViewRange = fixedLeft.getViewRange();
      const lCoincideRange = rect.coincide(lViewRange);

      const cWidth = cols.sectionSumWidth(cCoincideRange.sci, cCoincideRange.eci) - offset * 2;
      const cHeight = rows.sectionSumHeight(cCoincideRange.sri, cCoincideRange.eri) - offset * 2;

      const lWidth = cols.sectionSumWidth(lCoincideRange.sci, lCoincideRange.eci) - offset * 2;
      const lHeight = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri) - offset * 2;
      let lTop = rows.sectionSumHeight(lViewRange.sri, lCoincideRange.sri - 1);
      let lLeft = cols.sectionSumWidth(lViewRange.sci, lCoincideRange.sci - 1);

      lTop += table.getFixedHeight() + table.getIndexHeight() + offset;
      lLeft += table.getIndexWidth() + offset;

      this.offset({
        width: cWidth + lWidth,
        height: cHeight + lHeight,
        top: lTop,
        left: lLeft,
      }).show();
    } else if (Utils.arrayEqual(intersectsArea, ['l', 'lt'])) {
      // console.log('l, lt');
      const { frozenLeftTop, fixedLeft } = table;

      const ltViewRange = frozenLeftTop.getViewRange();
      const ltCoincideRange = rect.coincide(ltViewRange);

      const lViewRange = fixedLeft.getViewRange();
      const lCoincideRange = rect.coincide(lViewRange);

      const ltWidth = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci) - offset * 2;
      const ltHeight = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri) - offset * 2;
      let ltTop = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1);
      let ltLeft = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1);

      const lWidth = cols.sectionSumWidth(lCoincideRange.sci, lCoincideRange.eci) - offset * 2;
      const lHeight = rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri) - offset * 2;

      ltTop += table.getIndexHeight() + offset;
      ltLeft += table.getIndexWidth() + offset;

      this.offset({
        width: ltWidth + lWidth,
        height: ltHeight + lHeight,
        top: ltTop,
        left: ltLeft,
      }).show();
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 't', 'br', 'l'])) {
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

      let width = cols.sectionSumWidth(ltCoincideRange.sci, ltCoincideRange.eci);
      let height = rows.sectionSumHeight(ltCoincideRange.sri, ltCoincideRange.eri);
      width += cols.sectionSumWidth(tCoincideRange.sci, tCoincideRange.eci);
      height += rows.sectionSumHeight(lCoincideRange.sri, lCoincideRange.eri);
      width -= offset * 2;
      height -= offset * 2;

      let top = rows.sectionSumHeight(ltViewRange.sri, ltCoincideRange.sri - 1);
      let left = cols.sectionSumWidth(ltViewRange.sci, ltCoincideRange.sci - 1);
      top += table.getIndexHeight() + offset;
      left += table.getIndexWidth() + offset;

      this.offset({
        width,
        height,
        top,
        left,
      }).show();
    }
  }
}

export { Edit };
