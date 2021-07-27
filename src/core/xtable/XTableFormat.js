import { SheetUtils } from '../../utils/SheetUtils';
import { DateUtils } from '../../utils/DateUtils';

function parserToDate(text) {
  let result = text;
  if (result instanceof Date) {
    return result;
  }
  result = DateUtils.parserToDate(text, 'yyyy/MM/dd hh:mm:ss');
  if (result) {
    return result;
  }
  result = DateUtils.parserToDate(text, 'yyyy/MM/dd');
  if (result) {
    return result;
  }
  result = DateUtils.parserToDate(text, 'hh:mm:ss');
  if (result) {
    return result;
  }
  result = DateUtils.parserToDate(text, 'MM月dd日');
  if (result) {
    return result;
  }
  result = DateUtils.parserToDate(text, 'yyyy年MM月');
  if (result) {
    return result;
  }
  result = DateUtils.parserToDate(text, 'yyyy年MM月dd日');
  if (result) {
    return result;
  }
  return text;
}

class Format {

  eNotation(value) {
    if (SheetUtils.isNumber(value)) {
      const number = SheetUtils.parseFloat(value);
      return number.toExponential(2);
    }
    return value;
  }

  default(value) {
    return value;
  }

  text(value) {
    return value;
  }

  decimal(value) {
    if (SheetUtils.isNumber(value)) {
      const indexOf = value.toString().indexOf('.');
      // eslint-disable-next-line no-bitwise
      if (~indexOf) {
        return value.toString().substring(0, indexOf + 3);
      }
      return `${value}.00`;
    }
    return value;
  }

  number(value) {
    if (SheetUtils.isNumber(value)) {
      return SheetUtils.parseFloat(value);
    }
    return value;
  }

  fraction(value) {
    if (SheetUtils.isFraction(value)) {
      const left = value.split('/')[0];
      const right = value.split('/')[1];
      return SheetUtils.parseInt(left) / SheetUtils.parseInt(right);
    }
    return value;
  }

  percentage(value) {
    if (SheetUtils.isNumber(value)) {
      return `${value}%`;
    }
    return value;
  }

  hk(value) {
    if (SheetUtils.isNumber(value)) {
      return `HK${value}`;
    }
    return value;
  }

  rmb(value) {
    if (SheetUtils.isNumber(value)) {
      return `￥${value}`;
    }
    return value;
  }

  time(value) {
    const result = parserToDate(value);
    if (result) {
      return DateUtils.dateFormat('hh:mm:ss', result);
    }
    return value;
  }

  date1(value) {
    const result = parserToDate(value);
    if (result) {
      return DateUtils.dateFormat('yyyy/MM/dd', result);
    }
    return value;
  }

  date2(value) {
    const result = parserToDate(value);
    if (result) {
      return DateUtils.dateFormat('MM月dd日', result);
    }
    return value;
  }

  date3(value) {
    const result = parserToDate(value);
    if (result) {
      return DateUtils.dateFormat('yyyy年MM月', result);
    }
    return value;
  }

  date4(value) {
    const result = parserToDate(value);
    if (result) {
      return DateUtils.dateFormat('yyyy年MM月dd日', result);
    }
    return value;
  }

  date5(value) {
    const result = parserToDate(value);
    if (result) {
      return DateUtils.dateFormat('yyyy/MM/dd hh:mm:ss', result);
    }
    return value;
  }

  dollar(value) {
    if (SheetUtils.isNumber(value)) {
      return `$${value}`;
    }
    return value;
  }

}

const format = new Format();

export default (type, value) => format[type](value);
