import { BaseIterator } from './BaseIterator';

let fold = [];

class RowsIterator extends BaseIterator {

  static setFold(value) {
    fold = value;
  }

  constructor() {
    super();
    this.useFold = true;
  }

  enableFold() {
    this.useFold = true;
    return this;
  }

  disableFold() {
    this.useFold = false;
    return this;
  }

  execute() {
    const {
      loopCallback, nextCallback,
    } = this;
    const {
      begin, end, useFold,
    } = this;
    let i;
    if (begin > end) {
      i = end;
      for (; i >= begin; i -= 1, nextCallback(i)) {
        if (useFold && fold[i]) {
          continue;
        }
        const res = loopCallback(i);
        if (res === false) {
          break;
        }
      }
    } else {
      i = begin;
      for (; i <= end; i += 1, nextCallback(i)) {
        if (useFold && fold[i]) {
          continue;
        }
        const res = loopCallback(i);
        if (res === false) {
          break;
        }
      }
    }
    this.finishCallback(i);
    return this;
  }

  static getInstance() {
    return new RowsIterator();
  }

}

export {
  RowsIterator,
};
