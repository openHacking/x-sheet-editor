import { rounded } from '../../../canvas/Draw';

class Scale {

  constructor(table) {
    this.table = table;
    this.value = 1;
    this.checkFloat = false;
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
      : rounded(origin / this.value);
  }

  goto(origin) {
    return this.checkFloat
      ? this.value * origin
      : rounded(this.value * origin);
  }

  setValue(value) {
    this.value = value;
  }

}

export {
  Scale,
};
