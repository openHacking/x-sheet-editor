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
    if (row && row[ci]) return Utils.mergeDeep({}, this.defaultAttr, row[ci]);
    return null;
  }

  getRectRangeCell(rectRange, cb) {
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = 0;
    for (let i = sri; i <= eri; i += 1) {
      const rowHeight = this.rows.getHeight(i);
      let x = 0;
      for (let j = sci; j <= eci; j += 1) {
        const colWidth = this.cols.getWidth(j);
        const cell = this.getCell(i, j);
        if (cell !== null) {
          const { merge } = cell;
          let [cellWidth, cellHeight] = [colWidth, rowHeight];
          if (merge) {
            const [rn, cn] = merge;
            if (rn > 0) {
              for (let ii = 1; ii <= rn; ii += 1) {
                cellHeight += this.rows.getHeight(i + ii);
              }
            }
            if (cn > 0) {
              for (let jj = 1; jj <= cn; jj += 1) {
                cellWidth += this.cols.getWidth(j + jj);
              }
            }
          }
          cb(i, j, new BoxRange(x, y, cellWidth, cellHeight), cell);
        }
        x += colWidth;
      }
      y += rowHeight;
    }
  }
}

export { Cells };
