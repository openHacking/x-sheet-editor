import { XLineIteratorFilter } from '../../XLineIteratorFilter';

class MergeRNullEdge {

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
      return merge.eci === col
        ? XLineIteratorFilter.RETURN_TYPE.EXEC
        : XLineIteratorFilter.RETURN_TYPE.JUMP;
    }
    return XLineIteratorFilter.RETURN_TYPE.EXEC;
  }

}

export {
  MergeRNullEdge,
};
