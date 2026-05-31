const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const alertDiv = document.querySelector(".alert-section");
const tbody = document.getElementById("tbody");
const deleteAll = document.getElementById("delete-all-button");
const buttonFilterPending = document.getElementById("filterPending");
const buttonFilterCompleted = document.getElementById("filterCompleted");
const buttonFilterAll = document.getElementById("filterAll");
/*
const actionButtons = `
    <button >Edit</button>
    <button >Do</button>
    <button onclick="deleteHandler(${})">Delet</button> 
`; 
onclick ra hamin inja dadim chon az ebteda dar document vojud nadasht ke anra be getElement begirim
ama ba injury dastur dadan nemitavan event ra dar tabe deleteHandler gereft, undifines midahad
function deleteHandler(event) {
  console.log(event);   -------------> undifiend
}
Ama aslan inke var actionButtons ro inja tarif konim eshtebahe chra? chon alan ma be id todo E ke rush click shode dastrasi nadarim
PAS on ra mibarim be dakhel khod tabe*/

//displayTodos();********** این خیلی درست نیست که همینجوری وسط ص یک تابع را صدا بزنیم
window.addEventListener("load", loadedPage);
addButton.addEventListener("click", addToDo);
deleteAll.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", apllyEditHandler);
buttonFilterPending.addEventListener("click", filterPendingHandler);
buttonFilterCompleted.addEventListener("click", filterCompletedHandler);
buttonFilterAll.addEventListener("click", filterAllHandler);

let todoList = JSON.parse(localStorage.getItem("todos")) || []; //***************
let editModeIsActive = false;
let filterdMode = null;

function loadedPage() {
  displayTodos();
}

function filterPendingHandler() {
  filterdMode = "pending";
  const newFilteredList = todoList.filter((todo) => todo.status == false);
  displayTodos(newFilteredList);
}

function filterCompletedHandler() {
  filterdMode = "completed";
  const newFilteredList = todoList.filter((todo) => todo.status == true);
  displayTodos(newFilteredList);
}

function filterAllHandler() {
  filterdMode = "";
  displayTodos();
}

function deleteAllHandler(event) {
  if (todoList.length == 0) return;
  todoList = [];
  saveToStorage();
  displayTodos();
  showAlertMessage(true, "all todos delete successfully");
  if (editModeIsActive) {
    taskInput.value = "";
    dateInput.value = "";
    addButton.style.display = "inline-block";
    editButton.style.display = "none";
  }
}

function deleteHandler(id, task) {
  /*const newList = [];
  todoList.forEach((todo) => {
    if (todo.id !== id) {
      newList.push(todo);
    }
  });*/
  const newList = todoList.filter((todo) => todo.id !== id);
  todoList = newList;
  saveToStorage();
  showAlertMessage(true, `Todo ${task} deleted successfully`);
  if (checkFilterStation()) return;
  displayTodos();
}

function statusHandler(id) {
  /*todoList.forEach((todo) => {
    if (id == todo.id) {
      todo.status = !todo.status; //todo.status = todo.status ? false : true;*************** به جای این مینویسیم*/
  const pointedTodo = todoList.find((todo) => todo.id == id);
  pointedTodo.status = !pointedTodo.status;
  saveToStorage();

  if (pointedTodo.status) {
    showAlertMessage(true, `${pointedTodo.task} is sucsessfully done`);
  }
  if (checkFilterStation()) return;
  displayTodos();
}

function editHandler(id) {
  const pointedTodo = todoList.find((todo) => todo.id == id);
  taskInput.value = pointedTodo.task;
  dateInput.value = pointedTodo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
  editModeIsActive = true;
}

function apllyEditHandler(event) {
  editModeIsActive = false;
  const pointedTodo = todoList.find(
    (todo) => todo.id == event.target.dataset.id
  );
  pointedTodo.task = taskInput.value;
  pointedTodo.date = dateInput.value;

  if (!taskInput.value) {
    showAlertMessage(false, "entered The todo name");
  } else {
    saveToStorage();
    taskInput.value = "";
    dateInput.value = "";
    addButton.style.display = "inline-block";
    editButton.style.display = "none";
    showAlertMessage(true, "Your task is sucsessfully edited");
    if (checkFilterStation()) return;
    displayTodos();
  }
}

function checkFilterStation() {
  if (filterdMode == "pending") {
    filterPendingHandler();
    return true;
  } else if (filterdMode == "completed") {
    filterCompletedHandler();
    return true;
  } else {
    filterAllHandler();
    return;
  }
}

function displayTodos(list) {
  list = list || todoList;
  tbody.innerHTML = "";
  list.forEach((todo) => {
    tbody.innerHTML += ` 
    <tr>
    <td> ${todo.task}</td>
    <td> ${todo.date || "No date"}</td>
    <td> ${todo.status ? "completed" : "pending"}</td>
    <td> 
      <button onclick="editHandler('${todo.id}')">Edit</button>
      <button onclick="statusHandler('${todo.id}')">${
      todo.status ? "Undo" : "Do"
    }</button>
      <button onclick="deleteHandler('${todo.id}','${todo.task}')">
        Delete
      </button> 
    </td>
    </tr>
    `;
  });
}

const generateID = () =>
  Math.round(Math.random() * Math.random() * Math.pow(10, 15)).toString(); //***************

const saveToStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todoList)); //***************
};

function addToDo() {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    task, //task: task,//***************
    date, //date: date,//***************
    id: generateID(),
    status: false,
  };
  if (task) {
    todoList.push(todo);
    saveToStorage();
    displayTodos();
    console.log(todoList);
    taskInput.value = "";
    dateInput.value = "";

    showAlertMessage(true, "Your task is sucsessfully added");
  } else {
    showAlertMessage(false, "entered The information");
  }
}

function showAlertMessage(check, message) {
  if (check) {
    alertMessage.innerText = message;
    alertDiv.classList.add("successful");
  } else {
    alertMessage.innerText = message;
    alertDiv.classList.add("error");
  }
  setTimeout(() => {
    alertMessage.innerText = "";
    alertDiv.classList.remove("error");
    alertDiv.classList.remove("successful");
  }, 2000);
}
