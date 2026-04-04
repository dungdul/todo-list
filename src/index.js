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
    this.archived = false;
  }

  addTodoItem(title, description, dueDate, priority) {
    const todoItem = new TodoItem(title, description, dueDate, priority);
    this.todoItems.push(todoItem);

    // Return the todo item so that it can ge stored in a variable and easily accessed when using console
    return todoItem;
  }

  deleteTodoItem(todoItemId) {
    this.todoItems = this.todoItems.filter(currentItem => currentItem.id !== todoItemId);
  }

  getTodoItem(todoItemId) {
    return this.todoItems.find(currentItem => currentItem.id === todoItemId);
  }

  toggleArchived() {
    this.archived = !this.archived;
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

  getUnarchivedProjects() {
    return this.projects.filter(project => project.archived === false);
  }

  getArchivedProjects() {
    return this.projects.filter(project => project.archived === true);
  }

  printTodoList() {
    this.projects.forEach((project, index) => {
      console.log(`Project ${index + 1}: ${project.title}`);
      console.log(`  ID: ${project.id}`);
      console.log(`  Archived: ${project.archived}`);
      project.todoItems.forEach((todoItem, index) => {
        console.log(`  Item ${index + 1}: ${todoItem.title}`);
        console.log(`    ID: ${todoItem.id}`);
        console.log(`    ${todoItem.description}`);
        console.log(`    ${todoItem.dueDate}`);
        console.log(`    ${todoItem.priority}`);
        console.log(`    Completed: ${todoItem.completed}`);
      })
    })
  }
}

const todo = new Todo();
todo.addProject('test 1');
todo.addProject('test 3');
const p2 = todo.addProject('test 2');
p2.toggleArchived();
const p4 = todo.addProject('test 4');
p4.toggleArchived();

function renderSidebar() {
  const projectContainerDiv = document.querySelector('.project-container');
  const dropdownDiv = document.querySelector('.dropdown');
  const dropdownButton = document.querySelector('.dropdown-button');
  const dropdownMenuDiv = document.querySelector('.dropdown-menu');
  
  function createMenuButton(project) {
    const button = document.createElement('button');
    button.classList.add('menu-button');
    button.textContent = project.title;
    button.onclick = function() {renderProjectPage(project)};

    return button;
  }

  // Display each project in the sidebar as a clickable sidebar menu
  // A project will go into a dropdown menu if it has been archived
  todo.projects.forEach(project => {
    const menuButton = createMenuButton(project);
    if (!project.archived) {
      projectContainerDiv.append(menuButton);
    } else {
      dropdownMenuDiv.append(menuButton);
    }
  });

  // Logics related to dropdown menu are implemented in css
  // Here we just toggle the class 'open'
  dropdownButton.addEventListener('click', e => {
    dropdownDiv.classList.toggle('open');
  });
}

function renderProjectPage(project) {
  console.log('this works');
}

renderSidebar();