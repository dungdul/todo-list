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
}

export default new TodoList();