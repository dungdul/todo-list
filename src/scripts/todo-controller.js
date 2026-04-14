class TodoItem {
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
}

class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
  }
}

class TodoList {
  constructor() {
    this.todoItems = [];
    this.projects = [];
  }

  addProject(projectTitle) {
    const project = new Project(projectTitle);
    this.projects.push(project);
    return project;
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter(item => item.id !== projectId);
    this.todoItems = this.todoItems.filter(item => item.projectId !== projectId);
  }

  addTodoItem(title, description, dueDate, priority, projectId=null) {
    const todoItem = new TodoItem(title, description, dueDate, priority, projectId);
    this.todoItems.push(todoItem);
    return todoItem;
  }

  deleteTodoItem(todoItemId) {
    this.todoItems = this.todoItems.filter(currentItem => currentItem.id !== todoItemId);
  }

  getProject(projectId) {
    return this.projects.find(project => project.id === projectId);
  }

  getTodoItemsFromProject(projectId) {
    return this.todoItems.filter(item => item.projectId === projectId);
  }
}

export default new TodoList();