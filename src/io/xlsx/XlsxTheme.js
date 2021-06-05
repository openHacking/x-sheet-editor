/**
 * http://ciintelligence.blogspot.com/2012/02/converting-excel-theme-color-and-tint.html
 */
import { ColorPicker } from '../../component/colorpicker/ColorPicker';
import { XDraw } from '../../canvas/XDraw';
import X2JS from '../../libs/xml2json/xml2json';

function HexRgb(argb) {
  if (argb) {
    if (argb.startsWith('#')) {
      if (argb.length === 9) {
        return `#${argb.substring(3)}`;
      }
    } else if (argb.length === 8) {
      return argb.substring(2);
    }
  }
  return argb;
}

class HlsColor {

  constructor(a = 0, h = 0, l = 0, s = 0) {
    this.a = a;
    this.h = h;
    this.l = l;
    this.s = s;
  }

  rgbToHls(rgbColor) {
    const hlsColor = new HlsColor();
    const r = rgbColor.r / 255;
    const g = rgbColor.g / 255;
    const b = rgbColor.b / 255;
    const a = rgbColor.a / 255;
    const min = Math.min(r, Math.min(g, b));
    const max = Math.max(r, Math.max(g, b));
    const delta = max - min;
    if (max === min) {
      hlsColor.h = 0;
      hlsColor.s = 0;
      hlsColor.l = max;
      return hlsColor;
    }
    hlsColor.l = (min + max) / 2;
    if (hlsColor.l < 0.5) {
      hlsColor.s = delta / (max + min);
    } else {
      hlsColor.s = delta / (2.0 - max - min);
    }
    if (r === max) hlsColor.h = (g - b) / delta;
    if (g === max) hlsColor.h = 2.0 + (b - r) / delta;
    if (b === max) hlsColor.h = 4.0 + (r - g) / delta;
    hlsColor.h *= 60;
    if (hlsColor.h < 0) hlsColor.h += 360;
    hlsColor.a = a;
    return hlsColor;
  }

}

class RgbColor {

  constructor(r = 0, g = 0, b = 0, a = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  setColor(t1, t2, t3) {
    if (t3 < 0) t3 += 1.0;
    if (t3 > 1) t3 -= 1.0;
    let color;
    if (6.0 * t3 < 1) {
      color = t2 + (t1 - t2) * 6.0 * t3;
    } else if (2.0 * t3 < 1) {
      color = t1;
    } else if (3.0 * t3 < 2) {
      color = t2 + (t1 - t2) * ((2.0 / 3.0) - t3) * 6.0;
    } else {
      color = t2;
    }
    return color;
  }

  hlsToRgb(hlsColor) {
    if (hlsColor.s === 0) {
      return new RgbColor(hlsColor.l * 255, hlsColor.l * 255, hlsColor.l * 255, hlsColor.a * 255);
    }
    let t1;
    if (hlsColor.l < 0.5) {
      t1 = hlsColor.l * (1.0 + hlsColor.s);
    } else {
      t1 = hlsColor.l + hlsColor.s - (hlsColor.l * hlsColor.s);
    }
    const t2 = 2.0 * hlsColor.l - t1;
    const h = hlsColor.h / 360;
    const tR = h + (1.0 / 3.0);
    const r = this.setColor(t1, t2, tR);
    const g = this.setColor(t1, t2, h);
    const tB = h - (1.0 / 3.0);
    const b = this.setColor(t1, t2, tB);
    return new RgbColor(r * 255, g * 255, b * 255, hlsColor.a * 255);
  }

}

class Theme {

  constructor(theme = 0, tint = 0, colorPallate = [
    'FFFFFF',
    '000000',
    'EEECE1',
    '1F497D',
    '4F81BD',
    'C0504D',
    '9BBB59',
    '8064A2',
    '4BACC6',
    'F79646',
  ]) {
    this.cacheTheme = {};
    this.tint = tint;
    this.theme = theme;
    this.colorPallate = colorPallate;
  }

  setColorPallate(list) {
    this.colorPallate = list;
    this.cacheTheme = {};
    return this;
  }

  setTint(tint) {
    this.tint = tint;
    return this;
  }

  setTheme(theme) {
    this.theme = theme;
    return this;
  }

  getThemeRgb() {
    const key = `${this.theme}+${this.tint}`;
    if (this.cacheTheme[key]) {
      return this.cacheTheme[key];
    }
    const hex = this.colorPallate[this.theme];
    const rgb = ColorPicker.hexToRgb(hex);
    const rgbColor = new RgbColor(rgb.r, rgb.g, rgb.b);
    const hlsColor = new HlsColor().rgbToHls(rgbColor);
    hlsColor.l = this.lumValue(this.tint, hlsColor.l * 255) / 255;
    const result = new RgbColor().hlsToRgb(hlsColor);
    const r = XDraw.trunc(result.r);
    const g = XDraw.trunc(result.g);
    const b = XDraw.trunc(result.b);
    const final = `rgb(${r},${g},${b})`;
    this.cacheTheme[key] = final;
    return final;
  }

  lumValue(tint, lum) {
    if (tint == null) {
      return lum;
    }
    let value;
    if (tint < 0) {
      value = lum * (1.0 + tint);
    } else {
      value = lum * (1.0 - tint) + (255 - 255 * (1.0 - tint));
    }
    return value;
  }
}

class ThemeXml {

  constructor(xml) {
    this.x2js = new X2JS();
    this.x2jsPraseResult = this.x2js.xml_str2json(xml);
  }

  getThemeList() {
    const { theme } = this.x2jsPraseResult;
    const { themeElements } = theme;
    const { clrScheme } = themeElements;
    const array = [];
    const sort = [
      'lt1', 'dk1', 'lt2', 'dk2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6',
    ];
    sort.forEach((key) => {
      const { sysClr, srgbClr } = clrScheme[key];
      if (sysClr) {
        const { _lastClr } = sysClr;
        if (_lastClr) {
          array.push({
            key,
            val: _lastClr,
          });
        }
      }
      if (srgbClr) {
        const { _val } = srgbClr;
        if (_val) {
          array.push({
            key,
            val: _val,
          });
        }
      }
    });
    array.sort((a, b) => {
      const key1 = a.key;
      const key2 = b.key;
      return sort.indexOf(key1) - sort.indexOf(key2);
    });
    return array.map(item => item.val);
  }
}

export {
  Theme, ThemeXml, HexRgb,
};
