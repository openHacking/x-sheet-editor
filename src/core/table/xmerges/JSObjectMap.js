class JSObjectMap {

  constructor() {
    this.map = {};
  }

  put(key, value) {
    this.map[key] = value;
  }

  get(key) {
    return this.map[key];
  }

  remove(key) {
    delete this.map[key];
  }

  each(callback) {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const key in this.map) {
      callback(this.map[key]);
    }
  }

}

export {
  JSObjectMap,
};
