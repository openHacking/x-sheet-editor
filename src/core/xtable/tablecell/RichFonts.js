import { RichFont } from './RichFont';

class RichFonts {

  constructor({
    fonts = [],
  }) {
    this.fonts = fonts.map(font => new RichFont(font));
  }

  clone() {
    const fonts = [];
    this.fonts.forEach((font) => {
      fonts.push(font.clone());
    });
    return new RichFont({
      fonts,
    });
  }

  setScaleAdapter(scaleAdapter) {
    this.fonts.forEach((font) => {
      font.setScaleAdapter(scaleAdapter);
    });
  }

}

export {
  RichFonts,
};
