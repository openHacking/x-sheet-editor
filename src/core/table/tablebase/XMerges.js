class NO {

  constructor(index) {
    this.index = index;
  }

}

class Rows {

  constructor() {
    this.nos = [];
  }

  getNo(row) {
    const no = this.nos[row];
    if (no) {
      return no;
    }
    // eslint-disable-next-line no-return-assign
    return this.nos[row] = new NO(row);
  }

}

class Cols {

  constructor() {
    this.nos = [];
  }

  getNo(col) {
    const no = this.nos[col];
    if (no) {
      return no;
    }
    // eslint-disable-next-line no-return-assign
    return this.nos[col] = new NO(col);
  }

}

class XMerges {

  constructor({
    data = [],
  }) {
    this.data = data;
    this.index = [];
  }

}

export {
  XMerges,
};
