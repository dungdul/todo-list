import todoList from './todo-controller.js';
import {format} from 'date-fns';
import TrashBin from '../images/trash-bin-trash-svgrepo-com.svg';

function renderSidebar() {
  const projectContainerDiv = document.querySelector('.project-container');
  
  function createMenuButton(project) {
    const button = document.createElement('button');
    button.classList.add('menu-button', 'project-button');
    button.textContent = project.title;
    // Project id will be used when the button is clicked
    button.dataset.projectId = project.id;

    return button;
  }

  // Display each project in the sidebar as a clickable sidebar menu
  todoList.projects.forEach(project => {
    projectContainerDiv.append(createMenuButton(project));
  });
}

function renderPage(title, todoItems, showProject=false) {
  const headerH1 = document.querySelector('.header > h1');
  const sortBySelect = document.querySelector('#sort-by')
  const todoListContainerDiv = document.querySelector('.todo-list-container');

  headerH1.textContent = title;
  todoListContainerDiv.textContent = '';

  const todoListUl = document.createElement('ul');
  todoListUl.classList.add('todo-list');
  todoListContainerDiv.append(todoListUl);

  // Populate ul with todo items
  todoItems.forEach(item => {
    // The item will have a colored border according to its priority
    const li = document.createElement('li');
    li.classList.add('todo-item', `priority-${item.priority}`);
    todoListUl.append(li);

    // Checkbox
    const checkboxContainerDiv = document.createElement('div');
    checkboxContainerDiv.classList.add('checkbox-container');
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxContainerDiv.append(checkboxInput);

    // Text box. This includes title, description, and due date
    const todoItemTextDiv = document.createElement('div');
    todoItemTextDiv.classList.add('todo-item-text');

    // Title will be preceded by a colored border according to its priority
    const titleH2 = document.createElement('h2');
    titleH2.textContent = item.title;

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('description');
    descriptionP.textContent = item.description;

    // Due date and project will go into the same line, so we need a flexbox container
    const dueDateProjectDiv = document.createElement('div');
    dueDateProjectDiv.classList.add('due-date-project-container');
    const dueDateP = document.createElement('p');
    dueDateP.textContent = format(item.dueDate, 'd MMM yyyy');
    dueDateProjectDiv.append(dueDateP);

    todoItemTextDiv.append(titleH2, descriptionP, dueDateProjectDiv);

    // Append a project which the item is from if showProject=true
    if (showProject) {
      const projectP = document.createElement('p');
      if (item.projectId) {
        projectP.textContent = todoList.getProject(item.projectId).title;
        dueDateProjectDiv.append(projectP);
      }
    }

    // Delete button
    const deleteButtonContainerDiv = document.createElement('div');
    deleteButtonContainerDiv.classList.add('delete-button-container');
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    const trashBinImage = new Image();
    trashBinImage.src = TrashBin;
    deleteButton.append(trashBinImage);
    deleteButtonContainerDiv.append(deleteButton);
 
    li.append(checkboxContainerDiv, todoItemTextDiv, deleteButtonContainerDiv)
  });
}

function addEventListenersToSidebar() {
  const topMenuButtons = document.querySelectorAll('.top-menu > button');
  const homebutton = document.querySelector('#home');
  const todayButton = document.querySelector('#today');
  const upcomingButton = document.querySelector('#upcoming');
  const overdueButton = document.querySelector('#overdue');
  const completedButton = document.querySelector('#completed');
  const projectButtons = document.querySelectorAll('.project-button');

  function selectButton(buttonToSelect) {
    // Clear 'selected' class from every button first
    [...topMenuButtons, ...projectButtons].forEach(button => {
      button.classList.remove('selected');
    })

    // Add 'selected' class to the selected button
    buttonToSelect.classList.add('selected');
  }

  // Home page will show all todo items
  homebutton.addEventListener('click', e => {
    selectButton(homebutton);
    renderPage('All Tasks', todoList.todoItems, true);
  });

  // Today page will show that is due today
  todayButton.addEventListener('click', e => {
    selectButton(todayButton);
    const todoItemsToday = todoList.todoItems.filter(item => item.dueDate.toDateString() === new Date().toDateString());
    renderPage('Tasks Due Today', todoItemsToday, false);
  });

  // Upcoming button will show todo items
  upcomingButton.addEventListener('click', e => {
    let allTodoItems = [];
    todoList.getUnarchivedProjects().forEach(project => {
      allTodoItems = allTodoItems.concat(project.todoItems);
    });
    selectButton(upcomingButton);
    renderPage('Upcoming', allTodoItems);
  })

  // Individual project button will show todo items from that project
  projectButtons.forEach(button => {
    button.addEventListener('click', e => {
      selectButton(button);
      const project = todoList.getProject(button.dataset.projectId);
      const todoItems = todoList.getTodoItemsFromProject(button.dataset.projectId);
      renderPage(project.title, todoItems, false);
    })
  })
}

export function initializeDisplay() {
  renderSidebar();
  addEventListenersToSidebar();
  document.querySelector('#home').click();
}