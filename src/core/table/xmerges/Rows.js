import { Index } from './Index';

class Rows {

  constructor() {
    this.index = [];
  }

  getIndex(ri) {
    if (this.index[ri]) { return this.index[ri]; }
    this.index[ri] = new Index(ri);
    return this.index[ri];
  }

}

export {
  Rows,
};
