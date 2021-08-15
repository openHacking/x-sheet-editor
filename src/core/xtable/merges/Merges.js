import { RectRange } from '../tablebase/RectRange';
import { Snapshot } from '../snapshot/Snapshot';
import { RangeTree } from '../tablebase/RangeTree';
import { RtreeUtils } from '../../../utils/RtreeUtils';

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
  } = {}) {
    super({ snapshot });
    merges.map(merge => RectRange.valueOf(merge)).forEach(view => this.add(view));
  }

  /**
   * 删除行号
   * @param ri
   * @param number
   */
  removeRow(ri, number) {
    let { rTree, snapshot } = this;
    let footRange = new RectRange(ri, 0, RangeTree.MAX_ROW, RangeTree.MAX_COL);
    let fullRange = this.getFullRowRange(ri, number);
    let fullBbox = RtreeUtils.rangeToBbox(fullRange);
    let footBbox = RtreeUtils.rangeToBbox(footRange);
    let divers = [];
    let change = [];
    let search = [];
    let mergeAction = {
      undo: () => {
        let { length } = change;
        for (let i = 0; i < length; i++) {
          const item = change[i];
          const { style } = item;
          rTree.remove(item);
          switch (style) {
            case 'oddValue': {
              item.maxY = item.oldMax;
              break;
            }
            case 'evenValue': {
              item.minY = item.oldMin;
              item.maxY = item.oldMax;
              break;
            }
          }
        }
        rTree.load(search);
      },
      redo: () => {
        divers = [];
        change = [];
        search = rTree.search(footBbox);
        let { length } = search;
        for (let i = 0; i < length; i++) {
          const item = search[i];
          rTree.remove(item);
          if (item.minY < fullBbox.minY) {
            if (item.maxY < fullBbox.maxY) {
              let diffMax = item.maxY - fullBbox.minY;
              diffMax += 1;
              item.oldMax = item.maxY;
              item.maxY -= diffMax;
              item.style = 'oddValue';
              change.push(item);
              if (item.maxX !== item.minX || item.maxY !== item.minY) {
                divers.push(item);
              }
              continue;
            }
            if (item.maxY > fullBbox.maxY) {
              let diffMax = fullBbox.maxY - footBbox.minY;
              diffMax += 1;
              item.oldMax = item.maxY;
              item.maxY -= diffMax;
              item.style = 'oddValue';
              change.push(item);
              if (item.maxX !== item.minX || item.maxY !== item.minY) {
                divers.push(item);
              }
              continue;
            }
          }
          if (item.minY > fullBbox.minY) {
            if (item.minY < fullBbox.maxY) {
              if (item.maxY > fullBbox.maxY) {
                let diffMin = item.minY - fullBbox.minY;
                let diffMax = fullBbox.maxY - item.minY;
                diffMax += diffMin + 1;
                item.oldMax = item.maxY;
                item.oldMin = item.minY;
                item.maxY -= diffMax;
                item.minY -= diffMin;
                item.style = 'evenValue';
                change.push(item);
                if (item.maxX !== item.minX || item.maxY !== item.minY) {
                  divers.push(item);
                }
                continue;
              }
            }
            if (item.minY > fullBbox.maxY) {
              let diffValue = fullBbox.maxY - fullBbox.minY;
              diffValue += 1;
              item.oldMax = item.maxY;
              item.oldMin = item.minY;
              item.maxY -= diffValue;
              item.minY -= diffValue;
              item.style = 'evenValue';
              change.push(item);
              if (item.maxX !== item.minX || item.maxY !== item.minY) {
                divers.push(item);
              }
              continue;
            }
          }
          if (item.minY === fullBbox.minY) {
            if (item.maxY > fullBbox.maxY) {
              let diffMax = fullBbox.maxY - item.minY;
              diffMax += 1;
              item.oldMax = item.maxY;
              item.maxY -= diffMax;
              item.style = 'oddValue';
              change.push(item);
              if (item.maxX !== item.minX || item.maxY !== item.minY) {
                divers.push(item);
              }
            }
          }
        }
        rTree.load(divers);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 删除列号
   * @param ci
   * @param number
   */
  removeCol(ci, number) {
    let { rTree, snapshot } = this;
    let footRange = new RectRange(0, ci, RangeTree.MAX_ROW, RangeTree.MAX_COL);
    let fullRange = this.getFullColRange(ci, number);
    let fullBbox = RtreeUtils.rangeToBbox(fullRange);
    let footBbox = RtreeUtils.rangeToBbox(footRange);
    let divers = [];
    let change = [];
    let search = [];
    let mergeAction = {
      undo: () => {
        let { length } = change;
        for (let i = 0; i < length; i++) {
          const item = change[i];
          const { style } = item;
          rTree.remove(item);
          switch (style) {
            case 'oddValue': {
              item.maxX = item.oldMax;
              break;
            }
            case 'evenValue': {
              item.minX = item.oldMin;
              item.maxX = item.oldMax;
              break;
            }
          }
        }
        rTree.load(search);
      },
      redo: () => {
        divers = [];
        change = [];
        search = rTree.search(footBbox);
        let { length } = search;
        for (let i = 0; i < length; i++) {
          const item = search[i];
          rTree.remove(item);
          if (item.minX < fullBbox.minX) {
            if (item.maxX < fullBbox.maxX) {
              let diffMax = item.maxX - fullBbox.minX;
              diffMax += 1;
              item.oldMax = item.maxX;
              item.maxX -= diffMax;
              item.style = 'oddValue';
              change.push(item);
              if (item.maxX !== item.minX || item.maxY !== item.minY) {
                divers.push(item);
              }
              continue;
            }
            if (item.maxX > fullBbox.maxX) {
              let diffMax = fullBbox.maxX - footBbox.minX;
              diffMax += 1;
              item.oldMax = item.maxX;
              item.maxX -= diffMax;
              item.style = 'oddValue';
              change.push(item);
              if (item.maxX !== item.minX || item.maxY !== item.minY) {
                divers.push(item);
              }
              continue;
            }
          }
          if (item.minX > fullBbox.minX) {
            if (item.minX < fullBbox.maxX) {
              if (item.maxX > fullBbox.maxX) {
                let diffMin = item.minX - fullBbox.minX;
                let diffMax = fullBbox.maxX - item.minX;
                diffMax += diffMin + 1;
                item.oldMax = item.maxX;
                item.oldMin = item.minX;
                item.maxX -= diffMax;
                item.minX -= diffMin;
                item.style = 'evenValue';
                change.push(item);
                if (item.maxX !== item.minX || item.maxY !== item.minY) {
                  divers.push(item);
                }
                continue;
              }
            }
            if (item.minX > fullBbox.maxX) {
              let diffValue = fullBbox.maxX - fullBbox.minX;
              diffValue += 1;
              item.oldMax = item.maxX;
              item.oldMin = item.minX;
              item.maxX -= diffValue;
              item.minX -= diffValue;
              item.style = 'evenValue';
              change.push(item);
              if (item.maxX !== item.minX || item.maxY !== item.minY) {
                divers.push(item);
              }
              continue;
            }
          }
          if (item.minX === fullBbox.minX) {
            if (item.maxX > fullBbox.maxX) {
              let diffMax = fullBbox.maxX - item.minX;
              diffMax += 1;
              item.oldMax = item.maxX;
              item.maxX -= diffMax;
              item.style = 'oddValue';
              change.push(item);
              if (item.maxX !== item.minX || item.maxY !== item.minY) {
                divers.push(item);
              }
            }
          }
        }
        rTree.load(divers);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 插入新列时调整区域大小和位置
   * @param ci
   * @param number
   */
  insertColAfter(ci, number) {
    const { snapshot } = this;
    const mergeAction = {
      undo: () => {
        this.colAfterShrink(ci, number);
      },
      redo: () => {
        this.colAfterExpand(ci, number);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 插入新列时调整区域大小和位置
   * @param ci
   * @param number
   */
  insertColBefore(ci, number) {
    const { snapshot } = this;
    const mergeAction = {
      undo: () => {
        this.colBeforeShrink(ci, number);
      },
      redo: () => {
        this.colBeforeExpand(ci, number);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 插入新行时调整区域大小和位置
   * @param ri
   * @param number
   */
  insertRowAfter(ri, number) {
    const { snapshot } = this;
    const mergeAction = {
      undo: () => {
        this.rowAfterShrink(ri, number);
      },
      redo: () => {
        this.rowAfterExpand(ri, number);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
  }

  /**
   * 插入新行时调整区域大小和位置
   * @param ri
   * @param number
   */
  insertRowBefore(ri, number) {
    const { snapshot } = this;
    const mergeAction = {
      undo: () => {
        this.rowBeforeShrink(ri, number);
      },
      redo: () => {
        this.rowBeforeExpand(ri, number);
      },
    };
    snapshot.addAction(mergeAction);
    mergeAction.redo();
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
