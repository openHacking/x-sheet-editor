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
        selectRect = selectorAttr.rect;
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
    const { screen, settings } = table;
    const selector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = selector;
    const { rect } = selectorAttr;
    const { index } = settings;
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
      left += index.width + offset;
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
      console.log('l');
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 't'])) {
      console.log('lt t');
    } else if (Utils.arrayEqual(intersectsArea, ['t', 'br'])) {
      console.log('t, br');
    } else if (Utils.arrayEqual(intersectsArea, ['br', 'l'])) {
      console.log('br, l');
    } else if (Utils.arrayEqual(intersectsArea, ['l', 'lt'])) {
      console.log('l, lt');
    } else if (Utils.arrayEqual(intersectsArea, ['lt', 't', 'br', 'l'])) {
      console.log('lt t br l');
    }
  }
}

export { Edit };
