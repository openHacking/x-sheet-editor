import { BaseEdit } from './BaseEdit';
import { XEvent } from '../../../libs/XEvent';
import { Constant } from '../../../const/Constant';

class TableEdit extends BaseEdit {

  constructor({
    table,
  }) {
    super({ table });
    this.bind();
  }

  unbind() {
    XEvent.unbind(this);
  }

  bind() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.INPUT, () => {
      this.parseExpr();
    });
  }

  parseExpr() {

  }

  destroy() {
    this.unbind();
  }

}

export {
  TableEdit,
};
