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
import { Border } from './tools/border/Border';
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
import { ElPopUp } from '../../component/elpopup/ElPopUp';
import { Cells } from '../table/Cells';

class Divider extends Widget {
  constructor() {
    super(`${cssPrefix}-tools-divider`);
  }
}

class TopMenu extends Widget {
  constructor(workTop) {
    super(`${cssPrefix}-tools-menu`);
    this.workTop = workTop;
    const { body } = this.workTop.work;
    const { sheetView } = body;
    // tools
    this.undo = new Undo();
    this.redo = new Redo();
    this.paintFormat = new PaintFormat();
    this.clearFormat = new ClearFormat();
    this.format = new Format({
      contextMenu: {
        onUpdate: (format, title) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { screen, cells, dataSnapshot } = table;
          const screenSelector = screen.findByClass(ScreenSelector);
          const { selectorAttr } = screenSelector;
          this.format.setTitle(title);
          if (selectorAttr) {
            cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
              cell.format = format;
            }, undefined, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
    this.font = new Font({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { screen, cells, dataSnapshot } = table;
          const screenSelector = screen.findByClass(ScreenSelector);
          const { selectorAttr } = screenSelector;
          this.font.setTitle(type);
          if (selectorAttr) {
            cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
              cell.fontAttr.name = type;
            }, undefined, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
    this.fontSize = new FontSize({
      contextMenu: {
        onUpdate: (size) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { screen, cells, dataSnapshot } = table;
          const screenSelector = screen.findByClass(ScreenSelector);
          const { selectorAttr } = screenSelector;
          this.fontSize.setTitle(size);
          if (selectorAttr) {
            cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
              cell.fontAttr.size = size;
            }, undefined, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
    this.fontBold = new FontBold();
    this.fontItalic = new FontItalic();
    this.underLine = new UnderLine();
    this.fontStrike = new FontStrike();
    this.fontColor = new FontColor({
      contextMenu: {
        onUpdate: (color) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { screen, cells, dataSnapshot } = table;
          const screenSelector = screen.findByClass(ScreenSelector);
          const { selectorAttr } = screenSelector;
          this.fontColor.setColor(color);
          if (selectorAttr) {
            cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
              cell.fontAttr.color = color;
            }, undefined, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
    this.fillColor = new FillColor({
      contextMenu: {
        onUpdate: (color) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { screen, cells, dataSnapshot } = table;
          const screenSelector = screen.findByClass(ScreenSelector);
          const { selectorAttr } = screenSelector;
          this.fillColor.setColor(color);
          if (selectorAttr) {
            cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
              cell.background = color;
            }, undefined, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
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
    EventBind.bind(body, Constant.TABLE_EVENT_TYPE.SELECT_DOWN, () => {
      // console.log('TABLE_EVENT_TYPE.SELECT_DOWN');
      this.setFormatStatus();
      this.setFontStatus();
      this.setFontSizeStatus();
      this.setFontBold();
      this.setFontItalic();
      this.setUnderLine();
      this.setFontStrike();
      this.setFontColor();
      this.setFillColor();
    });
    EventBind.bind(this.undo, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { dataSnapshot } = table;
      if (dataSnapshot.undo.length() > 1) dataSnapshot.undo.pop();
    });
    EventBind.bind(this.redo, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { dataSnapshot } = table;
      dataSnapshot.redo.pop();
    });
    EventBind.bind(this.paintFormat, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, cells, dataSnapshot } = table;
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
          cells.getCellInRectRange(newSelectorAttr.rect, (r, c, cell) => {
            const { text } = cell;
            Utils.mergeDeep(cell, src);
            cell.text = text;
          });
          dataSnapshot.snapshot();
          table.render();
        };
        screenSelector.addSelectChangeOverCb(cb);
      }
    });
    EventBind.bind(this.clearFormat, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, cells } = table;
      const screenSelector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
          const { text } = cell;
          Utils.mergeDeep(cell, Cells.getDefaultAttr());
          cell.text = text;
        });
        table.render();
      }
    });
    EventBind.bind(this.format, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { format } = this;
      const { formatContextMenu } = format;
      const { elPopUp } = formatContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (formatContextMenu.isOpen()) {
        formatContextMenu.open();
      } else {
        formatContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.font, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { font } = this;
      const { fontContextMenu } = font;
      const { elPopUp } = fontContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fontContextMenu.isOpen()) {
        fontContextMenu.open();
      } else {
        fontContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.fontSize, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { fontSize } = this;
      const { fontSizeContextMenu } = fontSize;
      const { elPopUp } = fontSizeContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fontSizeContextMenu.isOpen()) {
        fontSizeContextMenu.open();
      } else {
        fontSizeContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.fontBold, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, cells, dataSnapshot } = table;
      const screenSelector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
        const bold = !firstCell.fontAttr.bold;
        cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
          cell.fontAttr.bold = bold;
        }, undefined, true);
        dataSnapshot.snapshot();
        table.render();
      }
    });
    EventBind.bind(this.fontItalic, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, cells, dataSnapshot } = table;
      const screenSelector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
        const italic = !firstCell.fontAttr.italic;
        cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
          cell.fontAttr.italic = italic;
        }, undefined, true);
        dataSnapshot.snapshot();
        table.render();
      }
    });
    EventBind.bind(this.underLine, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, cells, dataSnapshot } = table;
      const screenSelector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
        const underline = !firstCell.fontAttr.underline;
        cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
          cell.fontAttr.underline = underline;
        }, undefined, true);
        dataSnapshot.snapshot();
        table.render();
      }
    });
    EventBind.bind(this.fontStrike, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, () => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, cells, dataSnapshot } = table;
      const screenSelector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
        const strikethrough = !firstCell.fontAttr.strikethrough;
        cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
          cell.fontAttr.strikethrough = strikethrough;
        }, undefined, true);
        dataSnapshot.snapshot();
        table.render();
      }
    });
    EventBind.bind(this.fontColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { fontColor } = this;
      const { fontColorContextMenu } = fontColor;
      const { elPopUp } = fontColorContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fontColorContextMenu.isOpen()) {
        fontColorContextMenu.open();
      } else {
        fontColorContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.fillColor, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { fillColor } = this;
      const { fillColorContextMenu } = fillColor;
      const { elPopUp } = fillColorContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (fillColorContextMenu.isOpen()) {
        fillColorContextMenu.open();
      } else {
        fillColorContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.border, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { border } = this;
      const { borderTypeContextMenu } = border;
      const { elPopUp } = borderTypeContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (borderTypeContextMenu.isOpen()) {
        borderTypeContextMenu.open();
      } else {
        borderTypeContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
  }

  setUndoStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { dataSnapshot } = table;
    this.undo.active(dataSnapshot.undo.length() > 1);
  }

  setRedoStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { dataSnapshot } = table;
    this.redo.active(!dataSnapshot.redo.isEmpty());
  }

  setPaintFormatStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    this.paintFormat.active(this.paintFormat.includeSheet(sheet));
  }

  setFormatStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let text = '常规';
    let format = 'default';
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      format = firstCell.format;
      switch (format) {
        case 'default':
          text = '常规';
          break;
        case 'text':
          text = '文本';
          break;
        case 'number':
          text = '数字';
          break;
        case 'percentage':
          text = '百分比';
          break;
        case 'fraction':
          text = '分数';
          break;
        case 'ENotation':
          text = '科学计数';
          break;
        case 'rmb':
          text = '人民币';
          break;
        case 'hk':
          text = '港币';
          break;
        case 'dollar':
          text = '美元';
          break;
        case 'date1':
        case 'date2':
        case 'date3':
        case 'date4':
        case 'date5':
          text = '日期';
          break;
        case 'time':
          text = '时间';
          break;
        default: break;
      }
    }
    this.format.setTitle(text);
    this.format.formatContextMenu.setActiveByType(format);
  }

  setFontStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let name = 'Arial';
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      name = firstCell.fontAttr.name;
    }
    this.font.setTitle(name);
    this.font.fontContextMenu.setActiveByType(name);
  }

  setFontSizeStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let size = '12';
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      size = firstCell.fontAttr.size;
    }
    this.fontSize.setTitle(size);
  }

  setFontBold() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let bold = false;
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      bold = firstCell.fontAttr.bold;
    }
    this.fontBold.active(bold);
  }

  setFontItalic() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let italic = false;
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      italic = firstCell.fontAttr.italic;
    }
    this.fontItalic.active(italic);
  }

  setUnderLine() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let underline = false;
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      underline = firstCell.fontAttr.underline;
    }
    this.underLine.active(underline);
  }

  setFontStrike() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let strikethrough = false;
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      strikethrough = firstCell.fontAttr.strikethrough;
    }
    this.fontStrike.active(strikethrough);
  }

  setFontColor() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let color = 'rgb(0, 0, 0)';
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      color = firstCell.fontAttr.color;
    }
    this.fontColor.setColor(color);
    this.fontColor.fontColorContextMenu.setActiveByColor(color);
  }

  setFillColor() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let color = 'rgb(255, 255, 255)';
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      // eslint-disable-next-line prefer-destructuring
      if (firstCell.background) {
        color = firstCell.background;
      }
    }
    this.fillColor.setColor(color);
    this.fillColor.fillColorContextMenu.setActiveByColor(color);
  }

  setStatus() {
    this.setUndoStatus();
    this.setRedoStatus();
    this.setPaintFormatStatus();
    this.setFormatStatus();
    this.setFontStatus();
    this.setFontSizeStatus();
    this.setFontBold();
    this.setFontItalic();
    this.setUnderLine();
    this.setFontStrike();
    this.setFontColor();
    this.setFillColor();
  }
}

export { TopMenu };
