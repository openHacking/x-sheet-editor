import { RichFont } from './RichFont';

class RichFonts {

  constructor({
    rich = [],
  } = {}) {
    this.rich = rich.map(font => new RichFont(font));
  }

  setRich(rich = []) {
    this.rich = rich;
  }

  getRich() {
    return this.rich;
  }

  clone() {
    const rich = [];
    this.rich.forEach((font) => {
      rich.push(font.clone());
    });
    return new RichFonts({ rich });
  }

  plain(option) {
    const result = [];
    this.rich.forEach((font) => {
      result.push(font.plain(option));
    });
    return result;
  }

}

export {
  RichFonts,
};
