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

  getBoxRangeCells(rectRange) {
    const {
      sri, eri, sci, eci,
    } = rectRange;
    const boxRanges = [];
    let y = 0;
    for (let i = sri; i <= eri; i += 1) {
      const height = this.rows.getHeight(i);
      let x = 0;
      for (let j = sci; j <= eci; j += 1) {
        const width = this.cols.getWidth(j);
        boxRanges.push({
          boxRange: new BoxRange(x, y, width, height),
          cell: this.getCell(i, j),
          ri: i,
          ci: j,
        });
        x += width;
      }
      y += height;
    }
    return boxRanges;
  }
}

export { Cells };
