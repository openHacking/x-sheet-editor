import { LineFilter } from '../LineFilter';

class HorizontalBorderDisplayFilter extends LineFilter {

  constructor({
    cells,
  }) {
    super((ri, ci) => {
      const next = cells.getMergeCellOrCell(ri + 1, ci);
      const cell = cells.getMergeCellOrCell(ri, ci);
      let display = false;
      if (cell && !display) display = cell.borderAttr.bottom.display;
      if (next && !display) display = next.borderAttr.top.display;
      return !display;
    });
  }

}

export {
  HorizontalBorderDisplayFilter,
};
