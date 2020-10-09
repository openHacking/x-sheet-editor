/* global document */
import { XSelectItem } from '../xselect/XSelectItem';
import { XScreenCssBorderItem } from '../../xscreen/item/viewborder/XScreenCssBorderItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { RectRange } from '../../tablebase/RectRange';
import { PlainUtils } from '../../../../utils/PlainUtils';
import { Event } from '../../../../lib/Event';
import { XTableMousePointer } from '../../XTableMousePointer';

class XautoFillItem extends XScreenCssBorderItem {

  constructor(table, options = {}) {
    super({ table });
    this.options = PlainUtils.mergeDeep({
      mergeForceSplit: false,
      onBeforeAutoFill: () => {},
      onAfterAutoFill: () => {},
    }, options);
    this.selectRange = RectRange.EMPTY;
    this.status = false;
    this.moveDir = null;
    this.ltElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.brElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.lElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.tElem = new Widget(`${cssPrefix}-x-autofill-area`);
    this.blt.child(this.ltElem);
    this.bl.child(this.lElem);
    this.bt.child(this.tElem);
    this.bbr.child(this.brElem);
    this.setBorderType('dashed');
  }

  // eslint-disable-next-line no-unused-vars
  selectRangeHandle(x, y) {}

  selectOffsetHandle() {}

  selectBorderHandle() {}

  onAdd() {
    this.bind();
    this.hide();
  }

  bind() {
    const { table, xScreen } = this;
    const { mousePointer } = table;
    const xSelect = xScreen.findType(XSelectItem);
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_LEAVE, () => {
      mousePointer.free(XautoFillItem);
    });
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, () => {
      mousePointer.lock(XautoFillItem);
      mousePointer.set(XTableMousePointer.KEYS.crosshair, XautoFillItem);
    });
    Event.bind([
      xSelect.ltCorner,
      xSelect.tCorner,
      xSelect.lCorner,
      xSelect.brCorner,
    ], Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.status = true;
      mousePointer.lock(XautoFillItem);
      mousePointer.set(XTableMousePointer.KEYS.crosshair, XautoFillItem);
      Event.mouseMoveUp(document, (e2) => {
        const { x, y } = table.computeEventXy(e2);
        this.selectRangeHandle(x, y);
        this.selectOffsetHandle();
        this.selectBorderHandle();
      }, () => {
        this.status = false;
        mousePointer.free(XautoFillItem);
        this.autoFillTo();
        this.hide();
      });
    });
  }

  copyContent() {}

  autoFillTo() {}

  splitMerge() {}

  copyMerge() {}

}

export {
  XautoFillItem,
};
