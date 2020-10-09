class Throttle {

  constructor() {
    this.handle = null;
    this.time = 3000;
  }

  action(cb) {
    setTimeout(this.handle);
    this.handle = setTimeout(() => {
      cb();
    }, this.time);
  }

}

export {
  Throttle,
};
