import { BaseFont } from './BaseFont';

class DisplayFont extends BaseFont {

  displayFont(rect, text) {
    const { attr } = this;
    const { align } = attr;
    const { width: rectWidth } = rect;
    const textLen = text.length;
    switch (align) {
      case BaseFont.ALIGN.center: {
        const textWidth = this.textWidth(text);
        let lOffset = rectWidth / 2 - textWidth / 2;
        if (lOffset < 0) {
          let display = '';
          let bi = 0;
          while (bi < textLen) {
            const char = text.charAt(bi);
            const width = this.textWidth(char);
            lOffset += width;
            if (lOffset > 0) {
              display += char;
              if (lOffset > rectWidth) {
                return display;
              }
            }
            bi += 1;
          }
        }
        break;
      }
      case BaseFont.ALIGN.left: {
        const textLen = text.length;
        let display = '';
        let bi = 0;
        let total = 0;
        while (bi < textLen) {
          const char = text.charAt(bi);
          const width = this.textWidth(char);
          total += width;
          display += char;
          if (total > rectWidth) {
            return display;
          }
          bi += 1;
        }
        break;
      }
      case BaseFont.ALIGN.right: {
        let bi = text.length;
        let display = '';
        let total = 0;
        while (bi > 0) {
          const char = text.charAt(bi);
          const width = this.textWidth(char);
          total += width;
          display = char + display;
          if (total > rectWidth) {
            return display;
          }
          bi -= 1;
        }
        break;
      }
    }
    return text;
  }

}

export {
  DisplayFont,
};
