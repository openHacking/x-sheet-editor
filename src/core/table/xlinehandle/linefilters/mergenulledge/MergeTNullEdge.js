import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class MergeTNullEdge {

  constructor({
    merges,
  }) {
    this.merges = merges;
  }

  run({
    row, col,
  }) {
    const { merges } = this;
    const merge = merges.getFirstIncludes(row, col);
    if (merge) {
      return merge.sri === row
        ? XLineIteratorFilter.RETURN_TYPE.EXEC
        : XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  MergeTNullEdge,
};
