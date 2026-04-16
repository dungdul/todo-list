import todoList from './todo-controller.js';
import {format, getMonth} from 'date-fns';
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

  // Sort todo items according to what is selected in the sort-by dropdown menu
  // Sort by due date first, then if 'priority' is selected, bring the item with high priority to the top
  todoItems.sort((a, b) => a.dueDate - b.dueDate);
  if (sortBySelect.value === 'priority') {
    const groups = {
      high: [],
      medium: [],
      low: [],
    };
    todoItems.forEach(item => {
      groups[item.priority].push(item);
    });
    todoItems = [...groups.high, ...groups.medium, ...groups.low];
  }

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
    checkboxInput.checked = item.completed;
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

function selectButton(buttonToSelect) {
  const menuButtons = document.querySelectorAll('.menu-button');

  // Clear 'selected' class from every button first
  menuButtons.forEach(button => {
    button.classList.remove('selected');
  })

  // Add 'selected' class to the selected button
  buttonToSelect.classList.add('selected');
}

// This add event listeners to elements that don't change, which are top menu buttons and sort-by dropdown
function addEventListenersToStaticElements() {
  const homebutton = document.querySelector('#home');
  const todayButton = document.querySelector('#today');
  const upcomingButton = document.querySelector('#upcoming');
  const overdueButton = document.querySelector('#overdue');
  const completedButton = document.querySelector('#completed');
  const sortBySelect = document.querySelector('#sort-by');


  // Function to turn a date into 00:00 so that the date can be compared with another date
  function normalizeDate(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // Home page will show all uncompleted todo items
  homebutton.addEventListener('click', e => {
    selectButton(homebutton);
    const todoItemsUncompleted = todoList.todoItems.filter(item => !item.completed);
    renderPage('All uncompleted Tasks', todoItemsUncompleted, true);
  });

  // Today page will show that is due today
  todayButton.addEventListener('click', e => {
    selectButton(todayButton);
    const todoItemsToday = todoList.todoItems.filter(item => item.dueDate.toDateString() === new Date().toDateString());
    renderPage('Tasks Due Today', todoItemsToday, true);
  });

  // Upcoming page shows upcoming uncompletd todo items
  upcomingButton.addEventListener('click', e => {
    selectButton(upcomingButton);
    const todoItemsUpcoming = todoList.todoItems.filter(item => normalizeDate(item.dueDate) >= normalizeDate(new Date()) && !item.completed);
    renderPage('Upcoming', todoItemsUpcoming, true);
  })

  overdueButton.addEventListener('click', e => {
    selectButton(overdueButton);
    const todoItemsOverdue = todoList.todoItems.filter(item => normalizeDate(item.dueDate) < normalizeDate(new Date()) && !item.completed);
    renderPage('Overdue Tasks', todoItemsOverdue, true)
  })

  completedButton.addEventListener('click', e => {
    selectButton(completedButton);
    const todoItemsCompleted = todoList.todoItems.filter(item => item.completed);
    renderPage('Completed Tasks', todoItemsCompleted, true)
  })

  sortBySelect.addEventListener('click', e => {
    // Get selected menu button. Then click that button to trigger rendering page
    document.querySelector('.selected').click();
  })
}

function addEventListenersToProjectMenu() {
  const projectButtons = document.querySelectorAll('.project-button');
  
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
  addEventListenersToStaticElements();
  addEventListenersToProjectMenu();
  document.querySelector('#home').click();
}