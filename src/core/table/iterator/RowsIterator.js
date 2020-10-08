import { BaseIterator } from './BaseIterator';

let fold = [];

class RowsIterator extends BaseIterator {

  setFold(value) {
    fold = value;
  }

  execute() {
    const {
      loopCallback, nextCallback,
    } = this;
    const {
      begin, end,
    } = this;
    let i;
    if (begin > end) {
      i = end;
      for (; i >= begin; i -= 1, nextCallback(i)) {
        if (fold[i]) {
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
        if (fold[i]) {
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
