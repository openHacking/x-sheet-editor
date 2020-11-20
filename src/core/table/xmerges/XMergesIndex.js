class XMergesIndex {

  constructor() {
    this.index = [];
  }

  set(ri, ci, point) {
    const line = this.index[ri] || [];
    line[ci] = point;
    this.index[ri] = line;
  }

  get(ri, ci) {
    const line = this.index[ri];
    return line ? line[ci] : undefined;
  }

  clear(ri, ci) {
    const line = this.index[ri];
    if (line) {
      line[ci] = undefined;
    }
  }

}

export {
  XMergesIndex,
};
