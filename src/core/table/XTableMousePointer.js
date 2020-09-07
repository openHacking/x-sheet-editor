import cell from '../../../assets/svg/cell.png';
import sResize from '../../../assets/svg/s-resize.png';
import eResize from '../../../assets/svg/e-resize.png';

class XTableMousePointer {

  constructor(table) {
    this.table = table;
  }

  set(type) {
    const { table } = this;
    switch (type) {
      case 's-resize':
        table.css('cursor', `url(${sResize}) 2.5 7.5,auto`);
        break;
      case 'cell':
        table.css('cursor', `url(${cell}) 7.5 7.5,auto`);
        break;
      case 'e-resize':
        table.css('cursor', `url(${eResize}) 7.5 2.5,auto`);
        break;
      default:
        table.css('cursor', type);
        break;
    }
  }

}

export { XTableMousePointer };
