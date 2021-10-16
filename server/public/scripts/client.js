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
      //   renderTasks(res);
      $("#taskIn").val("");
    })
    .catch((err) => {
      console.log("Error connecting to server:", err);
    });
}
