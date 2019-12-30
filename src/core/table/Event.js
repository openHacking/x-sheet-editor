import { Utils } from '../../utils/Utils';

class Event {
  constructor(native, options = {}) {
    this.native = native;
    Utils.mergeDeep(this, options);
  }
}

export { Event };
