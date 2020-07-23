import { XDraw } from '../../../canvas/XDraw';

class Scale {

  constructor(table) {
    this.table = table;
    this.value = 1;
    this.enableFloat = false;
  }

  useFloat() {
    this.enableFloat = true;
  }

  notFloat() {
    this.enableFloat = false;
  }

  back(origin) {
    return this.enableFloat ? origin / this.value : XDraw.upRounding(origin / this.value);
  }

  goto(origin) {
    return this.enableFloat ? this.value * origin : XDraw.upRounding(this.value * origin);
  }

  setValue(value) {
    this.value = value;
  }

}

export {
  Scale,
};
