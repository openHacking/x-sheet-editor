import { Widget } from '../../../lib/Widget';
import { cssPrefix } from '../../../const/Constant';

class Input extends Widget {

  constructor() {
    super(`${cssPrefix}-form-input`);
  }

}

export {
  Input,
};
