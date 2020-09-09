import { RectRange } from './RectRange';

class XFixedView {

  constructor({
    fixedView = RectRange.EMPTY,
  }) {
    this.fixedView = fixedView;
  }

  getFixedView() {
    return this.fixedView.clone();
  }

  hasFixedLeft() {
    return this.fixedView.eci > -1;
  }

  hasFixedTop() {
    return this.fixedView.eri > -1;
  }

}

export {
  XFixedView,
};
