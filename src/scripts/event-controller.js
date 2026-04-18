import todoList from './todo-controller.js';
import { renderProjectMenu, renderPage } from "./display-controller.js";

// Elements related to task dialog
const newTaskButton = document.querySelector('#new-task');
const taskDialog = document.querySelector('#task-dialog');
const taskIdInput = taskDialog.querySelector('#task-id');
const taskTitleInput = taskDialog.querySelector('#task-title');
const taskDescriptionInput = taskDialog.querySelector('#task-description');
const taskDateInput = taskDialog.querySelector('#task-date');
const taskPriorityInput = taskDialog.querySelector('#task-priority');
const taskProjectIdInput = taskDialog.querySelector('#task-project-id');
const taskDialogCancelButton = taskDialog.querySelector('.cancel-button');
const taskDialogConfirmButton = taskDialog.querySelector('.confirm-button');

// Top menu buttons
const homebutton = document.querySelector('#home');
const todayButton = document.querySelector('#today');
const upcomingButton = document.querySelector('#upcoming');
const overdueButton = document.querySelector('#overdue');
const completedButton = document.querySelector('#completed');
const sortBySelect = document.querySelector('#sort-by');

// Elements related to project dialog
const newProjectButton = document.querySelector('#new-project');
const projectDialog = document.querySelector('#project-dialog');
const projectIdInput = projectDialog.querySelector('#project-id');
const projectTitleInput = projectDialog.querySelector('#project-title');
const projectDialogCancelButton = projectDialog.querySelector('.cancel-button');
const projectDialogConfirmButton = projectDialog.querySelector('.confirm-button');

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

// Helper function to clear all input fields in the task dialog
function clearTaskInputFields() {
  taskIdInput.value = null;
  taskTitleInput.value = null;
  taskDescriptionInput.value = null;
  taskDateInput.value = null;
  taskPriorityInput.selectedIndex = 0;
  taskProjectIdInput.selectedIndex = 0;
}

function clearProjectInputFields() {
  projectIdInput.value = null;
  projectTitleInput.value = null;
}

// This add event listeners to elements that don't change
function addEventListenersToStaticElements() {
  // New task button will clear task-id input field so that when the form is submitted, we know it is a new task
  newTaskButton.addEventListener('click', e => {
    taskIdInput.value = null;
  })

  // Task dialog's cancel button will clear all input fields
  taskDialogCancelButton.addEventListener('click', e => {
    clearTaskInputFields();
  })

  // Whether user add a new task or edit existing task, the new task dialog will be opened
  // Pressing the confirm button will add or update the task
  taskDialogConfirmButton.addEventListener('click', e => {
    e.preventDefault();

    // Get all input data
    const id = taskIdInput.value;
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const date = taskDateInput.value;
    const priority = taskPriorityInput.value;
    let projectId = taskProjectIdInput.value;
    projectId = projectId || null;

    // Add a new task or modify existing task based on whether task-id is specified or not
    if (id) {
      todoList.getTask(id).updateValues(title, description, date, priority, projectId);
    } else {
      todoList.addTask(title, description, date, priority, projectId);
    }

    clearTaskInputFields();
    taskDialog.close();
    reRenderPage();
  });

  // Home page will show all uncompleted todo items
  homebutton.addEventListener('click', e => {
    selectButton(homebutton);
    renderPage('All uncompleted Tasks', todoList.getUncompletedTasks());
  });

  // Today page will show that is due today
  todayButton.addEventListener('click', e => {
    selectButton(todayButton);
    renderPage('Tasks Due Today', todoList.getTodayTasks());
  });

  // Upcoming page shows upcoming uncompletd todo items
  upcomingButton.addEventListener('click', e => {
    selectButton(upcomingButton);
    renderPage('Upcoming', todoList.getUpcomingTasks());
  });

  overdueButton.addEventListener('click', e => {
    selectButton(overdueButton);
    renderPage('Overdue Tasks', todoList.getOverdueTasks());
  });

  completedButton.addEventListener('click', e => {
    selectButton(completedButton);
    renderPage('Completed Tasks', todoList.getCompletedTasks());
  });

  // New-project button will clear the hidden project-id input field, so that when the form is submetted we know the user is adding a new project
  newProjectButton.addEventListener('click', e => {
    projectIdInput.value = null;
  });

  projectDialogCancelButton.addEventListener('click', e => {
    clearProjectInputFields();
  })

  projectDialogConfirmButton.addEventListener('click', e => {
    e.preventDefault();
    
    // Get values
    let id = projectIdInput.value;
    const title = projectTitleInput.value;

    // If id is available, user is editting an existing project, otherwise, user is adding a new project
    if (id) {
      todoList.getProject(id).updateValues(title);
    } else {
      // Get the id so that it can be use later to select the project menu button
      id = todoList.addProject(title).id;
    }

    clearProjectInputFields();
    projectDialog.close();
    renderProjectMenu();
    // (Re)select the project button
    // RenderProjectMenu() causes 'selected' class to disappear, resulting in reRenderPage() not working since there is no selected button to click
    const projectButton = document.querySelector(`[data-project-id="${id}"]`);
    selectButton(projectButton);
    reRenderPage();
  })

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
      renderPage(project.title, tasks, true);
    })
  })
}

