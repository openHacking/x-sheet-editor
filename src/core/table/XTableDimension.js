import { SheetUtils } from '../../utils/SheetUtils';
import { Code } from './tablebase/Code';
import { Rows } from './tablerow/Rows';
import { Cols } from './tablecol/Cols';
import { Scroll, SCROLL_TYPE } from './tablebase/Scroll';
import { Widget } from '../../lib/Widget';
import { Constant, cssPrefix } from '../../const/Constant';
import { XEvent } from '../../lib/XEvent';
import { Scale, ScaleAdapter } from './tablebase/Scale';
import { XTableMousePoint } from './XTableMousePoint';
import { XTableKeyboard } from './XTableKeyboard';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { XDraw } from '../../draw/XDraw';
import { RectRange } from './tablebase/RectRange';
import { XTableScrollView } from './XTableScrollView';
import { XTableAreaView } from './XTableAreaView';
import { XTableDrawStyle } from './XTableDrawStyle';
import { XScreen } from './screen/XScreen';
import { XSelectItem } from './screenitems/xselect/XSelectItem';
import { XAutoFillItem } from './screenitems/xautofill/XAutoFillItem';
import { XCopyStyle } from './screenitems/xcopystyle/XCopyStyle';
import { RowFixed } from './tablefixed/RowFixed';
import { ColFixed } from './tablefixed/ColFixed';
import { DropRowFixed } from './tablefixed/drop/DropRowFixed';
import { DropColFixed } from './tablefixed/drop/DropColFixed';
import { XFixedMeasure } from './tablebase/XFixedMeasure';
import { XFixedView } from './tablebase/XFixedView';
import { XFilter } from './screenitems/xfilter/XFilter';
import { CellMergeCopyHelper } from './helper/dimension/CellMergeCopyHelper';
import { Clipboard } from '../../lib/Clipboard';
import { XIcon } from './tableicon/XIcon';
import { XIconBuilder } from './tableicon/XIconBuilder';
import { XIteratorBuilder } from './iterator/XIteratorBuilder';
import { RowHeightGroupIndex } from './tablebase/RowHeightGroupIndex';
import { Alert } from '../../module/alert/Alert';
import { Snapshot } from './snapshot/Snapshot';
import { TableEdit } from './tableedit/TableEdit';
import { Protection } from './protection/Protection';
import { DateCellsHelper } from './helper/dimension/DateCellsHelper';

class Dimensions {

  constructor(table) {
    this.table = table;
    this.scrollView = null;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
  }

  reset() {
    this.scrollView = null;
    this.width = null;
    this.height = null;
    this.x = null;
    this.y = null;
  }

  getX() {
    throw new TypeError('child impl');
  }

  getY() {
    throw new TypeError('child impl');
  }

  getHeight() {
    throw new TypeError('child impl');
  }

  getWidth() {
    throw new TypeError('child impl');
  }

}

// ============================== ?????????????????? ===============================

class XTableFrozenContent extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { rows, cols } = table;
    const { xFixedView } = table;
    const view = xFixedView.getFixedView();
    view.w = cols.rectRangeSumWidth(view);
    view.h = rows.rectRangeSumHeight(view);
    this.scrollView = view;
    return view.clone();
  }

}

class XTableTop extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const height = xFixedMeasure.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { index } = table;
    const y = index.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { rows } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    const fixedView = xFixedView.getFixedView();
    scrollView.sri = fixedView.sri;
    scrollView.eri = fixedView.eri;
    scrollView.h = rows.sectionSumHeight(scrollView.sri, scrollView.eri);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableLeft extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xFixedMeasure } = table;
    const width = xFixedMeasure.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { index } = table;
    const x = index.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xFixedView } = table;
    const { cols } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    const fixedView = xFixedView.getFixedView();
    scrollView.sci = fixedView.sci;
    scrollView.eci = fixedView.eci;
    scrollView.w = cols.sectionSumWidth(scrollView.sci, scrollView.eci);
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableLeftIndex extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const width = index.getWidth();
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const x = 0;
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const { index } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = 0;
    scrollView.w = index.getWidth();
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableContent extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { index } = table;
    const { xLeft } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const height = table.visualHeight() - (index.getHeight() + xTop.getHeight());
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const { table } = this;
    const { xTop } = table;
    const { index } = table;
    const y = index.getHeight() + xTop.getHeight();
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

class XTableTopIndex extends Dimensions {

