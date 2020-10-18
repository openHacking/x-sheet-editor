import { h } from '../../../lib/Element';
import { Constant, cssPrefix } from '../../../const/Constant';
import { Widget } from '../../../lib/Widget';
import { XEvent } from '../../../lib/XEvent';

class SearchInput extends Widget {

  constructor() {
    super(`${cssPrefix}-form-search-input`);
    this.inputWrapEle = h('div', `${cssPrefix}-form-input-wrap`);
    this.inputInnerEle = h('div', `${cssPrefix}-form-input-inner`);
    this.inputEle = h('input', `${cssPrefix}-form-input-source`);
    this.searchEle = h('div', `${cssPrefix}-form-input-search`);
    this.inputInnerEle.children(this.inputEle);
    this.inputWrapEle.children(this.inputInnerEle);
    this.children(this.inputWrapEle);
    this.children(this.searchEle);
    this.bind();
  }

  bind() {
    XEvent.bind(this.inputEle, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      e.stopPropagation();
    });
  }

}

export {
  SearchInput,
};
