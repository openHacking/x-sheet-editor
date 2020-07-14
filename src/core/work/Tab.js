import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../const/Constant';

let number = 0;

class Tab extends Widget {
  constructor(name = `Sheet${number += 1}`) {
    super(`${cssPrefix}-sheet-tab`);
    this.setName(name);
  }

  setName(name) {
    this.name = name;
    this.text(this.name);
  }
}

export { Tab };
