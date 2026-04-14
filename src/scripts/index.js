import '../css/styles.css';
import todoList from './todo-controller.js';
import { initializeDisplay } from './display-controller.js';

let p1 = todoList.addProject('p1');
todoList.addTodoItem('task1', 'something', '2020-03-01', 'low', p1.id);
todoList.addTodoItem("today's tasks", 'yahahaha', '2026-04-15', 'medium');

initializeDisplay();