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
  $("#taskListContainer").on("click", ".updateBtn", updateTask);
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
  let id = $(this).closest("li").data("id");
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
  // let markCompleteBtn = `<button class="markCompleteBtn btn btn-success p-0"><i class="bi bi-square"></i></button>`;
  // let markNotCompleteBtn = `<button class="markCompleteBtn btn btn-success p-0"><i class="bi bi-check2-square"></i></button>`;
  for (let task of taskList) {
    // let updateBtn = ``;
    // if (!task.is_complete) {
    //   updateBtn = markCompleteBtn;
    // } else if (task.is_complete) {
    //   updateBtn = markNotCompleteBtn;
    // }
    let taskEntry = $(`
      <li class="mb-1 p-2">
        <div class="row">
          <div class="col-auto align-self-center">
            <input class="updateBtn form-check-input m-0" type="checkbox" value="">
          </div>
          <div class="col align-self-center ps-0">
            <p class="m-0">${task.task}</p>
          </div>
          <div class="col-auto">
            <button class="deleteBtn btn btn-outline-danger py-0 px-1"><i class="bi bi-x-lg"></i></button>
          </div>
        </div>
        </li>`);
    taskEntry.data("id", task.id);
    if (task.is_complete) {
      taskEntry.addClass("complete");
      taskEntry.find("input[type=checkbox]").prop("checked", true);
    } else if (!task.is_complete) {
      taskEntry.removeClass("complete");
    }
    $("#taskListContainer").append(taskEntry);
  }
}

function updateTask() {
  let id = $(this).closest("li").data("id");
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
