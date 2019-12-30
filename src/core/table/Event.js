import { Utils } from '../../utils/Utils';

class Event {
  constructor(native, options = {}) {
    this.native = native;
    this.isUse = false;
    Utils.mergeDeep(this, options);
  }

  use() {
    this.isUse = true;
  }
}

export { Event };
