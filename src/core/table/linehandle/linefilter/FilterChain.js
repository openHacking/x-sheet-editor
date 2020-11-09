import { LineFilter } from './LineFilter';

const ChainLogic = {
  AND: Symbol('and'),
  OR: Symbol('or'),
};

class FilterChain extends LineFilter {

  constructor(logic, chain) {
    // eslint-disable-next-line func-names
    super(function () {
      let result;
      if (logic === ChainLogic.AND) {
        result = LineFilter.RETURN_TYPE.HANDLE;
        // eslint-disable-next-line no-restricted-syntax
        for (const item of chain) {
          // eslint-disable-next-line prefer-spread,prefer-rest-params
          const returnValue = item.execute.apply(item, arguments);
          if (returnValue !== LineFilter.RETURN_TYPE.HANDLE) {
            result = returnValue;
            break;
          }
        }
      } else {
        result = LineFilter.RETURN_TYPE.JUMP;
        // eslint-disable-next-line no-restricted-syntax
        for (const item of chain) {
          // eslint-disable-next-line prefer-spread,prefer-rest-params
          const returnValue = item.execute.apply(item, arguments);
          if (returnValue === LineFilter.RETURN_TYPE.HANDLE) {
            result = LineFilter.RETURN_TYPE.HANDLE;
            break;
          }
        }
      }
      return result;
    });
  }

}

export {
  FilterChain,
  ChainLogic,
};
