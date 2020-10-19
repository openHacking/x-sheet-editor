import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';

class ValueItem extends Widget {

  constructor({
    text = '',
  }) {
    super(`${cssPrefix}-value-filter-item`);
    this.status = true;
    this.iconEle = h('div', `${cssPrefix}-value-filter-item-icon`);
    this.textEle = h('div', `${cssPrefix}-value-filter-item-text`);
    this.textEle.text(text);
    this.children(this.iconEle);
    this.children(this.textEle);
    this.select(false);
  }

  select(status) {
    this.status = status;
    if (this.status) {
      this.iconEle.css('opacity', 1);
    } else {
      this.iconEle.css('opacity', 0);
    }
  }

}

export {
  ValueItem,
};
