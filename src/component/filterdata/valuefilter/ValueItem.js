import { Widget } from '../../../lib/Widget';
import { Constant, cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';
import { XEvent } from '../../../lib/XEvent';

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
    this.bind();
    this.select(false);
  }

  unbind() {
    XEvent.unbind(this);
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      this.select(!this.status);
    });
  }

  select(status) {
    this.status = status;
    if (this.status) {
      this.iconEle.css('opacity', 1);
    } else {
      this.iconEle.css('opacity', 0);
    }
  }

  destroy() {
    super.destroy();
    this.unbind();
  }

}

export {
  ValueItem,
};