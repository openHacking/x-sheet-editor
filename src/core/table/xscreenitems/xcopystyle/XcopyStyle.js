import { XScreenSvgBorderItem } from '../../xscreen/item/viewborder/XScreenSvgBorderItem';
import { XSelectItem } from '../xselect/XSelectItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { EventBind } from '../../../../utils/EventBind';
import { RectRange } from '../../tablebase/RectRange';

class XcopyStyle extends XScreenSvgBorderItem {

  constructor(table) {
    super({ table });
    this.selectRange = RectRange.EMPTY;
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
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
    });
    EventBind.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
    });
    EventBind.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
    });
  }

  selectOffsetHandle() {
    const { selectRange } = this;
    if (selectRange.equals(RectRange.EMPTY)) {
      this.hide();
      return;
    }
    this.show();
    this.setDisplay(selectRange);
    this.setSizer(selectRange);
    this.setLocal(selectRange);
  }

  selectBorderHandle() {
    const { selectRange } = this;
    if (selectRange.equals(RectRange.EMPTY)) {
      return;
    }
    this.hideBorder();
    this.showBorder(selectRange);
  }

  hideCopyStyle() {
    this.hide();
  }

  showCopyStyle() {
    this.show();
    const { xScreen } = this;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange,
    } = xSelect;
    this.selectRange = selectRange;
    this.selectOffsetHandle();
    this.selectBorderHandle();
  }

}

export {
  XcopyStyle,
};
