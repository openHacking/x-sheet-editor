import { Utils } from '../utils/Utils';

class SolidLine {
  constructor(draw, attr) {
    this.draw = draw;
    this.color = '#000000';
    this.width = 1;
    Utils.mergeDeep(this, attr);
  }

  drawLine(sx, sy, ex, ey) {
    const { draw, width } = this;
    draw.attr({ lineWidth: width });
    draw.line([sx, sy], [ex, ey]);
  }

  setColor(color) {
    this.color = color;
  }

  setWidth(width) {
    this.width = width;
  }
}

class DottedLine {
  constructor(draw, attr) {
    this.draw = draw;
    this.color = '#000000';
    this.width = 1;
    Utils.mergeDeep(this, attr);
  }

  setColor(color) {
    this.color = color;
  }

  setWidth(width) {
    this.width = width;
  }
}

class DoubleLine {
  constructor(draw, attr) {
    this.draw = draw;
    this.color = '#000000';
    this.width = 1;
    Utils.mergeDeep(this, attr);
  }

  setColor(color) {
    this.color = color;
  }

  setWidth(width) {
    this.width = width;
  }
}

const LINE_TYPE = {
  SOLID_LINE: 0,
  DOTTED_LINE: 1,
  DOUBLE_LINE: 2,
};

class Line {
  constructor(draw, attr = {}) {
    this.draw = draw;
    this.width = 1;
    this.color = '#000000';
    this.type = LINE_TYPE.SOLID_LINE;
    Utils.mergeDeep(this, attr);
    this.solidLine = new SolidLine(draw, { color: this.color, width: this.width });
    this.dottedLine = new DottedLine(draw, { color: this.color, width: this.width });
    this.doubleLine = new DoubleLine(draw, { color: this.color, width: this.width });
  }

  drawLine(sx, sy, ex, ey) {
    const { type, solidLine } = this;
    switch (type) {
      case LINE_TYPE.SOLID_LINE:
        solidLine.drawLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOTTED_LINE:
        // TODO ...
        // ....
        break;
      case LINE_TYPE.DOUBLE_LINE:
        // TODO ...
        // ....
        break;
      default: break;
    }
  }

  setType(type) {
    this.type = type;
  }

  setWidth(width) {
    this.width = width;
    this.solidLine.setWidth(width);
    this.dottedLine.setWidth(width);
    this.doubleLine.setWidth(width);
  }

  setColor(color) {
    this.color = color;
    this.solidLine.setColor(color);
    this.dottedLine.setColor(color);
    this.doubleLine.setColor(color);
  }
}

export { Line, LINE_TYPE };
