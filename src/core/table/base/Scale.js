class Scale {

  constructor(table) {
    this.table = table;
    this.value = 1;
  }

  to(origin) {
    return this.value * origin;
  }

  back(origin) {
    return origin / this.value;
  }

  setValue(value) {
    this.value = value;
  }

}

export {
  Scale,
};
