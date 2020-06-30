import { cssPrefix, Constant } from '../../constant/Constant';
import Format from './Format';
import { Utils } from '../../utils/Utils';
import { Rows } from './Rows';
import { Cols } from './Cols';
import { Scroll, SCROLL_TYPE } from './Scroll';
import { Fixed } from './Fixed';
import { Widget } from '../../lib/Widget';
import { RectRange } from './RectRange';
import { Merges } from './Merges';
import { EventBind } from '../../utils/EventBind';
import { Screen } from './screen/Screen';
import { ScreenCopyStyle } from './screenwiget/copystyle/ScreenCopyStyle';
import { XReSizer } from './resizer/XReSizer';
import { YReSizer } from './resizer/YReSizer';
import { ScreenAutoFill } from './screenwiget/autofill/ScreenAutoFill';
import { XHeightLight } from './highlight/XHeightLight';
import { YHeightLight } from './highlight/YHeightLight';
import { Edit } from './Edit';
import { Draw, npx } from '../../canvas/Draw';
import { ALIGN, Font, TEXT_WRAP } from '../../canvas/Font';
import { Rect } from '../../canvas/Rect';
import { Crop } from '../../canvas/Crop';
import { Grid } from '../../canvas/Grid';
import { Box } from '../../canvas/Box';
import { Line, LINE_TYPE } from '../../canvas/Line';
import { LineHandle } from './gridborder/LineHandle';
import { Cells } from './cells/Cells';
import { CellsHelper } from './CellsHelper';
import { GridLineHandle } from './gridborder/GridLineHandle';
import { BorderLineHandle } from './gridborder/BorderLineHandle';
import { TableDataSnapshot } from './datasnapshot/TableDataSnapshot';
import { MousePointer } from './MousePointer';
import { Keyboard } from './Keyboard';
import { Focus } from './Focus';
import {
  SCREEN_SELECT_EVENT,
  ScreenSelector,
} from './screenwiget/selector/ScreenSelector';

const TABLE_RENDER_MODE = {
  SCROLL: 1,
  RENDER: 2,
};

// ================================ 冻结内容坐标 ================================

class FrozenLeftIndexOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    return 0;
  }

  getFixedYOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  getFixedWidth() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    return table.rows.sectionSumHeight(0, fxTop);
  }

  getScrollViewChange() {
    const { table } = this;
    return table.mode !== TABLE_RENDER_MODE.SCROLL;
  }

  getScrollView() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    const width = this.getFixedWidth();
    const height = this.getFixedHeight();
    return new RectRange(0, 0, fxTop, 0, width, height);
  }

}

class FrozenTopIndexOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getFixedYOffset() {
    return 0;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    return table.cols.sectionSumWidth(0, fxLeft);
  }

  getFixedHeight() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  getScrollViewChange() {
    const { table } = this;
    return table.mode !== TABLE_RENDER_MODE.SCROLL;
  }

  getScrollView() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const width = this.getFixedWidth();
    const height = this.getFixedHeight();
    return new RectRange(0, 0, 0, fxLeft, width, height);
  }

}

class FrozenLeftTopOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getFixedYOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    return table.cols.sectionSumWidth(0, fxLeft);
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    return table.rows.sectionSumHeight(0, fxTop);
  }

  getScrollViewChange() {
    const { table } = this;
    return table.mode !== TABLE_RENDER_MODE.SCROLL;
  }

  getScrollView() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop, fxLeft } = fixed;
    const width = this.getFixedWidth();
    const height = this.getFixedHeight();
    return new RectRange(0, 0, fxTop, fxLeft, width, height);
  }

}

// ================================ 动态内容坐标 ================================

class FixedTopOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return index.width + fixedLeftWidth;
  }

  getFixedYOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return table.visualWidth() - (index.width + fixedLeftWidth);
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    return table.rows.sectionSumHeight(0, fxTop);
  }

  getCaptureX() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureX = difference.getCaptureX();
    const xOffset = this.getFixedXOffset();
    return xOffset + captureX;
  }

  getCaptureY() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureY = difference.getCaptureY();
    const yOffset = this.getFixedYOffset();
    return yOffset + captureY;
  }

  getDwXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwXOffset = difference.getDwXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + dwXOffset;
  }

  getDwYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwYOffset = difference.getDwYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + dwYOffset;
  }

  getScrollViewChange() {
    const { table } = this;
    const { fixed } = table;
    const { fxTop } = fixed;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      const { dynamicView } = table;
      const last = dynamicView.getOriginLastScrollView();
      const next = dynamicView.getOriginScrollView();
      if (last === null) {
        return true;
      }
      last.sri = 0;
      last.eri = fxTop;
      next.sri = 0;
      next.eri = fxTop;
      return next.equals(last) === false;
    }
    return true;
  }

  getContentView() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxTop } = fixed;
    const contentView = dynamicView.getContentView();
    contentView.sri = 0;
    contentView.eri = fxTop;
    return contentView;
  }

  getScrollView() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxTop } = fixed;
    const scrollView = dynamicView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = fxTop;
    return scrollView;
  }

  getBorderView() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxTop } = fixed;
    const borderView = dynamicView.getBorderView();
    borderView.sri = 0;
    borderView.eri = fxTop;
    return borderView;
  }

  getScrollXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    return dynamicView.getScrollXOffset();
  }

}

class FixedLeftOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getFixedYOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return index.height + fixedTopHeight;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    return table.cols.sectionSumWidth(0, fxLeft);
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return table.visualHeight() - (index.height + fixedTopHeight);
  }

  getCaptureX() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureX = difference.getCaptureX();
    const xOffset = this.getFixedXOffset();
    return xOffset + captureX;
  }

  getCaptureY() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureY = difference.getCaptureY();
    const yOffset = this.getFixedYOffset();
    return yOffset + captureY;
  }

  getDwXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwXOffset = difference.getDwXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + dwXOffset;
  }

  getDwYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwYOffset = difference.getDwYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + dwYOffset;
  }

  getScrollViewChange() {
    const { table } = this;
    const { fixed } = table;
    const { fxLeft } = fixed;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      const { dynamicView } = table;
      const last = dynamicView.getOriginLastScrollView();
      const next = dynamicView.getOriginScrollView();
      if (last === null) {
        return true;
      }
      last.sci = 0;
      last.eci = fxLeft;
      next.sci = 0;
      next.eci = fxLeft;
      return next.equals(last) === false;
    }
    return true;
  }

  getContentView() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const contentView = dynamicView.getContentView();
    contentView.sci = 0;
    contentView.eci = fxLeft;
    return contentView;
  }

  getScrollView() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const scrollView = dynamicView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = fxLeft;
    return scrollView;
  }

  getBorderView() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const borderView = dynamicView.getBorderView();
    borderView.sci = 0;
    borderView.eci = fxLeft;
    return borderView;
  }

}

class ContentOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return fixedLeftWidth + index.width;
  }

  getFixedYOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return index.height + fixedTopHeight;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return table.visualWidth() - (fixedLeftWidth + index.width);
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return table.visualHeight() - (index.height + fixedTopHeight);
  }

  getCaptureX() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureX = difference.getCaptureX();
    const xOffset = this.getFixedXOffset();
    return xOffset + captureX;
  }

  getCaptureY() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureY = difference.getCaptureY();
    const yOffset = this.getFixedYOffset();
    return yOffset + captureY;
  }

  getDwXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwXOffset = difference.getDwXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + dwXOffset;
  }

  getDwYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwYOffset = difference.getDwYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + dwYOffset;
  }

  getBdXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const bdXOffset = difference.getBdXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + bdXOffset;
  }

  getBdYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const bdYOffset = difference.getBdYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + bdYOffset;
  }

  getScrollViewChange() {
    const { table } = this;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      const { dynamicView } = table;
      const last = dynamicView.getOriginLastScrollView();
      const next = dynamicView.getOriginScrollView();
      if (last === null) {
        return true;
      }
      return next.equals(last) === false;
    }
    return true;
  }

  getContentView() {
    const { table } = this;
    const { dynamicView } = table;
    return dynamicView.getContentView();
  }

  getScrollView() {
    const { table } = this;
    const { dynamicView } = table;
    return dynamicView.getScrollView();
  }

  getBorderView() {
    const { table } = this;
    const { dynamicView } = table;
    return dynamicView.getBorderView();
  }

  getScrollXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    return dynamicView.getScrollXOffset();
  }

}

class FixedTopIndexOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedTopWidth = table.cols.sectionSumWidth(0, fxLeft);
    return index.width + fixedTopWidth;
  }

  getFixedYOffset() {
    return 0;
  }

  getFixedWidth() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxLeft } = fixed;
    const fixedLeftWidth = table.cols.sectionSumWidth(0, fxLeft);
    return table.visualWidth() - (index.width + fixedLeftWidth);
  }

  getFixedHeight() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.height;
  }

  getCaptureX() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureX = difference.getCaptureX();
    const xOffset = this.getFixedXOffset();
    return xOffset + captureX;
  }

  getCaptureY() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureY = difference.getCaptureY();
    const yOffset = this.getFixedYOffset();
    return yOffset + captureY;
  }

  getDwXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwXOffset = difference.getDwXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + dwXOffset;
  }

  getDwYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwYOffset = difference.getDwYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + dwYOffset;
  }

  getScrollViewChange() {
    const { table } = this;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      const { dynamicView } = table;
      const last = dynamicView.getOriginLastScrollView();
      const next = dynamicView.getOriginScrollView();
      if (last === null) {
        return true;
      }
      last.sri = 0;
      last.eri = 0;
      next.sri = 0;
      next.eri = 0;
      return next.equals(last) === false;
    }
    return true;
  }

  getContentView() {
    const { table } = this;
    const { dynamicView } = table;
    const contentView = dynamicView.getContentView();
    contentView.sri = 0;
    contentView.eri = 0;
    return contentView;
  }

  getScrollView() {
    const { table } = this;
    const { dynamicView } = table;
    const scrollView = dynamicView.getScrollView();
    scrollView.sri = 0;
    scrollView.eri = 0;
    return scrollView;
  }

}

class FixedLeftIndexOffset {

  constructor(table) {
    this.table = table;
  }

  getFixedXOffset() {
    return 0;
  }

  getFixedYOffset() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return index.height + fixedTopHeight;
  }

  getFixedWidth() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    return index.width;
  }

  getFixedHeight() {
    const { table } = this;
    const { fixed, settings } = table;
    const { index } = settings;
    const { fxTop } = fixed;
    const fixedTopHeight = table.rows.sectionSumHeight(0, fxTop);
    return table.visualHeight() - (index.height + fixedTopHeight);
  }

  getCaptureX() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureX = difference.getCaptureX();
    const xOffset = this.getFixedXOffset();
    return xOffset + captureX;
  }

  getCaptureY() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const captureY = difference.getCaptureY();
    const yOffset = this.getFixedYOffset();
    return yOffset + captureY;
  }

  getDwXOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwXOffset = difference.getDwXOffset();
    const xOffset = this.getFixedXOffset();
    return xOffset + dwXOffset;
  }

  getDwYOffset() {
    const { table } = this;
    const { dynamicView } = table;
    const { difference } = dynamicView;
    const dwYOffset = difference.getDwYOffset();
    const yOffset = this.getFixedYOffset();
    return yOffset + dwYOffset;
  }

  getScrollViewChange() {
    const { table } = this;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      const { dynamicView } = table;
      const last = dynamicView.getOriginLastScrollView();
      const next = dynamicView.getOriginScrollView();
      if (last === null) {
        return true;
      }
      last.sci = 0;
      last.eci = 0;
      next.sci = 0;
      next.eci = 0;
      return next.equals(last) === false;
    }
    return true;
  }

  getContentView() {
    const { table } = this;
    const { dynamicView } = table;
    const contentView = dynamicView.getContentView();
    contentView.sci = 0;
    contentView.eci = 0;
    return contentView;
  }

  getScrollView() {
    const { table } = this;
    const { dynamicView } = table;
    const scrollView = dynamicView.getScrollView();
    scrollView.sci = 0;
    scrollView.eci = 0;
    return scrollView;
  }

}

// ================================ 动态视图计算 ================================

class DynamicViewDifference {

  constructor(dynamicView) {
    this.dynamicView = dynamicView;
    // 滚动时的新区域
    this.subtractRange = null;
    this.addRange = null;
    // 渲染截图的坐标
    this.captureX = 0;
    this.captureY = 0;
    // 滚动区域渲染
    this.dwAddRange = null;
    this.dwContentRange = null;
    // 渲染区域坐标
    this.dwXOffset = 0;
    this.dwYOffset = 0;
    // 边框绘制区域
    this.borderRange = null;
    this.bdXOffset = 0;
    this.bdYOffset = 0;
  }

  cpSubtractRange() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    const { lastScrollRange } = dynamicView;
    const { scrollRange } = dynamicView;
    const { cols, rows } = table;
    if (lastScrollRange) {
      const [subtractRange] = lastScrollRange.coincideDifference(scrollRange);
      if (subtractRange) {
        subtractRange.w = cols.rectRangeSumWidth(subtractRange);
        subtractRange.h = rows.rectRangeSumHeight(subtractRange);
        this.subtractRange = subtractRange;
      }
    }
  }

  cpAddRange() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    const { lastScrollRange } = dynamicView;
    const { scrollRange } = dynamicView;
    const { cols, rows } = table;
    if (lastScrollRange) {
      const [addRange] = scrollRange.coincideDifference(lastScrollRange);
      if (addRange) {
        addRange.w = cols.rectRangeSumWidth(addRange);
        addRange.h = rows.rectRangeSumHeight(addRange);
        this.addRange = addRange;
      }
    }
  }

  cpCaptureXY() {
    const { dynamicView } = this;
    const { addRange, subtractRange } = this;
    const { table } = dynamicView;
    const { scroll } = table;
    if (addRange || subtractRange) {
      let captureX = 0;
      let captureY = 0;
      switch (scroll.type) {
        case SCROLL_TYPE.V_TOP: {
          captureY = addRange.h;
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          captureY = -subtractRange.h;
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          captureX = addRange.w;
          break;
        }
        case SCROLL_TYPE.H_RIGHT: {
          captureX = -subtractRange.w;
          break;
        }
        default: break;
      }
      this.captureX = captureX;
      this.captureY = captureY;
    }
  }

  cpRange() {
    this.subtractRange = null;
    this.addRange = null;
    this.captureX = 0;
    this.captureY = 0;
    this.dwAddRange = null;
    this.dwContentRange = null;
    this.dwXOffset = 0;
    this.dwYOffset = 0;
    this.borderRange = null;
    this.bdXOffset = 0;
    this.bdYOffset = 0;
    this.cpSubtractRange();
    this.cpAddRange();
    this.cpDwAddRange();
    this.cpDwContentRange();
    this.cpCaptureXY();
    this.cpDwOffsetXY();
    this.cpBorderRange();
    this.cpBdOffsetXY();
  }

  cpDwAddRange() {
    const { dynamicView } = this;
    const { addRange } = this;
    const { table } = dynamicView;
    const { scroll } = table;
    if (addRange) {
      this.dwAddRange = addRange.clone();
      const { rows, cols } = table;
      switch (scroll.type) {
        case SCROLL_TYPE.H_RIGHT: {
          this.dwAddRange.sci -= 1;
          this.dwAddRange.w = cols.rectRangeSumWidth(this.dwAddRange);
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          this.dwAddRange.sri -= 1;
          this.dwAddRange.h = rows.rectRangeSumHeight(this.dwAddRange);
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          this.dwAddRange.eci += 1;
          this.dwAddRange.w = cols.rectRangeSumWidth(this.dwAddRange);
          break;
        }
        case SCROLL_TYPE.V_TOP: {
          this.dwAddRange.eri += 1;
          this.dwAddRange.h = rows.rectRangeSumHeight(this.dwAddRange);
          break;
        }
        default: break;
      }
    }
  }

  cpDwContentRange() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    const { dwAddRange } = this;
    if (dwAddRange) {
      const { sri, eri } = dwAddRange;
      const { cols } = table;
      this.dwContentRange = dwAddRange.clone();
      this.dwContentRange.set(sri, 0, eri, cols.len);
      this.dwContentRange.w = cols.rectRangeSumWidth(this.dwContentRange);
    }
  }

  cpDwOffsetXY() {
    const { dynamicView } = this;
    const { dwAddRange } = this;
    const { table } = dynamicView;
    if (dwAddRange) {
      const width = dwAddRange.w;
      const height = dwAddRange.h;
      let dwXOffset = 0;
      let dwYOffset = 0;
      const { scroll } = table;
      switch (scroll.type) {
        case SCROLL_TYPE.V_TOP: {
          dwYOffset = 0;
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          const { rows } = table;
          const { scrollRange } = dynamicView;
          const h = rows.rectRangeSumHeight(scrollRange);
          dwYOffset = h - height;
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          dwXOffset = 0;
          break;
        }
        case SCROLL_TYPE.H_RIGHT: {
          const { cols } = table;
          const { scrollRange } = dynamicView;
          const w = cols.rectRangeSumWidth(scrollRange);
          dwXOffset = w - width;
          break;
        }
        default: break;
      }
      this.dwXOffset = dwXOffset;
      this.dwYOffset = dwYOffset;
    }
  }

  cpBorderRange() {
    const { dwContentRange } = this;
    const { dynamicView } = this;
    const { table } = dynamicView;
    const { scroll } = table;
    const { cols, rows } = table;
    if (dwContentRange) {
      const borderRange = dwContentRange.clone();
      switch (scroll.type) {
        case SCROLL_TYPE.H_LEFT:
          borderRange.sci += 1;
          break;
        case SCROLL_TYPE.H_RIGHT:
          borderRange.eci -= 1;
          break;
        case SCROLL_TYPE.V_TOP:
          borderRange.eri += 1;
          break;
        case SCROLL_TYPE.V_BOTTOM:
          borderRange.sri -= 1;
          break;
        default: break;
      }
      borderRange.w = cols.rectRangeSumWidth(borderRange);
      borderRange.h = rows.rectRangeSumHeight(borderRange);
      this.borderRange = borderRange;
    }
  }

  cpBdOffsetXY() {
    const { dynamicView } = this;
    const { borderRange } = this;
    const { table } = dynamicView;
    if (borderRange) {
      const width = borderRange.w;
      const height = borderRange.h;
      let bdXOffset = 0;
      let bdYOffset = 0;
      const { scroll } = table;
      switch (scroll.type) {
        case SCROLL_TYPE.V_TOP: {
          bdYOffset = 0;
          break;
        }
        case SCROLL_TYPE.V_BOTTOM: {
          const { rows } = table;
          const { scrollRange } = dynamicView;
          const h = rows.rectRangeSumHeight(scrollRange);
          bdYOffset = h - height;
          break;
        }
        case SCROLL_TYPE.H_LEFT: {
          bdXOffset = 0;
          break;
        }
        case SCROLL_TYPE.H_RIGHT: {
          const { cols } = table;
          const { scrollRange } = dynamicView;
          const w = cols.rectRangeSumWidth(scrollRange);
          bdXOffset = w - width;
          break;
        }
        default: break;
      }
      this.bdXOffset = bdXOffset;
      this.bdYOffset = bdYOffset;
    }
  }

  getCaptureX() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      return this.captureX;
    }
    return 0;
  }

  getCaptureY() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      return this.captureY;
    }
    return 0;
  }

  getDwXOffset() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      return this.dwXOffset;
    }
    return 0;
  }

  getDwYOffset() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      return this.dwYOffset;
    }
    return 0;
  }

  getBdXOffset() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      return this.bdXOffset;
    }
    return 0;
  }

  getBdYOffset() {
    const { dynamicView } = this;
    const { table } = dynamicView;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      return this.bdYOffset;
    }
    return 0;
  }

}

