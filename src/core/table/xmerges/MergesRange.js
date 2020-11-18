import { RectRange } from '../tablebase/RectRange';

class MergesRange {

  constructor(sri, sci, eri, eci) {
    this.sri = sri;
    this.sci = sci;
    this.eri = eri;
    this.eci = eci;
    this.rectrange = new RectRange();
  }

  getRectRange() {
    this.rectrange.set(this.sri.index, this.sci.index, this.eri.index, this.eci.index);
    return this.rectrange;
  }

}

export {
  MergesRange,
};
