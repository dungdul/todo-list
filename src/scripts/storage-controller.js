import todoList from "./todo-controller.js";

function initializeStorage() {
  localStorage.setItem('projects', JSON.stringify([]));
  localStorage.setItem('tasks', JSON.stringify([]));
}

// Function: Get data from local storage
// Return false if data is not found, so that we know we should initialize storage and add default tasks
function readData() {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  let projects = JSON.parse(localStorage.getItem('projects'));

  if (!tasks) return false;

  tasks.forEach(task => {
    const newtask = todoList.addTask(
      task.title,
      task.description,
      task.dueDate,
      task.priority,
      task.projectId,
    )
    newtask.id = task.id;
    if (task.completed) newtask.toggleCompleted();
  });

  // Skip if there is no projects
  if (projects) {
    projects.forEach(project => {
      const newProject = todoList.addProject(project.title);
      newProject.id = project.id;
    });
  }

  // Return true to show that data have been read successfully
  return true;
}

function updateProjects(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function updateTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export { initializeStorage, readData, updateProjects, updateTasks };