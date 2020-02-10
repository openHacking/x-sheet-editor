import { cssPrefix } from '../../../config';
import { ELContextMenu } from '../../../component/elcontextmenu/ELContextMenu';
import { FormatContextMenuItem } from './FormatContextMenuItem';
import { ELContextMenuDivider } from '../../../component/elcontextmenu/ELContextMenuDivider';
import { Constant } from '../../../utils/Constant';

class FormatContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-format-context-menu`, options);
    this.addItem(new FormatContextMenuItem('常规', '').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('文本', '').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('数值', '0.59').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('百分比', '90.00%').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('分数', '1/2').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('科学计数', '9.50E-01').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('人民币', '￥5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('港币', 'HK$5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('美元', '$5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('日期', '2018/4/18').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('日期', '4月18日').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('日期', '2018年4月').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('日期', '2018年4月18日').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('日期', '2018/4/18 14:30:30').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new FormatContextMenuItem('时间', '14:30:30').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('更多格式', '').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {}));
  }
}

export { FormatContextMenu };
