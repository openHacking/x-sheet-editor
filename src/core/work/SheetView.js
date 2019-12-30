import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Sheet } from './Sheet';

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
    sheet.show().sibling().forEach((item) => {
      item.hide();
    });
    return sheet;
  }
}

export { SheetView };
