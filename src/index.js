/* global window, document */
import { cssPrefix, XSheetVersion } from './const/Constant';
import { h } from './lib/Element';
import { Work } from './core/work/Work';
import { Widget } from './lib/Widget';
import { ElPopUp } from './component/elpopup/ElPopUp';
import { DragPanel } from './component/dragpanel/DragPanel';
import { PlainUtils } from './utils/PlainUtils';
import './styles/base.less';
import './styles/index.less';

class XSheet extends Widget {

  constructor(selectors, options = {
    workConfig: {
      body: {
        sheets: [{
          tableConfig: {},
        }],
      },
    },
  }) {
    super(`${cssPrefix}`);
    let root = selectors;
    if (typeof selectors === 'string') {
      root = document.querySelector(selectors);
    }
    root = h(root);
    root.children(this);
    this.work = new Work(options);
    this.attach(this.work);
    ElPopUp.setRoot(this);
    DragPanel.setRoot(this);
  }

}

XSheet.version = XSheetVersion;

XSheet.PlainUtils = PlainUtils;

if (window) {
  window.XSheet = XSheet;
}

export { XSheet };
