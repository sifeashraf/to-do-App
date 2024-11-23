let addTaskButton = document.querySelector("#add-task-btn");
let taskAddWindow = document.getElementsByClassName("task-add-window")[0];
let taskAddWindowInputs = document.querySelectorAll(".task-add-window input");
let taskAddWindowBtn = document.querySelectorAll(".task-add-window button");
let taskList = document.querySelector(".task-list");
let overlay = document.getElementById("overlay");
let taskAddWindowClose = document.querySelector(".task-add-window i");
let notifications = document.querySelector(".notifications");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentIndex;
renderTask();
function renderTask() {
  if (tasks.length > 0) {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
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
              <div ="task-buttons">
                <button onclick=completeTask(${index})>Complete</button>
                <button onclick=editTask(${index})>Edit</button>
                <button onclick=deleteTask(${index})>Delete</button>
              </div>
            </div>
          `;
      taskList.appendChild(div);
      task.completed
        ? document.querySelector(".task-card").classList.add("completed")
        : "";
    });
  }
}
function addTask() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const time = date.toLocaleTimeString();

  let obj = {};
  obj.id = tasks.length + 1;
  obj.title = taskAddWindowInputs[0].value;
  obj.description = taskAddWindowInputs[1].value;
  obj.date = `${year}/${month}/${day}/${time}`;
  obj.completed = false;
  tasks.push(obj);
  saveTask();
  pop("Task Added Successfully");
}
function saveTask() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskAddWindowInputs[0].value = "";
  taskAddWindowInputs[1].value = "";
  renderTask();
}
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTask();
  if (tasks.length === 0) {
    taskList.innerHTML = `<p>Empty Add Task</p>`;
  }
  pop("Task Deleted Successfully");
}
function editTask(index) {
  openAddTaskWindow("is editing");
  currentIndex = tasks[index];
  taskAddWindowInputs[0].value = currentIndex.title;
  taskAddWindowInputs[1].value = currentIndex.description;
}
addTaskButton.onclick = () => {
  openAddTaskWindow();
};

taskAddWindowBtn[0].onclick = () => {
  addTask();
};
taskAddWindowBtn[1].onclick = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const time = date.toLocaleTimeString();
  currentIndex.date = `edited ${year}/${month}/${day}/${time}`;
  currentIndex.title = taskAddWindowInputs[0].value;
  currentIndex.description = taskAddWindowInputs[1].value;
  saveTask();
  renderTask();
  openAddTaskWindow();
  pop("Task Edited Successfully");
};

taskAddWindowClose.onclick = () => {
  openAddTaskWindow();
};

function completeTask(inedx) {
  tasks[inedx].completed = true;
  saveTask();
  renderTask();
  pop("Task Completed Successfully");
}
function openAddTaskWindow(edit) {
  taskAddWindow.classList.toggle("hidden");
  taskAddWindow.classList.toggle("active");
  overlay.classList.toggle("active");
  if (edit === "is editing") {
    taskAddWindowBtn[0].classList.add("hidden");
    taskAddWindowBtn[1].classList.remove("hidden");
  } else {
    taskAddWindowBtn[0].classList.remove("hidden");
    taskAddWindowBtn[1].classList.add("hidden");
  }
}
function pop(opration) {
  let div = document.createElement("div");
  div.innerHTML = `
     ${opration} 
    `;
  div.classList.add("popup", "notification");
  setTimeout(() => {
    div.classList.remove("popup");
    div.classList.add("popout");
    setTimeout(() => {
      div.remove();
    }, 900);
  }, 3000);
  notifications.appendChild(div);
}
