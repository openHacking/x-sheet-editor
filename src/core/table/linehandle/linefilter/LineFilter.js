class LineFilter {

  constructor(callback) {
    this.callback = callback;
  }

  execute() {
    // eslint-disable-next-line prefer-spread,prefer-rest-params
    return this.callback.apply(this, arguments);
  }

}

LineFilter.RETURN_TYPE = {
  HANDLE: 1,
  JUMP: 2,
  NEXT_ROW: 3,
  NEXT_COL: 4,
};

export {
  LineFilter,
};
