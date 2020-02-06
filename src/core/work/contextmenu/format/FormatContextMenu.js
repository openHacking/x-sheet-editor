import { ContextMenu } from '../../../../component/contextmenu/ContextMenu';
import { FormatContextMenuItem } from './FormatContextMenuItem';
import { ContextMenuDivider } from '../../../../component/contextmenu/ContextMenuDivider';
import { cssPrefix } from '../../../../config';

class FormatContextMenu extends ContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-format-context-menu`, options);
    this.addItem(new FormatContextMenuItem('常规', ''));
    this.addItem(new FormatContextMenuItem('文本', ''));
    this.addItem(new ContextMenuDivider());
    this.addItem(new FormatContextMenuItem('数值', '0.59'));
    this.addItem(new FormatContextMenuItem('百分比', '90.00%'));
    this.addItem(new FormatContextMenuItem('分数', '1/2'));
    this.addItem(new FormatContextMenuItem('科学计数', '9.50E-01'));
    this.addItem(new ContextMenuDivider());
    this.addItem(new FormatContextMenuItem('人民币', '￥5.00'));
    this.addItem(new FormatContextMenuItem('港币', 'HK$5.00'));
    this.addItem(new FormatContextMenuItem('美元', '$5.00'));
    this.addItem(new ContextMenuDivider());
    this.addItem(new FormatContextMenuItem('日期', '2018/4/18'));
    this.addItem(new FormatContextMenuItem('日期', '4月18日'));
    this.addItem(new FormatContextMenuItem('日期', '2018年4月'));
    this.addItem(new FormatContextMenuItem('日期', '2018年4月18日'));
    this.addItem(new FormatContextMenuItem('日期', '2018/4/18 14:30:30'));
    this.addItem(new FormatContextMenuItem('时间', '14:30:30'));
    this.addItem(new ContextMenuDivider());
    this.addItem(new FormatContextMenuItem('更多格式', ''));
  }
}

export { FormatContextMenu };
