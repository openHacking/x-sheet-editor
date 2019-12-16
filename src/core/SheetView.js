import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';
import { Sheet } from './Sheet';

class SheetView extends Widget {
  constructor() {
    super(`${cssPrefix}-sheet-view`);
    this.sheets = [];
  }

  init() {
    this.add();
  }

  add(sheet = new Sheet()) {
    sheet.init();
    this.sheets.push(sheet);
    this.children(sheet);
  }
}

export { SheetView };
