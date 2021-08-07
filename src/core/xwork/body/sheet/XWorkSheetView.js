import { Widget } from '../../../../lib/Widget';
import { cssPrefix } from '../../../../const/Constant';

/**
 * XWorkSheetView
 */
class XWorkSheetView extends Widget {

  /**
   * XWorkSheetView
   */
  constructor() {
    super(`${cssPrefix}-sheet-view`);
    this.sheetList = [];
    this.activeIndex = -1;
  }

  /**
   * 添加一个新的sheet
   */
  attach(sheet) {
    this.sheetList.push(sheet);
    super.attach(sheet);
    sheet.hide();
  }

  /**
   * 激活指定索引的sheet
   * @param index
   * @returns {*}
   */
  setActiveByIndex(index = 0) {
    const { sheetList } = this;
    const sheet = sheetList[index];
    if (sheet) {
      this.setActive(sheet);
    }
    return sheet;
  }

  /**
   * 激活指定sheet
   * @param sheet
   * @returns {*}
   */
  setActive(sheet) {
    this.activeIndex = this.getIndexBySheet(sheet);
    sheet.show();
    sheet.sibling().forEach((item) => {
      item.hide();
    });
    return sheet;
  }

  /**
   * 获取最后一个索引
   * @returns {number}
   */
  getLastIndex() {
    return this.sheetList.length - 1;
  }

  /**
   * 获取sheet的索引
   * @param tab
   * @returns {number}
   */
  getIndexByTab(tab) {
    return this.sheetList.findIndex(item => item.tab === tab);
  }

  /**
   * 获取sheet的索引
   * @param sheet
   * @returns {number}
   */
  getIndexBySheet(sheet) {
    return this.sheetList.findIndex(item => item === sheet);
  }

  /**
   * 获取当前激活的sheet
   * @returns {*}
   */
  getActiveSheet() {
    return this.sheetList[this.activeIndex];
  }

  /**
   * 删除指定索引的sheet
   * @param index
   */
  removeByIndex(index = 0) {
    const { sheetList } = this;
    const array = sheetList.splice(index, 1);
    if (array.length) {
      array[0].destroy();
    }
  }

}

export { XWorkSheetView };
