import todoList from './todo-controller.js';
import {format, getMonth} from 'date-fns';
import EditIcon from '../images/edit-svgrepo-com.svg';
import DeleteIcon from '../images/trash-bin-trash-svgrepo-com.svg';

function renderProjectMenu() {
  const projectContainerDiv = document.querySelector('.project-container');
  const projectSelect = document.querySelector('#task-project-id');
  
  function createMenuButton(project) {
    const button = document.createElement('button');
    button.classList.add('menu-button', 'project-button');
    button.textContent = project.title;
    // Project id will be used when the button is clicked
    button.dataset.projectId = project.id;

    return button;
  }

  projectContainerDiv.textContent = '';
  projectSelect.textContent = '';
  const noneOption = document.createElement('option');
  noneOption.textContent = 'None';
  noneOption.selected = true;
  projectSelect.append(noneOption);

  todoList.projects.forEach(project => {
    // Display each project in the sidebar as a clickable sidebar menu
    projectContainerDiv.append(createMenuButton(project));
    
    // Uptade available projects in new-task dialog
    const option = document.createElement('option');
    option.value = project.id;
    option.textContent = project.title;
    projectSelect.append(option);
  });

  
}

function renderPage(title, tasks, isProjectPage=false) {
  const pageTitleDiv = document.querySelector('.page-title');
  const pageTitleH1 = pageTitleDiv.querySelector('h1');
  const pageTitleButtonContainerDiv = pageTitleDiv.querySelector('.page-title-button-container');
  const sortBySelect = document.querySelector('#sort-by')
  const todoListContainerDiv = document.querySelector('.todo-list-container');

  pageTitleH1.textContent = title;
  pageTitleButtonContainerDiv.textContent = '';
  todoListContainerDiv.textContent = '';

  // Helper function to create an icon button, i,e. edit button or delete button
  function createIconButton(datasetProperty, datasetValue, imageSource) {
    const button = document.createElement('button');
    button.dataset[datasetProperty] = datasetValue;
    const icon = new Image();
    icon.src = imageSource;
    button.append(icon);
    const buttonContainerDiv = document.createElement('div');
    buttonContainerDiv.classList.add('icon-button-container');
    buttonContainerDiv.append(button);

    return {
      buttonContainerDiv,
      button,
    };
  }

  // If the page is a project page, add edit button and delete button for the project
  if (isProjectPage) {
    // Get project-id from the selected menu button
    const projectId = document.querySelector('.selected').dataset.projectId;

    // Edit button
    const { buttonContainerDiv: editButtonContainerDiv, button: editButton } = createIconButton('projectId', projectId, EditIcon);
    editButton.id = 'edit-project';

    // Delete button
    const { buttonContainerDiv: deleteButtonContainerDiv, button: deleteButton } = createIconButton('projectId', projectId, DeleteIcon);
    deleteButton.id = 'delete-project';

    pageTitleButtonContainerDiv.append(editButtonContainerDiv, deleteButtonContainerDiv);
  }

  const todoListUl = document.createElement('ul');
  todoListUl.classList.add('todo-list');
  todoListContainerDiv.append(todoListUl);

  // Sort todo items according to what is selected in the sort-by dropdown menu
  // Sort by due date first, then if 'priority' is selected, bring the task with high priority to the top
  tasks.sort((a, b) => a.dueDate - b.dueDate);
  if (sortBySelect.value === 'priority') {
    const groups = {
      high: [],
      medium: [],
      low: [],
    };
    tasks.forEach(task => {
      groups[task.priority].push(task);
    });
    tasks = [...groups.high, ...groups.medium, ...groups.low];
  }

  // Populate ul with todo items
  tasks.forEach(task => {
    // The task will have a colored border according to its priority
    const li = document.createElement('li');
    li.classList.add('task', `priority-${task.priority}`);
    li.dataset.taskId = task.id;
    todoListUl.append(li);

    // Checkbox
    const checkboxContainerDiv = document.createElement('div');
    checkboxContainerDiv.classList.add('checkbox-container');
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.dataset.taskId = task.id;
    checkboxInput.classList.add('complete-status-checkbox');
    checkboxInput.checked = task.completed;
    checkboxContainerDiv.append(checkboxInput);

    // Text box. This includes title, description, and due date
    const taskTextDiv = document.createElement('div');
    taskTextDiv.classList.add('task-text');

    // Title will be preceded by a colored border according to its priority
    const titleH2 = document.createElement('h2');
    titleH2.textContent = task.title;

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('description');
    descriptionP.textContent = task.description;

    // Due date and project will go into the same line, so we need a flexbox container
    const dueDateProjectDiv = document.createElement('div');
    dueDateProjectDiv.classList.add('due-date-project-container');
    const dueDateP = document.createElement('p');
    dueDateP.textContent = format(task.dueDate, 'd MMM yyyy');
    dueDateProjectDiv.append(dueDateP);

    taskTextDiv.append(titleH2, descriptionP, dueDateProjectDiv);

    // Append a project which the task is from if the page is not a project page
    if (!isProjectPage) {
      const projectP = document.createElement('p');
      if (task.projectId) {
        projectP.textContent = todoList.getProject(task.projectId).title;
        dueDateProjectDiv.append(projectP);
      }
    }

    // Delete button
    const { buttonContainerDiv, button } = createIconButton('taskId', task.id, DeleteIcon);
    button.classList.add('delete-task-button');
 
    li.append(checkboxContainerDiv, taskTextDiv, buttonContainerDiv)
  });
}


export {renderProjectMenu, renderPage}