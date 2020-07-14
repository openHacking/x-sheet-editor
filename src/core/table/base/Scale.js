import { rounded } from '../../../canvas/Draw';

class Scale {

  constructor(table) {
    this.table = table;
    this.value = 1;
  }

  back(origin) {
    return rounded(origin / this.value);
  }

  goto(origin) {
    return rounded(this.value * origin);
  }

  setValue(value) {
    this.value = value;
  }

}

export {
  Scale,
};
