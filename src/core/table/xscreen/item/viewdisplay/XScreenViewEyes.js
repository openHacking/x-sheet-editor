import { RectRange } from '../../../tablebase/RectRange';
import { XScreenItem } from '../XScreenItem';

class Display {

  constructor(viewEyes) {
    this.viewEyes = viewEyes;
  }

  setDisplay(targetViewRange) {
    const screenView = this.getXScreenViewRange();
    const target = screenView.coincide(targetViewRange);
    const part = this.getPart();
    if (target !== RectRange.EMPTY) {
      part.show();
    } else {
      part.hide();
    }
  }

  getPart() {
    throw new TypeError('child impl');
  }

  getXScreenViewRange() {
    throw new TypeError('child impl');
  }

}

class LTDisplay extends Display {

  setDisplay(targetViewRange) {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      super.setDisplay(targetViewRange);
    }
  }

  getPart() {
    const { viewEyes } = this;
    return viewEyes.lt;
  }

  getXScreenViewRange() {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop() && xFixedView.hasFixedLeft()) {
      return xFixedView.getFixedView();
    }
    return RectRange.EMPTY;
  }

}

class TDisplay extends Display {

  setDisplay(targetViewRange) {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop()) {
      super.setDisplay(targetViewRange);
    }
  }

  getPart() {
    const { viewEyes } = this;
    return viewEyes.t;
  }

  getXScreenViewRange() {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedTop()) {
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      return new RectRange(fixedView.sri, scrollView.sci, fixedView.eri, scrollView.eci);
    }
    return RectRange.EMPTY;
  }

}

class BRDisplay extends Display {

  getPart() {
    const { viewEyes } = this;
    return viewEyes.br;
  }

  getXScreenViewRange() {
    const { viewEyes } = this;
    const { table } = viewEyes;
    return table.getScrollView();
  }

}

class LDisplay extends Display {

  setDisplay(targetViewRange) {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedLeft()) {
      super.setDisplay(targetViewRange);
    }
  }

  getPart() {
    const { viewEyes } = this;
    return viewEyes.l;
  }

  getXScreenViewRange() {
    const { viewEyes } = this;
    const { table } = viewEyes;
    const { xFixedView } = table;
    if (xFixedView.hasFixedLeft()) {
      const fixedView = xFixedView.getFixedView();
      const scrollView = table.getScrollView();
      return new RectRange(scrollView.sri, fixedView.sci, scrollView.eri, fixedView.eci);
    }
    return RectRange.EMPTY;
  }

}

class XScreenViewEyes extends XScreenItem {

  constructor({
    table,
  } = {}) {
    super({ table });
    this.ltDisplay = new LTDisplay(this);
    this.tDisplay = new TDisplay(this);
    this.brDisplay = new BRDisplay(this);
    this.lDisplay = new LDisplay(this);
  }

  setDisplay(targetViewRange) {
    this.ltDisplay.setDisplay(targetViewRange);
    this.tDisplay.setDisplay(targetViewRange);
    this.brDisplay.setDisplay(targetViewRange);
    this.lDisplay.setDisplay(targetViewRange);
  }

  setLocal() {
    throw new TypeError('child impl');
  }

  setSizer() {
    throw new TypeError('child impl');
  }

}

export {
  XScreenViewEyes,
};