class DynamicView {

  constructor(table) {
    this.difference = new DynamicViewDifference(this);
    this.table = table;
    this.lastScrollRange = null;
    this.scrollRange = null;
    this.contentRange = null;
    this.scrollXOffset = 0;
  }

  cpScrollRange() {
    const { table } = this;
    const {
      rows, cols, scroll, contentOffset,
    } = table;
    let [width, height] = [0, 0];
    const { ri, ci } = scroll;
    let [eri, eci] = [rows.len, cols.len];
    for (let i = ri; i < rows.len; i += 1) {
      height += rows.getHeight(i);
      eri = i;
      if (height > contentOffset.getFixedHeight()) break;
    }
    for (let j = ci; j < cols.len; j += 1) {
      width += cols.getWidth(j);
      eci = j;
      if (width > contentOffset.getFixedWidth()) break;
    }
    this.scrollRange = new RectRange(ri, ci, eri, eci, width, height);
  }

  cpContentRange() {
    const { table } = this;
    const { scrollRange } = this;
    const { sri, eri } = scrollRange;
    const { cols } = table;
    this.contentRange = scrollRange.clone();
    this.contentRange.set(sri, 0, eri, cols.len);
    this.contentRange.w = cols.rectRangeSumWidth(scrollRange);
  }

  cpScrollXOffset() {
    const { table } = this;
    const { scroll, cols } = table;
    const { ci } = scroll;
    this.scrollXOffset = -cols.sectionSumWidth(0, ci - 1);
  }

  cpRange() {
    this.lastScrollRange = this.scrollRange;
    this.scrollRange = null;
    this.contentRange = null;
    this.scrollXOffset = 0;
    this.cpScrollRange();
    this.cpContentRange();
    this.cpScrollXOffset();
    this.difference.cpRange();

  }

  getOriginScrollView() {
    const { scrollRange } = this;
    return scrollRange.clone();
  }

  getOriginContentView() {
    const { contentRange } = this;
    return contentRange.clone();
  }

  getOriginLastScrollView() {
    const { lastScrollRange } = this;
    if (lastScrollRange) {
      return lastScrollRange.clone();
    }
    return null;
  }

  getScrollXOffset() {
    return this.scrollXOffset;
  }

  getScrollView() {
    const { table } = this;
    const { scrollRange } = this;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      const { difference } = this;
      const { dwAddRange } = difference;
      if (dwAddRange) {
        return dwAddRange.clone();
      }
    }
    return scrollRange.clone();
  }

  getContentView() {
    const { contentRange } = this;
    const { table } = this;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      const { scroll } = table;
      const { difference } = this;
      switch (scroll.type) {
        case SCROLL_TYPE.V_TOP:
        case SCROLL_TYPE.V_BOTTOM: {
          const { dwContentRange } = difference;
          if (dwContentRange) {
            return dwContentRange.clone();
          }
          break;
        }
        default: break;
      }
    }
    return contentRange.clone();
  }

  getBorderView() {
    const { table } = this;
    const { scrollRange } = this;
    if (table.mode === TABLE_RENDER_MODE.SCROLL) {
      const { difference } = this;
      const { borderRange } = difference;
      if (borderRange) {
        return borderRange.clone();
      }
    }
    return scrollRange.clone();
  }

}

// =============================== 冻结内容渲染 =================================

class FrozenLeftTop {

  constructor(table) {
    this.table = table;
  }

  getScrollViewRange() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxLeft, fxTop } = fixed;
    const scrollView = dynamicView.getOriginScrollView();
    scrollView.sci = 0;
    scrollView.eci = fxLeft;
    scrollView.sri = 0;
    scrollView.eri = fxTop;
    return scrollView;
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridLineHandle.hLine(viewRange);
    const vLine = gridLineHandle.vLine(viewRange);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridLineHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridLineHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBorder(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, line, lineHandle, borderLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderLineHandle.htLine(viewRange);
    const hbLine = borderLineHandle.hbLine(viewRange);
    const vlLine = borderLineHandle.vlLine(viewRange);
    const vrLine = borderLineHandle.vrLine(viewRange);
    htLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    const htMergeLine = borderLineHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderLineHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderLineHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderLineHandle.vrMergeLine(coincideViewBrink);
    htMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cellsHelper,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格背景
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    // 绘制合并单元格背景
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cellsHelper, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格文字
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect, overflow) => {
        // 绘制文字
        const { fontAttr } = cell;
        const { align } = fontAttr;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        font.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
        // Test
        // draw.attr({ globalAlpha: 0.3 });
        // draw.fillRect(rect.x, rect.y, cell.contentWidth, rect.height);
      },
    });
    // 绘制合并单元格文字
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // console.log('rect >>>', rect);
        // 绘制文字
        const { fontAttr } = cell;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow: null,
          attr: fontAttr,
        });
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const offset = table.frozenLeftTopOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(x, y, width, height);
  }

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const { frozenLeftTopOffset } = table;
    const change = frozenLeftTopOffset.getScrollViewChange();
    if (change) {
      const scrollView = frozenLeftTopOffset.getScrollView();
      const offsetX = frozenLeftTopOffset.getFixedXOffset();
      const offsetY = frozenLeftTopOffset.getFixedYOffset();
      const fixedWidth = frozenLeftTopOffset.getFixedWidth();
      const fixedHeight = frozenLeftTopOffset.getFixedHeight();
      this.renderClear();
      // 裁剪内容
      const drawRect = new Rect({
        x: offsetX + grid.lineWidth(),
        y: offsetY + grid.lineWidth(),
        width: fixedWidth,
        height: fixedHeight,
      });
      const drawCrop = new Crop({ draw, rect: drawRect, offset: grid.lineWidth() });
      drawCrop.open();
      this.drawBackGround(scrollView, offsetX, offsetY);
      this.drawCells(scrollView, offsetX, offsetY);
      if (settings.table.showGrid) {
        this.drawGrid(scrollView, offsetX, offsetY);
      }
      this.drawBorder(scrollView, offsetX, offsetY);
      drawCrop.close();
    }
  }

}

class FrozenLeftIndex {

  constructor(table) {
    this.table = table;
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const {
      draw, grid, rows, settings,
    } = table;
    const { sri, eri } = viewRange;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f6f7fa',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${npx(11)}px Arial`,
      fillStyle: '#585757',
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.fillText(i + 1, width / 2, y + (ch / 2));
    });
    // 绘制边框
    let lineHeight = 0;
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      lineHeight += ch;
      grid.horizontalLine(0, y, width, y);
      if (i === eri) grid.horizontalLine(0, y + ch, width, y + ch);
    });
    grid.verticalLine(width, 0, width, lineHeight);
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const offset = table.frozenLeftIndexOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(x, y, width, height);
  }

  render() {
    const { table } = this;
    const { frozenLeftIndexOffset } = table;
    const change = frozenLeftIndexOffset.getScrollViewChange();
    if (change) {
      const offsetX = frozenLeftIndexOffset.getFixedXOffset();
      const offsetY = frozenLeftIndexOffset.getFixedYOffset();
      const width = frozenLeftIndexOffset.getFixedWidth();
      const height = frozenLeftIndexOffset.getFixedHeight();
      const scrollView = frozenLeftIndexOffset.getScrollView();
      this.renderClear();
      this.draw(scrollView, offsetX, offsetY, width, height);
    }
  }

}

