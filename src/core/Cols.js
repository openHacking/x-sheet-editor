import { Utils } from '../utils/Utils';

class Cols {
  /**
   * Cols
   * @param len
   * @param width
   */
  constructor({ len, width }) {
    this._ = [];
    this.width = width;
    this.len = len;
  }

  /**
   * 获取指定列
   * @param ci
   * @returns {*}
   */
  get(ci) {
    return this._[ci];
  }

  /**
   * 获取指定列,不存在时创建新的
   * @param ci
   * @returns {*}
   */
  getOrNew(ci) {
    this._[ci] = this._[ci] || {};
    return this._[ci];
  }

  /**
   * 获取指定列的宽度
   * @param i
   * @returns {*}
   */
  getWidth(i) {
    const col = this._[i];
    if (col && col.width) {
      return col.width;
    }
    return this.width;
  }

  /**
   * 设置指定列的宽度
   * @param i
   * @param width
   */
  setWidth(i, width) {
    const col = this.get(i);
    col.width = width;
    this.computeLeft(i, this.len);
  }

  /**
   * 获取指定区域内的列的宽度
   * @param ci
   * @param ei
   * @param cb
   */
  eachWidth(ci, ei, cb) {
    let x = 0;
    for (let i = ci; i <= ei; i += 1) {
      const colWidth = this.getWidth(i);
      cb(i, colWidth, x);
      x += colWidth;
    }
  }

  /**
   * 统计指定列区间的总宽度
   * @param sci
   * @param eci)
   * @returns {number}
   */
  sectionSumWidth(sci, eci) {
    return Utils.rangeSum(sci, eci + 1, i => this.getWidth(i));
  }

  /**
   * 统计总的宽度
   * @returns {number}
   */
  totalWidth() {
    return Utils.rangeSum(0, this.len, i => this.getWidth(i));
  }

  /**
   * 获取指定列和左边的距离
   * @param i
   */
  getLeft(i) {
    const col = this.getOrNew(i);
    if (!col.left) {
      this.computeLeft(0, i);
    }
    return col.left;
  }

  /**
   * 计算指定区间中的列和左边的距离
   * @param sci
   * @param eci
   */
  computeLeft(sci, eci) {
    let left = 0;
    if (sci > 0) {
      left += this.getLeft(sci - 1);
      left += this.getWidth(sci - 1);
    }
    for (let i = sci; i <= eci; i += 1) {
      const col = this.getOrNew(i);
      col.left = left;
      left += this.getWidth(i);
    }
  }
}

export { Cols };