  getWidth() {
    if (SheetUtils.isNumber(this.width)) {
      return this.width;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const width = table.visualWidth() - (index.getWidth() + xLeft.getWidth());
    this.width = width;
    return width;
  }

  getHeight() {
    if (SheetUtils.isNumber(this.height)) {
      return this.height;
    }
    const { table } = this;
    const { index } = table;
    const height = index.getHeight();
    this.height = height;
    return height;
  }

  getX() {
    if (SheetUtils.isNumber(this.x)) {
      return this.x;
    }
    const { table } = this;
    const { xLeft } = table;
    const { index } = table;
    const x = index.getWidth() + xLeft.getWidth();
    this.x = x;
    return x;
  }

  getY() {
    if (SheetUtils.isNumber(this.y)) {
      return this.y;
    }
    const y = 0;
    this.y = y;
    return y;
  }

  getScrollView() {
    if (SheetUtils.isDef(this.scrollView)) {
      return this.scrollView.clone();
    }
    const { table } = this;
    const { index } = table;
    const { xTableAreaView } = table;
    const scrollView = xTableAreaView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = 0;
    scrollView.h = index.getHeight();
    this.scrollView = scrollView;
    return scrollView.clone();
  }

}

// ================================= XTable ================================

const settings = {
  index: {
    height: 30,
    width: 50,
    gridColor: 'rgb(193,193,193)',
    size: 12,
    color: 'rgb(0,0,0)',
  },
  table: {
    showGrid: true,
    background: 'rgb(255,255,255)',
    borderColor: 'rgb(0,0,0)',
    gridColor: 'rgb(225,225,225)',
  },
  rows: {
    len: 1000,
    height: 30,
    data: [],
  },
  cols: {
    len: 36,
    width: 110,
    data: [],
  },
  xFixedView: {
    fixedView: new RectRange(0, 0, -1, -1),
    fxLeft: -1,
    fxTop: -1,
  },
  xFixedBar: {
    height: RowFixed.HEIGHT,
    width: ColFixed.WIDTH,
    background: 'rgb(234,234,234)',
    buttonColor: 'rgb(193,193,193)',
  },
  data: [],
  protection: {
    protections: [],
  },
  merge: {
    merges: [],
  },
  sheetProtection: false,
};

/**
 * XTable
 */
class XTableDimension extends Widget {

  /**
   * XTable
   * @param options
   */
  constructor(options) {
    super(`${cssPrefix}-table`);
    this.settings = SheetUtils.copy({}, settings, options);
  }

