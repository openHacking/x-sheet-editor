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
    bottom = {},
    top = {},
    right = {},
  }) {
    this.left = new Border(left);
    this.bottom = new Border(bottom);
    this.top = new Border(top);
    this.right = new Border(right);
  }

  isDisplay() {
    return this.left.display || this.top.display
      || this.bottom.display || this.right.display;
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

  setAllWidthType(widthType) {
    this.setLWidthType(widthType);
    this.setTWidthType(widthType);
    this.setRWidthType(widthType);
    this.setBWidthType(widthType);
  }

  setLWidthType(widthType) {
    this.left.widthType = widthType;
  }

  setTWidthType(widthType) {
    this.top.widthType = widthType;
  }

  setRWidthType(widthType) {
    this.right.widthType = widthType;
  }

  setBWidthType(widthType) {
    this.bottom.widthType = widthType;
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
