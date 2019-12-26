import { Widget } from '../lib/Widget';
import { cssPrefix } from '../config';

let number = 0;

class Tab extends Widget {
  constructor(name = `${number += 1}-tab`) {
    super(`${cssPrefix}-sheet-tab`);
    this.setName(name);
  }

  setName(name) {
    this.name = name;
    this.text(this.name);
  }
}

export { Tab };
