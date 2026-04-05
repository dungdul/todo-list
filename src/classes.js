class TodoItem {
  constructor(title, description, dueDate, priority, projectId) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.description = description;
    this.dueDate = new Date(dueDate);
    this.priority = priority;
    this.projectId = projectId;
    this.completed = false;
  }

  toggleCompleted() {
    this.completed = !this.completed;
  }
}

class Project {
  constructor(title) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.todoItems = [];
    this.archived = false;
  }

  addTodoItem(title, description, dueDate, priority) {
    const todoItem = new TodoItem(title, description, dueDate, priority, this.id);
    this.todoItems.push(todoItem);

    // Return the todo item so that it can ge stored in a variable and easily accessed when using console
    return todoItem;
  }

  deleteTodoItem(todoItemId) {
    this.todoItems = this.todoItems.filter(currentItem => currentItem.id !== todoItemId);
  }

  getTodoItem(todoItemId) {
    return this.todoItems.find(currentItem => currentItem.id === todoItemId);
  }

  toggleArchived() {
    this.archived = !this.archived;
  }
}

class Todo {
  constructor() {
    this.projects = [];
  }

  addProject(projectTitle) {
    const project = new Project(projectTitle);
    this.projects.push(project);

    // Return the project object so that it can be stored in a variable and can be accessed via console
    return project;
  }

  deleteProject(projectId) {
    this.projects = this.projects.filter(currentProject => currentProject.id !== projectId);
  }

  getProject(projectId) {
    return this.projects.find(currentProject => currentProject.id === projectId);
  }

  getUnarchivedProjects() {
    return this.projects.filter(project => project.archived === false);
  }

  getArchivedProjects() {
    return this.projects.filter(project => project.archived === true);
  }

  printTodoList() {
    this.projects.forEach((project, index) => {
      console.log(`Project ${index + 1}: ${project.title}`);
      console.log(`  ID: ${project.id}`);
      console.log(`  Archived: ${project.archived}`);
      project.todoItems.forEach((todoItem, index) => {
        console.log(`  Item ${index + 1}: ${todoItem.title}`);
        console.log(`    ID: ${todoItem.id}`);
        console.log(`    ${todoItem.description}`);
        console.log(`    ${todoItem.dueDate}`);
        console.log(`    ${todoItem.priority}`);
        console.log(`    Completed: ${todoItem.completed}`);
      })
    })
  }

  static groupTodoItems(todoItems, propertyToGroupBy) {
    const groups = [];

    function createGroup(title) {
      return {
        title,
        todoItems: [],
      }
    }

    todoItems.forEach(item => {
      // Find a group that has the same propertyToGroupBy's value as the current item
      // If found, it will add the current item to the group. If not found, it will create a new group before adding the item
      // For example, if the propertyToGroupBy is dueDate, it will find the group with title of current item's due date

      // Turn the value into a string first. Otherwise, the comparison won't work
      const value = String(item[propertyToGroupBy]);

      const groupFound = groups.find(group => group.title === value);
      if (groupFound) {
        groupFound.todoItems.push(item);
      } else {
        const newGroup = createGroup(value);
        newGroup.todoItems.push(item);
        groups.push(newGroup);
      }
    });

    return groups;
  }
}

export {TodoItem, Project, Todo};