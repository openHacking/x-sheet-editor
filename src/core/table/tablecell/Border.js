import { LINE_TYPE } from '../../../canvas/Line';
import { Utils } from '../../../utils/Utils';

/**
 * Border
 * @author jerry
 */
class Border {

  /**
   * Border
   * @param time
   * @param display
   * @param width
   * @param color
   * @param type
   */
  constructor({
    time = 0,
    display = false,
    width = 1,
    color = '#000000',
    type = LINE_TYPE.SOLID_LINE,
  }) {
    this.$time = time;
    this.$display = display;
    this.$width = width;
    this.$color = color;
    this.$type = type;
  }

  /**
   * 读取属性修改时间
   * @returns {*}
   */
  get time() {
    return this.$time;
  }

  /**
   * 读取边框是否显示
   * @returns {boolean}
   */
  get display() {
    return this.$display;
  }

  /**
   * 设置边框是否显示
   * @param value
   */
  set display(value) {
    this.$time = Utils.now();
    this.$display = value;
  }

  /**
   * 读取边框宽度
   * @returns {number}
   */
  get width() {
    return this.$width;
  }

  /**
   * 设置边框宽度
   * @param value
   */
  set width(value) {
    this.$time = Utils.now();
    this.$width = value;
  }

  /**
   * 读取边框颜色
   * @returns {string}
   */
  get color() {
    return this.$color;
  }

  /**
   * 设置边框颜色
   * @param value
   */
  set color(value) {
    this.$time = Utils.now();
    this.$color = value;
  }

  /**
   * 读取边框类型
   * @returns {number}
   */
  get type() {
    return this.$type;
  }

  /**
   * 设置边框类型
   * @param value
   */
  set type(value) {
    this.$time = Utils.now();
    this.$type = value;
  }

  /**
   * 判断两个边框是否一致
   * @param target
   */
  equal(target) {
    const color = this.color === target.color;
    const width = this.width === target.width;
    const type = this.type === target.type;
    return color && width && type;
  }

  /**
   * 比较两个边框的修改时间
   * this > target = 1
   * this < target = -1
   * this == target = 0
   * @param target
   * @returns {number}
   */
  compareTime(target) {
    if (Utils.isUnDef(target)) {
      return -2;
    }
    const srcTime = this.time;
    const targetTime = target.time;
    if (srcTime > targetTime) {
      return 1;
    }
    if (targetTime > srcTime) {
      return -1;
    }
    return 0;
  }

  toJSON() {
    const time = this.$time;
    const display = this.$display;
    const width = this.$width;
    const color = this.$color;
    const type = this.$type;
    return { time, display, width, color, type };
  }
}

export { Border };
