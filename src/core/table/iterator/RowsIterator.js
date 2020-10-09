import { BaseIterator } from './BaseIterator';

let fold = [false, false, false, false, true, true];

class RowsIterator extends BaseIterator {

  static setFold(value) {
    fold = value;
  }

  constructor() {
    super();
    this.useFold = true;
  }

  foldOnOff(onOff) {
    this.useFold = onOff;
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

  nextRow() {
    const { begin } = this;
    let ri = -1;
    this.setLoop((i) => {
      if (i !== begin) {
        ri = i;
        return false;
      }
      return true;
    }).execute();
    return ri;
  }

  static getInstance() {
    return new RowsIterator();
  }

}

export {
  RowsIterator,
};
