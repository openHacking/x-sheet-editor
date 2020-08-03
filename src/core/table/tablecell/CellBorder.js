import { Border } from './Border';

/**
 * CellBorder
 * @author jerry
 */
class CellBorder {

  /**
   * CellBorder
   * @param time
   * @param left
   * @param top
   * @param right
   * @param bottom
   */
  constructor({
    left = {},
    top = {},
    right = {},
    bottom = {},
  }) {
    this.left = new Border(left);
    this.top = new Border(top);
    this.right = new Border(right);
    this.bottom = new Border(bottom);
  }

  // ======================显示/隐藏=======================

  setAllDisplay(display) {
    this.setLDisplay(display);
    this.setTDisplay(display);
    this.setRDisplay(display);
    this.setBDisplay(display);
  }

  setLDisplay(display) {
    this.left.display = display;
  }

  setTDisplay(display) {
    this.top.display = display;
  }

  setRDisplay(display) {
    this.right.display = display;
  }

  setBDisplay(display) {
    this.bottom.display = display;
  }

  // ======================边框颜色=======================

  setAllColor(color) {
    this.setLColor(color);
    this.setTColor(color);
    this.setRColor(color);
    this.setBColor(color);
  }

  setLColor(color) {
    this.left.color = color;
  }

  setTColor(color) {
    this.top.color = color;
  }

  setRColor(color) {
    this.right.color = color;
  }

  setBColor(color) {
    this.bottom.color = color;
  }

  // ======================边框宽度=======================

  setAllWidth(width) {
    this.setLWidth(width);
    this.setTWidth(width);
    this.setRWidth(width);
    this.setBWidth(width);
  }

  setLWidth(width) {
    this.left.width = width;
  }

  setTWidth(width) {
    this.top.width = width;
  }

  setRWidth(width) {
    this.right.width = width;
  }

  setBWidth(width) {
    this.bottom.width = width;
  }

  // ======================边框类型=======================

  setAllType(type) {
    this.setLType(type);
    this.setTType(type);
    this.setRType(type);
    this.setBType(type);
  }

  setLType(type) {
    this.left.type = type;
  }

  setTType(type) {
    this.top.type = type;
  }

  setRType(type) {
    this.right.type = type;
  }

  setBType(type) {
    this.bottom.type = type;
  }

  clone() {
    const {
      left,
      top,
      right,
      bottom,
    } = this;
    return new CellBorder({
      left,
      top,
      right,
      bottom,
    });
  }
}

export { CellBorder };
