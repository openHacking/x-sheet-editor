import { LineFilter } from '../LineFilter';

class HorizontalMergeFilter extends LineFilter {

  constructor({
    merges,
  }) {
    super((ri, ci) => (merges.getFirstIncludes(ri, ci)
      ? LineFilter.RETURN_TYPE.JUMP
      : LineFilter.RETURN_TYPE.HANDLE));
  }

}

export {
  HorizontalMergeFilter,
};
