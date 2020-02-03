import { Utils } from '../../utils/Utils';

class History {
  constructor(option) {
    this._ = [];
    this.option = Utils.mergeDeep({}, {
      onAdd: () => {},
      onPop: () => {},
      onClear: () => {},
    }, option);
  }

  add(ele) {
    this._.unshift(ele);
    this.option.onAdd(ele);
  }

  pop() {
    if (!this.isEmpty()) {
      const result = this._.shift();
      this.option.onPop(result);
    }
  }

  get() {
    return this._[0];
  }

  clear() {
    this._ = [];
    this.option.onClear();
  }

  isEmpty() {
    return this._.length === 0;
  }

  length() {
    return this._.length;
  }
}

export { History };