// This adds event listeners to edit-project and delete-project buttons
// This will be triggered when a project menu button is clicked, which triggers rendering a project page
function addEventListenersToPageTitleButtons() {
  const editButton = document.querySelector('#edit-project');
  const deleteButton = document.querySelector('#delete-project');

  editButton.addEventListener('click', e => {
    projectDialog.showModal();
    const project = todoList.getProject(editButton.dataset.projectId);

    // Put project-id in the hidden input, so that projectDialogConfirmButton's event handler knows that user is editting an existing project
    projectIdInput.value = project.id;
    projectTitleInput.value = project.title;
  })

  function handleClickConfirmButton(e) {
    todoList.deleteProject(e.target.dataset.projectId);
    deleteDialog.close();
    renderProjectMenu();
    homebutton.click();
  }

  deleteButton.addEventListener('click', e => {
    deleteDialog.showModal();
    deleteDialogHeader.textContent = `Delete project "${todoList.getProject(deleteButton.dataset.projectId).title}"?`;

    // Pass on project-id to the confirm button so that handleClickConfirmButton knows which project to delete
    deleteDialogConfirmButton.dataset.projectId = deleteButton.dataset.projectId;
    deleteDialogConfirmButton.addEventListener('click', handleClickConfirmButton);

    // Delete the event-listener from the confirm button if user click cancel
    deleteDialogCancelButton.addEventListener('click', e => {
      deleteDialogConfirmButton.removeEventListener('click', handleClickConfirmButton);
    });
  })
}

function addEventListenersToTasks() {
  const taskLis = document.querySelectorAll('.task');
  const checkboxes = document.querySelectorAll('.complete-status-checkbox');
  const deleteButtons = document.querySelectorAll('.delete-task-button');

  // When a task is clicked, task dialog will open, letting user edit the task
  taskLis.forEach(taskLi => {
    taskLi.addEventListener('click', e => {
      taskDialog.showModal();
      const task = todoList.getTask(taskLi.dataset.taskId);

      // Put task-id in the hidden input, so that taskDialogConfirmButton's event handler knows that user is editting an existing task
      taskIdInput.value = task.id;

      // Populate input fields
      taskTitleInput.value = task.title;
      taskDescriptionInput.value = task.description;
      taskDateInput.value = task.dueDate.toISOString().substring(0, 10);
      taskPriorityInput.value = task.priority;
      taskProjectIdInput.value = task.projectId;
    })
  })

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', e => {
      todoList.getTask(checkbox.dataset.taskId).toggleCompleted();
      e.stopPropagation();
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

      e.stopPropagation();
    });
  });
}

export {
  addEventListenersToStaticElements,
  addEventListenersToProjectMenu,
  addEventListenersToPageTitleButtons,
  addEventListenersToTasks,
};