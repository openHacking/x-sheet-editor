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
        result = true;
        // eslint-disable-next-line no-restricted-syntax
        for (const item of chain) {
          // eslint-disable-next-line prefer-spread,prefer-rest-params
          if (item.execute.apply(item, arguments) === false) {
            result = false;
            break;
          }
        }
      } else {
        result = false;
        // eslint-disable-next-line no-restricted-syntax
        for (const item of chain) {
          // eslint-disable-next-line prefer-spread,prefer-rest-params
          if (item.execute.apply(item, arguments) === true) {
            result = true;
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
