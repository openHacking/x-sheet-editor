import { LINE_TYPE } from '../../../canvas/Line';
import { Utils } from '../../../utils/Utils';
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
   * @param zIndex
   * @param time
   * @param display
   * @param widthType
   * @param color
   * @param type
   */
  constructor({
    widthType = XDraw.LINE_WIDTH_TYPE.level1,
    zIndex = 0,
    display = false,
    color = '#000000',
    type = LINE_TYPE.SOLID_LINE,
  }) {
    this.$zIndex = zIndex;
    this.$display = display;
    this.$widthType = widthType;
    this.$color = color;
    this.$type = type;
    if (zIndex > zIndexID) {
      zIndexID = zIndex;
    }
  }

  get zIndex() {
    return this.$zIndex;
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
    if (Utils.isUnDef(border)) {
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
