import { Rect } from '../graphical/Rect';
import { Utils } from '../utils/Utils';

class Cells {
  constructor({ cols, rows, data = [] }) {
    this.cols = cols;
    this.rows = rows;
    this.defaultAttr = {
      style: {
        bgColor: '#ffffff',
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
}

export { Cells };
