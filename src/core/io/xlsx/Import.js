import Excel from '../../../lib/excel/Excel';

class Import {
  constructor() {
    this.workbook = new Excel.Workbook();
  }

  load(bufferData) {
    this.workbook.xlsx.load(bufferData).then(() => {

    });
  }
}

export { Import };
