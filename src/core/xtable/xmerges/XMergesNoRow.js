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

  syncNo() {
    const { nos } = this;
    for (let i = 0, len = nos.length; i < len; i++) {
      let item = nos[i];
      if (item) {
        item.setNo(i);
      }
    }
  }

  removeRow(ri) {
    this.nos.splice(ri, 1);
    this.syncNo();
  }

  insertRowAfter(ri) {
    const next = ri + 1;
    this.nos.splice(next, 0, new XMergesNo());
    this.syncNo();
  }

  insertRowBefore(ri) {
    this.nos.splice(ri, 0, new XMergesNo());
    this.syncNo();
  }

}

export {
  XMergesNoRow,
};
