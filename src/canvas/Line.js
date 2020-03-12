import { Utils } from '../utils/Utils';

const LINE_TYPE = {
  SOLID_LINE: 0,
  DOTTED_LINE: 1,
  POINT_LINE: 2,
  DOUBLE_LINE: 3,
};

class SolidLine {
  constructor(draw, attr) {
    this.draw = draw;
    this.color = '#000000';
    this.width = 1;
    Utils.mergeDeep(this, attr);
  }

  drawLine(sx, sy, ex, ey) {
    const { draw } = this;
    const { width, color } = this;
    draw.beginPath();
    draw.attr({
      lineWidth: width,
      strokeStyle: color,
    });
    draw.setLineDash([]);
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
    this.dash = [5];
    Utils.mergeDeep(this, attr);
  }

  drawLine(sx, sy, ex, ey) {
    const { draw, dash } = this;
    const { width, color } = this;
    draw.beginPath();
    draw.attr({
      lineWidth: width,
      strokeStyle: color,
    });
    draw.setLineDash(dash);
    draw.line([sx, sy], [ex, ey]);
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
    this.doubleLineFilter = () => ({});
    Utils.mergeDeep(this, attr);
  }

  drawLine(sx, sy, ex, ey, r, c, d) {
    const { draw, dash } = this;
    const { width, color } = this;
    draw.beginPath();
    draw.attr({
      lineWidth: width,
      strokeStyle: color,
    });
    draw.setLineDash([]);
    const { external, internal } = this.doubleLineFilter(sx, sy, ex, ey, r, c, d);
    if (external) {
      draw.line([external.sx, external.sy], [external.ex, external.ey]);
    }
    if (internal) {
      draw.line([internal.sx, internal.sy], [internal.ex, internal.ey]);
    }
  }

  setColor(color) {
    this.color = color;
  }

  setWidth(width) {
    this.width = width;
  }
}

class Line {
  constructor(draw, attr = {}) {
    this.draw = draw;
    this.width = 1;
    this.color = '#000000';
    this.type = LINE_TYPE.SOLID_LINE;
    this.doubleLineFilter = () => ({});
    Utils.mergeDeep(this, attr);
    this.solidLine = new SolidLine(draw, {
      color: this.color,
      width: this.width,
    });
    this.dottedLine = new DottedLine(draw, {
      color: this.color,
      width: this.width,
      dash: [5],
    });
    this.pointLine = new DottedLine(draw, {
      color: this.color,
      width: this.width,
      dash: [2, 2],
    });
    this.doubleLine = new DoubleLine(draw, {
      color: this.color,
      width: this.width,
      doubleLineFilter: this.doubleLineFilter,
    });
  }

  drawLine(sx, sy, ex, ey, r, c, d) {
    const {
      type,
      solidLine,
      dottedLine,
      pointLine,
      doubleLine,
    } = this;
    switch (type) {
      case LINE_TYPE.SOLID_LINE:
        solidLine.drawLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOTTED_LINE:
        dottedLine.drawLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.POINT_LINE:
        pointLine.drawLine(sx, sy, ex, ey);
        break;
      case LINE_TYPE.DOUBLE_LINE:
        doubleLine.drawLine(sx, sy, ex, ey, r, c, d);
        break;
      default: break;
    }
  }

  setType(type) {
    this.type = type;
  }

  setWidth(width) {
    if (width) {
      if (this.type === LINE_TYPE.SOLID_LINE) {
        this.solidLine.setWidth(width);
      }
    }
  }

  setColor(color) {
    if (color) {
      this.color = color;
      this.solidLine.setColor(color);
      this.dottedLine.setColor(color);
      this.pointLine.setColor(color);
      this.doubleLine.setColor(color);
    }
  }
}

export { Line, LINE_TYPE };
