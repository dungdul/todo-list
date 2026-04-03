import './styles.css';

class TodoItem {
  constructor(title, description, dueDate, priority) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
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
    this.todoItems = [];
  }

  addTodoItem(todoItem) {
    this.todoItems.push(todoItem);
  }

  deleteTodoItem(todoItemId) {
    this.todoItems = this.todoItems.filter(currentItem => currentItem.id !== todoItemId);
  }

  getTodoItem(todoItemId) {
    return this.todoItems.find(currentItem => currentItem.id === todoItemId);
  }
}

class Todo {
  constructor() {
    this.projects = [];
  }

  addProject(projectTitle) {
    const project = new Project(projectTitle);
    this.projects.push(project);

    // Return the project object so that it can be stored in a variable and can be accessed via console
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

    // So that it can be accessed via console
    return todoItem;
  }

  deleteTodoItemFromProject(projectId, todoItemId) {
    this.getProject(projectId).deleteTodoItem(todoItemId);
  }

  printTodoList() {
    this.projects.forEach((project, index) => {
      console.log(`Project ${index + 1} ------------------------`);
      console.log(project.title);
      project.todoItems.forEach((todoItem, index) => {
        console.log(`${index + 1}-----`);
        console.log(todoItem.title);
        console.log(todoItem.description);
        console.log(todoItem.dueDate);
        console.log(todoItem.priority);
        console.log(`Completed: ${todoItem.completed}`);
      })
    })
  }
}

window.todo = new Todo();