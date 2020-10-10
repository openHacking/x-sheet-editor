class Throttle {

  constructor() {
    this.handle = null;
    this.time = 500;
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
