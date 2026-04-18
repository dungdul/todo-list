import '../css/styles.css';
import todoList from './todo-controller.js';
import { renderProjectMenu } from './display-controller.js';
import { addEventListenersToStaticElements } from './event-controller.js';

// --- Create Projects ---
const work = todoList.addProject('Work');
const study = todoList.addProject('Study');
const personal = todoList.addProject('Personal');

// --- Helper: relative dates ---
function daysFromToday(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

// ======================================================
// TODAY TASKS (uncompleted → should appear in Today)
// ======================================================
todoList.addTask(
  'Reply to emails',
  'Clear inbox before noon',
  daysFromToday(0),
  'high'
);

todoList.addTask(
  'Buy groceries',
  'Milk, eggs, bread',
  daysFromToday(0),
  'medium',
  personal.id
);

// Completed TODAY (should NOT appear in Today, only Completed)
const completedToday = todoList.addTask(
  'Morning workout',
  '30 min run',
  daysFromToday(0),
  'low'
);
completedToday.toggleCompleted();

// ======================================================
// UPCOMING TASKS (future only, uncompleted)
// ======================================================
todoList.addTask(
  'Finish report',
  'Quarterly sales',
  daysFromToday(1),
  'high',
  work.id
);

todoList.addTask(
  'Team meeting',
  'Weekly sync',
  daysFromToday(3),
  'medium',
  work.id
);

todoList.addTask(
  'Read NLP chapter',
  'Transformers section',
  daysFromToday(2),
  'high',
  study.id
);

// Completed FUTURE (should NOT appear in Upcoming)
const completedFuture = todoList.addTask(
  'Optional reading',
  'Extra material',
  daysFromToday(4),
  'low',
  study.id
);
completedFuture.toggleCompleted();

// ======================================================
// OVERDUE TASKS (past only, uncompleted)
// ======================================================
todoList.addTask(
  'Call plumber',
  'Fix sink',
  daysFromToday(-1),
  'high'
);

todoList.addTask(
  'Submit assignment',
  'Week 2 homework',
  daysFromToday(-2),
  'high',
  study.id
);

// Completed PAST (should NOT appear in Overdue)
const completedPast = todoList.addTask(
  'Pay bills',
  'Electricity + water',
  daysFromToday(-3),
  'medium',
  personal.id
);
completedPast.toggleCompleted();

renderProjectMenu();
addEventListenersToStaticElements();
document.querySelector('#home').click();