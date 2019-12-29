import { RectRange } from './RectRange';

class Merges {
  /**
   *  Merges
   * @param {RectRange[]} d 区域数组
   */
  constructor(d = []) {
    this._ = d;
  }

  /**
   * 遍历所有区域
   * @param {Function} cb 回调函数
   */
  forEach(cb) {
    this._.forEach(cb);
  }

  /**
   * 删除区域数组中被指定区域包含的区域
   * @param {RectRange} cr 区域
   */
  deleteWithin(cr) {
    this._ = this._.filter(it => !it.within(cr));
  }

  /**
   * 返回区域数组中第一个包含指定行和列的区域
   * @param {int} ri 行索引
   * @param {int} ci  列索引
   * @returns {*}
   */
  getFirstIncludes(ri, ci) {
    for (let i = 0; i < this._.length; i += 1) {
      const it = this._[i];
      if (it.includes(ri, ci)) {
        return it;
      }
    }
    return null;
  }

  /**
   * 返回新的合并实例,同时剔除原来的合并实例区域数组中不和指定区域发生重合的区域
   * @param {RectRange} cellRange 区域
   * @returns {Merges}
   */
  filterIntersects(cellRange) {
    return new Merges(this._.filter(it => it.intersects(cellRange)));
  }

  /**
   * 判断区域数组中是否存在和指定区域发生重合的区域
   * @param {RectRange} cellRange 区域
   * @returns {boolean}
   */
  intersects(cellRange) {
    for (let i = 0; i < this._.length; i += 1) {
      const it = this._[i];
      if (it.intersects(cellRange)) {
        // console.log('intersects');
        return true;
      }
    }
    return false;
  }

  /**
   * 返回区域数组中和指定区域发生重合的新区域
   * @param {RectRange} cellRange 区域
   * @returns {*}
   */
  union(cellRange) {
    let cr = cellRange;
    this._.forEach((it) => {
      if (it.intersects(cr)) {
        cr = it.union(cr);
      }
    });
    return cr;
  }

  /**
   * 添加一个新的区域, 并且删除区域数组中被新区域包含的区域
   * @param {RectRange} cr 区域
   */
  add(cr) {
    this.deleteWithin(cr);
    this._.push(cr);
  }

  /**
   * 区域数组中和指定区域发生重合的区域移动指定的行和列
   * @param {RectRange} cellRange 区域
   * @param {int} rn 增加的行索引
   * @param {int} cn 增加的列索引
   */
  move(cellRange, rn, cn) {
    this._.forEach((it1) => {
      const it = it1;
      if (it.within(cellRange)) {
        it.eri += rn;
        it.sri += rn;
        it.sci += cn;
        it.eci += cn;
      }
    });
  }

  // type: row | column
  shift(type, index, n, cbWithin) {
    this._.forEach((cellRange) => {
      const {
        sri, sci, eri, eci,
      } = cellRange;
      const range = cellRange;
      if (type === 'row') {
        if (sri >= index) {
          range.sri += n;
          range.eri += n;
        } else if (sri < index && index <= eri) {
          range.eri += n;
          cbWithin(sri, sci, n, 0);
        }
      } else if (type === 'column') {
        if (sci >= index) {
          range.sci += n;
          range.eci += n;
        } else if (sci < index && index <= eci) {
          range.eci += n;
          cbWithin(sri, sci, 0, n);
        }
      }
    });
  }

  setData(merges) {
    this._ = merges.map(merge => RectRange.valueOf(merge));
    return this;
  }

  getData() {
    return this._.map(merge => merge.toString());
  }
}

export { Merges };

export default Merges;
