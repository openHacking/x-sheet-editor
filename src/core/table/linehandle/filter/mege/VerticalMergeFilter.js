import { LineFilter } from '../LineFilter';

class VerticalMergeFilter extends LineFilter {

  constructor({
    merges,
  }) {
    super((ci, ri) => merges.getFirstIncludes(ri, ci) === null);
  }

}

export {
  VerticalMergeFilter,
};
