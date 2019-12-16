/* global navigator */

class Utils {
  static cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  static isMac() {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  }

  static isWindows() {
    return /windows|win32/i.test(navigator.userAgent);
  }

  static isUnDef(e) {
    return e === undefined || e === null;
  }

  static isNumber(e) {
    // eslint-disable-next-line no-restricted-globals,radix
    return !isNaN(parseInt(e));
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

  static sum(objOrAry, cb = value => value) {
    let total = 0;
    let size = 0;
    Object.keys(objOrAry).forEach((key) => {
      total += cb(objOrAry[key], key);
      size += 1;
    });
    return [total, size];
  }

  static parseFloat(val) {
    if (Utils.isNumber(val)) return parseFloat(val);
    return 0;
  }
}

export { Utils };
