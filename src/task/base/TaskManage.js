class TaskManage {

  constructor() {
    this.sleepTasks = [];
    this.activeTasks = [];
  }

  removeTask(task) {
    task.destroy();
    this.sleepTasks = this.sleepTasks.filter(item => item !== task);
    this.activeTasks = this.activeTasks.filter(item => item !== task);
    return this;
  }

  registerTask(task) {
    let index;
    task.execute = new Proxy(task.execute, {
      apply: (target, that, argumentsList) => {
        this.sleepTasks.splice(index, 1);
        this.activeTasks.push(task);
        index = this.activeTasks.length;
        return target.apply(that, argumentsList)
          .then((result) => {
            this.activeTasks.splice(index, 1);
            this.sleepTasks.push(task);
            index = this.sleepTasks.length;
            return result;
          });
      },
    });
    this.sleepTasks.push(task);
    index = this.sleepTasks.length;
    return this;
  }

}

const taskManage = new TaskManage();

export {
  taskManage as TaskManage,
};
