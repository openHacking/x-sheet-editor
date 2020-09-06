import cell from '../../../assets/svg/cell.png';
import sResize from '../../../assets/svg/s-resize.png';
import eResize from '../../../assets/svg/e-resize.png';

class XTableMousePointer {

  constructor(table) {
    this.table = table;
    this.lock = null;
  }

  on(lock) {
    if (this.lock !== null) return;
    this.lock = lock;
  }

  set(type, lock) {
    if (this.lock) {
      if (lock !== this.lock) return;
    }
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
      case 'grab':
        table.css('cursor', '-webkit-grab');
        break;
      default:
        table.css('cursor', type);
        break;
    }
  }

  off(lock) {
    if (this.lock !== lock) return;
    this.lock = null;
  }
}

export { XTableMousePointer };
