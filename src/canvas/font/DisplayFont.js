import { BaseFont } from './BaseFont';

class DisplayFont extends BaseFont {

  displayFont() {
    const { attr, text, rect } = this;
    const { align } = attr;
    const { width: rectWidth } = rect;
    const textLen = text.length;
    switch (align) {
      case BaseFont.ALIGN.center: {
        const textWidth = this.textWidth(text);
        const lOffset = rectWidth / 2 - textWidth / 2;
        if (lOffset < 0) {
          let start = 0;
          let hideStr = '';
          while (start < textLen) {
            const str = hideStr + text.charAt(start);
            if (lOffset + this.textWidth(str) >= 0) {
              break;
            }
            hideStr = str;
            start += 1;
          }
          let over = start;
          let showStr = '';
          while (over < textLen) {
            const str = showStr + text.charAt(over);
            if (this.textWidth(str) >= rectWidth) {
              break;
            }
            showStr = str;
            over += 1;
          }
          return showStr;
        }
        break;
      }
      case BaseFont.ALIGN.left: {
        let start = 0;
        let showStr = '';
        while (start < textLen) {
          const str = showStr + text.charAt(start);
          if (this.textWidth(str) >= rectWidth) {
            break;
          }
          showStr = str;
          start += 1;
        }
        return showStr;
      }
      case BaseFont.ALIGN.right: {
        let start = textLen - 1;
        let showStr = '';
        while (start >= 0) {
          const str = text.charAt(start) + showStr;
          if (this.textWidth(str) >= rectWidth) {
            break;
          }
          showStr = str;
          start -= 1;
        }
        return showStr;
      }
    }
    return text;
  }

}

export {
  DisplayFont,
};
