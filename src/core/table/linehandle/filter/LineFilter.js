class LineFilter {

  constructor(callback) {
    this.callback = callback;
  }

  execute() {
    // eslint-disable-next-line prefer-spread,prefer-rest-params
    return this.callback.apply(this, arguments);
  }

}

export {
  LineFilter,
};
