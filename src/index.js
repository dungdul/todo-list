import './styles.css';

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
    this.todoItems = [];
    this.archived = false;
  }

  addTodoItem(title, description, dueDate, priority) {
    const todoItem = new TodoItem(title, description, dueDate, priority, this.id);
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

  static groupTodoItems(todoItems, propertyToGroupBy) {
    const groups = [];

    function createGroup(title) {
      return {
        title,
        todoItems: [],
      }
    }

    todoItems.forEach(item => {
      // Find a group that has the same propertyToGroupBy's value as the current item
      // If found, it will add the current item to the group. If not found, it will create a new group before adding the item
      // For example, if the propertyToGroupBy is dueDate, it will find the group with title of current item's due date

      // Turn the value into a string first. Otherwise, the comparison won't work
      const value = String(item[propertyToGroupBy]);

      const groupFound = groups.find(group => group.title === value);
      if (groupFound) {
        groupFound.todoItems.push(item);
      } else {
        const newGroup = createGroup(value);
        newGroup.todoItems.push(item);
        groups.push(newGroup);
      }
    });

    return groups;
  }
}

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
  // Here we only have to toggle the class 'open'
  dropdownButton.addEventListener('click', e => {
    dropdownDiv.classList.toggle('open');
  });
}

function renderProjectPage(project) {
  const headerH1 = document.querySelector('.header > h1');
  const groupBySelect = document.querySelector('#group-by')
  const sectionContainerDiv = document.querySelector('.section-container');

  headerH1.textContent = project.title;
  sectionContainerDiv.textContent = '';
  
  // Create a section from each group
  // Each section has a h2 title and a ul that contains todo items
  const groupBy = groupBySelect.value;
  const groups = Todo.groupTodoItems(project.todoItems, groupBy)
  groups.forEach(group => {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');
    sectionContainerDiv.append(sectionDiv);

    const sectionHeaderH2 = document.createElement('h2');
    sectionHeaderH2.textContent = group.title;
    sectionDiv.append(sectionHeaderH2);

    const ul = document.createElement('ul');
    sectionDiv.append(ul);

    // Populate the ul with todo items
    group.todoItems.forEach(item => {
      const li = document.createElement('li');
      ul.append(li);

      // Checkbox
      const checkboxContainerDiv = document.createElement('div');
      checkboxContainerDiv.classList.add('checkbox-container');
      li.append(checkboxContainerDiv);
      const checkboxInput = document.createElement('input');
      checkboxInput.type = 'checkbox';
      checkboxContainerDiv.append(checkboxInput);

      // Title
      const titleP = document.createElement('p');
      titleP.textContent = item.title;
      li.append(titleP);

      // Show priority or due date, depending on value of 'group by'
      // If items are grouped by due date, show priority, and vice versa
      const rightSideP = document.createElement('p');
      rightSideP.textContent = groupBy === 'dueDate' ? `Priority: ${item.priority}` : item.dueDate;
      li.append(rightSideP);
    })
  })
}

window.todo = new Todo();
window.Todo = Todo;

window.p1 = window.todo.addProject('p1');
let t1 = p1.addTodoItem('thing 1', 'some blah', '2020-01-03', 'low');
let t2 = p1.addTodoItem('thing 2', 'tnersitnareio', '2020-01-03', 'medium');
let t3 = p1.addTodoItem('thing 3', 'arsnetio', '2025-02-01', 'low');

window.p2 = window.todo.addProject('p2');
window.p3 = window.todo.addProject('p3');
window.p3.toggleArchived();

renderSidebar();
renderProjectPage(p1);