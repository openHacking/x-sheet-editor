import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { Sheet } from './Sheet';

class SheetView extends Widget {
  constructor() {
    super(`${cssPrefix}-sheet-view`);
    this.sheets = [];
    this.activeIndex = 0;
  }

  add(sheet = new Sheet()) {
    this.sheets.push(sheet);
    this.children(sheet);
    sheet.init();
    return this.sheets.length - 1;
  }

  getActiveSheet() {
    return this.sheets[this.activeIndex];
  }
}

export { SheetView };
