import '../css/styles.css';
import todoList from './todo-controller.js';
import { renderProjectMenu } from './display-controller.js';
import { addEventListenersToStaticElements } from './event-controller.js';

let p1 = todoList.addProject('Project 1');
todoList.addTask('task1', 'something', '2020-03-01', 'low', p1.id);
todoList.addTask("today's tasks", 'yahahaha', new Date(), 'medium');
todoList.addTask('old task', 'arstwfu', '2020-01-01', 'low')
todoList.addTask("urgent stuff", "anrsetinraieo", '2026-04-17', 'high', p1.id);
let completedTask = todoList.addTask('completed stuff', 'hayayaya', '2020-01-01', 'medium', p1.id);
completedTask.toggleCompleted();
let cTodayTask = todoList.addTask('completed today', 'arstneio', new Date(), 'low');
cTodayTask.toggleCompleted();

renderProjectMenu();
addEventListenersToStaticElements();
document.querySelector('#home').click();