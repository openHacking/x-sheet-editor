class Point {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  addX(x) {
    this.x += x;
  }

  addY(y) {
    this.y += y;
  }

}

export {
  Point,
};
