import { Utils } from '../utils/Utils';
import { BoxRange } from '../canvas/BoxRange';
import { Merges } from './Merges';

class Cells {
  constructor({ cols, rows, data = [] }) {
    this.cols = cols;
    this.rows = rows;
    this.merges = new Merges();
    this.defaultAttr = {
      merge: [0, 0],
      style: {
        bgColor: '#ffffff',
        align: 'left',
        verticalAlign: 'middle',
        textWrap: false,
        strike: false,
        underline: false,
        color: '#0a0a0a',
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
    if (row && row[ci]) return Utils.mergeDeep(row[ci], this.defaultAttr);
    return null;
  }

  getRectRangeCell(rectRange, cb) {
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = 0;
    for (let i = sri; i <= eri; i += 1) {
      const height = this.rows.getHeight(i);
      let x = 0;
      for (let j = sci; j <= eci; j += 1) {
        const width = this.cols.getWidth(j);
        cb(i, j, new BoxRange(x, y, width, height), this.getCell(i, j));
        x += width;
      }
      y += height;
    }
  }
}

export { Cells };
