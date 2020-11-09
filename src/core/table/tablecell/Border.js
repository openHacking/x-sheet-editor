import { LINE_TYPE } from '../../../canvas/Line';
import { PlainUtils } from '../../../utils/PlainUtils';
import { XDraw } from '../../../canvas/XDraw';

let zIndexID = 0;

/**
 * Border
 * @author jerry
 */
class Border {

  static getZIndex() {
    zIndexID += 1;
    return zIndexID;
  }

  /**
   * Border
   * @param widthType
   * @param width
   * @param color
   * @param zIndex
   * @param display
   * @param type
   */
  constructor({
    widthType = XDraw.LINE_WIDTH_TYPE.low,
    width = -1,
    color = '#000000',
    zIndex = 0,
    display = false,
    type = LINE_TYPE.SOLID_LINE,
  }) {
    this.$zIndex = zIndex;
    this.$display = display;
    this.$color = color;
    this.$type = type;
    if (width === 1) {
      this.$widthType = XDraw.LINE_WIDTH_TYPE.low;
    } else if (width === 2) {
      this.$widthType = XDraw.LINE_WIDTH_TYPE.medium;
    } else if (width === 3) {
      this.$widthType = XDraw.LINE_WIDTH_TYPE.high;
    } else {
      this.$widthType = widthType;
    }
    if (zIndex > zIndexID) {
      zIndexID = zIndex;
    }
  }

  get display() {
    return this.$display;
  }

  set display(value) {
    this.$zIndex = Border.getZIndex();
    this.$display = value;
  }

  get widthType() {
    return this.$widthType;
  }

  set widthType(value) {
    this.$zIndex = Border.getZIndex();
    this.$widthType = value;
  }

  get color() {
    return this.$color;
  }

  set color(value) {
    this.$zIndex = Border.getZIndex();
    this.$color = value;
  }

  get type() {
    return this.$type;
  }

  set type(value) {
    this.$zIndex = Border.getZIndex();
    this.$type = value;
  }

  get zIndex() {
    return this.$zIndex;
  }

  set zIndex(value) {
    this.$zIndex = value;
  }

  equal(target) {
    const widthType = this.widthType === target.widthType;
    const color = this.color === target.color;
    const type = this.type === target.type;
    return color && widthType && type;
  }

  toJSON() {
    const zIndex = this.$zIndex;
    const display = this.$display;
    const widthType = this.$widthType;
    const color = this.$color;
    const type = this.$type;
    return { zIndex, display, widthType, color, type };
  }

  priority(border) {
    if (PlainUtils.isUnDef(border)) {
      return -2;
    }
    const origin = this.zIndex;
    const target = border.zIndex;
    if (origin > target) {
      return 1;
    }
    if (target > origin) {
      return -1;
    }
    return 0;
  }

}

export { Border };
