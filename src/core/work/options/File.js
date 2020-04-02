import { Item } from './base/Item';
import { cssPrefix } from '../../../config';

class File extends Item {
  constructor() {
    super(`${cssPrefix}-tools-file`);
    this.setTitle('文件');
  }
}

export { File };
