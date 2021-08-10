import { Rtree } from '../../../lib/rtree/Rtree';
import { RectRange } from '../tablebase/RectRange';
import { Snapshot } from '../snapshot/Snapshot';
import { SheetUtils } from '../../../utils/SheetUtils';

/**
 * Merges
 */
class Merges {

  /**
     * Bbox转Range
     * @param bbox
     */
  static $$toRange(bbox) {
    return new RectRange(bbox.minY, bbox.minX, bbox.maxY, bbox.maxX);
  }

  /**
     * Range转Bbox
     * @param range
     */
  static $$toBBox(range) {
    return {
      minX: range.sci,
      minY: range.sri,
      maxX: range.eci,
      maxY: range.eri,
    };
  }

  /**
     * Merges 合并区域管理
     */
  constructor({
    snapshot = new Snapshot(),
    merges = [],
  }) {
    this.rTree = new Rtree();
    this.snapshot = snapshot;
    merges.map(merge => RectRange.valueOf(merge)).forEach(view => this.add(view));
  }

  /**
     * 获取包含点的矩形区域
     * @param ri
     * @param ci
     */
  getFirstIncludes(ri, ci) {
    let { rTree } = this;
    let bbox = {
      minX: ci,
      minY: ri,
      maxX: ci,
      maxY: ri,
    };
    let find = rTree.one(bbox);
    if (find) {
      return Merges.$$toRange(find);
    }
    return SheetUtils.Undef;
  }

  /**
     * 添加矩形区域
     * @param rectRange
     */
  push(rectRange) {
    let { rTree } = this;
    let bbox = Merges.$$toBBox(rectRange);
    rTree.insert(bbox);
    return this;
  }

  /**
     * 删除矩形区域
     * @param rectRange
     */
  shift(rectRange) {
    let { rTree } = this;
    let bbox = Merges.$$toBBox(rectRange);
    rTree.remove(bbox);
    return this;
  }

  /**
   * 添加矩形区域
   * @param rectRange
   */
  add(rectRange) {
    let { listen, snapshot } = this;
    let action = {
      undo: () => {
        this.shift(rectRange);
      },
      redo: () => {
        this.push(rectRange);
        listen.execute('add', rectRange);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  /**
   * 删除矩形区域
   * @param rectRange
   */
  delete(rectRange) {
    let { listen, snapshot } = this;
    let action = {
      undo: () => {
        this.push(rectRange);
      },
      redo: () => {
        this.shift(rectRange);
        listen.execute('delete', rectRange);
      },
    };
    snapshot.addAction(action);
    action.redo();
  }

  /**
     * 获取所有的矩形区域
     */
  getAll() {
    let { rTree } = this;
    return rTree.all().map(bbox => Merges.$$toRange(bbox));
  }

  /**
     * 获取交叉矩形新区域
     * @param rectRange
     */
  union(rectRange) {
    let { rTree } = this;
    let bbox = Merges.$$toBBox(rectRange);
    let find = rTree.one(bbox);
    if (find) {
      return Merges.$$toRange(find);
    }
    return rectRange;
  }

  /**
     * 获取矩形的json数据
     */
  getData() {
    return {
      merges: this.getAll().map(range => range.toString()),
    };
  }

}

export {
  Merges,
};
