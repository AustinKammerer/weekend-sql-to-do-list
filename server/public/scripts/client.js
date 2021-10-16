$(onPageLoad);

function onPageLoad() {
  console.log("jQ connected");
  refreshTasks();
  addClickHandlers();
}

function addClickHandlers() {
  // click listeners go here
  $("#submitBtn").on("click", handleSubmit);
}

function handleSubmit() {
  let task = {
    task: $("#taskIn").val(),
  };
  console.log(task);
}

function refreshTasks() {
  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then((res) => {
      console.log(res);
      renderTasks(res);
    })
    .catch((err) => {
      console.log("Error connecting to server:", err);
    });
}

function renderTasks(taskList) {
  $("#taskIn").val("");
  $("#taskListContainer").empty();
  let timeCompleted = ``;
  for (let task of taskList) {
    if (task.is_complete) {
      timeCompleted = task.task_completed;
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
                <button class="markCompleteBtn btn btn-outline-success">Complete</button>
            </div>
            <div class="col">
                <button class="deleteBtn btn btn-outline-danger">Delete</button>
            </div>
        </div>`);
    taskEntry.data("id", task.id);
    console.log(taskEntry.data("id"));
    $("#taskListContainer").append(taskEntry);
  }
}
