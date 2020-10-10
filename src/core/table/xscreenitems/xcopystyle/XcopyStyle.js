import { XScreenSvgBorderItem } from '../../xscreen/item/viewborder/XScreenSvgBorderItem';
import { XSelectItem } from '../xselect/XSelectItem';
import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { Event } from '../../../../lib/Event';
import { RectRange } from '../../tablebase/RectRange';

class XCopyStyle extends XScreenSvgBorderItem {

  constructor(table) {
    super({ table });
    this.status = false;
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
    Event.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
    });
    Event.bind(table, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
    });
    Event.bind(table, Constant.TABLE_EVENT_TYPE.SCALE_CHANGE, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
    });
    Event.bind(table, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
    });
    Event.bind(table, Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE, () => {
      this.selectOffsetHandle();
      this.selectBorderHandle();
    });
    Event.bind(table, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      if (this.status) {
        this.selectOffsetHandle();
        this.selectBorderHandle();
      }
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
    this.status = false;
    this.hide();
  }

  showCopyStyle() {
    this.status = true;
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
  XCopyStyle,
};
