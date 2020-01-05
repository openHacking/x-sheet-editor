/* global document */

import { EventBind } from '../../utils/EventBind';
import { Constant } from '../../utils/Constant';
import { Utils } from '../../utils/Utils';
import { ScreenSelector } from './selector/ScreenSelector';

class MousePoint {
  constructor(table) {
    this.table = table;
  }

  setTableMousePoint(e) {
    const { table } = this;
    const { x, y } = table.computeEventXy(e);
    const { ri, ci } = table.getRiCiByXy(x, y);
    if (ri === -1) {
      table.css('cursor', 's-resize');
    } else if (ci === -1) {
      table.css('cursor', 'e-resize');
    } else {
      table.css('cursor', 'cell');
    }
  }

  cleanTableMousePoint() {
    const { table } = this;
    table.css('cursor', 'inherit');
  }

  bind() {
    const { table } = this;
    const { xReSizer, yReSizer, screen } = table;
    let moveOff = false;
    // table
    EventBind.bind(table, Constant.EVENT_TYPE.MOUSE_MOVE, (e) => {
      if (moveOff) return;
      this.setTableMousePoint(e);
    });
    EventBind.bind(table, Constant.EVENT_TYPE.MOUSE_DOWN, (e) => {
      const { x, y } = table.computeEventXy(e);
      const { ri, ci } = table.getRiCiByXy(x, y);
      if (ri !== -1 && ci !== -1) {
        moveOff = true;
        EventBind.mouseMoveUp(document, () => {}, (e) => {
          moveOff = false;
          this.setTableMousePoint(e);
        });
      }
    });
    // reSizer
    EventBind.bind(xReSizer, Constant.EVENT_TYPE.MOUSE_DOWN, (e) => {
      moveOff = true;
      this.cleanTableMousePoint();
      Utils.setMousePointColReSize();
      EventBind.mouseMoveUp(document, () => {}, (e) => {
        moveOff = false;
        this.setTableMousePoint(e);
        Utils.setMousePoint();
      });
      e.stopPropagation();
      e.preventDefault();
    });
    EventBind.bind(yReSizer, Constant.EVENT_TYPE.MOUSE_DOWN, (e) => {
      moveOff = true;
      this.cleanTableMousePoint();
      Utils.setMousePointRowReSize();
      EventBind.mouseMoveUp(document, () => {}, (e) => {
        moveOff = false;
        this.setTableMousePoint(e);
        Utils.setMousePoint();
      });
      e.stopPropagation();
      e.preventDefault();
    });
    // selector
    const selector = screen.findByClass(ScreenSelector);
    if (selector) {
      EventBind.bind([
        selector.lt.cornerEl,
        selector.t.cornerEl,
        selector.l.cornerEl,
        selector.br.cornerEl,
      ], Constant.EVENT_TYPE.MOUSE_DOWN, (e1) => {
        moveOff = true;
        this.cleanTableMousePoint();
        Utils.setMousePointCrossHair();
        // console.log('auto fill');
        EventBind.mouseMoveUp(document, () => {}, (e) => {
          moveOff = false;
          this.setTableMousePoint(e);
          Utils.setMousePoint();
        });
        e1.stopPropagation();
        e1.preventDefault();
      });
    }
  }

  init() {
    this.bind();
  }
}

export { MousePoint };
