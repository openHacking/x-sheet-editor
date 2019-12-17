class Rows {
  constructor({ len, height }) {
    this._ = [];
    this.height = height;
    this.len = len;
  }

  get(ri) {
    return this._[ri];
  }

  getOrNew(ri) {
    this._[ri] = this._[ri] || {};
    return this._[ri];
  }

  getHeight(ri) {
    const row = this.get(ri);
    if (row && row.height) {
      return row.height;
    }
    return this.height;
  }

  eachHeight(ri, ei, cb) {
    let y = 0;
    for (let i = ri; i <= ei; i += 1) {
      const rowHeight = this.getHeight(i);
      cb(i, rowHeight, y);
      y += rowHeight;
    }
  }
}

export { Rows };
