import { RangeTree } from '../tablebase/RangeTree';
import { Snapshot } from '../snapshot/Snapshot';
import { RectRange } from '../tablebase/RectRange';

/**
 * Protection
 */
class Protection extends RangeTree {

  /**
   * Protection 保护区域管理
   */
  constructor({
    snapshot = new Snapshot(),
    protections = [],
  } = {}) {
    super({ snapshot });
    protections.map(protection => RectRange.valueOf(protection)).forEach(view => this.add(view));
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
  Protection,
};
