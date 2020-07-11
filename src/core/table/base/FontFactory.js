import { FontBuilder } from './FontBuilder';

class FontFactory {

  constructor(table) {
    this.table = table;
  }

  getBuilder() {
    return new FontBuilder(this.table);
  }

}

export {
  FontFactory,
};
