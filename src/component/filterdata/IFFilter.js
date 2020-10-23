import { ELContextMenuItem } from '../contextmenu/ELContextMenuItem';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { Select } from '../form/select/Select';
import { XEvent } from '../../lib/XEvent';
import { PlainInput } from '../form/input/PlainInput';

class IFFilter extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-filter-data-menu-item ${cssPrefix}-if-filter`);
    this.status = false;
    this.type = IFFilter.IF_TYPE.NOT;
    // 标题
    this.titleEle = h('div', `${cssPrefix}-if-filter-title`);
    this.titleTextEle = h('span', `${cssPrefix}-if-filter-title-text`);
    this.titleIconEle = h('span', `${cssPrefix}-if-filter-title-icon`);
    this.titleTextEle.text('条件过滤');
    this.titleEle.children(this.titleIconEle);
    this.titleEle.children(this.titleTextEle);
    this.children(this.titleEle);
    // 条件类型
    this.selectEleBox = h('div', `${cssPrefix}-if-filter-select-box`);
    this.selectEle = new Select();
    this.selectEleBox.children(this.selectEle);
    this.children(this.selectEleBox);
    // 条件值
    this.valueInputEleBox = h('div', `${cssPrefix}-if-filter-value-input-box`);
    this.valueInput = new PlainInput();
    this.valueInputEleBox.children(this.valueInput);
    this.children(this.valueInputEleBox);
    // 搜索类型
    this.selectEle.addValue({ text: '无', value: IFFilter.IF_TYPE.NOT });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '为空', value: IFFilter.IF_TYPE.CT_EMPTY });
    this.selectEle.addValue({ text: '不为空', value: IFFilter.IF_TYPE.CT_NOT_EMPTY });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '文本包含', value: IFFilter.IF_TYPE.STR_INCLUDE });
    this.selectEle.addValue({ text: '文本不包含', value: IFFilter.IF_TYPE.STR_NOT_INCLUDE });
    this.selectEle.addValue({ text: '文本开头', value: IFFilter.IF_TYPE.STR_START });
    this.selectEle.addValue({ text: '文本结尾', value: IFFilter.IF_TYPE.STR_END });
    this.selectEle.addValue({ text: '文本相符', value: IFFilter.IF_TYPE.STR_EQ });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '日期为', value: IFFilter.IF_TYPE.DAT_EQ });
    this.selectEle.addValue({ text: '日期超前', value: IFFilter.IF_TYPE.DAT_BEFORE });
    this.selectEle.addValue({ text: '日期滞后', value: IFFilter.IF_TYPE.DAT_AFTER });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '数字大于', value: IFFilter.IF_TYPE.NUM_BEFORE });
    this.selectEle.addValue({ text: '数字大于等于', value: IFFilter.IF_TYPE.NUM_BEFORE_EQ });
    this.selectEle.addValue({ text: '数字小于', value: IFFilter.IF_TYPE.NUM_AFTER });
    this.selectEle.addValue({ text: '数字小于等于', value: IFFilter.IF_TYPE.NUM_AFTER_EQ });
    this.selectEle.addValue({ text: '数字等于', value: IFFilter.IF_TYPE.NUM_EQ });
    this.selectEle.addValue({ text: '数字不等于', value: IFFilter.IF_TYPE.NUM_NOT_EQ });
    this.removeClass('hover');
    this.bind();
    this.selectEle.setSelect(IFFilter.IF_TYPE.NOT);
    this.hide();
  }

  unbind() {
    const { titleEle, selectEle } = this;
    XEvent.unbind(titleEle);
    XEvent.unbind(selectEle);
  }

  bind() {
    const {
      titleEle, titleIconEle, selectEle,
    } = this;
    XEvent.bind(selectEle, Constant.SYSTEM_EVENT_TYPE.CHANGE, (e) => {
      const { detail } = e;
      const { item } = detail;
      const { value } = item;
      this.setType(value);
    });
    XEvent.bind(titleEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      if (this.status) {
        this.status = false;
        this.hide();
        titleIconEle.removeClass('active');
      } else {
        this.status = true;
        this.show();
        titleIconEle.addClass('active');
      }
    });
  }

  setValue(value) {
    const { type } = this;
    switch (type) {
      case IFFilter.IF_TYPE.STR_NOT_INCLUDE:
      case IFFilter.IF_TYPE.STR_INCLUDE:
      case IFFilter.IF_TYPE.STR_EQ:
      case IFFilter.IF_TYPE.STR_START:
      case IFFilter.IF_TYPE.STR_END:
        this.valueInput.setValue(value);
        break;
      case IFFilter.IF_TYPE.DAT_EQ:
      case IFFilter.IF_TYPE.DAT_BEFORE:
      case IFFilter.IF_TYPE.DAT_AFTER:
        this.valueInput.setValue(value);
        break;
      case IFFilter.IF_TYPE.NUM_BEFORE:
      case IFFilter.IF_TYPE.NUM_BEFORE_EQ:
      case IFFilter.IF_TYPE.NUM_AFTER:
      case IFFilter.IF_TYPE.NUM_AFTER_EQ:
      case IFFilter.IF_TYPE.NUM_EQ:
      case IFFilter.IF_TYPE.NUM_NOT_EQ:
        this.valueInput.setValue(value);
        break;
    }
  }

  setType(type) {
    this.type = type;
    if (type) {
      switch (type) {
        case IFFilter.IF_TYPE.NOT:
        case IFFilter.IF_TYPE.CT_NOT_EMPTY:
        case IFFilter.IF_TYPE.CT_EMPTY:
          this.valueInputEleBox.hide();
          break;
        case IFFilter.IF_TYPE.STR_NOT_INCLUDE:
        case IFFilter.IF_TYPE.STR_INCLUDE:
        case IFFilter.IF_TYPE.STR_EQ:
        case IFFilter.IF_TYPE.STR_START:
        case IFFilter.IF_TYPE.STR_END:
          this.valueInputEleBox.show();
          break;
        case IFFilter.IF_TYPE.DAT_EQ:
        case IFFilter.IF_TYPE.DAT_BEFORE:
        case IFFilter.IF_TYPE.DAT_AFTER:
          this.valueInputEleBox.show();
          break;
        case IFFilter.IF_TYPE.NUM_BEFORE:
        case IFFilter.IF_TYPE.NUM_BEFORE_EQ:
        case IFFilter.IF_TYPE.NUM_AFTER:
        case IFFilter.IF_TYPE.NUM_AFTER_EQ:
        case IFFilter.IF_TYPE.NUM_EQ:
        case IFFilter.IF_TYPE.NUM_NOT_EQ:
          this.valueInputEleBox.show();
          break;
        default:
          this.valueInputEleBox.hide();
          break;
      }
    }
  }

  show() {
    this.status = true;
    this.selectEleBox.show();
    this.setType(this.type);
  }

  hide() {
    this.status = false;
    this.selectEleBox.hide();
    this.valueInputEleBox.hide();
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.selectEle.destroy();
  }

}
IFFilter.IF_TYPE = {
  NOT: 1,
  CT_NOT_EMPTY: 2,
  CT_EMPTY: 3,
  STR_NOT_INCLUDE: 4,
  STR_INCLUDE: 5,
  STR_EQ: 6,
  STR_START: 7,
  STR_END: 8,
  DAT_EQ: 9,
  DAT_BEFORE: 10,
  DAT_AFTER: 11,
  NUM_BEFORE: 12,
  NUM_BEFORE_EQ: 13,
  NUM_AFTER: 14,
  NUM_AFTER_EQ: 15,
  NUM_EQ: 16,
  NUM_NOT_EQ: 17,
};

export {
  IFFilter,
};
