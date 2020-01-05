import { Rect } from '../../graphical/rect/Rect';
import { Utils } from '../../utils/Utils';
import { RectText } from '../../graphical/rect/RectText';

class Cells {
  constructor({ cols, rows, data = [] }) {
    this.cols = cols;
    this.rows = rows;
    this.defaultStyle = {
      align: 'left',
      verticalAlign: 'middle',
      textWrap: false,
      strike: false,
      underline: false,
      font: {
        name: 'Arial',
        size: 13,
        bold: false,
        italic: false,
        color: '#000000',
      },
    };
    this.data = data;
  }

  getCell(ri, ci) {
    const row = this.data[ri];
    if (row && row[ci]) {
      return Utils.mergeDeep({
        text: '',
      }, row[ci]);
    }
    return null;
  }

  getRectRangeCell(rectRange, cb, { sy = 0, sx = 0 } = {}) {
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = sy;
    for (let i = sri; i <= eri; i += 1) {
      const height = this.rows.getHeight(i);
      let x = sx;
      for (let j = sci; j <= eci; j += 1) {
        const width = this.cols.getWidth(j);
        const cell = this.getCell(i, j);
        if (cell) {
          cb(i, j, new Rect({
            x, y, width, height,
          }), cell);
        }
        x += width;
      }
      y += height;
    }
  }

  getRectText(draw, rect = null) {
    return new RectText(draw, rect, {
      align: this.defaultStyle.align,
      verticalAlign: this.defaultStyle.verticalAlign,
      font: this.defaultStyle.font,
      strike: this.defaultStyle.strike,
      underline: this.defaultStyle.underline,
    });
  }
}

export { Cells };