class FrozenTopIndex {

  constructor(table) {
    this.table = table;
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const {
      draw, grid, cols, settings,
    } = table;
    const { sci, eci } = viewRange;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f6f7fa',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${npx(11)}px Arial`,
      fillStyle: '#585757',
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.fillText(Utils.stringAt(i), x + (cw / 2), height / 2);
    });
    // 绘制边框
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    let lineWidth = 0;
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      lineWidth += cw;
      grid.verticalLine(x, 0, x, height);
      if (i === eci) grid.verticalLine(x + cw, 0, x + cw, height);
    });
    grid.horizontalLine(0, height, lineWidth, height);
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const offset = table.frozenTopIndexOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    draw.attr({
      fillStyle: settings.table.background,
    });
    draw.fillRect(x, y, width, height);
  }

  render() {
    const { table } = this;
    const { frozenTopIndexOffset } = table;
    const change = frozenTopIndexOffset.getScrollViewChange();
    if (change) {
      const offsetX = frozenTopIndexOffset.getFixedXOffset();
      const offsetY = frozenTopIndexOffset.getFixedYOffset();
      const width = frozenTopIndexOffset.getFixedWidth();
      const height = frozenTopIndexOffset.getFixedHeight();
      const scrollView = frozenTopIndexOffset.getScrollView();
      this.renderClear();
      this.draw(scrollView, offsetX, offsetY, width, height);
    }
  }

}

class FrozenRect {

  constructor(table) {
    this.table = table;
  }

  draw(offsetX, offsetY, width, height) {
    const { table } = this;
    const { draw, grid, settings } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f4f5f8',
    });
    draw.fillRect(0, 0, width, height);
    draw.offset(0, 0);
    draw.restore();
    // 绘制边框
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    grid.verticalLine(width, offsetY, width, height);
    grid.horizontalLine(0, height, width, height);
  }

  render() {
    const { table } = this;
    const { settings } = table;
    const { index } = settings;
    this.draw(0, 0, index.width, index.height);
  }

}

// ================================ 动态内容渲染 ================================

class FixedTop {

  constructor(table) {
    this.table = table;
  }

  getScrollViewRange() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxTop } = fixed;
    const scrollView = dynamicView.getOriginScrollView();
    scrollView.sri = 0;
    scrollView.eri = fxTop;
    return scrollView;
  }

  drawCells(viewRange, scrollViewXOffset, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cellsHelper, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格文字
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect, overflow) => {
        // 绘制文字
        const { fontAttr } = cell;
        const { align } = fontAttr;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        font.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
        // Test
        // draw.attr({ globalAlpha: 0.3 });
        // draw.fillRect(rect.x, rect.y, cell.contentWidth, rect.height);
      },
      startX: scrollViewXOffset,
    });
    // 绘制合并单元格文字
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // console.log('rect >>>', rect);
        // 绘制文字
        const { fontAttr } = cell;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow: null,
          attr: fontAttr,
        });
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
      },
      startX: scrollViewXOffset,
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridLineHandle.hLine(viewRange);
    const vLine = gridLineHandle.vLine(viewRange);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridLineHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridLineHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBorder(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, line, lineHandle, borderLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderLineHandle.htLine(viewRange);
    const hbLine = borderLineHandle.hbLine(viewRange);
    const vlLine = borderLineHandle.vlLine(viewRange);
    const vrLine = borderLineHandle.vrLine(viewRange);
    htLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    const htMergeLine = borderLineHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderLineHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderLineHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderLineHandle.vrMergeLine(coincideViewBrink);
    htMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cellsHelper,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格背景
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    // 绘制合并单元格背景
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings, grid, dynamicView, cols } = table;
    const { scroll } = table;
    const { canvas } = table;
    const offset = table.fixedTopOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    // 贴图
    let cx = offset.getCaptureX();
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT:
      case SCROLL_TYPE.H_LEFT: {
        let sx = x;
        // 防止贴图网格
        sx += grid.lineWidth();
        cx += grid.lineWidth();
        draw.drawImage(canvas.el, sx, y, width, height, cx, y, width, height);
        break;
      }
      default:
        break;
    }
    // 擦除
    const range = dynamicView.getScrollView();
    let dx = offset.getDwXOffset();
    const dy = offset.getDwYOffset();
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT: {
        // 防止擦除网格
        dx += grid.lineWidth();
        draw.attr({ fillStyle: settings.table.background });
        if (cols.len - 1 === range.eci) {
          const origin = dynamicView.getOriginScrollView();
          draw.fillRect(dx, dy, range.w + (width - origin.w), height);
        } else {
          draw.fillRect(dx, dy, range.w, height);
        }
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        draw.attr({ fillStyle: settings.table.background });
        draw.fillRect(dx, dy, range.w, height);
        break;
      }
      default: {
        draw.attr({
          fillStyle: settings.table.background,
        });
        draw.fillRect(x, y, width, height);
      }
    }
  }

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const { fixedTopOffset } = table;
    const change = fixedTopOffset.getScrollViewChange();
    if (change) {
      const scrollXOffset = fixedTopOffset.getScrollXOffset();
      const scrollView = fixedTopOffset.getScrollView();
      const contentView = fixedTopOffset.getContentView();
      const borderView = fixedTopOffset.getBorderView();
      const fixedWidth = fixedTopOffset.getFixedWidth();
      const fixedHeight = fixedTopOffset.getFixedHeight();
      // 裁剪背景
      const offsetX = fixedTopOffset.getFixedXOffset();
      const offsetY = fixedTopOffset.getFixedYOffset();
      const clearRect = new Rect({
        x: offsetX + grid.lineWidth(),
        y: offsetY + grid.lineWidth(),
        width: fixedWidth,
        height: fixedHeight,
      });
      const clearCrop = new Crop({ draw, rect: clearRect });
      clearCrop.open();
      this.renderClear();
      clearCrop.close();
      // 裁剪内容
      const dx = fixedTopOffset.getDwXOffset();
      const dy = fixedTopOffset.getDwYOffset();
      const drawRect = new Rect({
        x: dx + grid.lineWidth(),
        y: dy + grid.lineWidth(),
        width: scrollView.w,
        height: scrollView.h,
      });
      const drawCrop = new Crop({ draw, rect: drawRect });
      drawCrop.open();
      this.drawBackGround(scrollView, dx, dy);
      this.drawCells(contentView, scrollXOffset, offsetX, dy);
      if (settings.table.showGrid) {
        this.drawGrid(scrollView, dx, dy);
      }
      drawCrop.close();
      // 裁剪边框
      const bdY = fixedTopOffset.getBdYOffset();
      const bdX = fixedTopOffset.getBdXOffset();
      const borderRect = new Rect({
        x: offsetX + grid.lineWidth(),
        y: offsetY + grid.lineWidth(),
        width: fixedWidth,
        height: fixedHeight,
      });
      const borderCrop = new Crop({ draw, rect: borderRect });
      borderCrop.open();
      this.drawBorder(borderView, bdX, bdY);
      borderCrop.close();
    }
  }

}

class FixedLeft {

  constructor(table) {
    this.table = table;
  }

