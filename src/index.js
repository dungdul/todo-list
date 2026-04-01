import './styles.css';

class TodoItem {
  constructor(title, description, dueDate, priority) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
  }
}

class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.todoItems = [];
  }

  addTodoItem(todoItem) {
    this.todoItems.push(todoItem);
  }

  deleteTodoItem(todoItemId) {
    this.todoItems = this.todoItems.filter(currentItem => currentItem.id !== todoItemId);
  }
}

class Todo {
  constructor() {
    this.projects = [];
  }

  addProject(projectTitle) {
    const project = new Project(projectTitle);
    this.projects.push(project);
    return project;
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter(currentProject => currentProject.id !== projectId);
  }

  getProject(projectId) {
    return this.projects.find(currentProject => currentProject.id === projectId);
  }

  addTodoItemToProject(projectId, title, description, dueDate, priority) {
    const todoItem = new TodoItem(title, description, dueDate, priority);
    const project = this.getProject(projectId);
    project.addTodoItem(todoItem);
  }

  deleteTodoItemFromProject(projectId, todoItemId) {
    this.getProject(projectId).deleteTodoItem(todoItemId);
  }

  printTodoList() {
    this.projects.forEach((project, index) => {
      console.log(`${index + 1}------------------------`);
      console.log(project.title);
      project.todoItems.forEach((todoItem, index) => {
        console.log(`${index + 1}-----`);
        console.log(todoItem.title);
        console.log(todoItem.description);
        console.log(todoItem.dueDate);
        console.log(todoItem.priority);
      })
    })
  }
}

window.todo = new Todo();