//variables create
let addTaskButton = document.querySelector(".add-task-btn");
let taskAddWindow = document.getElementsByClassName("task-add-window")[0];
let taskAddWindowInputs = document.querySelectorAll(".task-add-window input");
let taskAddWindowBtn = document.querySelectorAll(".task-add-window button");
let taskListHeading = document.querySelector(".task-list-container > p");
let taskList = document.querySelector(".task-list");
let overlay = document.getElementById("overlay");
let taskAddWindowClose = document.querySelector(".task-add-window i");
let notifications = document.querySelector(".notifications");
let completedTaskListHeading = document.querySelector(
  ".completed-task-list-container > p"
);
let completedTaskList = document.querySelector(".completed-task-list");
//main task list array if local storage is empty then create new array
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// the main reason to add it is when you click on edit button from the card it add the value to the window
// but the index of the object is not sending to the open window function cause the open window function trigger with Another
//  function and i didn't want to trigger this function with empty Parameter
// secondly it still point at the place of the object on the array so no need to delete element just edit it
let currentIndex;
//main function to start the app
renderTask();
function renderTask() {
  //clear the list to add the edited / deleted / new tasks without conflict
  taskList.innerHTML = "";
  completedTaskList.innerHTML = "";
  //check if there is a task if not then trigger check empty function
  if (tasks.length > 0) {
    //loop over takas
    tasks.forEach((task, index) => {
      //create card div and styles and elements
      let div = document.createElement("div");
      div.classList.add("task-card");
      div.innerHTML = `
            <div class="task-card-top">
              <div class="task-card-header">
                <h4>${task.title}</h4>
                <p>${task.date}</p>
              </div>
            </div>
            <div class="task-card-bottom">
            <p >${task.description}</p>
               <div class="task-buttons">
               <button onclick=completeTask(${index})>Complete</button>
                <button onclick=editTask(${index})>Edit</button>
                <button onclick=deleteTask(${index})>Delete</button>
              </div>
            </div> 
              `;

      if (task.completed) {
        //if taks is completed then add it to completed Task List
        completedTaskList.appendChild(div);
        //add style (line through)
        document.querySelector(".task-card").classList.add("completed");
      } else {
        //if task is not completed then add it to task list
        taskList.appendChild(div);
      }
    });
  }
  checkEmpty();
}
//trigger when click on add task button on the add task window
function addTask() {
  //get current date when its created
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const time = date.toLocaleTimeString();
  //creat object then add property's to it
  let obj = {};
  obj.id = tasks.length + 1;
  obj.title = taskAddWindowInputs[0].value;
  obj.description = taskAddWindowInputs[1].value;
  obj.date = `${year}/${month}/${day}/${time}`;
  obj.completed = false;
  //add it to the main task object
  tasks.push(obj);
  //call the savetask to add new object(after adding the new task) to local storage
  saveTask();
  //massage function
  pop("Task Added Successfully");
}
function saveTask() {
  //explained before
  localStorage.setItem("tasks", JSON.stringify(tasks));
  //clear add task window inputs
  taskAddWindowInputs[0].value = "";
  taskAddWindowInputs[1].value = "";
  // call the render task to render the new version object
  renderTask();
}
//delete the task trigger when click button delete
function deleteTask(index) {
  tasks.splice(index, 1);
  //save the new version object to local storage
  saveTask();
  //explained before
  pop("Task Deleted Successfully");
}
//edit tasks trigger when click button card edit button
function editTask(index) {
  //open the window but with different buttons
  openAddTaskWindow("is editing");
  //set the object the variable to use it later
  currentIndex = tasks[index];
  //set the window input value
  taskAddWindowInputs[0].value = currentIndex.title;
  taskAddWindowInputs[1].value = currentIndex.description;
}
//change value of property completed to true trigger when click on complete button
function completeTask(inedx) {
  tasks[inedx].completed = true;
  //explained before
  saveTask();
  //explained before
  pop("Task Completed Successfully");
}
function openAddTaskWindow(edit) {
  //trigger the window visibility
  taskAddWindow.classList.toggle("hidden");
  taskAddWindow.classList.toggle("active");
  //over lay to prevent any thing out the edit/add window
  overlay.classList.toggle("active");
  //if edit then show specific button
  if (edit === "is editing") {
    taskAddWindowBtn[0].classList.add("hidden");
    taskAddWindowBtn[1].classList.remove("hidden");
  } else {
    //if not editing then show normal button
    taskAddWindowBtn[0].classList.remove("hidden");
    taskAddWindowBtn[1].classList.add("hidden");
  }
}
function pop(opration) {
  //create popup massage div
  let div = document.createElement("div");
  // set the text and classes
  div.innerHTML = `
     ${opration} 
    `;
  div.classList.add("popup", "notification");
  // after 3 remove class popup and add class popout
  setTimeout(() => {
    div.classList.remove("popup");
    div.classList.add("popout");
    setTimeout(() => {
      // after the first timer another timer start to remove element from the dom
      div.remove();
    }, 900);
  }, 3000);
  notifications.appendChild(div);
}
//open the window
addTaskButton.onclick = () => {
  openAddTaskWindow();
};
// the add task button from the window
taskAddWindowBtn[0].onclick = () => {
  //explained before
  addTask();
};
//edit task button from window
taskAddWindowBtn[1].onclick = () => {
  // now we get the new values and edit the object with them
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const time = date.toLocaleTimeString();
  currentIndex.date = `edited ${year}/${month}/${day}/${time}`;
  currentIndex.title = taskAddWindowInputs[0].value;
  currentIndex.description = taskAddWindowInputs[1].value;
  //explained before
  saveTask();
  renderTask();
  openAddTaskWindow();
  pop("Task Edited Successfully");
};

taskAddWindowClose.onclick = () => {
  openAddTaskWindow();
};
//trigger the visibility of the both list
taskListHeading.onclick = () => {
  taskList.classList.toggle("hidden");
};
completedTaskListHeading.onclick = () => {
  completedTaskList.classList.toggle("hidden");
};
//check empty lists
function checkEmpty() {
  let completedTaks = tasks.filter((task) => task.completed === true);
  if (completedTaks.length === 0) {
    completedTaskList.innerHTML = `<p>Empty Complete Task</p>`;
  }
  if (tasks.length === 0) {
    taskList.innerHTML = `<p>Empty Add Task</p>`;
  }
}
