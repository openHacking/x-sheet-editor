import { RectRange } from '../tablebase/RectRange';
import { Snapshot } from '../snapshot/Snapshot';
import { RangeTree } from '../tablebase/RangeTree';

/**
 * Merges
 */
class Merges extends RangeTree {

  /**
     * Merges 合并区域管理
     */
  constructor({
    snapshot = new Snapshot(),
    merges = [],
  }) {
    super({ snapshot });
    merges.map(merge => RectRange.valueOf(merge)).forEach(view => this.add(view));
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
