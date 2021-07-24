/**
 * 数据快照
 */
class Snapshot {

  /**
   * Snapshot
   */
  constructor() {
    // 撤销
    this.undoStack = [];
    // 反撤销
    this.redoStack = [];
    // 当前记录层
    this.layer = [];
    // 启用记录
    this.apply = false;
  }

  /**
   * 撤销
   */
  undo() {
    const layer = this.undoStack.pop();
    for (let i = 0, len = layer.length; i < len; i++) {
      const action = layer[i];
      action.undo();
    }
    this.redoStack.push(layer);
  }

  /**
   * 反撤销
   */
  redo() {
    const layer = this.redoStack.pop();
    for (let i = 0, len = layer.length; i < len; i++) {
      const action = layer[i];
      action.redo();
    }
    this.undoStack.push(layer);
  }

  /**
   * 打开快照
   */
  open() {
    this.layer = [];
    this.apply = true;
  }

  /**
   * 关闭快照
   */
  close() {
    if (this.layer.length) {
      this.undoStack.push(this.layer);
    }
    this.layer = [];
    this.apply = false;
  }

  /**
   * 能否反撤销
   * @returns {boolean}
   */
  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * 能否撤销
   * @returns {boolean}
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * 添加动作
   * @param action
   */
  addAction(action = {
    undo: () => {},
    redo: () => {},
  }) {
    if (this.apply) {
      this.layer.push(action);
    }
  }
}

export {
  Snapshot,
};
