import { RectRange } from './RectRange';
import { Utils } from '../../../utils/Utils';

/**
 * Merges Class
 */
class Merges {

  /**
   * Merges
   * @param merges
   * @param cols
   * @param rows
   */
  constructor({
    merges = [],
    cols,
    rows,
  }) {
    this.rows = rows;
    this.cols = cols;
    this.data = merges.map(merge => RectRange.valueOf(merge));
    this.index = new Array(rows.len * cols.len);
  }

  /**
   * 获取包含在指定区域中的合并单元格
   * @param rectRange
   * @param cb
   */
  getIncludes(rectRange, cb) {
    const { index, data } = this;
    rectRange.each((ri, ci) => {
      const offset = this.getOffset(ri, ci);
      const no = index[offset];
      if (Utils.isNotUnDef(no)) {
        cb(data[no]);
      }
    });
  }

  /**
   * 获取偏移量
   * @param ri
   * @param ci
   * @return {*}
   */
  getOffset(ri, ci) {
    const { cols } = this;
    const { len } = cols;
    return (ri * len) + ci;
  }

  /**
   * 获取指定行列的合并单元格
   * @param ri
   * @param ci
   * @return {null|RectRange}
   */
  getFirstIncludes(ri, ci) {
    const { index, data } = this;
    const offset = this.getOffset(ri, ci);
    const no = index[offset];
    if (Utils.isUnDef(no)) {
      return null;
    }
    const item = data[no];
    if (Utils.isUnDef(item)) {
      return null;
    }
    return item;
  }

  /**
   * 添加合并单元格
   * @param rectRange
   * @param checked
   */
  add(rectRange, checked = true) {
    const { index, data } = this;
    // 删除旧的关联关系
    if (checked) {
      this.getIncludes(rectRange, old => this.delete(old));
    }
    // 添加新的单元格
    const len = data.length;
    data.push(rectRange);
    // 添加新的关联关系
    rectRange.each((ri, ci) => {
      const offset = this.getOffset(ri, ci);
      index[offset] = len;
    });
  }

  /**
   * 删除合并单元格
   * @param rectRange
   */
  delete(rectRange) {
    const { index, data } = this;
    // 删除合并单元格
    const { sri, sci } = rectRange;
    const offset = this.getOffset(sri, sci);
    const no = index[offset];
    if (Utils.isUnDef(no)) {
      return;
    }
    data.splice(no, 1);
    // 删除旧单元格索引
    rectRange.each((ri, ci) => {
      const offset = this.getOffset(ri, ci);
      index[offset] = undefined;
    });
    // 同步当前合并单元格索引
    this.sync(no);
  }

  /**
   * 返回联合的合并单元格(性能差,以后优化)
   * @param cellRange
   * @return {RectRange}
   */
  union(cellRange) {
    let cr = cellRange;
    const filter = [];
    for (let i = 0; i < this.data.length; i += 1) {
      const item = this.data[i];
      if (filter.find(e => e === item)) {
        continue;
      }
      if (item.intersects(cr)) {
        filter.push(item);
        cr = item.union(cr);
        i = -1;
      }
    }
    return cr;
  }

  /**
   * 同步索引
   */
  sync(offset = 0) {
    const { index, data } = this;
    for (let i = offset; i < data.length; i += 1) {
      const rectRange = data[i];
      rectRange.each((ri, ci) => {
        const offset = this.getOffset(ri, ci);
        index[offset] = i;
      });
    }
  }

  /**
   * 获取数据
   * @return {RectRange[]}
   */
  getData() {
    return this.data;
  }

  /**
   * 设置数据
   * @param data
   */
  setData(data) {
    this.data = data;
  }

}

export {
  Merges,
};
