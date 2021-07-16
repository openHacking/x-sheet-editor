import { XMergesNo } from './XMergesNo';

class XMergesNoCol {

  constructor() {
    this.nos = [];
  }

  getNo(ci) {
    if (this.nos[ci]) { return this.nos[ci]; }
    this.nos[ci] = new XMergesNo(ci);
    return this.nos[ci];
  }

  removeCol(ci) {
    this.nos.splice(ci, 1);
    for (let i = ci, len = this.nos.length; i < len; i++) {
      let item = this.nos[i];
      if (item) {
        item.setNo(item.no - 1);
      }
    }
  }

  insertColAfter(ci) {
    const next = ci - 1;
    this.nos.splice(next, 0, new XMergesNo(next));
    for (let i = next + 1, len = this.nos.length; i < len; i++) {
      let item = this.nos[i];
      if (item) {
        item.setNo(item.no + 1);
      }
    }
  }

  insertColBefore(ci) {
    const last = ci - 1;
    this.nos.splice(last, 0, new XMergesNo(last));
    for (let i = last + 1, len = this.nos.length; i < len; i++) {
      let item = this.nos[i];
      if (item) {
        item.setNo(item.no + 1);
      }
    }
  }

}

export {
  XMergesNoCol,
};
