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

  syncNo() {
    const { nos } = this;
    for (let i = 0, len = nos.length; i < len; i++) {
      let item = nos[i];
      if (item) {
        item.setNo(i);
      }
    }
  }

  removeCol(ci) {
    this.nos.splice(ci, 1);
    this.syncNo();
  }

  insertColAfter(ci) {
    const next = ci + 1;
    this.nos.splice(next, 0, new XMergesNo());
    this.syncNo();
  }

  insertColBefore(ci) {
    this.nos.splice(ci, 0, new XMergesNo());
    this.syncNo();
  }

}

export {
  XMergesNoCol,
};
