// eslint-disable-next-line no-unused-vars
/* global navigator document window */

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let throttleHandle = null;

const DATA_TYPE = {
  String: 1,
  Boolean: 2,
  Number: 3,
  Object: 4,
  Array: 5,
  Function: 6,
  Null: 7,
  Undefined: 8,
  Promise: 9,
  GeneratorFunction: 10,
  AsyncFunction: 11,
  BigInt: 12,
  Symbol: 13,
  Un: 14,
};

class Utils {
  static type(arg) {
    const type = Object.prototype.toString.call(arg);
    switch (type) {
      case '[object Null]':
        return DATA_TYPE.Null;
      case '[object Undefined]':
        return DATA_TYPE.Undefined;
      case '[object String]':
        return DATA_TYPE.String;
      case '[object Boolean]':
        return DATA_TYPE.Boolean;
      case '[object Number]':
        return DATA_TYPE.Number;
      case '[object Function]':
        return DATA_TYPE.Function;
      case '[object Array]':
        return DATA_TYPE.Array;
      case '[object Promise]':
        return DATA_TYPE.Promise;
      case '[object GeneratorFunction]':
        return DATA_TYPE.GeneratorFunction;
      case '[object AsyncFunction]':
        return DATA_TYPE.AsyncFunction;
      case '[object BigInt]':
        return DATA_TYPE.BigInt;
      case '[object Symbol]':
        return DATA_TYPE.Symbol;
      default:
        return DATA_TYPE.Un;
    }
  }

