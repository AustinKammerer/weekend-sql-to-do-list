$(onPageLoad);

function onPageLoad() {
  console.log("jQ connected");
  refreshTasks();
  addClickHandlers();
}

function addClickHandlers() {
  // click listeners go here
  $("#submitBtn").on("click", handleSubmit);
  $("#taskListContainer").on("click", ".deleteBtn", deleteTask);
  $("#taskListContainer").on("click", ".markCompleteBtn", updateTask);
}

function addTask(newTask) {
  $.ajax({
    method: "POST",
    url: "/tasks",
    data: newTask,
  })
    .then((res) => {
      console.log("Database UPDATE Success");
      refreshTasks();
    })
    .catch((err) => {
      console.log("Database/Server error", err);
      alert("Unable to add task at this time. Please try again later.");
    });
}

function deleteTask() {
  let id = $(this).closest(".row").data("id");
  console.log(id);
  $.ajax({
    method: "DELETE",
    url: `/tasks/${id}`,
  })
    .then((res) => {
      console.log("Database DELETE Success");
      refreshTasks();
    })
    .catch((err) => {
      console.log("Database/Server error", err);
      alert("Unable to delete task at this time. Please try again later.");
    });
}

function handleSubmit() {
  let newTask = {
    task: $("#taskIn").val(),
  };
  console.log(newTask);
  addTask(newTask);
}

function refreshTasks() {
  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then((res) => {
      console.log("Database SELECT Success");
      console.log("response:", res);
      renderTasks(res);
    })
    .catch((err) => {
      console.log("Error connecting to server:", err);
    });
}

function renderTasks(taskList) {
  $("#taskIn").val("");
  $("#taskListContainer").empty();
  let markCompleteBtn = `<button class="markCompleteBtn btn btn-outline-success">Complete</button>`;
  for (let task of taskList) {
    let timeCompleted = ``;
    if (task.is_complete) {
      timeCompleted = `Completed: ${task.time_completed}`;
    }
    let updateBtn = ``;
    if (!task.is_complete) {
      updateBtn = markCompleteBtn;
    }
    let taskEntry = $(`
      <div class="row">
        <div class="col">
          <p class="taskOut">${task.task}</p>
        </div>
        <div class="col">
          <p class="timeCompletedOut">${timeCompleted}</p>
        </div>
        <div class="col">
          ${updateBtn}
        </div>
        <div class="col">
          <button class="deleteBtn btn btn-outline-danger">Delete</button>
        </div>
      </div>`);
    taskEntry.data("id", task.id);
    $("#taskListContainer").append(taskEntry);
  }
}

function updateTask() {
  let id = $(this).closest(".row").data("id");
  $.ajax({
    method: "PUT",
    url: `tasks/${id}`,
  })
    .then((res) => {
      console.log("Database UPDATE Success");
      refreshTasks();
    })
    .catch((err) => {
      console.log("Database/Server error", err);
      alert("Unable to update task at this time. Please try again later.");
    });
}
