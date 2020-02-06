import { OffsetLocation } from './OffsetLocation';

const LOCATION_TYPE = {
  TOP: 1,
  BOTTOM: 2,
  LEFT: 3,
  RIGHT: 4,
};

class ElLocation {
  constructor(el, type, offset = new OffsetLocation(0, 0)) {
    this.el = el;
    this.type = type;
    this.offset = offset;
    this.fixed = false;
  }
}

export { ElLocation, LOCATION_TYPE };
