import { XTableImage } from './XTableImage';
import { Utils } from '../../utils/Utils';
import { Code } from './base/Code';
import { Rows } from './base/Rows';
import { Cols } from './base/Cols';
import { Fixed } from './base/Fixed';
import { Scroll } from './base/Scroll';
import { XTableAreaView, XTableScrollView } from './XTableScrollView';

class XTableDimens {

}

class XTable {

  /**
   * XTable
   * @param settings
   */
  constructor(settings) {
    // 表格设置
    this.settings = Utils.mergeDeep({
      index: {
        height: 25,
        width: 40,
        gridColor: '#c4c4c4',
        size: 9,
        color: '#000000',
      },
      table: {
        showGrid: true,
        background: '#ffffff',
        borderColor: '#e5e5e5',
        gridColor: '#c5c5c5',
      },
      fixed: {
        fxTop: -1,
        fxLeft: -1,
      },
      rows: {
        len: 1000,
        height: 28,
      },
      cols: {
        len: 26,
        width: 110,
      },
    }, settings);
    // 表格数据配置
    this.index = new Code(this.settings.index);
    this.rows = new Rows(this.settings.rows);
    this.cols = new Cols(this.settings.cols);
    // 冻结视图坐标
    this.fixed = new Fixed(this.settings.fixed);
    // 滚动视图的坐标
    this.scroll = new Scroll({
      fixed: this.fixed,
    });
    // 表格滚动区域
    this.xTableScrollView = new XTableScrollView({

    });
    // 表格视图区域
    this.xTableAreaView = new XTableAreaView({
      xTableScrollView: this.xTableScrollView,
      rows: this.rows,
      cols: this.cols,
      scroll: this.scroll,
    });
    // 表格界面
    this.xTable = new XTableImage({
      xTableScrollView: this.xTableScrollView,
      settings,
      scroll: this.scroll,
      fixed: this.fixed,
    });
  }

}

export { XTable };
