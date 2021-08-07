import { RichEdit } from './RichEdit';
import { Constant } from '../../../../const/Constant';

/**
 * FormulaEdit
 */
class FormulaEdit extends RichEdit {

  /**
   * 公式转html
   */
  formulaTextToHtml() {
    const { activeCell } = this;
    return activeCell.formula;
  }

  /**
   * html转公式
   */
  htmlToFormulaText() {
    const { activeCell, selectRange } = this;
    const { table } = this;
    const { sri, sci } = selectRange;
    const cloneCell = activeCell.clone();
    const { snapshot } = table;
    const formula = this.text();
    snapshot.open();
    cloneCell.setFormula(formula);
    cloneCell.setCellOrNew(sri, sci, cloneCell);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
    });
    table.render();
  }

  /**
   * 检查输入的是否为公式内容
   */
  checkedFormulaText() {

  }

}

export {
  FormulaEdit,
};
