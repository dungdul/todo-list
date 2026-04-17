class Task {
  constructor(title, description, dueDate, priority, projectId) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.projectId = projectId;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }

  updateValues(title, description, dueDate, priority, projectId) {
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.projectId = projectId;
  }
}

class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
  }

  updateValues(title) {
    this.title = title;
  }
}

class TodoList {
  constructor() {
    this.tasks = [];
    this.projects = [];
  }

  addProject(projectTitle) {
    const project = new Project(projectTitle);
    this.projects.push(project);
    return project;
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter(task => task.id !== projectId);
    this.tasks = this.tasks.filter(task => task.projectId !== projectId);
  }

  addTask(title, description, dueDate, priority, projectId=null) {
    const task = new Task(title, description, dueDate, priority, projectId);
    this.tasks.push(task);
    return task;
  }

  deleteTask(taskId) {
    this.tasks = this.tasks.filter(currentItem => currentItem.id !== taskId);
  }

  getProject(projectId) {
    return this.projects.find(project => project.id === projectId);
  }

  getTask(taskId) {
    return this.tasks.find(task => task.id === taskId);
  }

  getTasksFromProject(projectId) {
    return this.tasks.filter(task => task.projectId === projectId);
  }

  getUncompletedTasks() {
    return this.tasks.filter(task => !task.completed);
  }

  getTodayTasks() {
    return this.tasks.filter(task => task.dueDate.toDateString() === new Date().toDateString());
  }

  getUpcomingTasks() {
    return this.tasks.filter(task => normalizeDate(task.dueDate) >= normalizeDate(new Date()) && !task.completed);
  }

  getOverdueTasks() {
    return this.tasks.filter(task => normalizeDate(task.dueDate) < normalizeDate(new Date()) && !task.completed);
  }

  getCompletedTasks() {
    return this.tasks.filter(task => task.completed);
  }
}

// Helper function normalize date into the same time of the day, so that they can be compared
function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default new TodoList();