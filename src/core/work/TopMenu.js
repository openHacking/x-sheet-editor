import { Widget } from '../../lib/Widget';
import { cssPrefix } from '../../config';
import { Undo } from './tools/Undo';
import { Redo } from './tools/Redo';
import { PaintFormat } from './tools/PaintFormat';
import { ClearFormat } from './tools/ClearFormat';
import { Format } from './tools/Format';
import { Font } from './tools/Font';
import { FontSize } from './tools/FontSize';
import { FontBold } from './tools/FontBold';
import { FontItalic } from './tools/FontItalic';
import { UnderLine } from './tools/UnderLine';
import { FontStrike } from './tools/FontStrike';
import { FontColor } from './tools/FontColor';
import { FillColor } from './tools/FillColor';
import { Border } from './tools/Border';
import { Merge } from './tools/Merge';
import { HorizontalAlign } from './tools/HorizontalAlign';
import { VerticalAlign } from './tools/VerticalAlign';
import { TextWrapping } from './tools/TextWrapping';
import { Fixed } from './tools/Fixed';
import { Filter } from './tools/Filter';
import { Functions } from './tools/Functions';
import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';
import { ScreenCopyStyle } from '../table/copystyle/ScreenCopyStyle';
import { ScreenSelector } from '../table/selector/ScreenSelector';
import { Utils } from '../../utils/Utils';

class Divider extends Widget {
  constructor() {
    super(`${cssPrefix}-tools-divider`);
  }
}

class TopMenu extends Widget {
  constructor(workTop) {
    super(`${cssPrefix}-tools-menu`);
    this.workTop = workTop;
    this.undo = new Undo();
    this.redo = new Redo();
    this.paintFormat = new PaintFormat();
    this.clearFormat = new ClearFormat();
    this.format = new Format();
    this.font = new Font();
    this.fontSize = new FontSize();
    this.fontBold = new FontBold();
    this.fontItalic = new FontItalic();
    this.underLine = new UnderLine();
    this.fontStrike = new FontStrike();
    this.fontColor = new FontColor();
    this.fillColor = new FillColor();
    this.border = new Border();
    this.merge = new Merge();
    this.horizontalAlign = new HorizontalAlign();
    this.verticalAlign = new VerticalAlign();
    this.textWrapping = new TextWrapping();
    this.fixed = new Fixed();
    this.filter = new Filter();
    this.functions = new Functions();
    this.children(this.undo);
    this.children(this.redo);
    this.children(this.paintFormat);
    this.children(this.clearFormat);
    this.children(new Divider());
    this.children(this.format);
    this.children(new Divider());
    this.children(this.font);
    this.children(this.fontSize);
    this.children(new Divider());
    this.children(this.fontBold);
    this.children(this.fontItalic);
    this.children(this.underLine);
    this.children(this.fontStrike);
    this.children(this.fontColor);
    this.children(new Divider());
    this.children(this.fillColor);
    this.children(this.border);
    this.children(this.merge);
    this.children(this.horizontalAlign);
    this.children(this.verticalAlign);
    this.children(this.textWrapping);
    this.children(this.fixed);
    this.children(this.filter);
    this.children(this.functions);
    this.bind();
  }

  bind() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    EventBind.bind(body, Constant.WORK_BODY_TYPE.CHANGE_ACTIVE, () => {
      this.setStatus();
    });
    EventBind.bind(body, Constant.TABLE_EVENT_TYPE.DATA_CHANGE, () => {
      this.setStatus();
    });
    EventBind.bind(this.undo, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      if (table.undo.length() > 1) table.undo.pop();
    });
    EventBind.bind(this.redo, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      table.redo.pop();
    });
    EventBind.bind(this.paintFormat, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, cells } = table;
      const screenCopyStyle = screen.findByClass(ScreenCopyStyle);
      const screenSelector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        screenCopyStyle.setShow(selectorAttr);
        this.paintFormat.active(true);
        this.paintFormat.addSheet(sheet);
        const cb = () => {
          // 清除复制
          screenCopyStyle.setHide();
          this.paintFormat.active(false);
          this.paintFormat.removeSheet(sheet);
          screenSelector.removeSelectChangeOverCb(cb);
          // 复制样式
          const { selectorAttr: newSelectorAttr } = screenSelector;
          const src = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
          cells.getRectRangeCell(newSelectorAttr.rect, (r, c, rect, cell) => {
            Utils.mergeDeep(cell.style, src.style);
          });
          table.render();
        };
        screenSelector.addSelectChangeOverCb(cb);
      }
    });
    EventBind.bind(this.clearFormat, Constant.SYSTEM_EVENT_TYPE.CLICK, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, cells } = table;
      const screenSelector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        cells.getRectRangeCell(selectorAttr.rect, (r, c, rect, cell) => {
          cell.style = cells.defaultStyle;
        });
        table.render();
      }
    });
    EventBind.bind(this.format, Constant.SYSTEM_EVENT_TYPE.CLICK, (e) => {
      if (this.format.formatContextMenu.off) {
        this.format.formatContextMenu.close();
      } else {
        this.format.formatContextMenu.open();
      }
      e.stopPropagation();
      e.preventDefault();
    });
  }

  setStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    this.undo.active(table.undo.length() > 1);
    this.redo.active(!table.redo.isEmpty());
    this.paintFormat.active(this.paintFormat.includeSheet(sheet));
  }
}

export { TopMenu };
