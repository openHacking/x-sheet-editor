import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class JumpMergeCell {

  constructor({
    merges,
  }) {
    this.merges = merges;
  }

  run({
    row, col,
  }) {
    const { merges } = this;
    return merges.getFirstIncludes(row, col)
      ? XLineIteratorFilter.RETURN_TYPE.JUMP
      : XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  JumpMergeCell,
};
