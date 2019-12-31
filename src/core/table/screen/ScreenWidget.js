class ScreenWidget {
  constructor(screen) {
    this.screen = screen;
    this.lt = null;
    this.t = null;
    this.l = null;
    this.br = null;
  }

  getLT() {
    return this.lt;
  }

  getT() {
    return this.t;
  }

  getL() {
    return this.l;
  }

  getBR() {
    return this.br;
  }
}

export { ScreenWidget };
