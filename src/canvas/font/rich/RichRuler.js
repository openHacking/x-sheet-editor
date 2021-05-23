import { BaseRuler } from '../BaseRuler';

class RichRuler extends BaseRuler {

  constructor({
    draw, rich,
  }) {
    super({ draw });
    this.rich = rich;
  }

}

export {
  RichRuler,
};
