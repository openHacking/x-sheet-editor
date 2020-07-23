import { XDraw } from '../../../canvas/XDraw';

class Scale {

  constructor(table) {
    this.table = table;
    this.value = 1;
    this.checkFloat = true;
  }

  useFloat() {
    this.checkFloat = true;
  }

  notFloat() {
    this.checkFloat = false;
  }

  back(origin) {
    return this.checkFloat
      ? origin / this.value
      : XDraw.round(origin / this.value);
  }

  goto(origin) {
    return this.checkFloat
      ? this.value * origin
      : XDraw.round(this.value * origin);
  }

  setValue(value) {
    this.value = value;
  }

}

export {
  Scale,
};