  /**
   * onAttach
   */
  onAttach() {
    this.rootWidget = this.getRootWidget();
    // ??????????????????
    this.focusManage = this.rootWidget.focusManage;
    // ???????????????
    this.xIconBuilder = new XIconBuilder();
    // ???????????????
    this.xIteratorBuilder = new XIteratorBuilder();
    // ????????????
    this.snapshot = new Snapshot();
    // ??????????????????
    this.index = new Code({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.cssPx(this.scale.goto(v)),
      }),
      ...this.settings.index,
    });
    this.cols = new Cols({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.cssPx(this.scale.goto(v)),
      }),
      snapshot: this.snapshot,
      xIteratorBuilder: this.xIteratorBuilder,
      ...this.settings.cols,
    });
    this.rows = new Rows({
      scaleAdapter: new ScaleAdapter({
        goto: v => XDraw.cssPx(this.scale.goto(v)),
      }),
      snapshot: this.snapshot,
      xIteratorBuilder: this.xIteratorBuilder,
      ...this.settings.rows,
    });
    this.scale = new Scale();
    // ????????????
    this.protection = new Protection({
      snapshot: this.snapshot,
      ...settings.protection,
    });
    // ??????????????????
    this.xFixedView = new XFixedView(this.settings.xFixedView);
    this.xFixedMeasure = new XFixedMeasure({
      fixedView: this.xFixedView,
      cols: this.cols,
      rows: this.rows,
    });
    // ?????????????????????
    this.scroll = new Scroll({
      xFixedView: this.xFixedView,
    });
    // ??????????????????
    this.xTableScrollView = new XTableScrollView({
      scroll: this.scroll,
      rows: this.rows,
      cols: this.cols,
      xIteratorBuilder: this.xIteratorBuilder,
      getHeight: () => this.xContent.getHeight(),
      getWidth: () => this.xContent.getWidth(),
    });
    // ??????????????????
    this.xTableAreaView = new XTableAreaView({
      xTableScrollView: this.xTableScrollView,
      rows: this.rows,
      cols: this.cols,
      scroll: this.scroll,
    });
    // ??????????????????
    this.xTableStyle = new XTableDrawStyle({
      xTableScrollView: this.xTableScrollView,
      xIteratorBuilder: this.xIteratorBuilder,
      scroll: this.scroll,
      snapshot: this.snapshot,
      settings: this.settings,
      xFixedView: this.xFixedView,
    });
    // ?????????????????????
    this.dateCellsHelper = new DateCellsHelper(this);
    // table??????
    this.xTableFrozenContent = new XTableFrozenContent(this);
    this.xLeftIndex = new XTableLeftIndex(this);
    this.xTopIndex = new XTableTopIndex(this);
    this.xLeft = new XTableLeft(this);
    this.xTop = new XTableTop(this);
    this.xContent = new XTableContent(this);
    // table??????
    this.readOnlyAlert = new Alert({
      closeDestroy: false,
    }).parentWidget(this);
    this.keyboard = new XTableKeyboard(this);
    this.mousePointer = new XTableMousePoint(this);
    this.xScreen = new XScreen(this);
    this.xReSizer = new XReSizer(this);
    this.yReSizer = new YReSizer(this);
    this.xHeightLight = new XHeightLight(this);
    this.yHeightLight = new YHeightLight(this);
    this.edit = new TableEdit(this);
    this.rowFixed = new RowFixed(this);
    this.colFixed = new ColFixed(this);
    this.dropColFixed = new DropColFixed(this);
    this.dropRowFixed = new DropRowFixed(this);
    // ?????????
    this.clipboard = new Clipboard({
      filter: () => {
        return true;
      },
      paste: (e) => {
        const data = e.clipboardData.getData('text/plain');

        // ???????????????????????????
        const dataArray = data.split(/[\r\n]+/).map((row)=>{
          return row.split('\t');
        });

        const operateCellsHelper = this.getOperateCellsHelper();
        const xSelect = this.xScreen.findType(XSelectItem);
        const { selectRange } = xSelect;
        const cells = this.dateCellsHelper.getCells();

        // ????????????
        selectRange.eri = selectRange.sri + dataArray.length - 1;
        selectRange.eci = selectRange.sci + dataArray[0].length - 1;

        this.snapshot.open();

        // ?????????????????????????????????????????????
        operateCellsHelper.getCellOrNewCellByViewRange({
          rectRange: selectRange,
          callback: (ri, ci, cell) => {
            const newCell = cell.clone();
            newCell.setText(dataArray[ri - selectRange.sri][ci - selectRange.sci]);
            cells.setCell(ri, ci, newCell);
          },
        });
        // ??????????????????
        xSelect.setRange(selectRange);

        this.snapshot.close({
          type: Constant.TABLE_EVENT_TYPE.DATA_CHANGE,
        });
        // ????????????
        this.xContent.table.render();
      },
    });
    // ??????????????????
    this.cellMergeCopyHelper = new CellMergeCopyHelper(this);
    // ??????????????????
    this.rowHeightGroupIndex = new RowHeightGroupIndex({
      rows: this.rows,
      xFixedView: this.xFixedView,
      xIteratorBuilder: this.xIteratorBuilder,
    });
    // ??????????????????
    this.snapshot.listen.registerListen('change', (event) => {
      this.cols.syncColsLen(this.xTableStyle.cols);
      this.rows.syncRowsLen(this.xTableStyle.rows);
      if (event) {
        const { type } = event;
        switch (type) {
          case Constant.TABLE_EVENT_TYPE.REMOVE_ROW:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            this.trigger(Constant.TABLE_EVENT_TYPE.REMOVE_ROW);
            break;
          case Constant.TABLE_EVENT_TYPE.REMOVE_COL:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            this.trigger(Constant.TABLE_EVENT_TYPE.REMOVE_COL);
            break;
          case Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            this.trigger(Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW);
            break;
          case Constant.TABLE_EVENT_TYPE.ADD_NEW_COL:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            this.trigger(Constant.TABLE_EVENT_TYPE.ADD_NEW_COL);
            break;
          case Constant.TABLE_EVENT_TYPE.DATA_CHANGE:
            this.trigger(Constant.TABLE_EVENT_TYPE.DATA_CHANGE);
            break;
          case Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH:
            this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH);
            break;
          case Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT:
            this.trigger(Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT);
            break;
        }
      }
      this.trigger(Constant.TABLE_EVENT_TYPE.SNAPSHOT_CHANGE);
    });
    // ??????????????????
    this.bindTableEvent();
    // ??????????????????
    this.bindIconEvent();
    // ?????????
    this.initialize();
  }

  /**
   * ?????????
   */
  initialize() {
    // ??????????????????
    this.focusManage.register({
      target: this,
    });
    // ??????????????????
    const { xTableStyle } = this;
    this.attach(xTableStyle);
    // ??????????????????
    this.attach(this.xScreen);
    this.xScreen.addItem(new XFilter(this));
    this.xScreen.addItem(new XSelectItem(this));
    this.xScreen.addItem(new XCopyStyle(this));
    this.xScreen.addItem(new XAutoFillItem(this));
    // ??????????????????
    this.attach(this.xHeightLight);
    this.attach(this.yHeightLight);
    this.attach(this.edit);
    this.attach(this.rowFixed);
    this.attach(this.colFixed);
    this.attach(this.xReSizer);
    this.attach(this.yReSizer);
    this.attach(this.dropRowFixed);
    this.attach(this.dropColFixed);
  }

  /**
   * ???????????????
   * @param min
   * @param max
   * @param initS
   * @param initV
   * @param ifv
   * @param getV
   * @return {(*|number)[]}
   */
  colsReduceIf(min, max, initS, initV, ifv, getV) {
    let s = initS;
    let v = initV;
    let ci = min;
    this.xIteratorBuilder.getColIterator()
      .setBegin(ci)
      .setEnd(max - 1)
      .setLoop((i) => {
        if (s >= ifv) {
          return false;
        }
        v = getV(i);
        s += v;
        return true;
      })
      .setFinish((i) => {
        ci = i;
      })
      .execute();
    return [ci, s, v];
  }

  /**
   * ???????????????
   * @param min
   * @param max
   * @param initS
   * @param initV
   * @param ifv
   * @param getV
   * @return {(*|number)[]}
   */
  rowsReduceIf(min, max, initS, initV, ifv, getV) {
    let s = initS;
    let v = initV;
    let ri = min;
    this.xIteratorBuilder.getRowIterator()
      .setBegin(ri)
      .setEnd(max - 1)
      .setLoop((i) => {
        if (s >= ifv) {
          return false;
        }
        v = getV(i);
        s += v;
        return true;
      })
      .setFinish((i) => {
        ri = i;
      })
      .execute();
    return [ri, s, v];
  }

  /**
   * ??????????????????
   * @returns {TextCellsHelper}
   */
  getTextCellsHelper() {
    const { xTableStyle } = this;
    return xTableStyle.getTextCellsHelper();
  }

  /**
   * ?????????????????????
   * @returns {DateCellsHelper}
   */
  getDateCellsHelper() {
    return this.dateCellsHelper;
  }

  /**
   * ??????????????????
   * @returns {StyleCellsHelper}
   */
  getStyleCellsHelper() {
    const { xTableStyle } = this;
    return xTableStyle.getStyleCellsHelper();
  }

  /**
   * ??????????????????
   * @returns {OperateCellsHelper}
   */
  getOperateCellsHelper() {
    const { xTableStyle } = this;
    return xTableStyle.getOperateCellsHelper();
  }

  /**
   * ?????????????????????
   */
  getTableMerges() {
    const { xTableStyle } = this;
    const { merges } = xTableStyle;
    return merges;
  }

  /**
   * ????????????????????????
   * @returns {XTableDrawStyle}
   */
  getXTableStyle() {
    const { xTableStyle } = this;
    return xTableStyle;
  }

  /**
   * ?????????????????????
   * @returns {Cells}
   */
  getTableCells() {
    const { xTableStyle } = this;
    const { cells } = xTableStyle;
    return cells;
  }

  /**
   * ?????????????????????
   * @returns {*}
   */
  getScrollTotalHeight() {
    const { xFixedView } = this;
    const { rows } = this;
    let height;
    if (xFixedView.hasFixedTop()) {
      const fixedView = xFixedView.getFixedView();
      height = rows.sectionSumHeight(fixedView.eri + 1, rows.len - 1);
    } else {
      height = rows.sectionSumHeight(0, rows.len - 1);
    }
    return height;
  }

  /**
   * ?????????????????????
   * @returns {*}
   */
  getScrollTotalWidth() {
    const { xFixedView } = this;
    const { cols } = this;
    let width;
    if (xFixedView.hasFixedLeft()) {
      const fixedView = xFixedView.getFixedView();
      width = cols.sectionSumWidth(fixedView.eci, cols.len - 1);
    } else {
      width = cols.sectionSumWidth(0, cols.len - 1);
    }
    return width;
  }

  /**
   * ???????????????
   * @returns {*}
   */
  getIndexHeight() {
    const { index } = this;
    return index.getHeight();
  }

  /**
   * ???????????????
   * @returns {*}
   */
  getIndexWidth() {
    const { index } = this;
    return index.getWidth();
  }

  /**
   * ????????????????????????
   */
  getContentHeight() {
    const { xContent } = this;
    return xContent.getHeight();
  }

  /**
   * ????????????????????????
   */
  getContentWidth() {
    const { xContent } = this;
    return xContent.getWidth();
  }

  /**
   * ??????????????????
   */
  getFixedWidth() {
    const { xLeft } = this;
    return xLeft.getWidth();
  }

  /**
   * ??????????????????
   * @returns {*}
   */
  getFixedHeight() {
    const { xTop } = this;
    return xTop.getHeight();
  }

  /**
   * ??????????????????
   * @return {*}
   */
  visualWidth() {
    return this.box().width;
  }

  /**
   * ??????????????????
   * @return {*}
   */
  visualHeight() {
    return this.box().height;
  }

  /**
   * ???????????????
   */
  hideEditor() {
    this.edit.hide();
  }

  /**
   * ???????????????
   */
  showEditor() {
    this.edit.show();
  }

  /**
   * ????????????????????????
   * @param type
   * @param info
   * @param native
   */
  xIconsEvent(type, info, native) {
    const { xIconBuilder } = this;
    const style = this.getXTableStyle();
    const cells = this.getTableCells();
    const { fixedCellIcon, staticCellIcon } = style;
    const {
      ri, ci, mri, mci, fx, fy, sx, sy,
    } = info;

    let staticIconArray = [];
    let fixedIconArray = [];

    // ????????????????????????
    const fixedIcon = fixedCellIcon.getIcon(ri, ci);
    if (fixedIcon) {
      fixedIconArray = fixedIconArray.concat(fixedIcon);
    }

    // ????????????????????????
    const cell = cells.getCell(mri, mci);
    if (cell) {
      staticIconArray = staticIconArray.concat(cell.icons);
    }

    // ????????????????????????
    const staticIcon = staticCellIcon.getIcon(mri, mci);
    if (staticIcon) {
      staticIconArray = staticIconArray.concat(staticIcon);
    }

    // ??????????????????????????????
    xIconBuilder.xIconsEvent({
      native,
      type,
      staticIcons: staticIconArray,
      fixedIcons: fixedIconArray,
      sx: XDraw.stylePx(sx),
      sy: XDraw.stylePx(sy),
      fx: XDraw.stylePx(fx),
      fy: XDraw.stylePx(fy),
    });
  }

  /**
   * ?????????????????????
   */
  pointerEvent(info) {
    const { mousePointer } = this;
    const { ri, ci } = info;
    if (ri === -1 && ci === -1) {
      mousePointer.set(XTableMousePoint.KEYS.default);
      return;
    }
    if (ri === -1) {
      mousePointer.set(XTableMousePoint.KEYS.sResize);
      return;
    }
    if (ci === -1) {
      mousePointer.set(XTableMousePoint.KEYS.eResize);
      return;
    }
    mousePointer.set(XTableMousePoint.KEYS.cell);
  }

  /**
   * ?????????????????????????????????
   * @param x
   * @param y
   * @returns {{ci: number, ri: number}}
   */
  getRiCiByXy(x, y) {
    const { xFixedView } = this;
    const { rows, cols } = this;

    const { index } = this;
    const fixedView = xFixedView.getFixedView();
    const merges = this.getTableMerges();
    const fixedWidth = this.getFixedWidth();
    const fixedHeight = this.getFixedHeight();

    let [left, top] = [x, y];
    let [ci, ri] = [-1, -1];
    left -= index.getWidth();
    top -= index.getHeight();

    let fx = 0;
    if (left <= fixedWidth && x > index.getWidth()) {
      let total = 0;
      this.xIteratorBuilder.getColIterator()
        .setBegin(fixedView.sci)
        .setEnd(fixedView.eci)
        .setLoop((i) => {
          const width = cols.getWidth(i);
          total += width;
          ci = i;
          return total < left;
        })
        .execute();
      fx = (total - cols.getWidth(ci) - left) * -1;
    } else if (x > index.getWidth()) {
      let total = fixedWidth;
      const viewRange = this.getScrollView();
      this.xIteratorBuilder.getColIterator()
        .setBegin(viewRange.sci)
        .setEnd(viewRange.eci)
        .setLoop((i) => {
          const width = cols.getWidth(i);
          total += width;
          ci = i;
          return total < left;
        })
        .execute();
      fx = (total - cols.getWidth(ci) - left) * -1;
    }

    let fy = 0;
    if (top < fixedHeight && y > index.getHeight()) {
      let total = 0;
      this.xIteratorBuilder.getRowIterator()
        .setBegin(fixedView.sri)
        .setEnd(fixedView.eri)
        .setLoop((i) => {
          const height = rows.getHeight(i);
          total += height;
          ri = i;
          return total <= top;
        })
        .execute();
      fy = (total - rows.getHeight(ri) - top) * -1;
    } else if (y > index.getHeight()) {
      let total = fixedHeight;
      const viewRange = this.getScrollView();
      this.xIteratorBuilder.getRowIterator()
        .setBegin(viewRange.sri)
        .setEnd(viewRange.eri)
        .setLoop((i) => {
          const height = rows.getHeight(i);
          total += height;
          ri = i;
          return total <= top;
        })
        .execute();
      fy = (total - rows.getHeight(ri) - top) * -1;
    }

    const merge = merges.getFirstInclude(ri, ci);
    let mci = ci;
    let mri = ri;
    let sx = fx;
    let sy = fy;
    if (merge) {
      mri = merge.sri;
      mci = merge.sci;
      const { rows, cols } = this;
      const height = rows.sectionSumHeight(mri, ri - 1);
      const width = cols.sectionSumWidth(mci, ci - 1);
      sy += height;
      sx += width;
    }

    return {
      ri, ci, mri, mci, fx, fy, sx, sy,
    };
  }

  /**
   * ??????????????????
   */
  unbind() {
    this.focusManage.remove(this);
    XEvent.unbind(this);
  }

  /**
   * ????????????
   */
  bindIconEvent() {
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      const { x, y } = this.eventXy(e);
      const info = this.getRiCiByXy(x, y);
      this.pointerEvent(info);
      this.xIconsEvent(XIcon.ICON_EVENT_TYPE.MOUSE_MOVE, info, e);
    });
    XEvent.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { activate } = this.focusManage;
      const { target } = activate;
      if (target === this) {
        const { x, y } = this.eventXy(e);
        const info = this.getRiCiByXy(x, y);
        this.xIconsEvent(XIcon.ICON_EVENT_TYPE.MOUSE_DOWN, info, e);
      }
    });
  }

  /**
   * ????????????
   */
  bindTableEvent() {
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.ADD_NEW_COL, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.REMOVE_COL, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.REMOVE_ROW, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.FIXED_ROW_CHANGE, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.FIXED_COL_CHANGE, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_ROW_HEIGHT, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_COL_WIDTH, () => {
      this.resize();
    });
    XEvent.bind(this, Constant.TABLE_EVENT_TYPE.SNAPSHOT_CHANGE, () => {
      this.render();
    });
  }

  /**
   * ??????????????????
   * @returns {RectRange}
   */
  getScrollView() {
    const { xTableAreaView } = this;
    return xTableAreaView.getScrollView();
  }

  /**
   * ????????????
   * @param x
   */
  scrollX(x) {
    const { cols, xFixedView, scroll } = this;
    const fixedView = xFixedView.getFixedView();
    const [ci, left] = this.colsReduceIf(fixedView.eci + 1, cols.len, 0, 0, x, i => cols.getWidth(i));
    // ??????????????????
    if (scroll.x > left) {
      scroll.x = left;
      scroll.ci = ci;
      scroll.type = SCROLL_TYPE.H_LEFT;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    } else if (scroll.x < left) {
      scroll.x = left;
      scroll.ci = ci;
      scroll.type = SCROLL_TYPE.H_RIGHT;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    }
  }

  /**
   * ????????????
   * @param y
   */
  scrollY(y) {
    const { rows, scroll, rowHeightGroupIndex } = this;
    const find = rowHeightGroupIndex.get(y);
    const [ri, top] = this.rowsReduceIf(find.ri, rows.len, find.top, 0, y, i => rows.getHeight(i));
    // ??????????????????
    if (scroll.y > top) {
      scroll.type = SCROLL_TYPE.V_TOP;
      scroll.y = top;
      scroll.ri = ri;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    } else if (scroll.y < top) {
      scroll.type = SCROLL_TYPE.V_BOTTOM;
      scroll.y = top;
      scroll.ri = ri;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    }
  }

  /**
   * ??????????????????
   */
  scrollRi(ri) {
    const { rows, scroll, xFixedView } = this;
    const fixedView = xFixedView.getFixedView();
    const top = rows.sectionSumHeight(fixedView.eri + 1, ri);
    // ??????????????????
    if (scroll.y >= top) {
      scroll.type = SCROLL_TYPE.V_TOP;
      scroll.y = top;
      scroll.ri = ri;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    } else if (scroll.y < top) {
      scroll.type = SCROLL_TYPE.V_BOTTOM;
      scroll.y = top;
      scroll.ri = ri;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    }
  }

  /**
   * ??????????????????
   */
  scrollCi(ci) {
    const { cols, scroll, xFixedView } = this;
    const fixedView = xFixedView.getFixedView();
    const left = cols.sectionSumWidth(fixedView.eci + 1, ci);
    // ??????????????????
    if (scroll.x >= left) {
      scroll.type = SCROLL_TYPE.H_LEFT;
      scroll.x = left;
      scroll.ci = ci;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    } else if (scroll.x < left) {
      scroll.type = SCROLL_TYPE.H_RIGHT;
      scroll.x = left;
      scroll.ci = ci;
      this.scrolling();
      scroll.type = SCROLL_TYPE.UN;
    }
  }

  /**
   * ???????????????????????????
   * @returns {*}
   */
  getTop() {
    const { rows, xFixedView } = this;
    const fixedView = xFixedView.getFixedView();
    const view = this.getScrollView();
    return rows.sectionSumHeight(fixedView.eri + 1, view.sri - 1);
  }

  /**
   * ???????????????????????????
   * @returns {*}
   */
  getLeft() {
    const { cols, xFixedView } = this;
    const fixedView = xFixedView.getFixedView();
    const view = this.getScrollView();
    return cols.sectionSumWidth(fixedView.eci + 1, view.sci - 1);
  }

  /**
   * ?????????????????????
   * @param end
   * @param start
   */
  setFixedRow(end, start = -1) {
    const { xFixedView, rows, scroll, rowFixed } = this;
    // ????????????
    const fixedView = xFixedView.getFixedView();
    fixedView.eri = end;
    if (start > -1) {
      fixedView.sri = start;
    }
    xFixedView.setFixedView(fixedView);
    // ??????????????????
    const { sri, eri } = fixedView;
    if (xFixedView.hasFixedTop()) {
      scroll.y = 0;
      scroll.ri = eri + 1;
    } else {
      scroll.y = rows.sectionSumHeight(0, sri - 1);
      scroll.ri = sri;
    }
    // ???????????????
    rowFixed.fxSri = fixedView.sri;
    rowFixed.fxEri = fixedView.eri;
    // ??????????????????
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_ROW_CHANGE);
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
  }

  /**
   * ?????????????????????
   * @param end
   * @param start
   */
  setFixedCol(end, start = -1) {
    const { xFixedView, rows, scroll, colFixed } = this;
    // ????????????
    const fixedView = xFixedView.getFixedView();
    fixedView.eci = end;
    if (start > -1) {
      fixedView.sci = start;
    }
    xFixedView.setFixedView(fixedView);
    // ??????????????????
    const { sci, eci } = fixedView;
    if (xFixedView.hasFixedLeft()) {
      scroll.x = 0;
      scroll.ci = eci + 1;
    } else {
      scroll.x = rows.sectionSumHeight(0, sci - 1);
      scroll.ci = sci;
    }
    // ???????????????
    colFixed.fxSci = fixedView.sci;
    colFixed.fxEci = fixedView.eci;
    // ??????????????????
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_COL_CHANGE);
    this.trigger(Constant.TABLE_EVENT_TYPE.FIXED_CHANGE);
  }

  /**
   * ???????????????
   */
  reset() {
    const { xTableAreaView } = this;
    const { xTableFrozenContent } = this;
    const { xLeftIndex } = this;
    const { xTopIndex } = this;
    const { xLeft } = this;
    const { xTop } = this;
    const { xContent } = this;
    xTableAreaView.reset();
    xTableFrozenContent.reset();
    xLeftIndex.reset();
    xTopIndex.reset();
    xLeft.reset();
    xTop.reset();
    xContent.reset();
  }

  /**
   * ????????????
   */
  recache() {
    this.rows.clearCache();
    this.cols.clearCache();
    this.rowHeightGroupIndex.clear();
    this.xTableStyle.rows.clearCache();
    this.xTableStyle.cols.clearCache();
  }

  /**
   * ??????????????????
   */
  resize() {
    const { rowFixed, colFixed } = this;
    const { xTableStyle, xScreen } = this;
    this.recache();
    this.reset();
    xScreen.setZone();
    rowFixed.setSize();
    colFixed.setSize();
    xTableStyle.resize();
    this.trigger(Constant.TABLE_EVENT_TYPE.RESIZE_CHANGE);
  }

  /**
   * ??????????????????
   */
  render() {
    const { xTableStyle } = this;
    xTableStyle.render();
    this.trigger(Constant.TABLE_EVENT_TYPE.RENDER);
  }

  /**
   * ??????????????????
   */
  scrolling() {
    const { xTableStyle, xFixedView, scroll } = this;
    const fixedView = xFixedView.getFixedView();
    if (!xFixedView.hasFixedTop()) {
      fixedView.sri = scroll.ri;
    }
    if (!xFixedView.hasFixedLeft()) {
      fixedView.sci = scroll.ci;
    }
    this.reset();
    xFixedView.setFixedView(fixedView);
    xTableStyle.scrolling();
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
  }

  /**
   * ???????????????
   */
  setScale(val = 1) {
    const { yHeightLight, xHeightLight, xTableStyle } = this;
    const { xScreen, scale, rowFixed, colFixed } = this;
    this.recache();
    this.reset();
    scale.setValue(val);
    xTableStyle.setScale(val);
    xScreen.setZone();
    rowFixed.setSize();
    colFixed.setSize();
    xHeightLight.offsetHandle();
    yHeightLight.offsetHandle();
    this.trigger(Constant.TABLE_EVENT_TYPE.SCALE_CHANGE);
  }

  /**
   * ??????????????????
   * @returns {boolean}
   */
  isProtection({ tips = true, view = null } = {}) {
    let { settings, readOnlyAlert } = this;
    let { xScreen, protection } = this;
    let { sheetProtection } = settings;
    // ??????????????????
    if (sheetProtection) {
      if (tips) {
        readOnlyAlert.setMessage('????????????????????????').open();
      }
      return true;
    }
    // ????????????????????????
    if (view === null) {
      let xSelect = xScreen.findType(XSelectItem);
      let { selectRange } = xSelect;
      if (selectRange) {
        let includes = protection.getIntersects(selectRange);
        if (includes.length) {
          if (tips) {
            readOnlyAlert.setMessage('????????????????????????').open();
          }
          return true;
        }
      }
    } else {
      let includes = protection.getIntersects(view);
      if (includes.length) {
        if (tips) {
          readOnlyAlert.setMessage('????????????????????????').open();
        }
        return true;
      }
    }
    return false;
  }

  /**
   * ???????????????
   * @param ri
   * @param number
   */
  removeRow(ri, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.removeRow(ri, number);
    protection.removeRow(ri, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.REMOVE_ROW,
    });
    this.resize();
  }

  /**
   * ???????????????
   * @param ci
   * @param number
   */
  removeCol(ci, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.removeCol(ci, number);
    protection.removeCol(ci, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.REMOVE_COL,
    });
    this.resize();
  }

  /**
   * ????????????????????????
   * @param ri
   * @param number
   */
  insertRowAfter(ri, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.insertRowAfter(ri, number);
    protection.insertRowAfter(ri, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW,
    });
    this.resize();
  }

  /**
   * ????????????????????????
   * @param ri
   * @param number
   */
  insertRowBefore(ri, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.insertRowBefore(ri, number);
    protection.insertRowBefore(ri, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.ADD_NEW_ROW,
    });
    this.resize();
  }

  /**
   * ????????????????????????
   * @param ci
   * @param number
   */
  insertColAfter(ci, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.insertColAfter(ci, number);
    protection.insertColAfter(ci, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.ADD_NEW_COL,
    });
    this.resize();
  }

  /**
   * ????????????????????????
   * @param ci
   * @param number
   */
  insertColBefore(ci, number = 1) {
    const { xTableStyle } = this;
    const { snapshot } = this;
    const { protection } = this;
    snapshot.open();
    xTableStyle.insertColBefore(ci, number);
    protection.insertColBefore(ci, number);
    snapshot.close({
      type: Constant.TABLE_EVENT_TYPE.ADD_NEW_COL,
    });
    this.resize();
  }

  /**
   * ????????????
   */
  destroy() {
    super.destroy();
    this.unbind();
    this.xScreen.destroy();
    this.xReSizer.destroy();
    this.yReSizer.destroy();
    this.xHeightLight.destroy();
    this.yHeightLight.destroy();
    this.edit.destroy();
    this.rowFixed.destroy();
    this.colFixed.destroy();
    this.keyboard.destroy();
  }

}

export {
  XTableDimension,
};
