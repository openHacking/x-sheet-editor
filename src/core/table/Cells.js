import { Utils } from '../../utils/Utils';
import { Rect } from '../../canvas/Rect';

class Cells {
  constructor({
    table, cols, rows, data = [],
  }) {
    this.table = table;
    this.cols = cols;
    this.rows = rows;
    this.borderArray = [];
    this._ = data;
  }

  /**
   * 返回指定区域中的所有单元格
   * @param rectRange
   * @param cb
   * @param sy
   * @param sx
   * @param createNew
   */
  getCellInRectRange(rectRange, cb, { sy = 0, sx = 0 } = {}, createNew = false) {
    const {
      sri, eri, sci, eci,
    } = rectRange;
    let y = sy;
    for (let i = sri; i <= eri; i += 1) {
      const height = this.rows.getHeight(i);
      let x = sx;
      for (let j = sci; j <= eci; j += 1) {
        const width = this.cols.getWidth(j);
        const cell = createNew ? this.getCellOrNew(i, j) : this.getCell(i, j);
        if (cell) {
          cb(i, j, new Rect({
            x,
            y,
            width,
            height,
          }), cell);
        }
        x += width;
      }
      y += height;
    }
  }

  /**
   * 返回指定区域中的所有合并单元格
   * @param viewRange
   * @param cb
   */
  getMergeCellInRectRange(viewRange, cb) {
    const { table } = this;
    const { merges, cols, rows } = table;
    const filter = [];
    this.getCellInRectRange(viewRange, (i, c) => {
      const rectRange = merges.getFirstIncludes(i, c);
      if (!rectRange || filter.find(item => item === rectRange)) return;
      filter.push(rectRange);
      const cell = this.getCell(rectRange.sri, rectRange.sci);
      const minSri = Math.min(viewRange.sri, rectRange.sri);
      let maxSri = Math.max(viewRange.sri, rectRange.sri);
      const minSci = Math.min(viewRange.sci, rectRange.sci);
      let maxSci = Math.max(viewRange.sci, rectRange.sci);
      maxSri -= 1;
      maxSci -= 1;
      let x = cols.sectionSumWidth(minSci, maxSci);
      let y = rows.sectionSumHeight(minSri, maxSri);
      x = viewRange.sci > rectRange.sci ? x * -1 : x;
      y = viewRange.sri > rectRange.sri ? y * -1 : y;
      const width = cols.sectionSumWidth(rectRange.sci, rectRange.eci);
      const height = rows.sectionSumHeight(rectRange.sri, rectRange.eri);
      const rect = new Rect({
        x,
        y,
        width,
        height,
      });
      cb(rect, cell);
    });
  }

  /**
   * 初始化单元格基本属性
   * @param cell
   * @returns {*}
   */
  initCell(cell) {
    return Utils.isUnDef(cell.ID) ? Utils.mergeDeep(Cells.getDefaultAttr(), cell) : cell;
  }

  /**
   * 判断单元格是否属于合并单元格
   * @param ri
   * @param ci
   * @returns {boolean}
   */
  isMergeCell(ri, ci) {
    const { table } = this;
    const { merges } = table;
    return merges.getFirstIncludes(ri, ci) !== null;
  }

  /**
   * 判断单元格是否显示左边框
   * @param ri
   * @param ci
   * @returns {null|boolean}
   */
  isDisplayLeftBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell && cell.borderAttr.left.display;
  }

  /**
   * 判断单元格是否显示顶部边框
   * @param ri
   * @param ci
   * @returns {null|boolean}
   */
  isDisplayTopBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell && cell.borderAttr.top.display;
  }

  /**
   * 判断单元格是否显示右部边框
   * @param ri
   * @param ci
   * @returns {null|boolean}
   */
  isDisplayRightBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell && cell.borderAttr.right.display;
  }

  /**
   * 判断单元格是否显示底部边框
   * @param ri
   * @param ci
   * @returns {null|boolean}
   */
  isDisplayBottomBorder(ri, ci) {
    const cell = this.getMergeCellOrCell(ri, ci);
    return cell && cell.borderAttr.bottom.display;
  }

  /**
   * 获取单元格的基本属性
   * @returns {Object}
   */
  static getDefaultAttr() {
    const fontAttr = {
      align: 'left',
      verticalAlign: 'middle',
      textWrap: false,
      strike: false,
      underline: false,
      color: '#000000',
      name: 'Arial',
      size: 14,
      bold: false,
      italic: false,
    };
    const borderAttr = {
      time: Utils.now(),
      left: { display: false },
      top: { display: false },
      right: { display: false },
      bottom: { display: false },
    };
    return {
      ID: Utils.now(),
      text: '',
      format: 'default',
      background: null,
      fontAttr,
      borderAttr,
    };
  }

  /**
   * 获取指定索引的单元格
   * @param ri
   * @param ci
   * @returns {null|*}
   */
  getCell(ri, ci) {
    const row = this._[ri];
    if (row && row[ci]) {
      row[ci] = this.initCell(row[ci]);
      return row[ci];
    }
    return null;
  }

  /**
   * 获取指定索引的单元格, 不存在时创建新的
   * @param ri
   * @param ci
   * @returns {null|*}
   */
  getCellOrNew(ri, ci) {
    if (!this._[ri]) {
      this._[ri] = [];
    }
    if (!this._[ri][ci]) {
      this._[ri][ci] = {};
    }
    this._[ri][ci] = this.initCell(this._[ri][ci]);
    return this._[ri][ci];
  }

  /**
   * 如果单元格是合并单元格的一部分, 返回合并单元格的起始单元格,
   * 否则返回指定的单元格
   * @param ri
   * @param ci
   * @returns {*}
   */
  getMergeCellOrCell(ri, ci) {
    const { table } = this;
    const { merges } = table;
    const merge = merges.getFirstIncludes(ri, ci);
    if (merge) {
      return this.getCell(merge.sri, merge.sci);
    }
    return this.getCell(ri, ci);
  }

  getData() {
    return this._;
  }

  setData(data = []) {
    this._ = data;
    return this;
  }
}

export { Cells };
