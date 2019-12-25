/* global window, document */

import { cssPrefix } from './config';
import { h } from './lib/Element';
import { Work } from './core/Work';
import { Widget } from './lib/Widget';
import './base.less';
import './index.less';

class XSheet extends Widget {
  constructor(selectors, options = {
    tableConfig: {},
    sheetConfig: {},
    workConfig: {},
    switchConfig: {},
    sheetData: [],
  }) {
    super(`${cssPrefix}`);
    let root = selectors;
    if (typeof selectors === 'string') {
      root = document.querySelector(selectors);
    }
    root = h(root);
    root.children(this);
    this.work = new Work();
    this.children(this.work);
    this.work.init();
  }
}

if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
