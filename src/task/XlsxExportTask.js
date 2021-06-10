import { BaseTask } from './base/BaseTask';
import Worker from './worker/xlsxexport.worker';

class XlsxExportTask extends BaseTask {

  constructor() {
    super();
    this.worker = null;
  }

  async execute() {

  }

  destroy() {

  }

}

export {
  XlsxExportTask,
};
