class Scale {

  constructor(table) {
    this.table = table;
    this.value = 1;
    this.useFloat = false;
  }

  openFloat() {
    this.useFloat = true;
  }

  closeFloat() {
    this.useFloat = false;
  }

  back(origin) {
    if (this.useFloat) {
      return origin / this.value;
    }
    return Math.ceil(origin / this.value);
  }

  to(origin) {
    if (this.useFloat) {
      return this.value * origin;
    }
    return Math.ceil(this.value * origin);
  }

  setValue(value) {
    this.value = value;
  }

}

export {
  Scale,
};
