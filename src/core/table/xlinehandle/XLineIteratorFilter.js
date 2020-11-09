class XLineIteratorFilter {

  constructor({
    logic, stack,
  }) {
    this.stack = stack;
    this.logic = logic;
  }

  run({
    row, col,
  }) {
    const { logic, stack } = this;
    let filterResult = XLineIteratorFilter.RETURN_TYPE.HANDLE;
    switch (logic) {
      case XLineIteratorFilter.FILTER_LOGIC.AND: {
        filterResult = XLineIteratorFilter.RETURN_TYPE.HANDLE;
        for (let i = 0; i < stack.length; i += 1) {
          const returnValue = stack[i](row, col);
          if (returnValue !== XLineIteratorFilter.RETURN_TYPE.HANDLE) {
            filterResult = XLineIteratorFilter.RETURN_TYPE.JUMP;
            break;
          }
        }
        break;
      }
      case XLineIteratorFilter.FILTER_LOGIC.OR: {
        filterResult = XLineIteratorFilter.RETURN_TYPE.JUMP;
        for (let i = 0; i < stack.length; i += 1) {
          const returnValue = stack[i](row, col);
          if (returnValue === XLineIteratorFilter.RETURN_TYPE.HANDLE) {
            filterResult = XLineIteratorFilter.RETURN_TYPE.HANDLE;
            break;
          }
        }
        break;
      }
    }
    return filterResult;
  }

}
XLineIteratorFilter.RETURN_TYPE = {
  HANDLE: 1,
  JUMP: 2,
};
XLineIteratorFilter.FILTER_LOGIC = {
  AND: 1,
  OR: 2,
};
XLineIteratorFilter.EMPTY = new XLineIteratorFilter({
  logic: XLineIteratorFilter.FILTER_LOGIC.AND,
  stack: [],
});

export {
  XLineIteratorFilter,
};
