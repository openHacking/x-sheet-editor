import { cssPrefix } from '../../../config';
import { ELContextMenu } from '../../../component/elcontextmenu/ELContextMenu';
import { FormatContextMenuItem } from './FormatContextMenuItem';
import { ELContextMenuDivider } from '../../../component/elcontextmenu/ELContextMenuDivider';
import { Constant } from '../../../utils/Constant';
import { Utils } from '../../../utils/Utils';
import { CELL_TEXT_FORMAT_TYPE } from '../../table/Cells';

class FormatContextMenu extends ELContextMenu {
  constructor(options = {}) {
    super(`${cssPrefix}-format-context-menu`, Utils.copyProp({
      onUpdate: () => {},
    }, options));
    this.addItem(new FormatContextMenuItem('常规', '').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.default, '常规');
    }));
    this.addItem(new FormatContextMenuItem('文本', '').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.text, '文本');
    }));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('数值', '0.59').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.number, '数值');
    }));
    this.addItem(new FormatContextMenuItem('百分比', '90.00%').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.percentage, '百分比');
    }));
    this.addItem(new FormatContextMenuItem('分数', '1/2').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.fraction, '分数');
    }));
    this.addItem(new FormatContextMenuItem('科学计数', '9.50E-01').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.ENotation, '科学计数');
    }));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('人民币', '￥5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.rmb, '人民币');
    }));
    this.addItem(new FormatContextMenuItem('港币', 'HK$5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.hk, '港币');
    }));
    this.addItem(new FormatContextMenuItem('美元', '$5.00').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.dollar, '美元');
    }));
    this.addItem(new ELContextMenuDivider());
    this.addItem(new FormatContextMenuItem('日期', '2018/4/18').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.date1, '日期');
    }));
    this.addItem(new FormatContextMenuItem('日期', '4月18日').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.date2, '日期');
    }));
    this.addItem(new FormatContextMenuItem('日期', '2018年4月').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.date3, '日期');
    }));
    this.addItem(new FormatContextMenuItem('日期', '2018年4月18日').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.date4, '日期');
    }));
    this.addItem(new FormatContextMenuItem('日期', '2018/4/18 14:30:30').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.date5, '日期');
    }));
    this.addItem(new FormatContextMenuItem('时间', '14:30:30').on(Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      this.update(CELL_TEXT_FORMAT_TYPE.time, '时间');
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
