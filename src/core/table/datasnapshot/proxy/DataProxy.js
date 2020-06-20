class DataProxy {

  constructor() {
    this.change = false;
  }

  end() {
    if (this.change) {
      this.change = false;
    }
  }

  backNotice() {
    if (this.change) {
      this.change = false;
    }
  }

  goNotice() {
    if (this.change) {
      this.change = false;
    }
  }

}

export { DataProxy };
