import { Snapshot } from '../snapshot/Snapshot';
import { Rtree } from '../../../lib/rtree/Rtree';
import { Listen } from '../../../lib/Listen';
import { RtreeUtils } from '../../../utils/RtreeUtils';
import { SheetUtils } from '../../../utils/SheetUtils';

/**
 * RangeTree
 */
class RangeTree {

  /**
     * RangeTree 区域管理
     */
  constructor({
    snapshot = new Snapshot(),
  }) {
    this.snapshot = snapshot;
    this.rTree = new Rtree();
    this.listen = new Listen();
  }

  /**
     * 获取包含点的矩形区域
     * @param ri
     * @param ci
     */
  getFirstInclude(ri, ci) {
    let { rTree } = this;
    let bbox = {
      minX: ci,
      minY: ri,
      maxX: ci,
      maxY: ri,
    };
    let find = rTree.first(bbox);
    if (find) {
      return RtreeUtils.bboxToRange(find);
    }
    return SheetUtils.Undef;
  }

  /**
   * 获取包含点的矩形区域
   * @param ri
   * @param ci
   */
  getMasterInclude(ri, ci) {
    const find = this.getFirstInclude(ri, ci);
    if (find.sri === ri) {
      if (find.sci === ci) {
        return find;
      }
    }
    return SheetUtils.Undef;
  }

  /**
     * 获取重合的区域
     * @param rectRange
     */
  getIncludes(rectRange) {
    let { rTree } = this;
    let bbox = RtreeUtils.rangeToBbox(rectRange);
    const array = rTree.search(bbox);
    return array.map(bbox => RtreeUtils.bboxToRange(bbox));
  }

  /**
     * 添加矩形区域
     * @param rectRange
     */
  push(rectRange) {
    let { rTree } = this;
    let bbox = RtreeUtils.rangeToBbox(rectRange);
    rTree.insert(bbox);
    return this;
  }

  /**
     * 删除矩形区域
     * @param rectRange
     */
  shift(rectRange) {
    let { rTree } = this;
    let bbox = RtreeUtils.rangeToBbox(rectRange);
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
    }
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
    return rTree.all().map(bbox => RtreeUtils.bboxToRange(bbox));
  }

  /**
     * 获取交叉矩形新区域
     * @param rectRange
     */
  union(rectRange) {
    let { rTree } = this;
    let bbox = RtreeUtils.rangeToBbox(rectRange);
    let array = rTree.search(bbox);
    if (array.length === 0) {
      return rectRange;
    }
    let clone = rectRange.clone();
    for (let i = 0, len = array.length; i < len; i++) {
      let range = RtreeUtils.bboxToRange(array[i]);
      clone = clone.union(range);
    }
    if (!clone.equals(rectRange)) {
      return this.union(clone);
    }
    return rectRange;
  }

  /**
     * 行扩展
     * @param ri
     * @param number
     */
  rowAfterExpand(ri, number) {
    let bbox = {
      minX: 0,
      minY: ri,
      maxX: 1433,
      maxY: 1048576,
    };
    let { rTree } = this;
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
      if (item.minY === ri) {
        item.maxY += number;
      } else {
        item.minY += number;
        item.maxY += number;
      }
    }
    rTree.load(array);
  }

  /**
     * 列扩展
     * @param ci
     * @param number
     */
  colAfterExpand(ci, number) {
    const bbox = {
      minX: ci,
      minY: 0,
      maxX: 1433,
      maxY: 1048576,
    };
    let { rTree } = this;
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
      if (item.minX === ci) {
        item.maxX += number;
      } else {
        item.minX += number;
        item.maxX += number;
      }
    }
    rTree.load(array);
  }

  /**
     * 行收缩
     * @param ri
     * @param number
     */
  rowAfterShrink(ri, number) {
    let bbox = {
      minX: 0,
      minY: ri,
      maxX: 1433,
      maxY: 1048576,
    };
    let { rTree } = this;
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
      if (item.minY === ri) {
        item.maxY -= number;
      } else {
        item.minY -= number;
        item.maxY -= number;
      }
    }
    rTree.load(array);
  }

  /**
     * 列收索
     * @param ci
     * @param number
     */
  colAfterShrink(ci, number) {
    const bbox = {
      minX: ci,
      minY: 0,
      maxX: 1433,
      maxY: 1048576,
    };
    let { rTree } = this;
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
      if (item.minX === ci) {
        item.maxX -= number;
      } else {
        item.minX -= number;
        item.maxX -= number;
      }
    }
    rTree.load(array);
  }

  /**
   * 行扩展
   * @param ri
   * @param number
   */
  rowBeforeExpand(ri, number) {
    let bbox = {
      minX: 0,
      minY: ri,
      maxX: 1433,
      maxY: 1048576,
    };
    let { rTree } = this;
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
      item.minY += number;
      item.maxY += number;
    }
    rTree.load(array);
  }

  /**
   * 列扩展
   * @param ci
   * @param number
   */
  colBeforeExpand(ci, number) {
    const bbox = {
      minX: ci,
      minY: 0,
      maxX: 1433,
      maxY: 1048576,
    };
    let { rTree } = this;
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
      item.minX += number;
      item.maxX += number;
    }
    rTree.load(array);
  }

  /**
   * 行收缩
   * @param ri
   * @param number
   */
  rowBeforeShrink(ri, number) {
    let bbox = {
      minX: 0,
      minY: ri,
      maxX: 1433,
      maxY: 1048576,
    };
    let { rTree } = this;
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
      item.minY -= number;
      item.maxY -= number;
    }
    rTree.load(array);
  }

  /**
   * 列收索
   * @param ci
   * @param number
   */
  colBeforeShrink(ci, number) {
    const bbox = {
      minX: ci,
      minY: 0,
      maxX: 1433,
      maxY: 1048576,
    };
    let { rTree } = this;
    let array = rTree.search(bbox);
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i];
      rTree.remove(item);
      item.minX -= number;
      item.maxX -= number;
    }
    rTree.load(array);
  }
}

export {
  RangeTree,
};