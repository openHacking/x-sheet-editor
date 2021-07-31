import { SheetUtils } from '../../../../utils/SheetUtils';

class XSelectPath {

  constructor() {
    this.dri = -1;
    this.dci = -1;
    this.mode = XSelectPath.MODE.UN;
  }

  set({
    sri, sci, mode, set = false,
  }) {
    if (this.mode !== mode || set) {
      if (SheetUtils.isNotUnDef(sri)) {
        this.dri = sri;
      }
      if (SheetUtils.isNotUnDef(sci)) {
        this.dci = sci;
      }
      if (SheetUtils.isNotUnDef(mode)) {
        this.mode = mode;
      }
    }
  }

  clear() {
    this.dri = -1;
    this.dci = -1;
    this.mode = XSelectPath.MODE.UN;
  }

}

XSelectPath.MODE = {
  UN: Symbol('未知'),
  TB: Symbol('上下'),
  LR: Symbol('左右'),
};

export {
  XSelectPath,
};