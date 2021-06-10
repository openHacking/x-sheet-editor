import { BaseTask } from './base/BaseTask';
import Worker from './worker/xlsximport.worker';

class XlsxImportTask extends BaseTask {

  constructor() {
    super();
    this.worker = null;
  }

  resetTask() {
    if (this.worker) {
      this.worker.terminate();
    }
    this.worker = null;
  }

  workerFinish(event) {

  }

  async execute(file) {
    const { workerFinish } = this;
    const finish = workerFinish.bind(this);
    this.resetTask();
    this.worker = new Worker();
    this.worker.addEventListener('message', finish);
    this.worker.postMessage(file);
  }

  destroy() {
    this.resetTask();
  }

}

export {
  XlsxImportTask,
};
