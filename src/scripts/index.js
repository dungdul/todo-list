import '../css/styles.css';
import todoList from './todo-controller.js';
import { initializeDisplay } from './display-controller.js';

let p1 = todoList.addProject('Project 1');
todoList.addTodoItem('task1', 'something', '2020-03-01', 'low', p1.id);
todoList.addTodoItem("today's tasks", 'yahahaha', '2026-04-15', 'medium');
todoList.addTodoItem("urgent stuff", "anrsetinraieo", '2026-04-17', 'high', p1.id);

initializeDisplay();