  getScrollViewRange() {
    const { table } = this;
    const { dynamicView } = table;
    const { fixed } = table;
    const { fxLeft } = fixed;
    const scrollView = dynamicView.getOriginScrollView();
    scrollView.sci = 0;
    scrollView.eci = fxLeft;
    return scrollView;
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridLineHandle.hLine(viewRange);
    const vLine = gridLineHandle.vLine(viewRange);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridLineHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridLineHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBorder(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, line, lineHandle, borderLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderLineHandle.htLine(viewRange);
    const hbLine = borderLineHandle.hbLine(viewRange);
    const vlLine = borderLineHandle.vlLine(viewRange);
    const vrLine = borderLineHandle.vrLine(viewRange);
    htLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    const htMergeLine = borderLineHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderLineHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderLineHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderLineHandle.vrMergeLine(coincideViewBrink);
    htMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cellsHelper,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格背景
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    // 绘制合并单元格背景
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawCells(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cellsHelper, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格文字
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect, overflow) => {
        // 绘制文字
        const { fontAttr } = cell;
        const { align } = fontAttr;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        font.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
        // Test
        // draw.attr({ globalAlpha: 0.3 });
        // draw.fillRect(rect.x, rect.y, cell.contentWidth, rect.height);
      },
    });
    // 绘制合并单元格文字
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // console.log('rect >>>', rect);
        // 绘制文字
        const { fontAttr } = cell;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow: null,
          attr: fontAttr,
        });
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings, grid, rows, dynamicView } = table;
    const { scroll } = table;
    const { canvas } = table;
    const offset = table.fixedLeftOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    // 贴图
    let cy = offset.getCaptureY();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM:
      case SCROLL_TYPE.V_TOP: {
        let sy = y;
        // 防止贴图网格
        sy += grid.lineWidth();
        cy += grid.lineWidth();
        draw.drawImage(canvas.el, x, sy, width, height, x, cy, width, height);
        break;
      }
      default:
        break;
    }
    // 擦除
    const range = dynamicView.getScrollView();
    const dx = offset.getDwXOffset();
    let dy = offset.getDwYOffset();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        draw.attr({ fillStyle: settings.table.background });
        // 防止擦除网格
        dy += grid.lineWidth();
        if (rows.len - 1 === range.eri) {
          const origin = dynamicView.getOriginScrollView();
          draw.fillRect(dx, dy, width, range.h + (height - origin.h));
        } else {
          draw.fillRect(dx, dy, width, range.h);
        }
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        draw.attr({ fillStyle: settings.table.background });
        draw.fillRect(dx, dy, width, range.h);
        break;
      }
      default: {
        draw.attr({
          fillStyle: settings.table.background,
        });
        draw.fillRect(x, y, width, height);
      }
    }
  }

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const { fixedLeftOffset } = table;
    const change = fixedLeftOffset.getScrollViewChange();
    if (change) {
      const scrollView = fixedLeftOffset.getScrollView();
      const contentView = fixedLeftOffset.getContentView();
      const borderView = fixedLeftOffset.getBorderView();
      const fixedWidth = fixedLeftOffset.getFixedWidth();
      const fixedHeight = fixedLeftOffset.getFixedHeight();
      // 裁剪背景
      const offsetX = fixedLeftOffset.getFixedXOffset();
      const offsetY = fixedLeftOffset.getFixedYOffset();
      const clearRect = new Rect({
        x: offsetX + grid.lineWidth(),
        y: offsetY + grid.lineWidth(),
        width: fixedWidth,
        height: fixedHeight,
      });
      const clearCrop = new Crop({ draw, rect: clearRect });
      clearCrop.open();
      this.renderClear();
      clearCrop.close();
      // 裁剪内容
      const dx = fixedLeftOffset.getDwXOffset();
      const dy = fixedLeftOffset.getDwYOffset();
      const drawRect = new Rect({
        x: dx + grid.lineWidth(),
        y: dy + grid.lineWidth(),
        width: scrollView.w,
        height: scrollView.h,
      });
      const drawCrop = new Crop({ draw, rect: drawRect });
      drawCrop.open();
      this.drawBackGround(scrollView, dx, dy);
      this.drawCells(contentView, offsetX, dy);
      if (settings.table.showGrid) {
        this.drawGrid(scrollView, dx, dy);
      }
      drawCrop.close();
      // 裁剪边框
      const bdY = fixedLeftOffset.getBdYOffset();
      const bdX = fixedLeftOffset.getBdXOffset();
      const borderRect = new Rect({
        x: offsetX + grid.lineWidth(),
        y: offsetY + grid.lineWidth(),
        width: fixedWidth,
        height: fixedHeight,
      });
      const borderCrop = new Crop({ draw, rect: borderRect });
      borderCrop.open();
      this.drawBorder(borderView, bdX, bdY);
      borderCrop.close();
    }
  }

}

class Content {

  constructor(table) {
    this.table = table;
  }

  getContentWidth() {
    const { table } = this;
    const { cols, fixed } = table;
    const total = cols.totalWidth();
    const fixedWidth = cols.sectionSumWidth(0, fixed.fxLeft);
    return total - fixedWidth;
  }

  getContentHeight() {
    const { table } = this;
    const { rows, fixed } = table;
    const total = rows.totalHeight();
    const fixedHeight = rows.sectionSumHeight(0, fixed.fxTop);
    return total - fixedHeight;
  }

  drawCells(viewRange, scrollViewXOffset, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, cellsHelper, grid,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格文字
    cellsHelper.getCellSkipMergeCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect, overflow) => {
        // 绘制文字
        const { fontAttr } = cell;
        const { align } = fontAttr;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow,
          attr: fontAttr,
        });
        font.setOverflowCrop(align === ALIGN.center);
        cell.setContentWidth(font.draw());
        // Test
        // draw.attr({ globalAlpha: 0.3 });
        // draw.fillRect(rect.x, rect.y, cell.contentWidth, rect.height);
      },
      startX: scrollViewXOffset,
    });
    // 绘制合并单元格文字
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // console.log('rect >>>', rect);
        // 绘制文字
        const { fontAttr } = cell;
        const font = new Font({
          text: Format(cell.format, cell.text),
          rect: rect.expandSize(grid.lineWidth()),
          dw: draw,
          overflow: null,
          attr: fontAttr,
        });
        font.setTextWrap(TEXT_WRAP.WORD_WRAP);
        cell.setContentWidth(font.draw());
      },
      startX: scrollViewXOffset,
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawGrid(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, lineHandle, gridLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const hLine = gridLineHandle.hLine(viewRange);
    const vLine = gridLineHandle.vLine(viewRange);
    hLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    const hMergeLine = gridLineHandle.hMergeLine(coincideViewBrink);
    const vMergeLine = gridLineHandle.vMergeLine(coincideViewBrink);
    hMergeLine.forEach((item) => {
      grid.horizontalLine(item.sx, item.sy, item.ex, item.ey);
    });
    vMergeLine.forEach((item) => {
      grid.verticalLine(item.sx, item.sy, item.ex, item.ey);
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBorder(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, line, lineHandle, borderLineHandle,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    const coincideView = lineHandle.viewRangeAndMergeCoincideView({ viewRange });
    const coincideViewBrink = lineHandle.coincideViewBrink({ coincideView });
    const htLine = borderLineHandle.htLine(viewRange);
    const hbLine = borderLineHandle.hbLine(viewRange);
    const vlLine = borderLineHandle.vlLine(viewRange);
    const vrLine = borderLineHandle.vrLine(viewRange);
    htLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    const htMergeLine = borderLineHandle.htMergeLine(coincideViewBrink);
    const hbMergeLine = borderLineHandle.hbMergeLine(coincideViewBrink);
    const vlMergeLine = borderLineHandle.vlMergeLine(coincideViewBrink);
    const vrMergeLine = borderLineHandle.vrMergeLine(coincideViewBrink);
    htMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { top } = borderAttr;
      const { color, width, type } = top;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'top');
    });
    hbMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { bottom } = borderAttr;
      const { color, width, type } = bottom;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'bottom');
    });
    vlMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { left } = borderAttr;
      const { color, width, type } = left;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'left');
    });
    vrMergeLine.forEach((item) => {
      const { borderAttr, row, col } = item;
      const { right } = borderAttr;
      const { color, width, type } = right;
      line.setType(type);
      line.setColor(color);
      line.setWidth(width);
      line.drawLine(item.sx, item.sy, item.ex, item.ey, row, col, 'right');
    });
    draw.offset(0, 0);
    draw.restore();
  }

  drawBackGround(viewRange, offsetX, offsetY) {
    const { table } = this;
    const {
      draw, grid, cellsHelper,
    } = table;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制单元格背景
    cellsHelper.getCellByViewRange({
      rectRange: viewRange,
      callback: (i, c, cell, rect) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    // 绘制合并单元格背景
    cellsHelper.getMergeCellByViewRange({
      rectRange: viewRange,
      callback: (rect, cell) => {
        // 绘制背景
        rect.expandSize(grid.lineWidth());
        const box = new Box({ draw, rect });
        box.drawBackgroundColor(cell.background);
      },
    });
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings, grid, rows, dynamicView, cols } = table;
    const { scroll } = table;
    const { canvas } = table;
    const offset = table.contentOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    // 贴图
    let cx = offset.getCaptureX();
    let cy = offset.getCaptureY();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM:
      case SCROLL_TYPE.V_TOP: {
        let sy = y;
        // 防止贴图网格
        sy += grid.lineWidth();
        cy += grid.lineWidth();
        draw.drawImage(canvas.el, x, sy, width, height, x, cy, width, height);
        break;
      }
      case SCROLL_TYPE.H_RIGHT:
      case SCROLL_TYPE.H_LEFT: {
        let sx = x;
        // 防止贴图网格
        sx += grid.lineWidth();
        cx += grid.lineWidth();
        draw.drawImage(canvas.el, sx, y, width, height, cx, y, width, height);
        break;
      }
      default:
        break;
    }
    // 擦除
    const range = dynamicView.getScrollView();
    let dx = offset.getDwXOffset();
    let dy = offset.getDwYOffset();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM: {
        draw.attr({ fillStyle: settings.table.background });
        // 防止擦除网格
        dy += grid.lineWidth();
        if (rows.len - 1 === range.eri) {
          const origin = dynamicView.getOriginScrollView();
          draw.fillRect(dx, dy, width, range.h + (height - origin.h));
        } else {
          draw.fillRect(dx, dy, width, range.h);
        }
        break;
      }
      case SCROLL_TYPE.V_TOP: {
        draw.attr({ fillStyle: settings.table.background });
        draw.fillRect(dx, dy, width, range.h);
        break;
      }
      case SCROLL_TYPE.H_RIGHT: {
        // 防止擦除网格
        dx += grid.lineWidth();
        draw.attr({ fillStyle: settings.table.background });
        if (cols.len - 1 === range.eci) {
          const origin = dynamicView.getOriginScrollView();
          draw.fillRect(dx, dy, range.w + (width - origin.w), height);
        } else {
          draw.fillRect(dx, dy, range.w, height);
        }
        break;
      }
      case SCROLL_TYPE.H_LEFT: {
        draw.attr({ fillStyle: settings.table.background });
        draw.fillRect(dx, dy, range.w, height);
        break;
      }
      default: {
        draw.attr({
          fillStyle: settings.table.background,
        });
        draw.fillRect(x, y, width, height);
      }
    }
  }

  render() {
    const { table } = this;
    const { draw, grid, settings } = table;
    const { contentOffset } = table;
    const change = contentOffset.getScrollViewChange();
    if (change) {
      const scrollXOffset = contentOffset.getScrollXOffset();
      const scrollView = contentOffset.getScrollView();
      const contentView = contentOffset.getContentView();
      const borderView = contentOffset.getBorderView();
      const fixedWidth = contentOffset.getFixedWidth();
      const fixedHeight = contentOffset.getFixedHeight();
      // 裁剪背景
      const offsetX = contentOffset.getFixedXOffset();
      const offsetY = contentOffset.getFixedYOffset();
      const clearRect = new Rect({
        x: offsetX + grid.lineWidth(),
        y: offsetY + grid.lineWidth(),
        width: fixedWidth,
        height: fixedHeight,
      });
      const clearCrop = new Crop({ draw, rect: clearRect });
      clearCrop.open();
      this.renderClear();
      clearCrop.close();
      // 裁剪内容
      const dx = contentOffset.getDwXOffset();
      const dy = contentOffset.getDwYOffset();
      const drawRect = new Rect({
        x: dx + grid.lineWidth(),
        y: dy + grid.lineWidth(),
        width: scrollView.w,
        height: scrollView.h,
      });
      const drawCrop = new Crop({ draw, rect: drawRect });
      drawCrop.open();
      this.drawBackGround(scrollView, dx, dy);
      this.drawCells(contentView, scrollXOffset, offsetX, dy);
      if (settings.table.showGrid) {
        this.drawGrid(scrollView, dx, dy);
      }
      drawCrop.close();
      // 裁剪边框
      const bdY = contentOffset.getBdYOffset();
      const bdX = contentOffset.getBdXOffset();
      const borderRect = new Rect({
        x: offsetX + grid.lineWidth(),
        y: offsetY + grid.lineWidth(),
        width: fixedWidth,
        height: fixedHeight,
      });
      const borderCrop = new Crop({ draw, rect: borderRect });
      borderCrop.open();
      this.drawBorder(borderView, bdX, bdY);
      borderCrop.close();
    }
  }

}

