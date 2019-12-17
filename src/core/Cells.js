import { Utils } from '../utils/Utils';
import { BoxRange } from '../canvas/BoxRange';

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
    let cell = {};
    if (row && row[ci]) cell = row[ci];
    return Utils.mergeDeep(cell, this.defaultAttr);
  }

  getBoxRange(ri, ci) {
    const [x, y, width, height] = [
      Utils.rangeSum(0, ci, i => this.cols.getWidth(i)),
      Utils.rangeSum(0, ri, i => this.rows.getHeight(i)),
      this.cols.getWidth(ci),
      this.rows.getHeight(ri),
    ];
    return new BoxRange(x, y, width, height);
  }
}

export { Cells };
