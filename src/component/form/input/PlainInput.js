import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';
import { h } from '../../../lib/Element';

class PlainInput extends Widget {

  constructor() {
    super(`${cssPrefix}-form-plain-input`);
    this.inputWrapEle = h('div', `${cssPrefix}-form-input-wrap`);
    this.inputInnerEle = h('div', `${cssPrefix}-form-input-inner`);
    this.inputEle = h('input', `${cssPrefix}-form-input-source`);
    this.inputInnerEle.children(this.inputEle);
    this.inputWrapEle.children(this.inputInnerEle);
    this.children(this.inputWrapEle);
  }

  setValue(value) {
    this.inputEle.val(value);
  }

}

export {
  PlainInput,
};
