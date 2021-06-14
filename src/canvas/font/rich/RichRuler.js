import { BaseRuler } from '../BaseRuler';

class RichRuler extends BaseRuler {

  constructor({
    draw, rich,
  }) {
    super({ draw });
    this.rich = rich;
  }

  richHasBreak() {
    for (let i = 0, len = this.rich.length; i < len; i++) {
      const item = this.rich[i];
      if (item.text.indexOf('\n') > -1) {
        return true;
      }
    }
    return false;
  }

  textBreak(text) {
    return text.split(/\n/);
  }

}

export {
  RichRuler,
};
