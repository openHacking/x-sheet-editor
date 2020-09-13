import { XScreenSvgBorderItem } from '../../xscreen/item/viewborder/XScreenSvgBorderItem';
import { XSelectItem } from '../xselect/XSelectItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { EventBind } from '../../../../utils/EventBind';

class XcopyStyle extends XScreenSvgBorderItem {

  constructor(table) {
    super({ table });
    this.targetOffset = { top: 0, left: 0, width: 0, height: 0 };
    this.selectRange = null;
    this.overGo = null;
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

  selectOffsetHandle() {}

  selectBorderHandle() {}

  hideCopyStyle() {
    this.hide();
  }

  showCopyStyle() {
    this.show();
    const { xScreen } = this;
    const xSelect = xScreen.findType(XSelectItem);
    const {
      selectRange, overGo,
    } = xSelect;
    this.selectRange = selectRange;
    this.overGo = overGo;
    this.selectOffsetHandle();
    this.selectBorderHandle();
  }

}

export {
  XcopyStyle,
};
