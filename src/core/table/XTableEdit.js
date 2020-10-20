import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { h } from '../../lib/Element';
import { XEvent } from '../../lib/XEvent';
import { PlainUtils } from '../../utils/PlainUtils';
import { XSelectItem } from './xscreenitems/xselect/XSelectItem';
import { BaseFont } from '../../canvas/font/BaseFont';

class XTableEdit extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-edit`);
    this.table = table;
    this.text = PlainUtils.EMPTY;
    this.input = h('div', `${cssPrefix}-table-edit-input`);
    this.input.attr('contenteditable', true);
    this.input.html(XTableEdit.EMPTY);
    this.cell = null;
    this.select = null;
    this.children(this.input);
  }

  onAttach() {
    this.bind();
    this.hide();
  }

  unbind() {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    XEvent.bind(table);
    XEvent.unbind([
      xSelect.lt,
      xSelect.t,
      xSelect.l,
      xSelect.br,
    ]);
  }

  bind() {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      e.stopPropagation();
    });
    XEvent.bind(this.input, Constant.SYSTEM_EVENT_TYPE.INPUT, () => {
      const { input } = this;
      if (PlainUtils.isBlank(this.input.text())) {
        input.html(XTableEdit.EMPTY);
      }
      this.text = input.text();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.hideEdit();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.hideEdit();
    });
    XEvent.dbClick([
      xSelect.lt,
      xSelect.t,
      xSelect.l,
      xSelect.br,
    ], () => {
      this.showEdit();
    });
  }

  showEdit() {
    const { table, input } = this;
    const cells = table.getTableCells();
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    this.show();
    if (selectRange) {
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      this.input.attr('style', cell.toCssStyle());
      this.cell = cell;
      this.select = selectRange;
      this.editOffset();
      this.text = cell.text;
      if (PlainUtils.isBlank(this.text)) {
        input.html(XTableEdit.EMPTY);
      } else {
        input.text(this.text);
      }
      PlainUtils.keepLastIndex(this.input.el);
    }
  }

  hideEdit() {
    const { select } = this;
    const { table } = this;
    const cells = table.getTableCells();
    const { tableDataSnapshot } = table;
    const { cellDataProxy } = tableDataSnapshot;
    this.hide();
    if (select) {
      const origin = cells.getCellOrNew(select.sri, select.sci);
      const cell = origin.clone();
      const text = PlainUtils.trim(this.text);
      if (cell.text !== text) {
        tableDataSnapshot.begin();
        cell.text = text;
        cellDataProxy.setCell(select.sri, select.sci, cell);
        tableDataSnapshot.end();
        table.render();
      }
      this.select = null;
    }
  }

  editOffset() {
    const { table, cell } = this;
    const {
      xHeightLight, yHeightLight,
    } = table;
    const { fontAttr, contentWidth } = cell;
    const { align } = fontAttr;
    const top = yHeightLight.getTop() + table.getIndexHeight() + 3;
    const left = xHeightLight.getLeft() + table.getIndexWidth() + 3;
    const width = xHeightLight.getWidth() - 7;
    const height = yHeightLight.getHeight() - 7;
    this.input.css('float', 'none');
    if (align === BaseFont.ALIGN.right) {
      if (contentWidth && contentWidth > width) {
        this.input.css('float', 'right');
      }
    }
    this.offset({
      top, left, height, width,
    });
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

XTableEdit.EMPTY = '<p>&nbsp;</p>';

export {
  XTableEdit,
};
