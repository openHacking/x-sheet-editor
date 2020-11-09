import { LineFilter } from '../LineFilter';

class VerticalMergeFilter extends LineFilter {

  constructor({
    merges,
  }) {
    super((ci, ri) => (merges.getFirstIncludes(ri, ci)
      ? LineFilter.RETURN_TYPE.JUMP
      : LineFilter.RETURN_TYPE.HANDLE));
  }

}

export {
  VerticalMergeFilter,
};
