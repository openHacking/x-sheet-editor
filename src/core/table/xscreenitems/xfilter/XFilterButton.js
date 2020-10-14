/* global document */
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { h } from '../../../../lib/Element';
import { ColorPicker } from '../../../../component/colorpicker/ColorPicker';
import { PlainUtils } from '../../../../utils/PlainUtils';
import { Event } from '../../../../lib/Event';
import { XTableMousePointer } from '../../XTableMousePointer';

class XFilterButton extends Widget {

  constructor({
    ri, ci, xFilter, area,
  }) {
    super(`${cssPrefix}-x-filter-button-box`);
    this.xFilter = xFilter;
    this.area = area;
    this.ri = ri;
    this.ci = ci;
    this.button = h('div', `${cssPrefix}-x-filter-button`);
    this.children(this.button);
    this.initStyle();
    this.bind();
  }

  bind() {
    const {
      xFilter, button,
    } = this;
    const { table } = xFilter;
    const {
      mousePointer,
    } = table;
    Event.bind(button, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (ev) => {
      mousePointer.lock(XFilterButton);
      mousePointer.set(XTableMousePointer.KEYS.pointer, XFilterButton);
      Event.mouseMoveUp(document, () => {}, () => {
        mousePointer.free(XFilterButton);
      });
      ev.stopPropagation();
    });
    Event.bind(button, Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.free(XFilterButton);
    });
    Event.bind(button, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.lock(XFilterButton);
      mousePointer.set(XTableMousePointer.KEYS.pointer, XFilterButton);
    });
  }

  initStyle() {
    const {
      ri, ci, xFilter, button,
    } = this;
    const { table } = xFilter;
    const cells = table.getTableCells();
    const cell = cells.getCell(ri, ci);
    if (PlainUtils.isUnDef(cell) || PlainUtils.isBlank(cell.background)) {
      button.css('background-color', '#ffffff');
      button.addClass(`${cssPrefix}-x-filter-button-dark`);
    } else {
      button.css('background-color', cell.background);
      if (ColorPicker.isDark(cell.background)) {
        button.addClass(`${cssPrefix}-x-filter-button-dark`);
      } else {
        button.addClass(`${cssPrefix}-x-filter-button-light`);
      }
    }
  }

  destroy() {
    const { area, button } = this;
    Event.unbind(button);
    area.remove(this);
  }

}

export {
  XFilterButton,
};
