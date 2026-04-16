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
    checkboxInput.dataset.todoItemId = item.id;
    checkboxInput.classList.add('complete-status-checkbox');
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
    deleteButton.classList.add('delete-todo-button');
    deleteButton.dataset.todoItemId = item.id;
    const trashBinImage = new Image();
    trashBinImage.src = TrashBin;
    deleteButton.append(trashBinImage);
    deleteButtonContainerDiv.append(deleteButton);
 
    li.append(checkboxContainerDiv, todoItemTextDiv, deleteButtonContainerDiv)
  });
}


export {renderSidebar, renderPage}