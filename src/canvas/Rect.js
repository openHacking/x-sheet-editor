class Rect {

  constructor({
    x, y, width, height,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * 扩展尺寸
   * @param size
   * @returns {Rect}
   */
  expandSize(size) {
    this.width += size;
    this.height += size;
    return this;
  }

  /**
   * 判断两个矩形是否不发生重合
   * @param {Rect} other 区域
   * @returns {boolean}
   */
  disjoint(other) {
    return this.x > other.x + other.width
      || this.y > this.y + other.height
      || other.x > this.x + this.width
      || other.y > this.y + this.height;
  }

  /**
   * 复制
   * @returns {Rect}
   */
  clone() {
    const { x, y, width, height } = this;
    return new Rect({ x, y, width, height });
  }

}


export { Rect };
