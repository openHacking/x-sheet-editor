
const SCROLL_TYPE = {
  H_LEFT: Symbol('水平方向左边滚动条'),
  H_RIGHT: Symbol('水平方向向右边滚动'),
  V_TOP: Symbol('垂直方向向上滚动'),
  V_BOTTOM: Symbol('垂直方向下滚动'),
};

class Scroll {

  constructor(table) {
    this.table = table;
    this.x = 0;
    this.y = 0;
    this.ri = table.fixed.fxTop + 1;
    this.ci = table.fixed.fxLeft + 1;
    this.type = SCROLL_TYPE.V_BOTTOM;
  }
}

export { Scroll, SCROLL_TYPE };
