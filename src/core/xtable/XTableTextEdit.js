/* global document */
import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { SheetUtils } from '../../utils/SheetUtils';
import { XSelectItem } from './xscreenitems/xselect/XSelectItem';
import { XDraw } from '../../draw/XDraw';
import { Throttle } from '../../lib/Throttle';
import { BaseFont } from '../../draw/font/BaseFont';
import { Cell } from './tablecell/Cell';

class XTableTextEdit extends Widget {

  constructor(table) {
    super(`${cssPrefix}-table-edit`);
    this.table = table;
    this.select = null;
    this.cell = null;
    this.merge = null;
    this.mode = XTableTextEdit.MODE.HIDE;
    this.throttle = new Throttle({
      time: 100,
    });
    this.attr('contenteditable', true);
    this.html(SheetUtils.EMPTY);
    this.closeClickHandle = XEvent.WrapFuncion.mouseClick((event) => {
      if (this.mode === XTableTextEdit.MODE.SHOW) {
        this.hideEdit(event);
      }
    });
    this.openClickHandle = XEvent.WrapFuncion.doubleClick((event) => {
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const merges = table.getTableMerges();
      const { selectRange } = xSelect;
      const { sri, sci } = selectRange;
      if (!selectRange.multiple() || merges.getFirstIncludes(sri, sci)) {
        this.showEdit(event);
      }
    });
  }

  onAttach() {
    const { table } = this;
    this.bind();
    this.hide();
    table.focus.register({ target: this });
  }

  show() {
    this.css({
      'min-width': '0px',
      'min-height': '0px',
      'max-width': '0px',
      'max-height': '0px',
    });
    return super.show();
  }

  insertBreak() {
    const { cell } = this;
    const { contentType } = cell;
    switch (contentType) {
      case Cell.TYPE.NUMBER:
      case Cell.TYPE.STRING:
      case Cell.TYPE.DATE_TIME: {
        document.execCommand('insertHTML', false, '<br>');
        break;
      }
      case Cell.TYPE.RICH_TEXT: {
        break;
      }
    }
  }

  editOffset() {
    const { table, cell } = this;
    const {
      xHeightLight, yHeightLight,
    } = table;
    const { fontAttr } = cell;
    const { align } = fontAttr;
    const left = xHeightLight.getLeft() + table.getIndexWidth();
    const top = yHeightLight.getTop() + table.getIndexHeight();
    const height = yHeightLight.getHeight();
    const width = xHeightLight.getWidth();
    switch (align) {
      case BaseFont.ALIGN.left: {
        this.cssRemoveKeys('right');
        const maxHeight = table.visualHeight() - top;
        const maxWidth = table.visualWidth() - left;
        this.css({
          left: `${left}px`,
          top: `${top}px`,
          'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
          'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
          'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
          'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
        });
        break;
      }
      case BaseFont.ALIGN.center: {
        this.cssRemoveKeys('right');
        const box = this.box();
        const maxHeight = table.visualHeight() - top;
        if (box.width > width) {
          const maxWidth = (table.visualWidth() - (left + width)) * 2 + width;
          const realWidth = Math.min(box.width, maxWidth);
          const realLeft = left - (realWidth / 2 - width / 2);
          this.css({
            left: `${realLeft}px`,
            top: `${top}px`,
            'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
            'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
            'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
            'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
          });
        } else {
          const maxWidth = table.visualWidth() - left;
          this.css({
            left: `${left}px`,
            top: `${top}px`,
            'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
            'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
            'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
            'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
          });
        }
        break;
      }
      case BaseFont.ALIGN.right: {
        this.cssRemoveKeys('left');
        const maxWidth = (left + width) - table.getIndexWidth();
        const right = table.visualWidth() - (left + width);
        const maxHeight = table.visualHeight() - top;
        this.css({
          right: `${right}px`,
          top: `${top}px`,
          'min-width': `${XDraw.offsetToLineInside(Math.min(width, maxWidth))}px`,
          'min-height': `${XDraw.offsetToLineInside(Math.min(height, maxHeight))}px`,
          'max-width': `${XDraw.offsetToLineInside(maxWidth)}px`,
          'max-height': `${XDraw.offsetToLineInside(maxHeight)}px`,
        });
        break;
      }
    }
  }

  bind() {
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
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_WHEEL, (event) => {
      event.stopPropagation();
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.INPUT, (event) => {
      const { cell } = this;
      const { fontAttr } = cell;
      const { align } = fontAttr;
      if (align === BaseFont.ALIGN.center) {
        this.editOffset();
      }
      table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_INPUT, {
        event,
        table,
        edit: this,
      });
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (event) => {
      event.stopPropagation();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.hideEdit();
    });
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.closeClickHandle);
    XEvent.bind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.openClickHandle);
  }

  unbind() {
    const { table } = this;
    const { xScreen } = table;
    const xSelect = xScreen.findType(XSelectItem);
    XEvent.unbind([
      xSelect.lt,
      xSelect.t,
      xSelect.l,
      xSelect.br,
    ]);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.openClickHandle);
    XEvent.unbind(table, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, this.closeClickHandle);
  }

  hideEdit(event) {
    const { select } = this;
    const { table } = this;
    const { snapshot } = table;
    const cells = table.getTableCells();
    if (select) {
      const origin = cells.getCellOrNew(select.sri, select.sci);
      const cell = origin.clone();
      const text = this.text();
      this.mode = XTableTextEdit.MODE.HIDE;
      this.hide();
      if (cell.toString() !== text) {
        snapshot.open();
        cell.setText(text);
        cells.setCellOrNew(select.sri, select.sci, cell);
        snapshot.close({
          type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
        });
        table.render();
      }
      this.select = null;
      table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_FINISH, {
        event,
        table,
        edit: this,
      });
    }
  }

  showEdit(event) {
    const { table } = this;
    if (!table.isReadOnly()) {
      const merges = table.getTableMerges();
      const cells = table.getTableCells();
      const { xScreen } = table;
      const xSelect = xScreen.findType(XSelectItem);
      const { selectRange } = xSelect;
      if (selectRange) {
        const { sri, sci } = selectRange;
        const merge = merges.getFirstIncludes(sri, sci);
        const cell = cells.getCellOrNew(sri, sci);
        this.merge = merge;
        this.cell = cell;
        this.select = selectRange;
        this.mode = XTableTextEdit.MODE.SHOW;
        if (cell.isEmpty()) {
          this.text(SheetUtils.EMPTY);
        } else {
          const { contentType } = cell;
          switch (contentType) {
            case Cell.TYPE.NUMBER:
            case Cell.TYPE.STRING:
            case Cell.TYPE.DATE_TIME: {
              const text = cell.toString();
              const style = table.getCellCssStyle(sri, sci);
              this.attr('style', style);
              this.text(text);
              break;
            }
            case Cell.TYPE.RICH_TEXT: {
              // TODO ...
              //
              this.text(SheetUtils.EMPTY);
              break;
            }
          }
        }
        this.show();
        this.editOffset();
        this.throttle.action(() => {
          this.focus();
          SheetUtils.keepLastIndex(this.el);
        });
        table.trigger(Constant.TABLE_EVENT_TYPE.EDIT_START, {
          event,
          table,
          edit: this,
        });
      }
    }
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

XTableTextEdit.MODE = {
  SHOW: Symbol('显示'),
  HIDE: Symbol('隐藏'),
};

export {
  XTableTextEdit,
};
