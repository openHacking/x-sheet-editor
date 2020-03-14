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
    Utils.mergeDeep(this, {
      color: '#000000',
      width: 1,
    }, attr);
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
    Utils.mergeDeep(this, {
      color: '#000000',
      width: 1,
      dash: [5],
    }, attr);
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
    Utils.mergeDeep(this, {
      color: '#000000',
      width: 1,
      padding: 1,
      spacing: 2,
      leftShow: () => false,
      topShow: () => false,
      rightShow: () => false,
      bottomShow: () => false,
      iFMerge: () => false,
      iFMergeFirstRow: () => false,
      ifMergeLastRow: () => false,
      iFMergeFirstCol: () => false,
      ifMergeLastCol: () => false,
    }, attr);
  }

  handleExternal(sx, sy, ex, ey, row, col, pos) {
    const external = {};
    const { leftShow, topShow, rightShow, bottomShow } = this;
    const { spacing } = this;
    switch (pos) {
      case 'left': {
        external.sx = sx - spacing;
        external.ex = ex - spacing;
        // 检查顶边和上底边及左上角底边及左顶边
        const sTopLeftCorner = bottomShow(row - 1, col - 1) || topShow(row, col - 1);
        const sTop = topShow(row, col);
        const sBottom = bottomShow(row - 1, col);
        external.sy = sy;
        if (sTop || sBottom) external.sy = sy - spacing;
        if (sTopLeftCorner) external.sy = sy + spacing;
        // 检查底边和下顶边及左下角顶边和左底边
        const eBottomLeftCorner = topShow(row + 1, col - 1) || bottomShow(row, col - 1);
        const eBottom = bottomShow(row, col);
        const eTop = topShow(row + 1, col);
        external.ey = ey;
        if (eBottom || eTop) external.ey = ey + spacing;
        if (eBottomLeftCorner) external.ey = ey - spacing;
        break;
      }
      case 'top': {
        external.sy = sy - spacing;
        external.ey = ey - spacing;
        // 检查左边和左右边及左上角右边及上左边
        const sTopLeftCorner = rightShow(row - 1, col - 1) || leftShow(row - 1, col);
        const sLeft = leftShow(row, col);
        const sRight = rightShow(row, col - 1);
        external.sx = sx;
        if (sLeft || sRight) external.sx = sx - spacing;
        if (sTopLeftCorner) external.sx = sx + spacing;
        // 检查右边和右左边及右上角左边及上右边
        const eTopRightCorner = leftShow(row - 1, col + 1) || rightShow(row - 1, col);
        const eRight = rightShow(row, col);
        const eLeft = leftShow(row, col + 1);
        external.ex = ex;
        if (eRight || eLeft) external.ex = ex + spacing;
        if (eTopRightCorner) external.ex = ex - spacing;
        break;
      }
      case 'right': {
        external.sx = sx + spacing;
        external.ex = ex + spacing;
        // 检查顶边和上底边及右上角底边及右顶边
        const sTopRightCorner = bottomShow(row - 1, col + 1) || topShow(row, col + 1);
        const sTop = topShow(row, col);
        const sBottom = bottomShow(row - 1, col);
        external.sy = sy;
        if (sTop || sBottom) external.sy = sy - spacing;
        if (sTopRightCorner) external.sy = sy + spacing;
        // 检查底边和下顶边及右下角顶边及右底边
        const eBottomRightCorner = topShow(row + 1, col + 1) || bottomShow(row, col + 1);
        const eBottom = bottomShow(row, col);
        const eTop = topShow(row + 1, col);
        external.ey = ey;
        if (eBottom || eTop) external.ey = ey + spacing;
        if (eBottomRightCorner) external.ey = ey - spacing;
        break;
      }
      case 'bottom': {
        external.sy = sy + spacing;
        external.ey = ey + spacing;
        // 检查左边和左右边及左下角右边及下左边
        const sBottomLeftCorner = rightShow(row + 1, col - 1) || leftShow(row + 1, col);
        const sLeft = leftShow(row, col);
        const sRight = rightShow(row, col - 1);
        external.sx = sx;
        if (sLeft || sRight) external.sx = sx - spacing;
        if (sBottomLeftCorner) external.sx = sx + spacing;
        // 检查右边和右左边及右下角左边及下右边
        const eBottomRightCorner = leftShow(row + 1, col + 1) || rightShow(row + 1, col);
        const eRight = rightShow(row, col);
        const eLeft = leftShow(row, col + 1);
        external.ex = ex;
        if (eRight || eLeft) external.ex = ex + spacing;
        if (eBottomRightCorner) external.ex = ex - spacing;
        break;
      }
      default: break;
    }
    return external;
  }

  handleInternal(sx, sy, ex, ey, row, col, pos) {
    const internal = {};
    const { leftShow, topShow, rightShow, bottomShow } = this;
    const { iFMerge, iFMergeFirstRow, iFMergeLastRow, iFMergeFirstCol, iFMergeLastCol } = this;
    const { spacing } = this;
    const ifMerge = iFMerge(row, col);
    if (ifMerge) {
      const firstRow = iFMergeFirstRow(row, col);
      const lastRow = iFMergeLastRow(row, col);
      const firstCol = iFMergeFirstCol(row, col);
      const lastCol = iFMergeLastCol(row, col);
      switch (pos) {
        case 'left': { break; }
        case 'top': { break; }
        case 'right': { break; }
        case 'bottom': { break; }
        default: break;
      }
      return internal;
    }
    switch (pos) {
      case 'left': {
        internal.sx = sx + spacing;
        internal.ex = ex + spacing;
        // 检查顶边和上底边及左上角底边及左顶边
        const sTopLeftCorner = bottomShow(row - 1, col - 1) || topShow(row, col - 1);
        const sTop = topShow(row, col);
        const sBottom = bottomShow(row - 1, col);
        internal.sy = sy;
        if (sTopLeftCorner) internal.sy = sy - spacing;
        if (sTop || sBottom) internal.sy = sy + spacing;
        // 检查底边和下顶边及左下角顶边和左底边
        const eBottomLeftCorner = topShow(row + 1, col - 1) || bottomShow(row, col - 1);
        const eBottom = bottomShow(row, col);
        const eTop = topShow(row + 1, col);
        internal.ey = ey;
        if (eBottomLeftCorner) internal.ey = ey + spacing;
        if (eBottom || eTop) internal.ey = ey - spacing;
        break;
      }
      case 'top': {
        internal.sy = sy + spacing;
        internal.ey = ey + spacing;
        // 检查左边和左右边及左上角右边及上左边
        const sTopLeftCorner = rightShow(row - 1, col - 1) || leftShow(row - 1, col);
        const sLeft = leftShow(row, col);
        const sRight = rightShow(row, col - 1);
        internal.sx = sx;
        if (sTopLeftCorner) internal.sx = sx - spacing;
        if (sLeft || sRight) internal.sx = sx + spacing;
        // 检查右边和右左边及右上角左边及上右边
        const eTopRightCorner = leftShow(row - 1, col + 1) || rightShow(row - 1, col);
        const eRight = rightShow(row, col);
        const eLeft = leftShow(row, col + 1);
        internal.ex = ex;
        if (eTopRightCorner) internal.ex = ex + spacing;
        if (eRight || eLeft) internal.ex = ex - spacing;
        break;
      }
      case 'right': {
        internal.sx = sx - spacing;
        internal.ex = ex - spacing;
        // 检查顶边和上底边及右上角底边及右上边
        const sTopRightCorner = bottomShow(row - 1, col + 1) || topShow(row, col + 1);
        const sTop = topShow(row, col);
        const sBottom = bottomShow(row - 1, col);
        internal.sy = sy;
        if (sTopRightCorner) internal.sy = sy - spacing;
        if (sTop || sBottom) internal.sy = sy + spacing;
        // 检查底边和下顶边右下角顶边及右下边
        const eBottomRightCorner = topShow(row + 1, col + 1) || bottomShow(row, col + 1);
        const eBottom = bottomShow(row, col);
        const eTop = topShow(row + 1, col);
        internal.ey = ey;
        if (eBottomRightCorner) internal.ey = ey + spacing;
        if (eBottom || eTop) internal.ey = ey - spacing;
        break;
      }
      case 'bottom': {
        internal.sy = sy - spacing;
        internal.ey = ey - spacing;
        // 检查左边和左右边及左下角右边及下左边
        const sBottomLeftCorner = rightShow(row + 1, col - 1) || leftShow(row + 1, col);
        const sLeft = leftShow(row, col);
        const sRight = rightShow(row, col - 1);
        internal.sx = sx;
        if (sBottomLeftCorner) internal.sx = sx - spacing;
        if (sLeft || sRight) internal.sx = sx + spacing;
        // 检查右边和右左边及右下角左边及下右边
        const eBottomRightCorner = leftShow(row + 1, col + 1) || rightShow(row + 1, col);
        const eRight = rightShow(row, col);
        const eLeft = leftShow(row, col + 1);
        internal.ex = ex;
        if (eBottomRightCorner) internal.ex = ex + spacing;
        if (eRight || eLeft) internal.ex = ex - spacing;
        break;
      }
      default: break;
    }
    return internal;
  }

  drawLine(sx, sy, ex, ey, row, col, pos) {
    const { draw } = this;
    const { width, color } = this;
    draw.beginPath();
    draw.attr({
      lineWidth: width,
      strokeStyle: color,
    });
    draw.setLineDash([]);
    const external = this.handleExternal(sx, sy, ex, ey, row, col, pos);
    const internal = this.handleInternal(sx, sy, ex, ey, row, col, pos);
    if (!Utils.isEmptyObject(internal)) {
      draw.line([internal.sx, internal.sy], [internal.ex, internal.ey]);
    }
    if (!Utils.isEmptyObject(external)) {
      draw.line([external.sx, external.sy], [external.ex, external.ey]);
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
    this.type = LINE_TYPE.SOLID_LINE;
    this.solidLine = new SolidLine(draw, Utils.mergeDeep({}, attr));
    this.dottedLine = new DottedLine(draw, Utils.mergeDeep({
      dash: [5],
    }, attr));
    this.pointLine = new DottedLine(draw, Utils.mergeDeep({
      dash: [2, 2],
    }, attr));
    this.doubleLine = new DoubleLine(draw, Utils.mergeDeep({}, attr));
  }

  drawLine(sx, sy, ex, ey, row, col, pos) {
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
        doubleLine.drawLine(sx, sy, ex, ey, row, col, pos);
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
      this.solidLine.setColor(color);
      this.dottedLine.setColor(color);
      this.pointLine.setColor(color);
      this.doubleLine.setColor(color);
    }
  }
}

export { Line, LINE_TYPE };
