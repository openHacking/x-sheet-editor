class Scale {

  constructor(table) {
    this.table = table;
    this.value = 1;
  }

  to(origin) {
    return Math.ceil(this.value * origin);
  }

  back(origin) {
    return Math.ceil(origin / this.value);
  }

  setValue(value) {
    this.value = value;
  }

}

export {
  Scale,
};
