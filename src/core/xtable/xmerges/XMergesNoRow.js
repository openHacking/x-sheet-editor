import { XMergesNo } from './XMergesNo';

class XMergesNoRow {

  constructor() {
    this.nos = [];
  }

  getNo(no) {
    if (this.nos[no]) { return this.nos[no]; }
    this.nos[no] = new XMergesNo(no);
    return this.nos[no];
  }

  removeRow(ri) {
    this.nos.splice(ri, 1);
    for (let i = ri, len = this.nos.length; i < len; i++) {
      let item = this.nos[i];
      if (item) {
        item.setNo(item.no - 1);
      }
    }
  }

  insertRowAfter(ri) {
    const next = ri + 1;
    this.nos.splice(next, 0, new XMergesNo(next));
    for (let i = next + 1, len = this.nos.length; i < len; i++) {
      let item = this.nos[i];
      if (item) {
        item.setNo(item.no + 1);
      }
    }
  }

  insertRowBefore(ri) {
    const last = ri - 1;
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
  XMergesNoRow,
};
