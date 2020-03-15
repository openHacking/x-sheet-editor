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
import { LINE_TYPE } from '../../canvas/Line';
import { Icon } from './tools/Icon';
import { ALIGN, VERTICAL_ALIGN } from '../../canvas/Font';

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
            }, true);
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
            }, true);
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
            }, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
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
            }, true);
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
            }, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
    this.border = new Border({
      contextMenu: {
        onUpdate: (borderType, color, lineType) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { screen, cells, dataSnapshot } = table;
          const screenSelector = screen.findByClass(ScreenSelector);
          const { selectorAttr } = screenSelector;
          const now = Utils.now();
          if (selectorAttr) {
            let width = 1;
            let type = LINE_TYPE.SOLID_LINE;
            switch (lineType) {
              case 'line1':
                width = 1;
                type = LINE_TYPE.SOLID_LINE;
                break;
              case 'line2':
                width = 2;
                type = LINE_TYPE.SOLID_LINE;
                break;
              case 'line3':
                width = 3;
                type = LINE_TYPE.SOLID_LINE;
                break;
              case 'line4':
                type = LINE_TYPE.DOTTED_LINE;
                break;
              case 'line5':
                type = LINE_TYPE.POINT_LINE;
                break;
              case 'line6':
                type = LINE_TYPE.DOUBLE_LINE;
                break;
              default: break;
            }
            // display
            switch (borderType) {
              case 'border1':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.display = true;
                  cell.borderAttr.top.display = true;
                  cell.borderAttr.right.display = true;
                  cell.borderAttr.bottom.display = true;
                }, true);
                break;
              case 'border2':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.bottom.display = true;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.top.display = true;
                  } else {
                    cell.borderAttr.bottom.display = true;
                    cell.borderAttr.top.display = true;
                  }
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.right.display = true;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.left.display = true;
                  } else {
                    cell.borderAttr.right.display = true;
                    cell.borderAttr.left.display = true;
                  }
                }, true);
                break;
              case 'border3':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.bottom.display = true;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.top.display = true;
                  } else {
                    cell.borderAttr.bottom.display = true;
                    cell.borderAttr.top.display = true;
                  }
                }, true);
                break;
              case 'border4':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.right.display = true;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.left.display = true;
                  } else {
                    cell.borderAttr.right.display = true;
                    cell.borderAttr.left.display = true;
                  }
                }, true);
                break;
              case 'border5':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.left.display = true;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.right.display = true;
                  }
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.top.display = true;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.bottom.display = true;
                  }
                }, true);
                break;
              case 'border6':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  if (c === selectorAttr.rect.sci) {
                    cell.borderAttr.time = now;
                    cell.borderAttr.left.display = true;
                  }
                }, true);
                break;
              case 'border7':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  if (r === selectorAttr.rect.sri) {
                    cell.borderAttr.time = now;
                    cell.borderAttr.top.display = true;
                  }
                }, true);
                break;
              case 'border8':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  if (c === selectorAttr.rect.eci) {
                    cell.borderAttr.time = now;
                    cell.borderAttr.right.display = true;
                  }
                }, true);
                break;
              case 'border9':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  if (r === selectorAttr.rect.eri) {
                    cell.borderAttr.time = now;
                    cell.borderAttr.bottom.display = true;
                  }
                }, true);
                break;
              case 'border10':
                cells.getCellInRectRange(selectorAttr.rect, (r, c) => {
                  const cell = cells.getCellOrNew(r, c);
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    const top = cells.getCellOrNew(r - 1, c);
                    top.borderAttr.time = now;
                    top.borderAttr.bottom.display = false;
                  }
                  if (selectorAttr.rect.eri === r) {
                    const bottom = cells.getCellOrNew(r + 1, c);
                    bottom.borderAttr.time = now;
                    bottom.borderAttr.top.display = false;
                  }
                  if (selectorAttr.rect.sci === c) {
                    const left = cells.getCellOrNew(r, c - 1);
                    left.borderAttr.time = now;
                    left.borderAttr.right.display = false;
                  }
                  if (selectorAttr.rect.eci === c) {
                    const right = cells.getCellOrNew(r, c + 1);
                    right.borderAttr.time = now;
                    right.borderAttr.left.display = false;
                  }
                  cell.borderAttr.left.display = false;
                  cell.borderAttr.top.display = false;
                  cell.borderAttr.right.display = false;
                  cell.borderAttr.bottom.display = false;
                }, true);
                break;
              default: break;
            }
            // color
            switch (borderType) {
              case 'border1':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.color = color;
                  cell.borderAttr.top.color = color;
                  cell.borderAttr.right.color = color;
                  cell.borderAttr.bottom.color = color;
                }, true);
                break;
              case 'border2':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.bottom.color = color;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.top.color = color;
                  } else {
                    cell.borderAttr.bottom.color = color;
                    cell.borderAttr.top.color = color;
                  }
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.right.color = color;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.left.color = color;
                  } else {
                    cell.borderAttr.right.color = color;
                    cell.borderAttr.left.color = color;
                  }
                }, true);
                break;
              case 'border3':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.bottom.color = color;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.top.color = color;
                  } else {
                    cell.borderAttr.bottom.color = color;
                    cell.borderAttr.top.color = color;
                  }
                }, true);
                break;
              case 'border4':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.right.color = color;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.left.color = color;
                  } else {
                    cell.borderAttr.right.color = color;
                    cell.borderAttr.left.color = color;
                  }
                }, true);
                break;
              case 'border5':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.left.color = color;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.right.color = color;
                  }
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.top.color = color;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.bottom.color = color;
                  }
                }, true);
                break;
              case 'border6':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.color = color;
                }, true);
                break;
              case 'border7':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.top.color = color;
                }, true);
                break;
              case 'border8':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.right.color = color;
                }, true);
                break;
              case 'border9':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.bottom.color = color;
                }, true);
                break;
              case 'border10':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.color = false;
                  cell.borderAttr.top.color = false;
                  cell.borderAttr.right.color = false;
                  cell.borderAttr.bottom.color = false;
                }, true);
                break;
              default: break;
            }
            // width
            switch (borderType) {
              case 'border1':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.width = width;
                  cell.borderAttr.top.width = width;
                  cell.borderAttr.right.width = width;
                  cell.borderAttr.bottom.width = width;
                }, true);
                break;
              case 'border2':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.bottom.width = width;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.top.width = width;
                  } else {
                    cell.borderAttr.bottom.width = width;
                    cell.borderAttr.top.width = width;
                  }
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.right.width = width;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.left.width = width;
                  } else {
                    cell.borderAttr.right.width = width;
                    cell.borderAttr.left.width = width;
                  }
                }, true);
                break;
              case 'border3':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.bottom.width = width;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.top.width = width;
                  } else {
                    cell.borderAttr.bottom.width = width;
                    cell.borderAttr.top.width = width;
                  }
                }, true);
                break;
              case 'border4':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.right.width = width;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.left.width = width;
                  } else {
                    cell.borderAttr.right.width = width;
                    cell.borderAttr.left.width = width;
                  }
                }, true);
                break;
              case 'border5':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.left.width = width;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.right.width = width;
                  }
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.top.width = width;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.bottom.width = width;
                  }
                }, true);
                break;
              case 'border6':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.width = width;
                }, true);
                break;
              case 'border7':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.top.width = width;
                }, true);
                break;
              case 'border8':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.right.width = width;
                }, true);
                break;
              case 'border9':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.bottom.width = width;
                }, true);
                break;
              case 'border10':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.width = false;
                  cell.borderAttr.top.width = false;
                  cell.borderAttr.right.width = false;
                  cell.borderAttr.bottom.width = false;
                }, true);
                break;
              default: break;
            }
            // type
            switch (borderType) {
              case 'border1':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.type = type;
                  cell.borderAttr.top.type = type;
                  cell.borderAttr.right.type = type;
                  cell.borderAttr.bottom.type = type;
                }, true);
                break;
              case 'border2':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.bottom.type = type;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.top.type = type;
                  } else {
                    cell.borderAttr.bottom.type = type;
                    cell.borderAttr.top.type = type;
                  }
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.right.type = type;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.left.type = type;
                  } else {
                    cell.borderAttr.right.type = type;
                    cell.borderAttr.left.type = type;
                  }
                }, true);
                break;
              case 'border3':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.bottom.type = type;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.top.type = type;
                  } else {
                    cell.borderAttr.bottom.type = type;
                    cell.borderAttr.top.type = type;
                  }
                }, true);
                break;
              case 'border4':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.right.type = type;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.left.type = type;
                  } else {
                    cell.borderAttr.right.type = type;
                    cell.borderAttr.left.type = type;
                  }
                }, true);
                break;
              case 'border5':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  if (selectorAttr.rect.sci === c) {
                    cell.borderAttr.left.type = type;
                  } else if (selectorAttr.rect.eci === c) {
                    cell.borderAttr.right.type = type;
                  }
                  if (selectorAttr.rect.sri === r) {
                    cell.borderAttr.top.type = type;
                  } else if (selectorAttr.rect.eri === r) {
                    cell.borderAttr.bottom.type = type;
                  }
                }, true);
                break;
              case 'border6':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.type = type;
                }, true);
                break;
              case 'border7':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.top.type = type;
                }, true);
                break;
              case 'border8':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.right.type = type;
                }, true);
                break;
              case 'border9':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.bottom.type = type;
                }, true);
                break;
              case 'border10':
                cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
                  cell.borderAttr.time = now;
                  cell.borderAttr.left.type = false;
                  cell.borderAttr.top.type = false;
                  cell.borderAttr.right.type = false;
                  cell.borderAttr.bottom.type = false;
                }, true);
                break;
              default: break;
            }
            // 快照
            dataSnapshot.snapshot();
            // render
            table.render();
          }
        },
      },
    });
    this.fontBold = new FontBold();
    this.fontItalic = new FontItalic();
    this.underLine = new UnderLine();
    this.fontStrike = new FontStrike();
    this.merge = new Merge();
    this.horizontalAlign = new HorizontalAlign({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { screen, cells, dataSnapshot } = table;
          const screenSelector = screen.findByClass(ScreenSelector);
          const { selectorAttr } = screenSelector;
          switch (type) {
            case ALIGN.left:
              this.horizontalAlign.setIcon(new Icon('align-left'));
              break;
            case ALIGN.center:
              this.horizontalAlign.setIcon(new Icon('align-center'));
              break;
            case ALIGN.right:
              this.horizontalAlign.setIcon(new Icon('align-right'));
              break;
            default: break;
          }
          if (selectorAttr) {
            cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
              cell.fontAttr.align = type;
            }, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
    this.verticalAlign = new VerticalAlign({
      contextMenu: {
        onUpdate: (type) => {
          const sheet = sheetView.getActiveSheet();
          const { table } = sheet;
          const { screen, cells, dataSnapshot } = table;
          const screenSelector = screen.findByClass(ScreenSelector);
          const { selectorAttr } = screenSelector;
          switch (type) {
            case VERTICAL_ALIGN.top:
              this.verticalAlign.setIcon(new Icon('align-top'));
              break;
            case VERTICAL_ALIGN.center:
              this.verticalAlign.setIcon(new Icon('align-middle'));
              break;
            case VERTICAL_ALIGN.bottom:
              this.verticalAlign.setIcon(new Icon('align-bottom'));
              break;
            default: break;
          }
          if (selectorAttr) {
            cells.getCellInRectRange(selectorAttr.rect, (r, c, cell) => {
              cell.fontAttr.verticalAlign = type;
            }, true);
            dataSnapshot.snapshot();
            table.render();
          }
        },
      },
    });
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
      this.setFontBoldStatus();
      this.setFontItalicStatus();
      this.setUnderLineStatus();
      this.setFontStrikeStatus();
      this.setFontColorStatus();
      this.setFillColorStatus();
      this.setHorizontalAlignStatus();
      this.setVerticalAlignStatus();
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
          }, true);
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
        }, true);
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
        }, true);
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
        }, true);
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
        }, true);
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
    EventBind.bind(this.merge, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const sheet = sheetView.getActiveSheet();
      const { table } = sheet;
      const { screen, dataSnapshot, merges } = table;
      const screenSelector = screen.findByClass(ScreenSelector);
      const { selectorAttr } = screenSelector;
      if (selectorAttr) {
        const merge = selectorAttr.rect.clone();
        const find = merges.getFirstIncludes(merge.sri, merge.sci);
        if (find !== null) {
          merges.deleteIntersects(find);
        } else if (merge.multiple()) {
          merges.add(merge);
        }
        dataSnapshot.snapshot();
        table.render();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.horizontalAlign, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { horizontalAlign } = this;
      const { horizontalContextMenu } = horizontalAlign;
      const { elPopUp } = horizontalContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (horizontalContextMenu.isOpen()) {
        horizontalContextMenu.open();
      } else {
        horizontalContextMenu.close();
      }
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(this.verticalAlign, Constant.SYSTEM_EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { verticalAlign } = this;
      const { verticalContextMenu } = verticalAlign;
      const { elPopUp } = verticalContextMenu;
      ElPopUp.closeAll([elPopUp]);
      if (verticalContextMenu.isOpen()) {
        verticalContextMenu.open();
      } else {
        verticalContextMenu.close();
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

  setFontBoldStatus() {
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

  setFontItalicStatus() {
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

  setUnderLineStatus() {
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

  setFontStrikeStatus() {
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

  setFontColorStatus() {
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

  setFillColorStatus() {
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

  setHorizontalAlignStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let icon = new Icon('align-left');
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      switch (firstCell.fontAttr.align) {
        case ALIGN.left:
          icon = new Icon('align-left');
          break;
        case ALIGN.center:
          icon = new Icon('align-center');
          break;
        case ALIGN.right:
          icon = new Icon('align-right');
          break;
        default: break;
      }
    }
    this.horizontalAlign.setIcon(icon);
  }

  setVerticalAlignStatus() {
    const { body } = this.workTop.work;
    const { sheetView } = body;
    const sheet = sheetView.getActiveSheet();
    const { table } = sheet;
    const { screen, cells } = table;
    const screenSelector = screen.findByClass(ScreenSelector);
    const { selectorAttr } = screenSelector;
    let icon = new Icon('align-middle');
    if (selectorAttr) {
      const firstCell = cells.getCellOrNew(selectorAttr.rect.sri, selectorAttr.rect.sci);
      switch (firstCell.fontAttr.verticalAlign) {
        case VERTICAL_ALIGN.top:
          icon = new Icon('align-top');
          break;
        case VERTICAL_ALIGN.center:
          icon = new Icon('align-middle');
          break;
        case VERTICAL_ALIGN.bottom:
          icon = new Icon('align-bottom');
          break;
        default: break;
      }
    }
    this.verticalAlign.setIcon(icon);
  }

  setStatus() {
    this.setUndoStatus();
    this.setRedoStatus();
    this.setPaintFormatStatus();
    this.setFormatStatus();
    this.setFontStatus();
    this.setFontSizeStatus();
    this.setFontBoldStatus();
    this.setFontItalicStatus();
    this.setUnderLineStatus();
    this.setFontStrikeStatus();
    this.setFontColorStatus();
    this.setFillColorStatus();
    this.setHorizontalAlignStatus();
    this.setVerticalAlignStatus();
  }
}

export { TopMenu };
