import { cssPrefix } from '../../../config';
import { ELContextMenu } from '../../../component/elcontextmenu/ELContextMenu';
import { FormatContextMenuItem } from './FormatContextMenuItem';
import { ELContextMenuDivider } from '../../../component/elcontextmenu/ELContextMenuDivider';
import { Constant } from '../../../utils/Constant';
import { CELL_TEXT_FORMAT } from '../../table/Cells';
import { Utils } from '../../../utils/Utils';

class FormatContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-format-context-menu`, Utils.copyProp({
      onUpdate: () => {},
    }, options));
    this.addItem(new FormatContextMenuItem('常规', '').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.default, '常规');
    }));
    this.addItem(new FormatContextMenuItem('文本', '').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.text, '文本');
    }));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('数值', '0.59').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.number, '数值');
    }));
    this.addItem(new FormatContextMenuItem('百分比', '90.00%').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.percentage, '百分比');
    }));
    this.addItem(new FormatContextMenuItem('分数', '1/2').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.fraction, '分数');
    }));
    this.addItem(new FormatContextMenuItem('科学计数', '9.50E-01').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.ENotation, '科学计数');
    }));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('人民币', '￥5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.rmb, '人民币');
    }));
    this.addItem(new FormatContextMenuItem('港币', 'HK$5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.hk, '港币');
    }));
    this.addItem(new FormatContextMenuItem('美元', '$5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.dollar, '美元');
    }));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('日期', '2018/4/18').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.date1, '日期');
    }));
    this.addItem(new FormatContextMenuItem('日期', '4月18日').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.date2, '日期');
    }));
    this.addItem(new FormatContextMenuItem('日期', '2018年4月').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.date3, '日期');
    }));
    this.addItem(new FormatContextMenuItem('日期', '2018年4月18日').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.date4, '日期');
    }));
    this.addItem(new FormatContextMenuItem('日期', '2018/4/18 14:30:30').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.date5, '日期');
    }));
    this.addItem(new FormatContextMenuItem('时间', '14:30:30').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT.time, '时间');
    }));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('更多格式', '').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {

    }));
  }

  update(format, title) {
    const { options } = this;
    const { el } = options;
    options.onUpdate(format);
    el.setTitle(title);
    this.close();
  }
}

export { FormatContextMenu };
