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
      color: '#000000',
      font: {
        name: 'Arial',
        size: 13,
        bold: false,
        italic: false,
      },
    };
    this.data = data;
  }

  getCell(ri, ci) {
    const row = this.data[ri];
    if (row && row[ci]) {
      row[ci] = Utils.mergeDeep({
        text: '',
      }, row[ci]);
      return row[ci];
    }
    return null;
  }

  getCellOrNew(ri, ci) {
    const row = this.data[ri];
    if (!row) {
      this.data.splice(ri, 0, []);
    }
    if (!row[ci]) {
      row[ci] = Utils.mergeDeep({
        text: '',
      }, row[ci]);
    }
    return row[ci];
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
      color: this.defaultStyle.color,
      strike: this.defaultStyle.strike,
      underline: this.defaultStyle.underline,
    });
  }
}

export { Cells };
