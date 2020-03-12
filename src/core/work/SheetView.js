import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Sheet } from './Sheet';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';

class SheetView extends Widget {
  constructor() {
    super(`${cssPrefix}-sheet-view`);
    this.sheetList = [];
    this.activeIndex = -1;
  }

  add(sheet = new Sheet()) {
    this.sheetList.push(sheet);
    this.children(sheet);
    sheet.init();
    sheet.hide();
    // console.log(sheet);
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, (e) => {
      // console.log('e>>>', e);
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH);
      e.stopPropagation();
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, (e) => {
      // console.log('e>>>', e);
      this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT);
      e.stopPropagation();
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.DATA_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
      e.stopPropagation();
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.SELECT_CHANGE, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
      e.stopPropagation();
    });
    EventBind.bind(sheet, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, (e) => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN, this);
      e.stopPropagation();
    });
    return this.sheetList.length - 1;
  }

  getActiveSheet() {
    return this.sheetList[this.activeIndex];
  }

  setActiveSheet(index) {
    const { sheetList } = this;
    if (sheetList[index]) {
      this.activeIndex = index;
      return this.setActive(sheetList[index]);
    }
    return null;
  }

  setActive(sheet) {
    sheet.show();
    sheet.sibling().forEach((item) => {
      item.hide();
    });
    sheet.table.resize();
    return sheet;
  }
}

export { SheetView };
