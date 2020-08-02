import { LineFilter } from '../LineFilter';

class HorizontalMergeFilter extends LineFilter {

  constructor({
    merges,
  }) {
    super((ri, ci) => merges.getFirstIncludes(ri, ci) === null);
  }

}

export {
  HorizontalMergeFilter,
};
