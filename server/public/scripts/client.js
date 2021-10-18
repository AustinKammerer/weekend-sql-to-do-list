$(onPageLoad);
// set up the luxon script for date formatting
const DateTime = luxon.DateTime;

function onPageLoad() {
  console.log("jQ connected");
  refreshTasks();
  addClickHandlers();
}

function addClickHandlers() {
  $("#submitBtn").on("click", handleSubmit);
  $("#taskListContainer").on("click", ".deleteBtn", deleteTask);
  $("#taskListContainer").on("click", ".updateBtn", updateTask);
  $("#sortSelect").on("change", sortTasks);
}

// function to add a task to the list and database
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

// function to delete task from list and database
function deleteTask() {
  // get the task id from the deleteBtn's parent li (data-id)
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

function formatTimestamp(timestamp) {
  // uses luxon to format the timestamp generated by the database
  let dt = DateTime.fromISO(timestamp, { zone: "cst" });
  return dt.toLocaleString(DateTime.DATETIME_MED);
}

function handleSubmit() {
  let newTask = {
    task: $("#taskIn").val(),
  };
  console.log(newTask);
  // plug the gathered input into the POST request
  addTask(newTask);
}

// function to GET the task list from the database
function refreshTasks() {
  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then((res) => {
      console.log("Database SELECT Success");
      console.log("response:", res);
      // reset the sort selector
      $("#sortSelect").val("null");
      // render the list of tasks to the DOM
      renderTasks(res);
    })
    .catch((err) => {
      console.log("Error connecting to server:", err);
    });
}

// function to render the task list to the DOM and attach data
function renderTasks(taskList) {
  $("#taskIn").val("");
  $("#taskListContainer").empty();
  for (let task of taskList) {
    // format the time_completed timestamp into something pretty
    let timeCompleted = formatTimestamp(task.time_completed);
    let timeEntry = ``;
    // if a task is complete, add the time completed to DOM
    if (task.is_complete) {
      timeEntry = `<p class="m-0 time-holder">Completed: <span class="time-out">${timeCompleted}</span></p>`;
    }
    // li template
    let taskEntry = $(`
      <li class="mb-1 p-2">
        <div class="row">
          <div class="col-auto align-self-center">
            <input class="updateBtn form-check-input m-0" type="checkbox" value="">
          </div>
          <div class="col align-self-center ps-0">
            <p class="m-0 task-out">${task.task}</p>
          </div>
          <div class="col-auto align-self-center ps-0">
            ${timeEntry}
          </div>
          <div class="col-auto">
            <button class="deleteBtn btn btn-outline-danger py-0 px-1"><i class="bi bi-x-lg"></i></button>
          </div>
        </div>
        </li>`);
    // add data-id and data-complete attributes to the li for deletion and changing completion status
    taskEntry.data("id", task.id);
    taskEntry.data("complete", task.is_complete);
    // if a task is complete, give the entry a visual indicator and make sure the box is checked
    if (task.is_complete) {
      taskEntry.addClass("complete");
      taskEntry.find("input[type=checkbox]").prop("checked", true);
    }
    // if it's not, remove the indicator
    else if (!task.is_complete) {
      taskEntry.removeClass("complete");
    }
    $("#taskListContainer").append(taskEntry);
  }
}

// function to sort the list based on the user's selection of category and direction
function sortTasks() {
  // get the user sorting input
  // each option's value corresponds to its sort-by category and direction
  let selectVal = $(this).val();
  // first part of the string is category
  let category = selectVal.slice(0, -4);
  // second part is the direction
  let direction = selectVal.slice(-3);
  // pass these to the server via query params in the url
  $.ajax({
    method: "GET",
    url: `/tasks/sort?category=${category}&direction=${direction}`,
  })
    .then((res) => {
      console.log("Database ORDER BY success");
      console.log("response:", res);
      renderTasks(res);
    })
    .catch((err) => {
      // alert the user to bad query params
      if (err.status === 400) {
        alert(err.responseJSON.msg);
      } else {
        console.log("Error connecting to server:", err);
      }
    });
}

// function to update a task's completion status
function updateTask() {
  // get the task's id
  let id = $(this).closest("li").data("id");
  // get the task's current completion status
  let status = $(this).closest("li").data("complete");
  // pass the status to the server so it can be flipped when the checkbox is clicked
  $.ajax({
    method: "PUT",
    url: `/tasks/${id}`,
    data: { currentIsComplete: status },
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
