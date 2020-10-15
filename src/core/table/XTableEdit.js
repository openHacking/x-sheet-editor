import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { h } from '../../lib/Element';
import { XEvent } from '../../lib/XEvent';
import { PlainUtils } from '../../utils/PlainUtils';
import { XSelectItem } from './xscreenitems/xselect/XSelectItem';

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

  showEdit() {
    const { table, input } = this;
    const cells = table.getTableCells();
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    const { selectRange } = xSelect;
    this.show();
    if (selectRange) {
      const cell = cells.getCellOrNew(selectRange.sri, selectRange.sci);
      this.select = selectRange;
      this.editOffset();
      this.text = cell.text;
      this.input.attr('style', cell.toCssStyle());
      if (PlainUtils.isBlank(this.text)) {
        input.html('<p>&nbsp;</p>');
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
        input.html('<p>&nbsp;</p>');
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

  editOffset() {
    const { table } = this;
    const {
      xHeightLight, yHeightLight,
    } = table;
    this.offset({
      top: yHeightLight.getTop() + table.getIndexHeight() + 3,
      left: xHeightLight.getLeft() + table.getIndexWidth() + 3,
      height: yHeightLight.getHeight() - 7,
      width: xHeightLight.getWidth() - 7,
    });
  }
}

export {
  XTableEdit,
};
