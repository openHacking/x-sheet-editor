class Scale {

  constructor() {
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
    return this.enableFloat ? origin / this.value : Math.floor(origin / this.value);
  }

  goto(origin) {
    return this.enableFloat ? this.value * origin : Math.floor(this.value * origin);
  }

  setValue(value) {
    this.value = value;
  }

}

class ScaleAdapter {

  constructor({
    goto = v => v,
    back = v => v,
  } = {}) {
    this.goto = goto;
    this.back = back;
  }

}

export {
  Scale, ScaleAdapter,
};
