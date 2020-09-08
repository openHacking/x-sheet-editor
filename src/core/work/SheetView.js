import { Widget } from '../../lib/Widget';
import { cssPrefix, Constant } from '../../const/Constant';
import { EventBind } from '../../utils/EventBind';


class SheetView extends Widget {

  constructor() {
    super(`${cssPrefix}-sheet-view`);
    this.sheetList = [];
    this.activeIndex = -1;
  }

  setActiveSheet(index) {
    const { sheetList } = this;
    if (sheetList[index]) {
      this.activeIndex = index;
      return this.setActive(sheetList[index]);
    }
    return null;
  }

  attach(sheet) {
    this.sheetList.push(sheet);
    super.attach(sheet);
    sheet.hide();
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH);
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.DATA_CHANGE, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN, this);
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.FIXED_CHANGE, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
    });
  }

  getActiveSheet() {
    return this.sheetList[this.activeIndex];
  }

  setActive(sheet) {
    sheet.show();
    sheet.sibling().forEach((item) => {
      item.hide();
    });
    return sheet;
  }

  getLastIndex() {
    return this.sheetList.length - 1;
  }
}

export { SheetView };
