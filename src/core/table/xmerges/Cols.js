import { Index } from './Index';

class Cols {

  constructor() {
    this.index = [];
  }

  getIndex(ci) {
    if (this.index[ci]) { return this.index[ci]; }
    this.index[ci] = new Index(ci);
    return this.index[ci];
  }

}

export {
  Cols,
};
