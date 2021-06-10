class XMergesPool {

  constructor() {
    this.pool = [];
  }

  clear() {
    this.pool = [];
  }

  add(view) {
    this.pool.push(view);
  }

  get(view) {
    const { pool } = this;
    for (let i = 0, len = pool.length; i < len; i++) {
      const item = pool[i];
      if (item.getView().intersects(view)) {
        return item;
      }
    }
    return null;
  }

  getPool() {
    return this.pool;
  }

  delete(view) {
    const { pool } = this;
    const filter = [];
    for (let i = 0, len = pool.length; i < len; i++) {
      const item = pool[i];
      const full = item.getView();
      if (!full.intersects(view)) {
        filter.push(item);
      }
    }
    this.pool = filter;
  }

}

export {
  XMergesPool,
};
