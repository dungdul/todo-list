import todoList from './todo-controller.js';
import { renderSidebar, renderPage } from "./display-controller.js";

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
    addEventListenersToTodoItems();
  });

  // Today page will show that is due today
  todayButton.addEventListener('click', e => {
    selectButton(todayButton);
    const todoItemsToday = todoList.todoItems.filter(item => item.dueDate.toDateString() === new Date().toDateString());
    renderPage('Tasks Due Today', todoItemsToday, true);
    addEventListenersToTodoItems();
  });

  // Upcoming page shows upcoming uncompletd todo items
  upcomingButton.addEventListener('click', e => {
    selectButton(upcomingButton);
    const todoItemsUpcoming = todoList.todoItems.filter(item => normalizeDate(item.dueDate) >= normalizeDate(new Date()) && !item.completed);
    renderPage('Upcoming', todoItemsUpcoming, true);
    addEventListenersToTodoItems();
  })

  overdueButton.addEventListener('click', e => {
    selectButton(overdueButton);
    const todoItemsOverdue = todoList.todoItems.filter(item => normalizeDate(item.dueDate) < normalizeDate(new Date()) && !item.completed);
    renderPage('Overdue Tasks', todoItemsOverdue, true);
    addEventListenersToTodoItems();
  })

  completedButton.addEventListener('click', e => {
    selectButton(completedButton);
    const todoItemsCompleted = todoList.todoItems.filter(item => item.completed);
    renderPage('Completed Tasks', todoItemsCompleted, true);
    addEventListenersToTodoItems();
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

function addEventListenersToTodoItems() {
  const deleteButtons = document.querySelectorAll('.delete-todo-button');

  deleteButtons.forEach(button => {
    button.addEventListener('click', e => {
      todoList.deleteTodoItem(button.dataset.todoItemId)

      // Click selected menu button to trigger page rendering
      document.querySelector('.selected').click();
    })
  })
}

export function initializeEventController() {
  addEventListenersToStaticElements();
  addEventListenersToProjectMenu();
  addEventListenersToTodoItems();
}