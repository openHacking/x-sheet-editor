import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';

class ValueItem extends Widget {

  constructor({
    text = '', status = false, index = -1,
  }) {
    super(`${cssPrefix}-value-filter-item`);
    this.status = status;
    this.index = index;
    this.iconEle = h('div', `${cssPrefix}-value-filter-item-icon`);
    this.textEle = h('div', `${cssPrefix}-value-filter-item-text`);
    this.textEle.text(text);
    this.children(this.iconEle);
    this.children(this.textEle);
    this.setIndex(index);
    this.setStatus(status);
  }

  setIndex(index) {
    this.index = index;
    this.attr(`${cssPrefix}-value-filter-item-index`, `${this.index}`);
  }

  setStatus(status) {
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
