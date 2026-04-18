import '../css/styles.css';
import todoList from './todo-controller.js';
import addDefaultTasks from './default-tasks.js';
import { renderProjectMenu } from './display-controller.js';
import { addEventListenersToStaticElements } from './event-controller.js';
import * as storage from './storage-controller.js';

if (!storage.readData()) {
  addDefaultTasks();
  storage.updateProjects(todoList.projects);
  storage.updateTasks(todoList.tasks);
}
renderProjectMenu();
addEventListenersToStaticElements();
document.querySelector('#home').click();