import { SvgBorderItem } from '../../xscreen/item/border/SvgBorderItem';
import { XSelectItem } from '../xselect/XSelectItem';
import { RectRange } from '../../tablebase/RectRange';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { EventBind } from '../../../../utils/EventBind';

class XcopyStyle extends SvgBorderItem {

  constructor(table) {
    super({ table });
    this.selectRange = null;
    this.targetRange = null;
    this.ltElem = new Widget(`${cssPrefix}-x-copy-style-area`);
    this.brElem = new Widget(`${cssPrefix}-x-copy-style-area`);
    this.lElem = new Widget(`${cssPrefix}-x-copy-style-area`);
    this.tElem = new Widget(`${cssPrefix}-x-copy-style-area`);
    this.blt.child(this.ltElem);
    this.bl.child(this.lElem);
    this.bt.child(this.tElem);
    this.bbr.child(this.brElem);
  }

  onAdd() {
    this.hideCopyStyle();
    this.bind();
  }

  bind() {
    const { table } = this;
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.offsetHandle();
      this.borderHandle();
    });
  }

  hideCopyStyle() {
    this.hide();
  }

  showCopyStyle() {
    this.show();
    this.offsetHandle();
    this.borderHandle();
  }

  offsetHandle() {
    const { xScreen } = this;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      targetRange, selectRange,
    } = xSelect;
    this.selectRange = selectRange;
    this.targetRange = targetRange;
    if (targetRange === RectRange.EMPTY) {
      this.hide();
      return;
    }
    this.show();
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
