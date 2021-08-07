import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';
import { Cell } from '../tablecell/Cell';
import { TextEdit } from './TextEdit';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XEvent } from '../../../lib/XEvent';
import { BaseEdit } from './BaseEdit';
import { Constant } from '../../../const/Constant';
import { BaseFont } from '../../../draw/font/BaseFont';

/**
 * TableEdit
 */
class TableEdit extends TextEdit {

  /**
   * TableEdit
   * @param table
   */
  constructor({
    table,
  }) {
    super({
      table,
    });
    this.activeCell = null;
    this.selectRange = null;
    this.closeClickHandle = XEvent.WrapFuncion.mouseClick((event) => {
      if (this.mode === BaseEdit.MODE.SHOW) {
        this.close(event);
      }
    });
    this.openClickHandle = XEvent.WrapFuncion.doubleClick((event) => {
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const merges = table.getTableMerges();
      const { selectRange } = xSelect;
      const { sri, sci } = selectRange;
      if (!selectRange.multiple() || merges.getFirstIncludes(sri, sci)) {
        this.open(event);
      }
    });
  }

  /**
   * 解绑事件处理
   */
  unbind() {}

  /**
   * 绑定事件处理
   */
  bind() {
    const { openClickHandle } = this;
    const { closeClickHandle } = this;
    const { table } = this;
    const { keyboard } = table;
    keyboard.register({
      target: this,
      response: [{
        keyCode: keyCode => keyCode === 1813,
        handle: () => {
          this.insertBreak();
        },
      }],
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      event.stopPropagation();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.INPUT, (event) => {
      const { activeCell } = this;
      const { fontAttr } = activeCell;
      const { align } = fontAttr;
      if (align === BaseFont.ALIGN.center) {
        this.local();
      }
      table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_INPUT, {
        native: event, table, edit: this,
      });
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (event) => {
      event.stopPropagation();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, (event) => {
      this.close(event);
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, openClickHandle);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, closeClickHandle);
  }

  /**
   * 打开编辑器
   * @returns {BaseEdit}
   */
  open(event) {
    let { throttle, table } = this;
    let cells = table.getTableCells();
    let { xScreen } = table;
    if (table.isReadOnly()) {
      return this;
    }
    let xSelect = xScreen.findType(XSelectItem);
    let { selectRange } = xSelect;
    let { sri, sci } = selectRange;
    let activeCell = cells.getCellOrNew(sri, sci);
    let { contentType } = activeCell;
    if (activeCell.hasFormula()) {
      let html = this.formulaTextToHtml(activeCell);
      this.html(html);
    } else {
      switch (contentType) {
        case Cell.TYPE.STRING:
        case Cell.TYPE.NUMBER:
        case Cell.TYPE.DATE_TIME: {
          let html = this.cellTextToHtml(activeCell);
          this.html(html);
          break;
        }
        case Cell.TYPE.RICH_TEXT: {
          let html = this.richTextToHtml(activeCell);
          this.html(html);
          break;
        }
      }
    }
    this.activeCell = activeCell;
    this.selectRange = selectRange;
    super.open({
      edit: this,
      table,
      native: event,
    });
    throttle.action(() => {
      this.focus();
      SheetUtils.keepLastIndex(this.el);
    });
    return this;
  }

  /**
   * 关闭编辑器
   * @returns {BaseEdit}
   */
  close(event) {
    let { table } = this;
    super.close({
      edit: this,
      table,
      native: event,
    });
    this.activeCell = null;
    this.selectRange = null;
    return this;
  }

  /**
   * 销毁编辑器
   */
  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  TableEdit,
};
