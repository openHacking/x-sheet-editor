import { Item } from './base/Item';
import { cssPrefix } from '../../../constant/Constant';

class File extends Item {
  constructor() {
    super(`${cssPrefix}-tools-file`);
    this.setTitle('文件');
  }
}

export { File };
