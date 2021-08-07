import { RichEdit } from './RichEdit';

/**
 * FormulaEdit
 */
class FormulaEdit extends RichEdit {

  /**
   * 公式转html
   * @param cell
   */
  formulaTextToHtml(cell) {
    return cell.formulaText;
  }

  /**
   * html转公式
   * @param html
   */
  htmlToFormulaText(html) {
    return html;
  }

}

export {
  FormulaEdit,
};
