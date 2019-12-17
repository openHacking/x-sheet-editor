/* global navigator */

const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

class Utils {
  /**
   * 对象复制
   * @param obj
   * @returns {any}
   */
  static cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * mac判定
   * @returns {boolean}
   */
  static isMac() {
    return /macintosh|mac os x/i.test(navigator.userAgent);
  }

  /**
   * windows判定
   * @returns {boolean}
   */
  static isWindows() {
    return /windows|win32/i.test(navigator.userAgent);
  }

  /**
   * 空判定
   * @param e
   * @returns {boolean}
   */
  static isUnDef(e) {
    return e === undefined || e === null;
  }

  /**
   * 数字判定
   * @param e
   * @returns {boolean}
   */
  static isNumber(e) {
    // eslint-disable-next-line no-restricted-globals,radix
    return !isNaN(parseInt(e));
  }

  /**
   * 对象合并
   * @param object
   * @param sources
   * @returns {{}}
   */
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

  /**
   * 数组或者对象属性求和
   * @param objOrAry
   * @param cb
   * @returns {number[]}
   */
  static sum(objOrAry, cb = value => value) {
    let total = 0;
    let size = 0;
    Object.keys(objOrAry).forEach((key) => {
      total += cb(objOrAry[key], key);
      size += 1;
    });
    return [total, size];
  }

  /**
   * 字符串转浮点数字
   * @param val
   * @returns {number}
   */
  static parseFloat(val) {
    if (Utils.isNumber(val)) return parseFloat(val);
    return 0;
  }

  /**
   * 将数字转换成excel字母
   * @param index
   * @returns {string}
   */
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

  /**
   * 将excel字母转换成数字
   * @param str
   * @returns {number}
   */
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

  /**
   * 将excel字母行列转换成数字行列,例如: B10 => x,y
   * @param src
   * @returns {number[]}
   */
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

  /**
   * 将数字行列转换成excel字母,例如: x,y =>B10
   * @param x
   * @param y
   * @returns {string}
   */
  static xy2expr(x, y) {
    return `${Utils.stringAt(x)}${y + 1}`;
  }

  /**
   * 将excel字母行列转换成数字行列,例如: B10 => x,y 并且将转换后的数字行和列加上 xn, yn
   * @param src
   * @param xn
   * @param yn
   * @returns {string}
   */
  static expr2expr(src, xn, yn) {
    const [x, y] = Utils.expr2xy(src);
    return Utils.xy2expr(x + xn, y + yn);
  }

  /**
   * 缩小范围
   * @param min
   * @param max
   * @param initS
   * @param initV
   * @param ifv
   * @param getV
   * @returns {*[]}
   */
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
}

export { Utils };
