import cell from '../../../assets/svg/cell.png';
import sResize from '../../../assets/svg/s-resize.png';
import eResize from '../../../assets/svg/e-resize.png';

class MousePointType {

  constructor(table) {
    this.table = table;
    this.switch = false;
    this.ignoreNames = [];
  }

  on(ignoredNames) {
    this.switch = true;
    this.ignoreNames = this.ignoreNames.concat(ignoredNames);
  }

  set(type, name) {
    if (this.switch && this.ignoreNames.indexOf(name) === -1) return;
    const { table } = this;
    switch (type) {
      case 'cell':
        table.css('cursor', `url(${cell}) 7.5 7.5,auto`);
        break;
      case 's-resize':
        table.css('cursor', `url(${sResize}) 2.5 7.5,auto`);
        break;
      case 'e-resize':
        table.css('cursor', `url(${eResize}) 7.5 2.5,auto`);
        break;
      default:
        table.css('cursor', type);
        break;
    }
  }

  off() {
    this.switch = false;
    this.ignoreNames = [];
  }
}

export { MousePointType };
