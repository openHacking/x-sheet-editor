
class SolidLine {
  constructor({ draw, color }) {
    this.draw = draw;
    this.color = color;
  }

  line(sx, sy, ex, ey) {
    const { draw } = this;
    draw.line([sx, sy], [ex, ey]);
  }
}

class DottedLine {
  constructor({ draw, color }) {
    this.draw = draw;
    this.color = color;
  }

  line(...xys) {}
}

class DoubleLine {
  constructor({ draw, color }) {
    this.draw = draw;
    this.color = color;
  }

  line(...xys) {}
}

export {
  SolidLine, DottedLine, DoubleLine,
};