class FixedTopIndex {

  constructor(table) {
    this.table = table;
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const {
      draw, grid, cols, settings,
    } = table;
    const { sci, eci } = viewRange;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f6f7fa',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${npx(11)}px Arial`,
      fillStyle: '#585757',
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      draw.fillText(Utils.stringAt(i), x + (cw / 2), height / 2);
    });
    // 绘制边框
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    let lineWidth = 0;
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    cols.eachWidth(sci, eci, (i, cw, x) => {
      lineWidth += cw;
      grid.verticalLine(x, 0, x, height);
      if (i === eci) grid.verticalLine(x + cw, 0, x + cw, height);
    });
    grid.horizontalLine(0, height, lineWidth, height);
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const { cols, grid } = table;
    const { dynamicView } = table;
    const offset = table.fixedTopIndexOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    const dx = offset.getDwXOffset();
    const dy = offset.getDwYOffset();
    const cx = offset.getCaptureX();
    const { scroll } = table;
    const { canvas } = table;
    const { el } = canvas;
    const range = offset.getScrollView();
    switch (scroll.type) {
      case SCROLL_TYPE.H_RIGHT:
      case SCROLL_TYPE.H_LEFT: {
        const [sx, sy, ey] = [x, y, y];
        draw.drawImage(el, sx, sy, width, height + grid.lineWidth(),
          cx, ey, width, height + grid.lineWidth());
        draw.attr({ fillStyle: settings.table.background });
        if (cols.len - 1 === range.eci) {
          const origin = dynamicView.getOriginScrollView();
          draw.fillRect(dx, dy, range.w + (width - origin.w), height + grid.lineWidth());
        } else {
          draw.fillRect(dx, dy, range.w, height + grid.lineWidth());
        }
        break;
      }
      default: {
        draw.attr({
          fillStyle: settings.table.background,
        });
        draw.fillRect(x, y, width, height);
      }
    }
  }

  render() {
    const { table } = this;
    const { fixedTopIndexOffset, grid, draw } = table;
    const change = fixedTopIndexOffset.getScrollViewChange();
    if (change) {
      const scrollView = fixedTopIndexOffset.getScrollView();
      const dx = fixedTopIndexOffset.getDwXOffset();
      const dy = fixedTopIndexOffset.getDwYOffset();
      const fixedOffsetX = fixedTopIndexOffset.getFixedXOffset();
      const fixedOffsetY = fixedTopIndexOffset.getFixedYOffset();
      const fixedWidth = fixedTopIndexOffset.getFixedWidth();
      const fixedHeight = fixedTopIndexOffset.getFixedHeight();
      const rect = new Rect({
        x: fixedOffsetX,
        y: fixedOffsetY,
        width: fixedWidth,
        height: fixedHeight + grid.lineWidth(),
      });
      const crop = new Crop({ draw, rect });
      crop.open();
      this.renderClear();
      this.draw(scrollView, dx, dy, scrollView.w, fixedHeight);
      crop.close();
    }
  }

}

class FixedLeftIndex {

  constructor(table) {
    this.table = table;
  }

  draw(viewRange, offsetX, offsetY, width, height) {
    const { table } = this;
    const {
      draw, grid, rows, settings,
    } = table;
    const { sri, eri } = viewRange;
    draw.save();
    draw.offset(offsetX, offsetY);
    // 绘制背景
    draw.attr({
      fillStyle: '#f6f7fa',
    });
    draw.fillRect(0, 0, width, height);
    // 绘制文字
    draw.attr({
      textAlign: 'center',
      textBaseline: 'middle',
      font: `${npx(11)}px Arial`,
      fillStyle: '#585757',
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      draw.fillText(i + 1, width / 2, y + (ch / 2));
    });
    // 绘制边框
    let lineHeight = 0;
    draw.attr({
      strokeStyle: settings.table.borderColor,
    });
    rows.eachHeight(sri, eri, (i, ch, y) => {
      lineHeight += ch;
      grid.horizontalLine(0, y, width, y);
      if (i === eri) grid.horizontalLine(0, y + ch, width, y + ch);
    });
    grid.verticalLine(width, 0, width, lineHeight);
    draw.offset(0, 0);
    draw.restore();
  }

  renderClear() {
    const { table } = this;
    const { draw, settings } = table;
    const { rows, grid } = table;
    const { dynamicView } = table;
    const offset = table.fixedLeftIndexOffset;
    const width = offset.getFixedWidth();
    const height = offset.getFixedHeight();
    const x = offset.getFixedXOffset();
    const y = offset.getFixedYOffset();
    const dx = offset.getDwXOffset();
    const dy = offset.getDwYOffset();
    const cy = offset.getCaptureY();
    const { scroll } = table;
    const { canvas } = table;
    const { el } = canvas;
    const range = offset.getScrollView();
    switch (scroll.type) {
      case SCROLL_TYPE.V_BOTTOM:
      case SCROLL_TYPE.V_TOP: {
        const [sx, ex, sy] = [x, x, y];
        draw.drawImage(el, sx, sy, width + grid.lineWidth(), height,
          ex, cy, width + grid.lineWidth(), height);
        draw.attr({ fillStyle: settings.table.background });
        if (rows.len - 1 === range.eri) {
          const origin = dynamicView.getOriginScrollView();
          draw.fillRect(dx, dy, width + grid.lineWidth(), range.h + (height - origin.h));
        } else {
          draw.fillRect(dx, dy, width + grid.lineWidth(), range.h);
        }
        break;
      }
      default: {
        draw.attr({
          fillStyle: settings.table.background,
        });
        draw.fillRect(x, y, width, height);
      }
    }
  }

