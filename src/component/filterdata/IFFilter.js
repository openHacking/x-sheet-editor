import { ELContextMenuItem } from '../contextmenu/ELContextMenuItem';
import { Constant, cssPrefix } from '../../const/Constant';
import { h } from '../../lib/Element';
import { Select } from '../form/select/Select';
import { XEvent } from '../../lib/XEvent';

class IFFilter extends ELContextMenuItem {

  constructor() {
    super(`${cssPrefix}-filter-data-menu-item ${cssPrefix}-if-filter`);
    this.status = false;

    this.titleEle = h('div', `${cssPrefix}-if-filter-title`);
    this.titleTextEle = h('span', `${cssPrefix}-if-filter-title-text`);
    this.titleIconEle = h('span', `${cssPrefix}-if-filter-title-icon`);
    this.titleTextEle.text('条件过滤');
    this.titleEle.children(this.titleIconEle);
    this.titleEle.children(this.titleTextEle);
    this.children(this.titleEle);

    this.selectEleBox = h('div', `${cssPrefix}-if-filter-select-box`);
    this.selectEle = new Select();
    this.selectEleBox.children(this.selectEle);
    this.children(this.selectEleBox);

    this.selectEle.addValue({ text: '无' });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '为空' });
    this.selectEle.addValue({ text: '不为空' });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '文本包含' });
    this.selectEle.addValue({ text: '文本不包含' });
    this.selectEle.addValue({ text: '文本开头' });
    this.selectEle.addValue({ text: '文本结尾' });
    this.selectEle.addValue({ text: '文本结尾' });
    this.selectEle.addValue({ text: '文本相符' });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '日期为' });
    this.selectEle.addValue({ text: '日期超前' });
    this.selectEle.addValue({ text: '日期滞后' });
    this.selectEle.addDivider();
    this.selectEle.addValue({ text: '数字大于' });
    this.selectEle.addValue({ text: '数字大于等于' });
    this.selectEle.addValue({ text: '数字小于' });
    this.selectEle.addValue({ text: '数字小于等于' });
    this.selectEle.addValue({ text: '数字等于' });
    this.selectEle.addValue({ text: '数字不等于' });

    this.removeClass('hover');
    this.bind();
    this.hide();
  }

  unbind() {
    const { titleEle } = this;
    XEvent.unbind(titleEle);
  }

  bind() {
    const { titleEle, titleIconEle } = this;
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

  show() {
    this.status = true;
    this.selectEleBox.show();
  }

  hide() {
    this.status = false;
    this.selectEleBox.hide();
  }

  destroy() {
    super.destroy();
    this.unbind();
    this.selectEle.destroy();
  }

}

export {
  IFFilter,
};
