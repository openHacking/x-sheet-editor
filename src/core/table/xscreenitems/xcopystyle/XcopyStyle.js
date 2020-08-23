import { XScreenSvgBorderItem } from '../../xscreen/item/border/XScreenSvgBorderItem';
import { XSelectItem } from '../xselect/XSelectItem';
import { RectRange } from '../../tablebase/RectRange';
import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';

class XcopyStyle extends XScreenSvgBorderItem {

  constructor(table) {
    super({ table });
    this.ltElem = new Widget(`${cssPrefix}-x-select-area`);
    this.brElem = new Widget(`${cssPrefix}-x-select-area`);
    this.lElem = new Widget(`${cssPrefix}-x-select-area`);
    this.tElem = new Widget(`${cssPrefix}-x-select-area`);
    this.blt.child(this.ltElem);
    this.bl.child(this.lElem);
    this.bt.child(this.tElem);
    this.bbr.child(this.brElem);
  }

  onAdd() {
    this.hide();
  }

  hideCopyStyle() {
    this.hide();
  }

  showCopyStyle() {
    this.offsetHandle();
    this.borderHandle();
  }

  offsetHandle() {
    const { xScreen } = this;
    const xSelect = xScreen.findType(XSelectItem);
    const { targetRange } = xSelect;
    if (targetRange === RectRange.EMPTY) {
      return;
    }
    const { targetOffset } = xSelect;
    this.setHeight(targetOffset.height);
    this.setWidth(targetOffset.width);
    this.setTop(targetOffset.top);
    this.setLeft(targetOffset.left);
  }

  borderHandle() {
    const { xScreen } = this;
    const xSelect = xScreen.findType(XSelectItem);
    const { targetRange } = xSelect;
    if (targetRange.equals(RectRange.EMPTY)) {
      return;
    }
    const { selectRange } = xSelect;
    const {
      top, bottom, left, right,
    } = this.rectRangeBoundOut(selectRange);
    this.hideAllBorder();
    const overGo = this.rectRangeOverGo(selectRange);
    if (!top) {
      this.showTBorder(overGo);
    }
    if (!bottom) {
      this.showBBorder(overGo);
    }
    if (!left) {
      this.showLBorder(overGo);
    }
    if (!right) {
      this.showRBorder(overGo);
    }
  }

}

export {
  XcopyStyle,
};