  render() {
    const { table } = this;
    const { fixedLeftIndexOffset, grid, draw } = table;
    const change = fixedLeftIndexOffset.getScrollViewChange();
    if (change) {
      const scrollView = fixedLeftIndexOffset.getScrollView();
      const dx = fixedLeftIndexOffset.getDwXOffset();
      const dy = fixedLeftIndexOffset.getDwYOffset();
      const fixedOffsetX = fixedLeftIndexOffset.getFixedXOffset();
      const fixedOffsetY = fixedLeftIndexOffset.getFixedYOffset();
      const fixedWidth = fixedLeftIndexOffset.getFixedWidth();
      const fixedHeight = fixedLeftIndexOffset.getFixedHeight();
      const rect = new Rect({
        x: fixedOffsetX,
        y: fixedOffsetY,
        width: fixedWidth + grid.lineWidth(),
        height: fixedHeight,
      });
      const crop = new Crop({ draw, rect, offset: grid.lineWidth() });
      crop.open();
      this.renderClear();
      this.draw(scrollView, dx, dy, fixedWidth, scrollView.h);
      crop.close();
    }
  }

}

// ================================= 快捷键 ===================================

class KeyBoardTab {

  constructor(table) {
    const { keyboard, cols, rows, edit, merges, screenSelector } = table;
    let tabId = 0;
    let tabNext = null;
    keyboard.register({
      el: table,
      focus: true,
      stop: false,
      attr: {
        code: 9,
        callback: () => {
          edit.hideEdit();
          const { selectorAttr } = screenSelector;
          const id = selectorAttr;
          const rect = selectorAttr.rect.clone();
          if (tabId !== id) {
            const { sri, sci } = rect;
            tabId = id;
            tabNext = { sri, sci };
          }
          const cLen = cols.len - 1;
          const rLen = rows.len - 1;
          let { sri, sci } = tabNext;
          const srcMerges = merges.getFirstIncludes(sri, sci);
          if (srcMerges) {
            sci = srcMerges.eci;
          }
          if (sci >= cLen && sri >= rLen) {
            return;
          }
          if (sci >= cLen) {
            sri += 1;
            sci = 0;
          } else {
            sci += 1;
          }
          tabNext.sri = sri;
          tabNext.sci = sci;
          let eri = sri;
          let eci = sci;
          const targetMerges = merges.getFirstIncludes(sri, sci);
          if (targetMerges) {
            sri = targetMerges.sri;
            sci = targetMerges.sci;
            eri = targetMerges.eri;
            eci = targetMerges.eci;
          }
          rect.sri = sri;
          rect.sci = sci;
          rect.eri = eri;
          rect.eci = eci;
          screenSelector.selectorAttr.rect = rect;
          screenSelector.setOffset(screenSelector.selectorAttr);
          screenSelector.onChangeStack.forEach(cb => cb());
          screenSelector.onSelectChangeStack.forEach(cb => cb());
          edit.showEdit();
        },
      },
    });
  }

}

// ============================== X-Sheet Table ==============================

const defaultSettings = {
  tipsRenderTime: false,
  tipsScrollTime: false,
  index: {
    height: 30,
    width: 50,
    bgColor: '#f4f5f8',
    color: '#000000',
  },
  table: {
    background: '#ffffff',
    borderColor: '#e5e5e5',
    gridColor: '#000000',
    showGrid: true,
  },
  data: [],
  rows: {
    len: 10000,
    height: 30,
  },
  cols: {
    len: 26,
    width: 137,
  },
  merges: [],
  fixed: {
    fxTop: -1,
    fxLeft: -1,
  },
};

class Table extends Widget {

  constructor(settings) {

    super(`${cssPrefix}-table`);

    this.mode = TABLE_RENDER_MODE.RENDER;
    this.settings = Utils.mergeDeep({}, defaultSettings, settings);
    this.canvas = new Widget(`${cssPrefix}-table-canvas`, 'canvas');

    // 动态区域计算
    this.dynamicView = new DynamicView(this);

    // 表格基本数据信息
    this.cells = new Cells({
      table: this,
      rows: this.rows,
      cols: this.cols,
      data: this.settings.data,
    });
    this.fixed = new Fixed(this.settings.fixed);
    this.rows = new Rows(this.settings.rows);
    this.cols = new Cols(this.settings.cols);
    this.merges = new Merges(this.settings.merges);
    this.scroll = new Scroll(this);

    // 帮助类
    this.cellsHelper = new CellsHelper({
      cells: this.cells,
      merges: this.merges,
      rows: this.rows,
      cols: this.cols,
    });

    // 焦点元素管理
    this.focus = new Focus(this);

    // 数据快照
    this.tableDataSnapshot = new TableDataSnapshot(this);

    // 鼠标指针
    this.mousePointer = new MousePointer(this);

    // 键盘快捷键
    this.keyboard = new Keyboard(this);

    // canvas 绘制资源
    this.draw = new Draw(this.canvas.el);
    this.line = new Line(this.draw, {
      leftShow: (ri, ci) => {
        // 单元格是否存在
        const cell = this.cells.getCell(ri, ci);
        if (cell === null) {
          return false;
        }
        // 是否是合并单元格
        const merge = this.merges.getFirstIncludes(ri, ci);
        if (merge) {
          const mergeCell = this.cells.getCell(merge.sri, merge.sci);
          return mergeCell.borderAttr.left.display;
        }
        // 检查边框是否需要绘制
        if (cell.borderAttr.left.display) {
          return this.lineHandle.vLineLeftOverFlowChecked(ci, ri);
        }
        return false;
      },
      topShow: (ri, ci) => {
        const cell = this.cells.getMergeCellOrCell(ri, ci);
        return cell && cell.borderAttr.top.display;
      },
      rightShow: (ri, ci) => {
        // 单元格是否存在
        const cell = this.cells.getCell(ri, ci);
        if (cell === null) {
          return false;
        }
        // 是否是合并单元格
        const merge = this.merges.getFirstIncludes(ri, ci);
        if (merge) {
          const mergeCell = this.cells.getCell(merge.sri, merge.sci);
          return mergeCell.borderAttr.right.display;
        }
        // 检查边框是否需要绘制
        if (cell.borderAttr.right.display) {
          return this.lineHandle.vLineRightOverFlowChecked(ci, ri);
        }
        return false;
      },
      bottomShow: (ri, ci) => {
        const cell = this.cells.getMergeCellOrCell(ri, ci);
        return cell && cell.borderAttr.bottom.display;
      },
      iFMerge: (row, col) => this.merges.getFirstIncludes(row, col) !== null,
      iFMergeFirstRow: (row, col) => this.merges.getFirstIncludes(row, col).sri === row,
      iFMergeLastRow: (row, col) => this.merges.getFirstIncludes(row, col).eri === row,
      iFMergeFirstCol: (row, col) => this.merges.getFirstIncludes(row, col).sci === col,
      iFMergeLastCol: (row, col) => this.merges.getFirstIncludes(row, col).eci === col,
    });
    this.grid = new Grid(this.draw, {
      color: this.settings.table.borderColor,
    });

    // 表格线段处理
    this.lineHandle = new LineHandle(this);
    this.borderLineHandle = new BorderLineHandle(this);
    this.gridLineHandle = new GridLineHandle(this);

    // table动态内容定位
    this.fixedTopOffset = new FixedTopOffset(this);
    this.fixedLeftOffset = new FixedLeftOffset(this);
    this.contentOffset = new ContentOffset(this);
    this.fixedTopIndexOffset = new FixedTopIndexOffset(this);
    this.fixedLeftIndexOffset = new FixedLeftIndexOffset(this);

    // table固定内容定位
    this.frozenLeftIndexOffset = new FrozenLeftIndexOffset(this);
    this.frozenTopIndexOffset = new FrozenTopIndexOffset(this);
    this.frozenLeftTopOffset = new FrozenLeftTopOffset(this);

    // table动态内容部分
    this.content = new Content(this);
    this.fixedLeft = new FixedLeft(this);
    this.fixedTop = new FixedTop(this);
    this.fixedTopIndex = new FixedTopIndex(this);
    this.fixedLeftIndex = new FixedLeftIndex(this);

    // table固定内容部分
    this.frozenLeftTop = new FrozenLeftTop(this);
    this.frozenLeftIndex = new FrozenLeftIndex(this);
    this.frozenTopIndex = new FrozenTopIndex(this);
    this.frozenRect = new FrozenRect(this);

    // table基础组件
    this.screen = new Screen(this);
    this.xReSizer = new XReSizer(this);
    this.yReSizer = new YReSizer(this);
    this.xHeightLight = new XHeightLight(this);
    this.yHeightLight = new YHeightLight(this);
    this.edit = new Edit(this);
  }

