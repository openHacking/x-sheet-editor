import { BaseIterator } from './BaseIterator';

class ColsIterator extends BaseIterator {

  static getInstance() {
    return new ColsIterator();
  }

}

export {
  ColsIterator,
};