  static cloneDeep() {
    let options; let name; let src; let copy; let copyIsArray; let clone;
    // eslint-disable-next-line prefer-rest-params
    let target = arguments[0] || {};
    let i = 1;
    // eslint-disable-next-line prefer-rest-params
    const { length } = arguments;
    let deep = false;

    // Handle a deep copy situation
    if (typeof target === 'boolean') {
      deep = target;
      // eslint-disable-next-line prefer-rest-params
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== 'object' && !Utils.isFunction(target)) {
      target = {};
    }

    // extend jQuery itself if only one argument is passed
    if (length === i) {
      target = this;
      // eslint-disable-next-line no-plusplus
      --i;
    }

    // eslint-disable-next-line no-plusplus
    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      // eslint-disable-next-line prefer-rest-params,no-cond-assign
      if ((options = arguments[i]) != null) {
        // Extend the base object
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          // eslint-disable-next-line no-cond-assign
          if (deep && copy && (Utils.isPlainObject(copy) || (copyIsArray = Utils.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && Utils.isArray(src) ? src : [];
            } else {
              clone = src && Utils.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = Utils.cloneDeep(deep, clone, copy);

            // Don't bring in undefined values
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  }

  static mergeDeep(object = {}, ...sources) {
    if (Utils.isUnDef(object)) {
      return {};
    }
    if (Utils.isUnDef(sources) || sources.length === 0) {
      return object;
    }
    sources.forEach((source) => {
      if (Utils.isUnDef(source)) return;
      Object.keys(source).forEach((key) => {
        const v = source[key];
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
          object[key] = v;
        } else if (typeof v !== 'function' && !Array.isArray(v) && v instanceof Object) {
          object[key] = object[key] || {};
          Utils.mergeDeep(object[key], v);
        } else {
          object[key] = v;
        }
      });
    });
    return object;
  }

  static copyProp(t, s) {
    return Object.assign(t, s);
  }

  static isMac() {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  }

  static isWindows() {
    return /windows|win32/i.test(navigator.userAgent);
  }

  static isEmptyObject(object) {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in object) {
      // eslint-disable-next-line no-prototype-builtins
      if (object.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  static isNotEmptyObject(object) {
    return !Utils.isEmptyObject(object);
  }

  static isUnDef(e) {
    return e === undefined || e === null;
  }

  static isNumber(e) {
    return /^(-?\d+.\d+)$|^(-?\d+)$/.test(e);
  }

  static isFraction(e) {
    return /^\d+\/\d+$/.test(e);
  }

  static isArray(e) {
    return Utils.type(e) === DATA_TYPE.Array;
  }

  static isBlank(s) {
    if (Utils.isUnDef(s)) {
      return true;
    }
    return s.toString() === '';
  }

  static isPlainObject(obj) {
    const prototype = Object.getPrototypeOf(obj);
    const type = Utils.type(obj);
    // eslint-disable-next-line no-return-assign
    return type === DATA_TYPE.Object
      && (prototype === null || prototype === Object.getPrototypeOf({}));
  }

  static sum(objOrAry, cb = value => value) {
    let total = 0;
    let size = 0;
    Object.keys(objOrAry).forEach((key) => {
      total += cb(objOrAry[key], key);
      size += 1;
    });
    return [total, size];
  }

  static rangeSum(min, max, cb) {
    let s = 0;
    for (let i = min; i < max; i += 1) {
      s += cb(i);
    }
    return s;
  }

  static parseFloat(val) {
    if (Utils.isNumber(val)) return parseFloat(val);
    return 0;
  }

  static parseInt(val) {
    if (Utils.isNumber(val)) return parseInt(val, 10);
    return 0;
  }

  static stringAt(index) {
    let str = '';
    let idx = index;
    while (idx >= alphabets.length) {
      idx /= alphabets.length;
      idx -= 1;
      str += alphabets[parseInt(idx, 10) % alphabets.length];
    }
    const last = index % alphabets.length;
    str += alphabets[last];
    return str;
  }

  static indexAt(str) {
    let ret = 0;
    for (let i = 0; i < str.length - 1; i += 1) {
      const idx = str.charCodeAt(i) - 65;
      const expoNet = str.length - 1 - i;
      ret += (alphabets.length ** expoNet) + (alphabets.length * idx);
    }
    ret += str.charCodeAt(str.length - 1) - 65;
    return ret;
  }

  static expr2xy(src) {
    let x = '';
    let y = '';
    for (let i = 0; i < src.length; i += 1) {
      if (src.charAt(i) >= '0' && src.charAt(i) <= '9') {
        y += src.charAt(i);
      } else {
        x += src.charAt(i);
      }
    }
    return [Utils.indexAt(x), parseInt(y, 10) - 1];
  }

  static xy2expr(x, y) {
    return `${Utils.stringAt(x)}${y + 1}`;
  }

  static expr2expr(src, xn, yn) {
    const [x, y] = Utils.expr2xy(src);
    return Utils.xy2expr(x + xn, y + yn);
  }

  static rangeReduceIf(min, max, initS, initV, ifv, getV) {
    let s = initS;
    let v = initV;
    let i = min;
    for (; i < max; i += 1) {
      if (s >= ifv) break;
      v = getV(i);
      s += v;
    }
    return [i, s - v, v];
  }

  static throttle(cb = () => {}, time = 500) {
    if (throttleHandle) clearTimeout(throttleHandle);
    throttleHandle = setTimeout(cb, time);
  }

  static contrastDifference(target, src) {
    const result = {};
    if (Utils.isUnDef(target) || Utils.isUnDef(src)) {
      return result;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const key in target) {
      // eslint-disable-next-line no-prototype-builtins
      if (target.hasOwnProperty(key)) {
        const sv = src[key];
        const tv = target[key];
        if (!Utils.isUnDef(sv) && !Utils.isUnDef(tv) && !Utils.equal(sv, tv)) {
          result[key] = target[key];
        }
      }
    }
    return result;
  }

  static minIf(v, min) {
    if (v < min) return min;
    return v;
  }

  static maxIf(v, max) {
    if (v > max) return max;
    return v;
  }

  // eslint-disable-next-line no-unused-vars
  static equal(x, y) {
    let i;
    let l;
    let leftChain;
    let rightChain;
    function compare2Objects(x, y) {
      let p;
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(x) && isNaN(y) && typeof x === 'number' && typeof y === 'number') {
        return true;
      }
      if (x === y) {
        return true;
      }
      if ((typeof x === 'function' && typeof y === 'function')
        || (x instanceof Date && y instanceof Date)
        || (x instanceof RegExp && y instanceof RegExp)
        || (x instanceof String && y instanceof String)
        || (x instanceof Number && y instanceof Number)) {
        return x.toString() === y.toString();
      }
      if (!(x instanceof Object && y instanceof Object)) {
        return false;
      }
      // eslint-disable-next-line no-prototype-builtins
      if (x.isPrototypeOf(y) || y.isPrototypeOf(x)) {
        return false;
      }
      if (x.constructor !== y.constructor) {
        return false;
      }
      if (x.prototype !== y.prototype) {
        return false;
      }
      if (leftChain.indexOf(x) > -1 || rightChain.indexOf(y) > -1) {
        return false;
      }
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (p in y) {
        // eslint-disable-next-line no-prototype-builtins
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        }
        if (typeof y[p] !== typeof x[p]) {
          return false;
        }
      }
      // eslint-disable-next-line guard-for-in,no-restricted-syntax
      for (p in x) {
        // eslint-disable-next-line no-prototype-builtins
        if (y.hasOwnProperty(p) !== x.hasOwnProperty(p)) {
          return false;
        } if (typeof y[p] !== typeof x[p]) {
          return false;
        }
        switch (typeof (x[p])) {
          case 'object':
          case 'function':
            leftChain.push(x);
            rightChain.push(y);
            if (!compare2Objects(x[p], y[p])) {
              return false;
            }
            leftChain.pop();
            rightChain.pop();
            break;
          default:
            if (x[p] !== y[p]) {
              return false;
            }
            break;
        }
      }
      return true;
    }
    if (arguments.length < 1) {
      return true;
    }
    // eslint-disable-next-line no-plusplus
    for (i = 1, l = arguments.length; i < l; i++) {
      leftChain = [];
      rightChain = [];
      // eslint-disable-next-line prefer-rest-params
      if (!compare2Objects(arguments[0], arguments[i])) {
        return false;
      }
    }
    return true;
  }

  static arrayIncludeArray(a1, a2) {
    if (Utils.isUnDef(a1) || Utils.isUnDef(a2)) {
      return false;
    }
    if (a1.length !== a2.length) {
      return false;
    }
    for (let i = 0; i < a1.length; i += 1) {
      if (a2.indexOf(a1[i]) === -1) return false;
    }
    return true;
  }

  static keepLastIndex(obj) {
    if (window.getSelection) {
      obj.focus();
      const range = window.getSelection();
      range.selectAllChildren(obj);
      range.collapseToEnd();
    } else if (document.selection) {
      const range = document.selection.createRange();
      range.moveToElementText(obj);
      range.collapse(false);
      range.select();
    }
  }

  static trim(s) {
    if (this.isBlank(s)) return '';
    return s.trim();
  }
}

window.Utils = Utils;

export { Utils };