  onAttach() {
    this.bind();
    // 初始化表格基础小部件
    this.screenSelector = new ScreenSelector(this.screen);
    this.screenAutoFill = new ScreenAutoFill(this.screen, {
      onBeforeAutoFill: () => {
        this.tableDataSnapshot.begin();
      },
      onAfterAutoFill: () => {
        this.tableDataSnapshot.end();
      },
    });
    this.copyStyle = new ScreenCopyStyle(this.screen, {});
    this.screen.addWidget(this.screenSelector);
    this.screen.addWidget(this.screenAutoFill);
    this.screen.addWidget(this.copyStyle);
    this.screenSelector.on(SCREEN_SELECT_EVENT.SELECT_CHANGE, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_CHANGE);
    });
    this.screenSelector.on(SCREEN_SELECT_EVENT.DOWN_SELECT, () => {
      this.trigger(Constant.TABLE_EVENT_TYPE.SELECT_DOWN);
    });
    // 添加表格中的组件
    this.attach(this.canvas);
    this.attach(this.screen);
    this.attach(this.xReSizer);
    this.attach(this.yReSizer);
    this.attach(this.xHeightLight);
    this.attach(this.yHeightLight);
    this.attach(this.edit);
    // 注册快捷键
    this.keyBoardTab = new KeyBoardTab(this);
  }

  bind() {
    const { mousePointer, dynamicView } = this;
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_WIDTH, () => {
      dynamicView.cpRange();
      this.render();
    });
    EventBind.bind(this, Constant.TABLE_EVENT_TYPE.CHANGE_HEIGHT, () => {
      dynamicView.cpRange();
      this.render();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.SCROLL, () => {
      dynamicView.cpRange();
      this.render();
    });
    EventBind.bind(this, Constant.SYSTEM_EVENT_TYPE.MOUSE_MOVE, (e) => {
      const { x, y } = this.computeEventXy(e);
      const { ri, ci } = this.getRiCiByXy(x, y);
      if (ri === -1) {
        const { type, key } = Constant.MOUSE_POINTER_TYPE.SELECT_ONE_COLUMN;
        mousePointer.set(type, key);
        return;
      }
      if (ci === -1) {
        const { type, key } = Constant.MOUSE_POINTER_TYPE.SELECT_ONE_ROW;
        mousePointer.set(type, key);
        return;
      }
      const { type, key } = Constant.MOUSE_POINTER_TYPE.SELECT_CELL;
      mousePointer.set(type, key);
    });
  }

  drawOptimization() {
    const { cellsHelper } = this;
    const { dynamicView } = this;
    const scrollView = dynamicView.getOriginScrollView();
    let enable = true;
    cellsHelper.getCellByViewRange({
      rectRange: scrollView,
      callback: (r, c, cell) => {
        const { borderAttr } = cell;
        const { top, left, right, bottom } = borderAttr;
        if (top.type === LINE_TYPE.DOUBLE_LINE) {
          enable = false;
          return enable;
        }
        if (left.type === LINE_TYPE.DOUBLE_LINE) {
          enable = false;
          return enable;
        }
        if (right.type === LINE_TYPE.DOUBLE_LINE) {
          enable = false;
          return enable;
        }
        if (bottom.type === LINE_TYPE.DOUBLE_LINE) {
          enable = false;
          return enable;
        }
        return true;
      },
    });
    if (enable) {
      this.borderLineHandle.openDrawOptimization();
    } else {
      this.borderLineHandle.closeDrawOptimization();
    }
  }

  scrollX(x) {
    const {
      cols, fixed, settings, scroll,
    } = this;
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.time();
    }
    let { fxLeft } = fixed;
    fxLeft += 1;
    const [
      ci, left, width,
    ] = Utils.rangeReduceIf(fxLeft, cols.len, 0, 0, x, i => cols.getWidth(i));
    let x1 = left;
    if (x > 0) x1 += width;
    let type;
    if (scroll.x > x1) {
      type = SCROLL_TYPE.H_LEFT;
    } else if (scroll.x < x1) {
      type = SCROLL_TYPE.H_RIGHT;
    }
    scroll.type = type;
    scroll.ci = ci;
    scroll.x = x1;
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.log('滚动条计算耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
    }
    this.mode = TABLE_RENDER_MODE.SCROLL;
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
    this.mode = TABLE_RENDER_MODE.RENDER;
    scroll.type = SCROLL_TYPE.UN;
  }

  scrollY(y) {
    const {
      rows, fixed, settings, scroll,
    } = this;
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.time();
    }
    let { fxTop } = fixed;
    fxTop += 1;
    const [
      ri, top, height,
    ] = Utils.rangeReduceIf(fxTop, rows.len, 0, 0, y, i => rows.getHeight(i));
    let y1 = top;
    if (y > 0) y1 += height;
    let type;
    if (scroll.y > y1) {
      type = SCROLL_TYPE.V_TOP;
    } else if (scroll.y < y1) {
      type = SCROLL_TYPE.V_BOTTOM;
    }
    scroll.type = type;
    scroll.ri = ri;
    scroll.y = y1;
    if (settings.tipsScrollTime) {
      // eslint-disable-next-line no-console
      console.log('滚动条计算耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
    }
    this.mode = TABLE_RENDER_MODE.SCROLL;
    this.trigger(Constant.SYSTEM_EVENT_TYPE.SCROLL);
    this.mode = TABLE_RENDER_MODE.RENDER;
    scroll.type = SCROLL_TYPE.UN;
  }

  visualHeight() {
    return this.box().height;
  }

  visualWidth() {
    return this.box().width;
  }

  resize() {
    const { draw, dynamicView } = this;
    const [width, height] = [this.visualWidth(), this.visualHeight()];
    draw.resize(width, height);
    dynamicView.cpRange();
    this.render();
  }

  render() {
    const { settings, fixed } = this;
    if (settings.tipsRenderTime) {
      // eslint-disable-next-line no-console
      console.time();
    }
    this.drawOptimization();
    this.frozenRect.render();
    // 固定内容渲染
    if (fixed.fxLeft > -1 && fixed.fxTop > -1) {
      this.frozenLeftTop.render();
    }
    if (fixed.fxTop > -1) {
      this.frozenLeftIndex.render();
      this.fixedTop.render();
    }
    if (fixed.fxLeft > -1) {
      this.frozenTopIndex.render();
      this.fixedLeft.render();
    }
    // 表格内容渲染
    this.content.render();
    // 固定索引渲染
    this.fixedLeftIndex.render();
    this.fixedTopIndex.render();
    if (settings.tipsRenderTime) {
      // eslint-disable-next-line no-console
      console.log('渲染界面耗时:');
      // eslint-disable-next-line no-console
      console.timeEnd();
    }
  }

  getContentWidth() {
    return this.content.getContentWidth();
  }

  getContentHeight() {
    return this.content.getContentHeight();
  }

  getFixedWidth() {
    return this.fixedLeftOffset.getFixedWidth();
  }

  getFixedHeight() {
    return this.fixedTopOffset.getFixedHeight();
  }

  getContentViewRange() {
    const { dynamicView } = this;
    return dynamicView.getOriginContentView();
  }

  getScrollViewRange() {
    const { dynamicView } = this;
    return dynamicView.getOriginScrollView();
  }

  getScrollViewXOffset() {
    const { dynamicView } = this;
    return dynamicView.getScrollXOffset();
  }

  getRiCiByXy(x, y) {
    const {
      settings, fixed, rows, cols,
    } = this;
    const { index } = settings;
    const fixedHeight = this.getFixedHeight();
    const fixedWidth = this.getFixedWidth();

    let [left, top] = [x, y];
    let [ci, ri] = [-1, -1];

    left -= index.width;
    top -= index.height;

    // left
    if (left <= fixedWidth && x > index.width) {
      let total = 0;
      for (let i = 0; i <= fixed.fxLeft; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total > left) break;
      }
    } else if (x > index.width) {
      let total = fixedWidth;
      const viewRange = this.getScrollViewRange();
      for (let i = viewRange.sci; i <= viewRange.eci; i += 1) {
        const width = cols.getWidth(i);
        total += width;
        ci = i;
        if (total > left) break;
      }
      // console.log('ci >>', ci);
    }

    // top
    if (top < fixedHeight && y > index.height) {
      let total = 0;
      for (let i = 0; i <= fixed.fxTop; i += 1) {
        const height = rows.getHeight(i);
        total += height;
        ri = i;
        if (total > top) break;
      }
    } else if (y > index.height) {
      let total = fixedHeight;
      const viewRange = this.getScrollViewRange();
      for (let i = viewRange.sri; i <= viewRange.eri; i += 1) {
        const height = rows.getHeight(i);
        total += height;
        ri = i;
        if (total > top) break;
      }
      // console.log('ri >>', ri);
    }

    return {
      ri, ci,
    };
  }

  getIndexWidth() {
    const { settings } = this;
    return settings.index.width;
  }

  getIndexHeight() {
    const { settings } = this;
    return settings.index.height;
  }

  toString() {
    const data = {
      rows: {
        data: this.rows.getData(),
      },
      cols: {
        data: this.cols.getData(),
      },
      merges: {
        data: this.merges.getData(),
      },
    };
    return JSON.stringify(data);
  }

}


export {
  Table,
};
