import { XSelectItem } from '../xscreenitems/xselect/XSelectItem';
import { Cell } from '../tablecell/Cell';
import { TextEdit } from './type/TextEdit';
import { SheetUtils } from '../../../utils/SheetUtils';
import { XEvent } from '../../../lib/XEvent';
import { BaseEdit } from './base/BaseEdit';
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
  constructor(table) {
    super(table);
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
    this.tableScrollHandle = XEvent.WrapFuncion.mouseClick((event) => {
      if (this.mode === BaseEdit.MODE.SHOW) {
        this.close(event);
      }
    });
    this.bind();
  }

  /**
   * 添加键盘事件
   */
  onAttach() {
    const { table } = this;
    const { widgetFocus } = table;
    widgetFocus.register({ target: this });
    this.hide();
  }

  /**
   * 解绑事件处理
   */
  unbind() {
    const { openClickHandle } = this;
    const { closeClickHandle } = this;
    const { tableScrollHandle } = this;
    const { table } = this;
    const { widgetFocus } = table;
    const { keyboard } = table;
    keyboard.remove(this);
    widgetFocus.remove(this);
    XEvent.unbind(this);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, tableScrollHandle);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, openClickHandle);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, closeClickHandle);
  }

  /**
   * 绑定事件处理
   */
  bind() {
    const { openClickHandle } = this;
    const { closeClickHandle } = this;
    const { tableScrollHandle } = this;
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
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, tableScrollHandle);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, closeClickHandle);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, openClickHandle);
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
    this.activeCell = activeCell;
    this.selectRange = selectRange;
    if (activeCell.hasFormula()) {
      this.formulaTextToHtml();
    } else {
      let { contentType } = activeCell;
      switch (contentType) {
        case Cell.TYPE.STRING:
        case Cell.TYPE.NUMBER:
        case Cell.TYPE.DATE_TIME: {
          this.cellTextToText();
          break;
        }
        case Cell.TYPE.RICH_TEXT: {
          this.richTextToHtml();
          break;
        }
      }
    }
    throttle.action(() => {
      this.focus();
      SheetUtils.keepLastIndex(this.el);
    });
    super.open({
      edit: this, table, native: event,
    });
    return this;
  }

  /**
   * 关闭编辑器
   * @returns {BaseEdit}
   */
  close(event) {
    let { table } = this;
    if (this.checkedFormulaText()) {
      this.htmlToFormulaText();
    } else if (this.checkedRichText()) {
      this.htmlToRichText();
    } else {
      this.textToCellText();
    }
    super.close({
      edit: this, table, native: event,
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
