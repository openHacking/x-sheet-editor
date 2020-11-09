import { LineFilter } from '../LineFilter';

class VerticalBorderDisplayFilter extends LineFilter {

  constructor({
    cells,
  }) {
    super((ci, ri) => {
      const next = cells.getCell(ri, ci + 1);
      const cell = cells.getCell(ri, ci);
      let display = false;
      if (cell && !display) display = cell.borderAttr.right.display;
      if (next && !display) display = next.borderAttr.left.display;
      return display
        ? LineFilter.RETURN_TYPE.JUMP
        : LineFilter.RETURN_TYPE.HANDLE;
    });
  }

}

export {
  VerticalBorderDisplayFilter,
};
