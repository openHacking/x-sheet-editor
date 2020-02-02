// eslint-disable-next-line no-unused-vars
/* global navigator document window */

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let throttleHandle = null;

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
    // eslint-disable-next-line no-restricted-globals,radix
    return !isNaN(parseInt(e));
  }

  static isBlank(s) {
    if (Utils.isUnDef(s)) {
      return true;
    }
    return s.toString() === '';
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
    if (Utils.isUnDef(target)) {
      return result;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const key in target) {
      // eslint-disable-next-line no-prototype-builtins
      if (target.hasOwnProperty(key)) {
        if (src[key] && Utils.equal(src[key], target[key])) continue;
        result[key] = target[key];
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

  static equal(o1, o2) {
    let no1 = o1;
    let no2 = o2;
    if (typeof no1 === 'object') no1 = JSON.stringify(no1);
    if (typeof no2 === 'object') no2 = JSON.stringify(no2);
    return no1.toString() === no2.toString();
  }

  static arrayContain(a2, a1) {
    for (let i = 0; i < a1.length; i += 1) {
      if (a2.indexOf(a1[i]) === -1) return false;
    }
    return true;
  }

  static arrayEqual(a1, a2) {
    if (Utils.isUnDef(a1) || Utils.isUnDef(a2)) {
      return false;
    }
    if (a1.length !== a2.length) {
      return false;
    }
    return Utils.arrayContain(a2, a1);
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

export { Utils };
