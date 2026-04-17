import todoList from './todo-controller.js';
import { renderProjectMenu, renderPage } from "./display-controller.js";

// Elements related to task dialog
const newTaskButton = document.querySelector('#new-task');
const taskDialog = document.querySelector('#task-dialog');
const taskDialogConfirmButton = taskDialog.querySelector('.confirm-button');

// Top menu buttons
const homebutton = document.querySelector('#home');
const todayButton = document.querySelector('#today');
const upcomingButton = document.querySelector('#upcoming');
const overdueButton = document.querySelector('#overdue');
const completedButton = document.querySelector('#completed');
const sortBySelect = document.querySelector('#sort-by');

// Elements related to delete confirmation dialog
const deleteDialog = document.querySelector('#delete-confirmation-dialog');
const deleteDialogHeader = deleteDialog.querySelector('.dialog-header');
const deleteDialogCancelButton = deleteDialog.querySelector('.cancel-button');
const deleteDialogConfirmButton = deleteDialog.querySelector('.confirm-button');

// Helper function to 'select' a button when user clicks on it
function selectButton(buttonToSelect) {
  const menuButtons = document.querySelectorAll('.menu-button');

  // Clear 'selected' class from every button first
  menuButtons.forEach(button => {
    button.classList.remove('selected');
  })

  // Add 'selected' class to the selected button
  buttonToSelect.classList.add('selected');
}

// Helper function to clicked 'selected' button to trigger page rendering
function reRenderPage() {
  document.querySelector('.selected').click();
}

// This add event listeners to elements that don't change
function addEventListenersToStaticElements() {
  // New task button will clear task-id input field so that when the form is submitted, we know it is a new task
  newTaskButton.addEventListener('click', e => {
    document.querySelector('#task-id').value = null;
  })

  // Whether user add a new task or edit existing task, the new task dialog will be opened
  // Pressing the confirm button will add or update the task
  taskDialogConfirmButton.addEventListener('click', e => {
    e.preventDefault();

    // Get all input data
    const id = document.querySelector('#task-id').value;
    const title = document.querySelector('#task-title').value;
    const description = document.querySelector('#task-description').value;
    const date = document.querySelector('#task-date').value;
    const priority = document.querySelector('#task-priority').value;
    let projectId = document.querySelector('#task-project-id').value;
    projectId = projectId || null;

    // Add a new task or modify existing task based on whether task-id is specified or not
    if (id) {
      todoList.getTask(id).updateValues(title, description, date, priority, projectId);
    } else {
      todoList.addTask(title, description, date, priority, projectId);
    }

    taskDialog.close();
    reRenderPage();
  })

  // Home page will show all uncompleted todo items
  homebutton.addEventListener('click', e => {
    selectButton(homebutton);
    renderPage('All uncompleted Tasks', todoList.getUncompletedTasks(), true);
    addEventListenersToTasks();
  });

  // Today page will show that is due today
  todayButton.addEventListener('click', e => {
    selectButton(todayButton);
    renderPage('Tasks Due Today', todoList.getTodayTasks(), true);
    addEventListenersToTasks();
  });

  // Upcoming page shows upcoming uncompletd todo items
  upcomingButton.addEventListener('click', e => {
    selectButton(upcomingButton);
    renderPage('Upcoming', todoList.getUpcomingTasks(), true);
    addEventListenersToTasks();
  });

  overdueButton.addEventListener('click', e => {
    selectButton(overdueButton);
    renderPage('Overdue Tasks', todoList.getOverdueTasks(), true);
    addEventListenersToTasks();
  });

  completedButton.addEventListener('click', e => {
    selectButton(completedButton);
    renderPage('Completed Tasks', todoList.getCompletedTasks(), true);
    addEventListenersToTasks();
  });

  sortBySelect.addEventListener('click', e => {
    reRenderPage();
  });
}

function addEventListenersToProjectMenu() {
  const projectButtons = document.querySelectorAll('.project-button');
  
  // Individual project button will show todo items from that project
  projectButtons.forEach(button => {
    button.addEventListener('click', e => {
      selectButton(button);
      const project = todoList.getProject(button.dataset.projectId);
      const tasks = todoList.getTasksFromProject(button.dataset.projectId);
      renderPage(project.title, tasks, false);
      addEventListenersToTasks();
    })
  })
}

function addEventListenersToTasks() {
  const checkboxes = document.querySelectorAll('.complete-status-checkbox');
  const deleteButtons = document.querySelectorAll('.delete-todo-button');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', e => {
      todoList.getTask(checkbox.dataset.taskId).toggleCompleted();
      reRenderPage();
    })
  });

  // Function to be called when user click 'confirm' in delete confirmation dialog
  function handleClickConfirmButton(e) {
    todoList.deleteTask(e.target.dataset.taskId);
    deleteDialog.close();
    reRenderPage();
  }

  deleteButtons.forEach(button => {
    button.addEventListener('click', e => {
      deleteDialog.showModal();
      deleteDialogHeader.textContent = `Delete task "${todoList.getTask(button.dataset.taskId).title}"?`;

      // Pass on task-id to the confirm button so that handleClickConfirmButton knows which task to delete
      deleteDialogConfirmButton.dataset.taskId = button.dataset.taskId;
      deleteDialogConfirmButton.addEventListener('click', handleClickConfirmButton);

      // Delete the event-listener from the confirm button if user click cancel
      deleteDialogCancelButton.addEventListener('click', e => {
        deleteDialogConfirmButton.removeEventListener('click', handleClickConfirmButton);
      });
    });
  });
}

export function initializeEventController() {
  addEventListenersToStaticElements();
  addEventListenersToProjectMenu();
  addEventListenersToTasks();
}