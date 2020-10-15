import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';

class Select extends Widget {

  constructor() {
    super(`${cssPrefix}-form-select`);
  }

}

export {
  Select,
};
