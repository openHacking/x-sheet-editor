import { Widget } from '../../../../lib/Widget';
import { Constant, cssPrefix } from '../../../../const/Constant';
import { SheetContextMenu } from './contextmenu/SheetContextMenu';
import { XEvent } from '../../../../lib/XEvent';
import { SheetUtils } from '../../../../utils/SheetUtils';
import { XSelectItem } from '../../../xtable/screenitems/xselect/XSelectItem';

const settings = {
  showMenu: true,
};

/**
 * XWorkSheetView
 */
class XWorkSheetView extends Widget {

  /**
   * XWorkSheetView
   */
  constructor(option) {
    super(`${cssPrefix}-sheet-view`);
    this.options = SheetUtils.copy({}, settings, option);
    this.sheetList = [];
    this.activeIndex = -1;
    this.contextMenu = new SheetContextMenu({
      onUpdate: (name, type) => {
        const sheet = this.getActiveSheet();
        const { table } = sheet;
        const { xScreen } = table;
        const xSelect = xScreen.findType(XSelectItem);
        const merges = table.getTableMerges();
        const { selectRange } = xSelect;
        switch (type) {
          case 3: {
            if (selectRange) {
              const { sri, sci } = selectRange;
              const merge = merges.getFirstInclude(sri, sci);
              if (merge) {
                const { eri } = merge;
                table.insertRowAfter(eri);
              } else {
                table.insertRowAfter(sri);
              }
            }
            break;
          }
          case 4: {
            if (selectRange) {
              const { sri, sci } = selectRange;
              const merge = merges.getFirstInclude(sri, sci);
              if (merge) {
                const { eci } = merge;
                table.insertColAfter(eci);
              } else {
                table.insertColAfter(sci);
              }
            }
            break;
          }
          case 5: {
            if (selectRange) {
              const { sri, eri } = selectRange;
              table.removeRow(sri, eri - sri + 1);
            }
            break;
          }
          case 6: {
            if (selectRange) {
              const { sci, eci } = selectRange;
              table.removeCol(sci, eci - sci + 1);
            }
            break;
          }
        }
      },
    });
    this.bind();
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
   * 绑定事件处理
   */
  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.CONTEXT_MENU, (event) => {
      if (this.options.showMenu) {
        this.contextMenu.openByMouse(event);
        event.preventDefault();
      }
    });
  }

  /**
   * 卸载事件处理
   */
  unbind() {
    XEvent.unbind(this);
  }

  /**
   * 激活指定索引的sheet
   * @param index
   * @returns {*}
   */
  setActiveByIndex(index = 0) {
    const { sheetList } = this;
    const sheet = sheetList[index];
    this.setActive(sheet);
    return sheet;
  }

  /**
   * 激活指定sheet
   * @param sheet
   * @returns {*}
   */
  setActive(sheet) {
    if (sheet) {
      this.activeIndex = this.getIndexBySheet(sheet);
      sheet.show();
      sheet.sibling().forEach((item) => {
        item.hide();
      });
    }
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
   * 获取sheet数量
   * @returns {number}
   */
  getSheetCount() {
    return this.sheetList.length;
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
    const { activeIndex, sheetList } = this;
    const remove = sheetList[index];
    sheetList.splice(index, 1);
    if (remove) {
      remove.destroy();
    }
    const length = this.getSheetCount() - 1;
    if (activeIndex >= length) {
      this.activeIndex = length;
    }
    const active = this.getActiveSheet();
    this.setActive(active);
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export { XWorkSheetView };
