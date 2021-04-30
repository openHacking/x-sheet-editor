(function (root, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? module.exports = factory() : typeof define === 'function' && define.amd
    ? define(factory) : typeof layui === 'object' && layui.define
      ? layui.define(function (exports) { exports("findDPI", factory()) }) :  (global.findDPI = global.findDPI = factory());
}(this, function () {

  /**
   * 96 dpi = 96 px / in
   * 1 inch = 2.54 cm
   * 96 dpi = 96 px / 2.54 cm
   *
   * See https://github.com/ryanve/res
   */

  let counter = 0;

  function findDPI() {
    return findFirstPositive((x) => (++counter, matchMedia(`(max-resolution: ${x}dpi)`).matches));
  }

  // Binary search
  // http://www.geeksforgeeks.org/find-the-point-where-a-function-becomes-negative/
  function findFirstPositive(fn) {
    let start = 1;
    while (0 >= fn(start)) start <<= 1;
    return binSearch(fn, start >>> 1, start) | 0;
  }

  function binSearch(fn, min, max) {
    if (max < min) return -1; // not found

    let mid = (min + max) >>> 1;
    if (0 < fn(mid)) {
      if (mid === min || 0 >= fn(mid - 1)) {
        return mid;
      }
      return binSearch(fn, min, mid - 1);
    }
    return binSearch(fn, mid + 1, max);
  }

  return findDPI;
}));
