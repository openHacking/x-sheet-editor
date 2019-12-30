import { Utils } from '../utils/Utils';

class Rows {
  /**
   * Rows
   * @param len
   * @param height
   */
  constructor({ len, height }) {
    this._ = [];
    this.height = height;
    this.len = len;
  }

  /**
   * 获取指定行
   * @param ri
   * @returns {*}
   */
  get(ri) {
    return this._[ri];
  }

  /**
   * 获取指定行,不存在时创建新的
   * @param ri
   * @returns {*}
   */
  getOrNew(ri) {
    this._[ri] = this._[ri] || {};
    return this._[ri];
  }

  /**
   * 获取指定行的高度
   * @param ri
   * @returns {*}
   */
  getHeight(ri) {
    const row = this.get(ri);
    if (row && row.height) {
      return row.height;
    }
    return this.height;
  }

  /**
   * 设置指定行的高度
   * @param ri
   * @param height
   */
  setHeight(ri, height) {
    const row = this.get(ri);
    row.height = height;
    this.computeTop(ri, this.len);
  }

  /**
   * 获取指定区域内的行的高度
   * @param ri
   * @param ei
   * @param cb
   */
  eachHeight(ri, ei, cb) {
    let y = 0;
    for (let i = ri; i <= ei; i += 1) {
      const rowHeight = this.getHeight(i);
      cb(i, rowHeight, y);
      y += rowHeight;
    }
  }

  /**
   * 统计指定行区间的总高度
   * @param sri
   * @param eri
   * @returns {number}
   */
  sectionSumHeight(sri, eri) {
    return Utils.rangeSum(sri, eri + 1, i => this.getHeight(i));
  }

  /**
   * 统计总的高度
   * @returns {number}
   */
  totalHeight() {
    return Utils.rangeSum(0, this.len, i => this.getHeight(i));
  }

  /**
   * 获取指定行和顶部的距离
   * @param ri
   */
  getTop(ri) {
    const row = this.getOrNew(ri);
    if (!row.top) {
      this.computeTop(0, ri);
    }
    return row.top;
  }

  /**
   * 计算指定区间中的行和顶部的距离
   * @param sri
   * @param eri
   */
  computeTop(sri, eri) {
    let top = 0;
    if (sri > 0) {
      top += this.getTop(sri - 1);
      top += this.getHeight(sri - 1);
    }
    for (let i = sri; i <= eri; i += 1) {
      const row = this.getOrNew(i);
      row.top = top;
      top += this.getHeight(i);
    }
  }
}

export { Rows };
