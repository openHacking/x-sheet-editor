
class ScaleBase {

  constructor(table) {
    this.table = table;
    this.value = 1;
  }

  drawModeBack() {
    const { table } = this;
    const { draw } = table;
    draw.restore();
  }

  drawModeTo() {
    const { table, value } = this;
    const { draw } = table;
    draw.save();
    draw.scale(value, value);
  }

  setValue(value) {
    this.value = value;
  }

}

class Scale extends ScaleBase {

  constructor(table) {
    super(table);
    this.useDigitMode = true;
  }

  digitModeBack(origin) {
    if (this.useDigitMode) {
      return origin / this.value;
    }
    return origin;
  }

  digitModeTo(origin) {
    if (this.useDigitMode) {
      return this.value * origin;
    }
    return origin;
  }

  closeDigitMode() {
    this.useDigitMode = false;
    return this;
  }

  openDigitMode() {
    this.useDigitMode = true;
    return this;
  }

}

export {
  Scale,
};
