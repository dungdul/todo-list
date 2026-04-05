import './styles.css';
import {Todo} from './classes.js';

window.todo = new Todo();
window.Todo = Todo;

window.p1 = window.todo.addProject('p1');
let t1 = p1.addTodoItem('thing 1', 'some blah', '2020-01-03', 'low');
let t2 = p1.addTodoItem('thing 2', 'tnersitnareio', '2020-01-03', 'medium');
let t3 = p1.addTodoItem('thing 3', 'arsnetio', '2025-02-01', 'low');

window.p2 = window.todo.addProject('p2');
window.p3 = window.todo.addProject('p3');
window.p3.toggleArchived();

let t21 = p2.addTodoItem('this is active', 'ntrseaistoreia', '2020-09-09', 'high');
let t31 = p3.addTodoItem('this is archived', 'luy;f3pwfpluy', '2018-02-02', 'low');

function renderSidebar() {
  const projectContainerDiv = document.querySelector('.project-container');
  const dropdownMenuDiv = document.querySelector('.dropdown-menu');
  
  function createMenuButton(project) {
    const button = document.createElement('button');
    button.classList.add('menu-button', 'project-button');
    button.textContent = project.title;
    // Project id will be used to get the project when user click then button
    button.dataset.projectId = project.id;

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
}

function addEventListenersToSidebar() {
  const upcomingButton = document.querySelector('#upcoming');
  const dropdownButton = document.querySelector('.dropdown-button');
  const dropdownDiv = document.querySelector('.dropdown');
  const projectButtons = document.querySelectorAll('.project-button');

  function selectButton(buttonToSelect) {
    // Clear 'selected' class from every button first
    [upcomingButton, dropdownButton, ...projectButtons].forEach(button => {
      button.classList.remove('selected');
    })

    // Add 'selected' class to the selected button
    buttonToSelect.classList.add('selected');
  }

  // Upcoming button will show todo items from every project that is not archived
  upcomingButton.addEventListener('click', e => {
    let allTodoItems = [];
    todo.getUnarchivedProjects().forEach(project => {
      allTodoItems = allTodoItems.concat(project.todoItems);
    });
    selectButton(upcomingButton);
    renderPage('Upcoming', allTodoItems);
  })

  // Dropdown button
  // Logics related to dropdown menu are implemented in css
  // Here we only have to toggle the class 'open'
  dropdownButton.addEventListener('click', e => {
    dropdownDiv.classList.toggle('open');
  });

  // Individual project button will show todo items from that project
  projectButtons.forEach(button => {
    button.addEventListener('click', e => {
      const project = todo.getProject(button.dataset.projectId);
      selectButton(button);
      renderPage(project.title, project.todoItems);
    })
  })
}

function renderPage(title, todoItems) {
  const headerH1 = document.querySelector('.header > h1');
  const groupBySelect = document.querySelector('#group-by')
  const sectionContainerDiv = document.querySelector('.section-container');

  headerH1.textContent = title;
  sectionContainerDiv.textContent = '';

  // Group todo items then create a section for each group
  // Each section has a h2 title and a ul that contains todo items
  const groups = Todo.groupTodoItems(todoItems, groupBySelect.value);

  function createSection(group) {
    const sectionDiv = document.createElement('div');
    sectionDiv.classList.add('section');

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
      rightSideP.textContent = groupBySelect.value === 'dueDate' ? `Priority: ${item.priority}` : item.dueDate;
      li.append(rightSideP);
    });

    return sectionDiv;
  }

  groups.forEach(group => {
    sectionContainerDiv.append(createSection(group));
  });
}

renderSidebar();
addEventListenersToSidebar();
renderPage(p1.title, p1.todoItems);